"use server";

import { Database } from "@/types/supabase";
import { sendToQueue } from "@/utils/amqpClient";
import { createClient } from "@/utils/supabase/server";

export async function sendProjectToQueue(id: number) {
  sendToQueue(id);
}

export async function createProject({
  name,
  description,
  detail,
  order,
  feature,
  files,
}: {
  name: string;
  description: string;
  detail: Database["public"]["Enums"]["details"];
  order: Database["public"]["Enums"]["orders"];
  feature: Database["public"]["Enums"]["features"];
  files: Database["public"]["Tables"]["project"]["Row"]["files"];
}) {
  const supabase = createClient();
  return await supabase
    .from("project")
    .insert({
      name,
      description,
      detail,
      order,
      feature,
      files,
      status: "in queue",
    })
    .select("id")
    .single();
}
