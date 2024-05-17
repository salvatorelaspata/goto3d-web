import { ImagesUpload } from "../forms/ImagesUpload";
import { Form } from "./Form";
import { Legend } from "./Legend";
import { WizardStep } from "./WizardSteps";
import { actions, useStore } from "@/store/wizardStore";

export const Step2: React.FC = () => {
  const form = (
    <Form stretch={false}>
      <div className="flex flex-col h-full">
        <ImagesUpload />
      </div>
    </Form>
  );

  const spiegone = (
    <Legend step={2}>
      <>
        <h3 className="p-4 text-lg font-bold">
          Step 2: Carica le foto del tuo progetto.
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <img
            src="/capturing-photographs-for-realitykit-object-capture-1@2x.png"
            className="hover:transform hover:scale-110 transition-transform duration-500 ease-in-out"
          />
          <img
            src="/capturing-photographs-for-realitykit-object-capture-2@2x.png"
            className="hover:transform hover:scale-110 transition-transform duration-500 ease-in-out"
          />
        </div>

        {/* https://developer.apple.com/documentation/realitykit/capturing-photographs-for-realitykit-object-capture/#Select-an-object-to-photograph */}
        <div className="overflow-y-auto h-96">
          <p className="text-lg font-bold py-2">
            📸 Quale oggetto fotografare:
          </p>
          <ul className="list-disc list-inside">
            <li>
              Scegliere <strong>oggetti statici</strong> che non si pieghino o
              deformino mentre si scattano le foto.
            </li>
            <li>
              Scegliere oggetti <strong>senza parti mobili</strong> o parti
              rimovibili.
            </li>
            <li>
              Scegliere oggetti <strong>senza parti riflettenti</strong> o
              trasparenti.
            </li>
            <li>
              Scegliere oggetti <strong>con dettagli</strong> e texture ben
              definite.
            </li>
          </ul>
          <p className="text-lg font-bold py-2">📏 Dimensioni dell'oggetto:</p>
          <p className="underline underline-offset-4">
            È possibile fotografare oggetti di diverse dimensioni, purchè essi
            si possano inquadrare, nella loro interezza, con la fotocamera.
          </p>

          <p className="text-lg font-bold py-2">
            📷 Come fotografare l'oggetto:
          </p>

          <ul className="list-disc list-inside">
            <li className="px-2">
              Muovere la fotocamera intorno all'oggetto, scattando foto da
              diverse angolazioni e ad altezze diverse,
            </li>
            <li className="px-2">
              Mettere l'oggetto su una piattaforma girevole e ruotarlo mentre si
              scattano le foto.
            </li>
          </ul>
          <p className="p-2 mt-2 bg-gray-100 rounded-lg">
            🧐:{" "}
            <i>
              È possibile spostare l'oggetto tra uno scatto e l'altro per
              fotografare tutti i lati, purchè esso non si pieghi o deformi.
            </i>
          </p>

          <p className="text-lg font-bold py-2">🤳 Come fare le foto:</p>
          <p>
            Posizionare l'oggetto in modo che riempia la maggior parte possibile
            dell'inquadratura della fotocamera senza escludere o tagliare alcuna
            parte. Utilizzare un'apertura di diaframma sufficientemente stretta
            per mantenere una messa a fuoco nitida. Scattare alla massima
            risoluzione supportata dalla fotocamera e utilizzare il formato RAW,
            se possibile.
          </p>

          <p className="text-lg font-bold py-4">❌ Cosa evitare:</p>
          <ul className="list-inside list-disc">
            <li>
              Evitare oggetti riflettenti o trasparenti, come specchi o vetri.
            </li>

            <li>
              Evitare oggetti che si pieghino o deformino durante la fotografia.
            </li>

            <li>
              Evitare oggetti troppo grandi o troppo piccoli per la fotocamera.
            </li>

            <li>
              Evitare di scattare foto in ambienti troppo bui o troppo luminosi.
            </li>
          </ul>
        </div>
      </>
    </Legend>
  );

  return <WizardStep form={form} spiegone={spiegone} />;
};
