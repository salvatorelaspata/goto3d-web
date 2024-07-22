"use client";

import { getSignedUrl, listObjects } from "@/utils/s3/api";
import { createClient } from "@/utils/supabase/client";

export const DownloadAsset: React.FC<{
  id: number;
  type?: ".usdz" | ".obj" | "tex0.png";
  name?: string;
}> = ({ id, type, name }) => {
  const download = async (e) => {
    e.preventDefault();
    const supabase = createClient();
    // get url for the usdz file
    try {
      const { data: project } = await supabase
        .from("project")
        .select("*")
        .eq("id", id)
        .single();
      // get the list of models
      const models = await listObjects("dev", `${project?.id}/model`);

      let filename: string;
      if (name) {
        filename = models?.find((m) => m.Key === name)?.Key || "";
      } else if (type) {
        filename = models?.find((m) => m?.Key?.endsWith(`${type}`))?.Key || "";
      } else {
        filename = models?.find((m) => m?.Key?.endsWith(".usdz"))?.Key || "";
      }

      let usdzUrl: string | undefined = "";
      // get the signed url for the obj fil
      const _usdzUrl = await getSignedUrl(
        "dev",
        `${project?.id}/model/${filename}`,
      );

      usdzUrl = _usdzUrl;
      if (!usdzUrl) return;
      // const instance = ref.current,
      const a = document.createElement("a");
      a.setAttribute("href", usdzUrl);
      a.setAttribute("download", `${project?.name}.${type}`);
      a.setAttribute("target", "_blank");
      a.click();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <button
      onClick={download}
      className="text-palette5 underline underline-offset-2 hover:text-palette3"
    >
      {type || name}
    </button>
  );
};
