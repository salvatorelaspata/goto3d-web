import { actions } from "@/store/main";
import { actions as wizardAction } from "@/store/wizardStore";
import { useStore } from "@/store/wizardStore";
import { useStore as useMainStore } from "@/store/main";
import { createClient } from "@/utils/supabase/client";
import { toast } from "react-toastify";
import { sendProjectToQueue, createProject } from "@/app/projects/new/actions";
import { useRouter } from "next/navigation";

export default function CompleteButton() {
  const { name, description, files, detail, order, feature } = useStore();
  const { loading } = useMainStore();
  const supabase = createClient();
  const navigation = useRouter();
  const onSubmit = async () => {
    actions.showLoading();
    const filesArray = Array.from(files).map((f) => f.name);
    const { data: _dataProject, error: _errorProject } = await createProject({
      name,
      description,
      detail,
      order,
      feature,
      files: filesArray,
    });

    toast.success("Project created");

    console.time("upload");
    await _sendFile(files as FileList, _dataProject?.id);
    console.timeEnd("upload");

    sendProjectToQueue(_dataProject?.id);
    toast.success("Project sent to queue");
    actions.hideLoading();

    wizardAction.resetState();

    navigation.push("/projects");
  };

  const _sendFile = async (files: FileList, projectId: number) => {
    // upload file in supabase storage
    // eseguo sequenzialmente l'upload per dare evidenza all'utente del caricamento
    let percentage = 0;
    if (!files || files.length === 0) return;
    for (let i = 0; i < files.length; i++) {
      const { data: _dataStorage, error: _errorStorage } =
        await supabase.storage
          .from("viewer3d-dev")
          .upload(projectId + "/images/" + files[i].name, files[i], {
            upsert: true,
          });

      percentage = ((i + 1) / files.length) * 100;

      if (_errorStorage) return toast.error("Error: " + files[i].name);

      toast.info("File upload " + files[i].name);
    }
  };

  return (
    <button
      className="border-green-600 border-2 text-white p-5 rounded-md text-xl font-bold hover:bg-palette5 focus:outline-none focus:ring-2 focus:ring-palette1 focus:ring-offset-2 focus:ring-offset-palette1"
      onClick={onSubmit}
      disabled={loading}
    >
      Processa {"✅"}
    </button>
  );
}
