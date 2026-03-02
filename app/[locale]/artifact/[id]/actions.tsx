import * as Sentry from "@sentry/nextjs";
import { createClient } from "@/utils/supabase/server";

export const fetchArtifact = async (id: string) => {
  const supabase = createClient();
  try {
    const { data: catalog, error } = await supabase
      .from("catalog")
      .select(
        `
        *,
        projects: project_catalog(project(*))
      `,
      )
      .eq("artifact", id)
      .single();
    if (error) throw new Error(error.message);

    return catalog;
  } catch (error) {
    Sentry.captureException(error, { tags: { action: "fetchArtifact" } });
  }
};
