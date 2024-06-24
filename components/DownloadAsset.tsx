"use client";

import { createClient } from "@/utils/supabase/client";

export const DownloadAsset: React.FC<{
  id: number;
  type: "usdz" | "obj" | "png";
}> = ({ id, type }) => {
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

      const { data: models } = await supabase.storage
        .from("viewer3d-dev")
        .list(`${project?.id}/model`);

      const filename: string =
        models?.find((m) => m.name.endsWith(`.${type}`))?.name || "";
      let usdzUrl: string | undefined = "";
      // get the signed url for the obj file
      // obj
      const { data: _usdzUrl, error: _usdzError } = await supabase.storage
        .from("viewer3d-dev")
        .createSignedUrl(`${project?.id}/model/${filename}`, 20);

      usdzUrl = _usdzUrl?.signedUrl;
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
      {type.toUpperCase()}
    </button>
  );
};
