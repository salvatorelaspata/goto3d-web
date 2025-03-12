import { getSignedUrl, putObject } from "@/utils/s3/api";
import { createClient } from "@/utils/supabase/server";
import dotenv from "dotenv";
dotenv.config();

export const getProjects = async () => {
  const supabase = createClient();
  const { data: projects, error } = await supabase
    .from("project")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  projects.forEach(async (project) => {
    project.thumbnail = await _getSignedThumbnail({
      thumbnail: project.thumbnail,
    });
  });

  return projects;
};

const _getSignedThumbnail = async ({
  thumbnail,
}: {
  thumbnail: string | null;
}) => {
  if (!thumbnail) return "";
  const signedUrl = await getSignedUrl(
    process.env.NEXT_CLOUDFLARE_R2_BUCKET_PUBLIC_NAME ?? "",
    thumbnail,
  );
  return signedUrl;
};
