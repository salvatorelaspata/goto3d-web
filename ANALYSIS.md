# GoTo3D — Analisi del Progetto

**Data**: 20 aprile 2026  
**Versione analizzata**: Next.js 15.5.12, React 19, React Three Fiber 9

---

## Panoramica

GoTo3D è una web app per la conversione di immagini in modelli 3D. Il progetto usa uno stack moderno (Next.js App Router, Supabase, Cloudflare R2, RabbitMQ) e include funzionalità avanzate come viewer WebGL, supporto AR su iOS e PWA. La base di codice è solida, ma presenta lacune in testing, logging, error handling e resilienza distribuita che andrebbero risolte prima di un utilizzo a larga scala.

---

## 1. Bug e Problemi Critici

### 1.1 Double-mesh in `components/viewer3d/Model3d.tsx:126`

```tsx
// PROBLEMA: mesh esterno vuoto con stesso ref del mesh interno
<mesh ref={mesh} position={[0, 0, 0]}>
  {geometry && (
    <mesh ref={mesh} geometry={geometry} position={[0, 0, 0]}>
      <meshPhysicalMaterial map={texture as THREE.Texture} />
    </mesh>
  )}
</mesh>
```

Il `<mesh>` esterno è vuoto e inutile. Probabile errore di copia-incolla. Il renderer Three.js disegna un oggetto in più per ogni frame.

**Fix**: rimuovere il wrapper esterno, mantenere solo il mesh con la geometry.

---

### 1.2 `Promise.all` senza gestione errori — `Model3d.tsx:50`

```ts
const values = await Promise.all(pAll); // se una texture fallisce, tutto crasha
```

Se anche solo un loader fallisce, l'intera operazione viene rigettata senza possibilità di degradazione parziale.

**Fix**: usare `Promise.allSettled()` e gestire i singoli fallimenti.

---

### 1.3 Rate limiting in-memory — `lib/rate-limit.ts`

Il rate limiter usa memoria locale del processo Node.js. Su Vercel (serverless) o in presenza di più istanze, ogni processo ha il suo contatore indipendente: il limite è quindi aggirato automaticamente in produzione.

Lo stesso file contiene un commento che menziona Upstash Redis come alternativa, ma non è stato implementato.

