import { ImagesUpload } from "../forms/ImagesUpload";
import { Form } from "./Form";
import { Legend } from "./Legend";
import { WizardStep } from "./WizardSteps";

export const Step2: React.FC = () => {
  const form = (
    <Form stretch={false}>
      <div className="flex flex-col">
        <ImagesUpload />
      </div>
      <div className="flex-grow"></div>
    </Form>
  );

  const spiegone = (
    <Legend step={2} title="Step 2: Carica le foto del tuo progetto">
      <>
        <div className="grid grid-cols-2 gap-4">
          <img
            src="/capturing-photographs-for-realitykit-object-capture-1@2x.png"
            className="transition-transform duration-500 ease-in-out hover:scale-110 hover:transform"
          />
          <img
            src="/capturing-photographs-for-realitykit-object-capture-2@2x.png"
            className="transition-transform duration-500 ease-in-out hover:scale-110 hover:transform"
          />
        </div>

        {/* https://developer.apple.com/documentation/realitykit/capturing-photographs-for-realitykit-object-capture/#Select-an-object-to-photograph */}
        {/* i want to create a overflow scrollbar to the section */}

        <div className="h-96 overflow-y-scroll p-4">
          <p className="py-2 text-lg font-bold">
            📸 Quale oggetto fotografare:
          </p>
          <ul className="list-inside list-disc">
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
          <p className="py-2 text-lg font-bold">📏 Dimensioni dell'oggetto:</p>
          <p className="underline underline-offset-4">
            È possibile fotografare oggetti di diverse dimensioni, purchè essi
            si possano inquadrare, nella loro interezza, con la fotocamera.
          </p>

          <p className="py-2 text-lg font-bold">
            📷 Come fotografare l'oggetto:
          </p>

          <ul className="list-inside list-disc">
            <li className="px-2">
              Muovere la fotocamera intorno all'oggetto, scattando foto da
              diverse angolazioni e ad altezze diverse,
            </li>
            <li className="px-2">
              Mettere l'oggetto su una piattaforma girevole e ruotarlo mentre si
              scattano le foto.
            </li>
          </ul>
          <p className="mt-2 rounded-lg bg-gray-100 p-2">
            🧐:{" "}
            <i>
              È possibile spostare l'oggetto tra uno scatto e l'altro per
              fotografare tutti i lati, purchè esso non si pieghi o deformi.
            </i>
          </p>

          <p className="py-2 text-lg font-bold">🤳 Come fare le foto:</p>
          <p>
            Posiziona l'oggetto in modo che riempia la maggior parte possibile
            dell'inquadratura della fotocamera senza escludere o tagliare alcuna
            parte.
          </p>
          <p>
            Utilizza un'apertura di diaframma sufficientemente stretta per
            mantenere una messa a fuoco nitida. Scattare alla massima
            risoluzione supportata dalla fotocamera e utilizzare il formato RAW,
            se possibile.
          </p>

          <p className="py-4 text-lg font-bold">❌ Cosa evitare:</p>
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
