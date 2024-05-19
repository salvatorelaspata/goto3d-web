import Form from "@/components/forms/Form";
import { Viewer } from "@/components/Viewer";
import { ModelLayout } from "@/components/layout/ModelLayout";
import { Database } from "@/types/supabase";
import { formFields } from "@/utils/constants";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

const Project: React.FC<{
  _project: Database["public"]["Tables"]["project"]["Row"];
  objUrl: string;
  textureUrl: string;
  backgroundUrl: string;
}> = ({ _project, objUrl, textureUrl, backgroundUrl }) => {
  const {
    query: { id },
  } = useRouter();
  const fields = formFields;

  const onSubmit = async (data: any) => {
    console.log("submit", data);
  };

  return (
    <>
      <>
        {fields.length && (
          <Form fields={fields} onSubmit={onSubmit} _data={{ ..._project }} />
        )}
      </>
      <ModelLayout>
        {objUrl && (
          <Viewer
            objUrl={objUrl}
            textureUrl={textureUrl}
            backgroundUrl={backgroundUrl}
          />
        )}
      </ModelLayout>
    </>
  );
};

export default Project;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;
  const _id: number = parseInt(id as string);
  const supabase = createPagesServerClient<Database>(context);
  try {
    // una sorta di innerjoin .-.
    const { data: _project } = await supabase
      .from("project")
      .select("*")
      .eq("id", _id)
      .single();
    // console.log(_project, _process, _id)
    const { data: models } = await supabase.storage
      .from("viewer3d-dev")
      .list(`${_project?.id}`);

    const { data: backgrounds } = await supabase.storage
      .from("viewer3d-dev")
      .list("HDR");

    // get the obj file name, the texture file name and a random background
    const objName: string =
      models?.find((m) => m.name.endsWith(".obj"))?.name || "";
    const textureName: string =
      models?.find((m) => m.name === "baked_mesh_tex0.png")?.name || "";
    const backgroundName: string =
      backgrounds && backgrounds.length > 0
        ? backgrounds[Math.floor(Math.random() * backgrounds.length)]?.name
        : "";
    let objUrl: string | undefined = "";
    let textureUrl: string | undefined = "";
    let backgroundUrl: string | undefined = "";
    // get the signed url for the obj file
    try {
      const { data: _objUrl } = await supabase.storage
        .from("viewer3d-dev")
        .createSignedUrl(`${_project?.id}${objName}`, 2);
      objUrl = _objUrl?.signedUrl;
      const { data: _textureUrl } = await supabase.storage
        .from("viewer3d-dev")
        .createSignedUrl(`${_project?.id}${textureName}`, 2);
      textureUrl = _textureUrl?.signedUrl;
      const { data: _backgroundUrl } = await supabase.storage
        .from("viewer3d-dev")
        .createSignedUrl(`HDR/${backgroundName}`, 2);
      backgroundUrl = _backgroundUrl?.signedUrl;
    } catch (error) {
      console.log("error", error);
    }

    // console.log(objUrl, textureUrl, backgroundUrl)

    return {
      props: {
        _project,
        models,
        objUrl: objUrl || null,
        textureUrl: textureUrl || null,
        backgroundUrl: backgroundUrl || null,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};
