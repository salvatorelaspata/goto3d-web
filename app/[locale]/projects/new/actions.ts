"use server";

import { createClient } from "@/utils/supabase/server";
import { projectSchema } from "@/lib/validations/project";
import { PROJECT_STATUS } from "@/lib/constants";
import { sendToQueue } from "@/utils/amqpClient";
import { listObjects, deleteObject } from "@/utils/s3/api";
import { rateLimiter } from "@/lib/rate-limit";
import { revalidatePath } from "next/cache";

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function checkProjectNameExists(
  name: string
): Promise<ActionResult<boolean>> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "Non autorizzato" };
  }

  const { data, error } = await supabase
    .from("project")
    .select("id")
    .eq("name", name)
    .eq("user_id", user.id)
    .limit(1);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data: data.length > 0 };
}

export async function createProject(
  formData: FormData
): Promise<ActionResult<{ id: number }>> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "Non autorizzato" };
  }

  const raw = {
    name: formData.get("name"),
    description: formData.get("description"),
    detail: formData.get("detail"),
    order: formData.get("order"),
    feature: formData.get("feature"),
  };

  const validation = projectSchema.safeParse(raw);
  if (!validation.success) {
    const errors = validation.error.issues.map((e) => e.message).join(", ");
    return { success: false, error: errors };
  }

  const { name, description, detail, order, feature } = validation.data;

  // Check name uniqueness per-user
  const { data: existing, error: checkError } = await supabase
    .from("project")
    .select("id")
    .eq("name", name)
    .eq("user_id", user.id)
    .limit(1);

  if (checkError) {
    return { success: false, error: checkError.message };
  }

  if (existing && existing.length > 0) {
    return { success: false, error: "Nome progetto già esistente" };
  }

  // Get file names from formData
  const files = formData
    .getAll("files")
    .filter((f) => f instanceof File && f.size > 0);
  const filesArray = files.map((f) => (f as File).name);

  const { data: project, error } = await supabase
    .from("project")
    .insert([
      {
        name,
        description: description || "",
        detail,
        order,
        feature,
        files: filesArray,
        status: PROJECT_STATUS.IN_QUEUE,
      },
    ])
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data: { id: project.id } };
}

export async function submitProjectToQueue(
  projectId: number
): Promise<ActionResult<void>> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "Non autorizzato" };
  }

  // Rate limiting per user
  const { success: withinLimit } = rateLimiter.limit(user.id);
  if (!withinLimit) {
    return { success: false, error: "Troppe richieste, riprova tra poco" };
  }

  const { data: project, error: projectError } = await supabase
    .from("project")
    .select("id, user_id")
    .eq("id", projectId)
    .single();

  if (projectError || !project) {
    return { success: false, error: "Progetto non trovato" };
  }

  if (project.user_id !== user.id) {
    return { success: false, error: "Non autorizzato" };
  }

  await sendToQueue(projectId);
  revalidatePath("/projects");

  return { success: true, data: undefined };
}

export async function rollbackProject(
  projectId: number
): Promise<ActionResult<void>> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "Non autorizzato" };
  }

  const { data: project, error: projectError } = await supabase
    .from("project")
    .select("id, user_id")
    .eq("id", projectId)
    .single();

  if (projectError || !project) {
    return { success: false, error: "Progetto non trovato" };
  }

  if (project.user_id !== user.id) {
    return { success: false, error: "Non autorizzato" };
  }

  // Delete uploaded images from R2
  try {
    const bucket = process.env.NEXT_CLOUDFLARE_R2_BUCKET_NAME ?? "";
    const objects = await listObjects(bucket, `${projectId}/images/`);
    await Promise.all(
      objects.map((obj) =>
        obj.Key ? deleteObject(bucket, obj.Key) : Promise.resolve()
      )
    );
  } catch {
    // Best-effort cleanup, don't fail the rollback
  }

  // Delete project from DB
  const { error: deleteError } = await supabase
    .from("project")
    .delete()
    .eq("id", projectId);

  if (deleteError) {
    return { success: false, error: deleteError.message };
  }

  return { success: true, data: undefined };
}
