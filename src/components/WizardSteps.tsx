import { useState } from "react";
import { Input } from "./forms/Input";
import { Textarea } from "./forms/Textarea";
import { InputFile } from "./forms/InputFile";

interface WizardStepProps {
  form: JSX.Element;
  spiegone: JSX.Element;
}

const WizardStep: React.FC<WizardStepProps> = ({ form, spiegone }) => {
  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-3">
      <div className="col-span-2 pr-4">{form}</div>
      <div className="p-5">{spiegone}</div>
    </div>
  );
};

const mandatory = (
  <p>
    <span className="text-red-600 my-4">*</span>Campi obbligatori
  </p>
);

const next = (
  <button className="bg-violet-600 text-white p-2 rounded-md my-4">
    Continua
  </button>
);

const nextText = (
  <p className="py-4">
    Premi il pulsante Continua per procedere al prossimo step
  </p>
);

const divider = <hr className="bg-color-violet" />;

export const Step1: React.FC = () => {
  const [name, setName] = useState("");
  const form = (
    <div>
      <form className="flex flex-col">
        <Input
          id="name"
          disabled={false}
          label="Nome del progetto"
          name="name"
          type={"text"}
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
        />

        <Textarea
          id="description"
          disabled={false}
          label="Descrizione del progetto (opzionale)"
          name="description"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
        />
        {next}
      </form>

      {divider}

      {mandatory}
    </div>
  );

  const spiegone = (
    <div>
      <img src="" />
      <div className="flex flex-col">
        <p className="text-sm">STEP 1</p>
        <h1 className="text-xl">Nome del progetto</h1>
        <p className="py-4">
          Il primo passo per creare un nuovo progetto è inserire il nome.
        </p>
        <p className="py-4">
          Puoi scegliere di impostare una descrizione al tuo progetto.
        </p>
        {nextText}
      </div>
    </div>
  );

  return <WizardStep form={form} spiegone={spiegone} />;
};

export const Step2: React.FC = () => {
  const [files, setFiles] = useState<FileList | null>(null);
  const form = (
    <div>
      <form className="flex flex-col">
        {/* SOSTITUIRE CON https://tailwindcomponents.com/component/responsive-multi-file-upload-with-drop-on-and-preview-3 */}
        <InputFile
          id={"files"}
          disabled={false}
          label={"Carica immagini"}
          multiple={true}
          name={"files"}
          onFileChange={(e) => setFiles(e.currentTarget.files)}
          type={"file"}
        />
        {next}
      </form>

      {divider}

      {mandatory}
    </div>
  );

  const spiegone = (
    <div>
      <img src="" />
      <div className="flex flex-col">
        <p className="text-sm">STEP 2</p>
        <h1 className="text-xl">Carica immagini</h1>
        <p className="py-4">Carica le immagini del progetto.</p>
        <p className="py-4">
          Puoi caricare più immagini contemporaneamente, selezionando più file
          dalla finestra di dialogo.
        </p>
        {nextText}
      </div>
    </div>
  );

  return <WizardStep form={form} spiegone={spiegone} />;
};

export const Step3: React.FC = () => {
  return (
    <WizardStep
      form={
        <div>
          <p className="text-sm">STEP 3</p>
        </div>
      }
      spiegone={
        <div className="flex flex-col">
          <p className="text-sm">STEP 3</p>
          <h1 className="text-xl">Configurazione</h1>
          <p className="py-4">Configura il dettaglio del modello 3d.</p>
        </div>
      }
    />
  );
};

export const Step4: React.FC = () => {
  return (
    <WizardStep
      form={
        <div>
          <p className="text-sm">FINISH</p>
        </div>
      }
      spiegone={
        <div className="flex flex-col">
          <p className="text-sm">FINISH</p>
          <h1 className="text-xl">Generazione modello</h1>
          <p className="py-4">
            La generazione del modello è in corso. Verrai notificato quando il
            modello sarà pronto.
          </p>
        </div>
      }
    />
  );
};