**Fix**: sostituire con [Upstash Redis](https://upstash.com/) o Cloudflare KV.

---

### 1.4 Nessun error tracking in produzione

Tutti gli errori vengono loggati con `console.error()`. In produzione questo è invisibile: stack trace esposto nel browser, nessun alert, nessuna aggregazione.

**Fix**: integrare Sentry (`@sentry/nextjs`) — setup in meno di un'ora.

---

## 2. Sicurezza

### 2.1 Content Security Policy troppo permissiva — `next.config.mjs:16`

```
script-src 'self' 'unsafe-eval' 'unsafe-inline' ...
```

`'unsafe-eval'` e `'unsafe-inline'` annullano di fatto l'utilità del CSP contro XSS. Sono stati aggiunti probabilmente per GSAP/Three.js e Iubenda.

**Fix**: valutare un approccio basato su nonce per gli script inline; verificare se Iubenda supporta una CSP più restrittiva.

### 2.2 Validazione file upload — `app/api/image-upload/route.ts`

La route fa già molte cose bene:
- sanitizzazione del filename
- verifica del tipo MIME
- limite di dimensione
- verifica della proprietà del progetto

Manca però la verifica dei **magic number** (firma binaria del file). Un file rinominato `.jpg` con contenuto malevolo supera la validazione MIME.

**Fix**: leggere i primi byte del buffer e verificare la firma con una libreria come `file-type`.

### 2.3 Variabile d'ambiente con fallback hardcoded — `utils/amqpClient.ts:4`

```ts
const connectionString = process.env.QUEUE_CONNECTION_STRING || "amqp://localhost";
```

In un ambiente di staging senza la variabile configurata, si connette silenziosamente a localhost senza errori visibili.

**Fix**: rimuovere il fallback, lanciare un errore esplicito se la variabile manca all'avvio.

---

## 3. Qualità del Codice

### 3.1 Validazione form assente — `components/Auth.tsx`

```ts
const email = formData.get("email") as string; // cast diretto, nessuna validazione
```

Zod è già nel progetto e usato in altri punti. La stessa validazione dovrebbe applicarsi ai form di autenticazione, sia lato client che nella server action.

**Fix**: definire uno schema Zod per login/signup e validare prima di chiamare Supabase.

### 3.2 Stringhe hardcoded in italiano — `store/wizardStore.ts:66` e altri file

```ts
wizardStore.error = "Compila tutti i campi obbligatori";
```

Il progetto usa `next-intl` per l'internazionalizzazione, ma molti messaggi di errore e toast sono hardcoded in italiano nei component e negli store.

**Fix**: spostare tutte le stringhe UI nei file di traduzione e accedere tramite `useTranslations()`.

### 3.3 Dipendenze useEffect incomplete — `Model3d.tsx:77`

```ts
useEffect(() => {
  const load = async () => { /* usa objectUrl, textureUrl, ... */ };
  load();
}, [objectUrl, textureUrl]); // mancano dipendenze
```

L'array di dipendenze è incompleto. Può causare stale closure e animazioni GSAP che girano con dati vecchi.

**Fix**: aggiungere tutte le dipendenze usate all'interno dell'effect (o usare `useCallback`).

### 3.4 `console.error` in produzione — più file

Molti errori vengono loggati con `console.error()` direttamente, esponendo stack trace nel browser e non fornendo contesto utile per il debug server-side.

**Fix**: usare Sentry per gli errori; rimuovere o condizionare i log con `process.env.NODE_ENV`.

---

## 4. Performance

### 4.1 Componenti 3D non lazy-loaded

`three`, `@react-three/fiber` e `@react-three/drei` pesano diverse centinaia di KB. Se vengono inclusi nel bundle principale, rallentano il caricamento iniziale anche sulle pagine che non mostrano il viewer.

`Viewer3dDynamic.tsx` esiste ma va verificato che sia effettivamente usato ovunque al posto dell'import diretto.

**Fix**: usare `next/dynamic` con `ssr: false` per tutti i componenti che usano Three.js.

```ts
const Viewer3d = dynamic(() => import('@/components/viewer3d/Viewer3d'), {
  ssr: false,
  loading: () => <Loader />,
});
```

### 4.2 GSAP caricato globalmente

GSAP (~100KB) è usato in `Loader.tsx` e `Model3d.tsx`. Se il loader è sempre visibile, ha senso tenerlo nel bundle principale; altrimenti si può lazy-loadare insieme al viewer 3D.

### 4.3 Immagini preview modelli

Nessuna compressione o formato WebP visibile per le immagini di anteprima dei modelli. Next.js Image component gestisce l'ottimizzazione automatica solo se usato correttamente con dimensioni esplicite.

**Fix**: specificare `width` e `height` su tutti i componenti `<Image>`, aggiungere `quality={80}` per le preview.

---

## 5. Architettura

### 5.1 Error boundaries parziali

`Canvas3dErrorBoundary` esiste ed è correttamente posizionato attorno al canvas Three.js. Mancano però error boundary a livello di pagina o sezione: un crash in un componente secondario può far saltare l'intera pagina.

**Fix**: aggiungere `error.tsx` con UI di recovery in ogni route group, e wrappare le sezioni principali con `<ErrorBoundary>`.

### 5.2 Nessun logging strutturato

Tutti i log sono stringhe senza contesto: nessun livello (debug/info/warn/error), nessun correlation ID per le request, nessuna distinzione tra errori operativi e di programmazione.

**Fix**: integrare `pino` per il logging server-side con output JSON; configurare livelli per ambiente.

### 5.3 Service Worker con strategia default

Il SW usa `defaultCache` di Serwist senza personalizzazioni. I file di modelli 3D (GLTF, OBJ, texture) potrebbero non essere cachati in modo ottimale.

**Fix**: aggiungere una strategia `CacheFirst` esplicita per i file statici e una `NetworkFirst` per le API.

---

## 6. Dipendenze

| Pacchetto | Versione attuale | Note |
|---|---|---|
| `@aws-sdk/client-s3` | 3.1000.0 | Molto indietro, aggiornare per patch sicurezza |
| `amqplib` | ^0.10.9 | Poco mantenuto, valutare `amq-connection-manager` |
| `@supabase/supabase-js` | ^2.98.0 | Verificare se v3 è disponibile |
| `next` | ^15.5.12 | OK |
| `react` | ^19.2.4 | OK |
| `typescript` | ^5.9.3 | OK |
| `zod` | ^4.3.6 | OK |
| `gsap` | ^3.14.2 | OK |

**Fix immediato**: `npm update @aws-sdk/client-s3@latest`

---

## 7. Testing

Il progetto ha Vitest e Cypress configurati, ma solo 4 file di test in `__tests__/lib/` (rate-limit e validazione). Nessun test di componente, nessun test di integrazione, Cypress praticamente inutilizzato.

**Target realistico**:
- 60%+ coverage per utility e store
- Test di integrazione per le API routes principali
- 2-3 scenari E2E Cypress per i flussi critici (upload → processing → viewer)

---

## Piano di Azione

### Priorità 1 — Fix rapidi (1-4 ore)

- [ ] Rimuovere double-mesh in `Model3d.tsx`
- [ ] `Promise.all` → `Promise.allSettled()` in `Model3d.tsx`
- [ ] Aggiornare `@aws-sdk/client-s3` all'ultima versione
- [ ] Rimuovere fallback hardcoded da `amqpClient.ts`

### Priorità 2 — Questa settimana

- [ ] Integrare Sentry per error tracking
- [ ] Aggiungere validazione Zod in `Auth.tsx`
- [ ] Spostare stringhe hardcoded italiane in `next-intl`
- [ ] Lazy-load componenti Three.js con `next/dynamic`
- [ ] Correggere array di dipendenze degli `useEffect` in `Model3d.tsx`

### Priorità 3 — Prossime due settimane

- [ ] Sostituire rate limiter in-memory con Upstash Redis
- [ ] Aggiungere magic number verification nell'upload
- [ ] Implementare logging strutturato con `pino`
- [ ] Aggiungere error boundaries a livello pagina
- [ ] Aumentare copertura test a 60%+

### Priorità 4 — Prossimo mese

- [ ] Revisione CSP con approccio nonce-based
- [ ] Strategia caching Service Worker per file 3D
- [ ] Profiling bundle e Core Web Vitals
- [ ] Suite E2E Cypress per flussi critici
- [ ] Valutare migrazione da `amqplib` a `amq-connection-manager`
