# Area 2: Performance

**Punteggio attuale**: 5/10
**Obiettivo**: 8/10
**Effort totale stimato**: ~3-4 giorni

---

## PERF-01: Refactoring AMQP Client

- **Priorita**: P0
- **Effort**: M (4-16h)
- **Stato**: `[~]` parziale
- **Dipendenze**: -

> **PROGRESSO**: Convertito a Promise API (async/await) e semplificato. Tuttavia crea **ancora una nuova connessione TCP per ogni messaggio** (`amqp.connect()` + `connection.close()` ad ogni invocazione). Mancano: connection pooling, retry logic, heartbeat, graceful shutdown.
> **NOTA**: `/api/send-to-queue` e stata eliminata. `sendToQueue` e ora chiamato dalla server action `submitProjectToQueue` in `app/projects/new/actions.ts`.

### Problema
`utils/amqpClient.ts` crea una nuova connessione TCP per ogni messaggio e nessun retry logic. Sotto carico esaurisce il pool di connessioni RabbitMQ.

### Implementazione

Riscrivere completamente `utils/amqpClient.ts`:

```typescript
import amqp, { Connection, Channel } from "amqplib";

const connectionString = process.env.QUEUE_CONNECTION_STRING || "amqp://localhost";
const QUEUE_NAME = process.env.QUEUE_NAME || "processing-dev";

let connection: Connection | null = null;
let channel: Channel | null = null;

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

async function getChannel(): Promise<Channel> {
  if (channel) return channel;

  if (!connection) {
    connection = await amqp.connect(connectionString, {
      heartbeat: 30,
      timeout: 10000,
    });
    connection.on("error", (err) => {
      console.error("[amqp] Connection error:", err);
      connection = null;
      channel = null;
    });
    connection.on("close", () => {
      connection = null;
      channel = null;
    });
  }

  channel = await connection.createChannel();
  await channel.assertQueue(QUEUE_NAME, { durable: true });
  return channel;
}

export async function sendToQueue(message: number): Promise<void> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const ch = await getChannel();
      ch.sendToQueue(QUEUE_NAME, Buffer.from(message.toString()), {
        persistent: true,
      });
      return;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      channel = null; // reset per prossimo tentativo
      if (attempt < MAX_RETRIES) {
        await new Promise((r) => setTimeout(r, RETRY_DELAY_MS * attempt));
      }
    }
  }

  throw lastError;
}

// Graceful shutdown
process.on("SIGINT", async () => {
  if (channel) await channel.close();
  if (connection) await connection.close();
});
```

### File coinvolti
- `utils/amqpClient.ts` (riscrittura completa)

### Criteri di accettazione
- [ ] Connection pooling: una singola connessione riutilizzata
- [ ] Promise API: niente callback
- [ ] Retry con exponential backoff (3 tentativi)
- [ ] Heartbeat configurato (30s)
- [ ] Connection timeout (10s)
- [ ] Gestione errori di connessione (auto-reconnect)
- [ ] Graceful shutdown su SIGINT
- [ ] Test: invio multiplo rapido non crea connessioni multiple

---

## PERF-02: Fix Viewer3d - Store Mutations e Camera

- **Priorita**: P1
- **Effort**: S (1-4h)
- **Stato**: `[ ]`
- **Dipendenze**: -

### Problema
`components/viewer3d/Viewer3d.tsx:35-37`: store mutations eseguite nel render body (non in useEffect), causa loop infiniti con React StrictMode. Riga 43: `PerspectiveCamera` ricreata ad ogni render.

### Implementazione

```typescript
// components/viewer3d/Viewer3d.tsx

export const Viewer3d: React.FC<Viewer3dProps> = ({ textureUrl, objectUrl, usdzUrl, ... }) => {
  // Spostare mutations in useEffect
  useEffect(() => {
    actions.setTextureUrl(textureUrl);
    actions.setObjectUrl(objectUrl);
    actions.setUsdzUrl(usdzUrl);
  }, [textureUrl, objectUrl, usdzUrl]);

  const containerRef = useRef<HTMLDivElement>(null);

  // Memoizzare la camera
  const camera = useMemo(
    () => {
      const cam = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
      cam.position.z = 5;
      cam.lookAt(0, 0, 0);
      return cam;
    },
    []
  );

  // ...
};
```

Rimuovere anche l'import non usato `_Object` dalla riga 8.

### File coinvolti
- `components/viewer3d/Viewer3d.tsx`

### Criteri di accettazione
- [ ] Store mutations in useEffect con dependency array
- [ ] Camera memoizzata con useMemo
- [ ] Import `_Object` rimosso
- [ ] Nessun warning React StrictMode in dev
- [ ] Viewer 3D funziona correttamente

---

## PERF-03: Fix listObjects con Prefix S3

- **Priorita**: P1
- **Effort**: XS (<1h)
- **Stato**: `[ ]`
- **Dipendenze**: -

### Problema
`utils/s3/api.ts:11`: `listObjects` scarica TUTTI gli oggetti del bucket e filtra client-side. Con molti file diventa molto costoso.

### Implementazione

```typescript
// utils/s3/api.ts
export const listObjects = async (Bucket: string, path: string) => {
  const response = await clientS3.send(
    new ListObjectsV2Command({
      Bucket,
      Prefix: path || undefined, // delega il filtro a S3
    })
  );
  return response.Contents ?? [];
};
```

### File coinvolti
- `utils/s3/api.ts`

### Criteri di accettazione
- [ ] ListObjectsV2Command usa parametro `Prefix`
- [ ] Filtro client-side rimosso
- [ ] Funzionalita invariata per i chiamanti
- [ ] Test: lista file di un progetto restituisce solo i suoi file

---

## PERF-04: Lazy Loading Componenti 3D

- **Priorita**: P2
- **Effort**: S (1-4h)
- **Stato**: `[ ]`
- **Dipendenze**: -

### Problema
Three.js + R3F + drei + postprocessing pesano ~1MB nel client bundle. Non c'e code splitting: il bundle 3D viene caricato anche quando l'utente non visualizza modelli.

### Implementazione

```typescript
// Dove Viewer3d viene importato (es. app/projects/[id]/page.tsx)
import dynamic from "next/dynamic";

const Viewer3d = dynamic(
  () => import("@/components/viewer3d/Viewer3d").then((mod) => mod.Viewer3d),
  {
    ssr: false,
    loading: () => <Loader />,
  }
);

// Stessa cosa per Configurator3d
const Configurator3d = dynamic(
  () => import("@/components/configurator/Configurator3d").then((mod) => mod.Configurator3d),
  { ssr: false, loading: () => <Loader /> }
);
```

### File coinvolti
- `app/projects/[id]/page.tsx` (o dove Viewer3d e importato)
- `app/configurator/[id]/page.tsx` (o dove Configurator3d e importato)
- Verificare tutti i punti di import di componenti 3D

### Criteri di accettazione
- [ ] Viewer3d caricato con next/dynamic e ssr: false
- [ ] Configurator3d caricato con next/dynamic e ssr: false
- [ ] Loading state visibile durante il caricamento
- [ ] Bundle iniziale piu leggero (verificare con build output)
- [ ] 3D funziona correttamente dopo lazy load

---

## PERF-05: Risolvere N+1 Queries su Signed URLs

- **Priorita**: P2
- **Effort**: M (4-16h)
- **Stato**: `[ ]`
- **Dipendenze**: -

### Problema
Nelle server actions che listano progetti, per ogni progetto viene chiamata `getSignedUrl()` separatamente per i thumbnail. Con 50 progetti = 50 chiamate sequenziali a S3.

### Implementazione

Usare `Promise.all` per parallelizzare:

```typescript
// Nelle server actions di lista progetti
const projects = await supabase.from("project").select("*").eq("user_id", user.id);

const projectsWithUrls = await Promise.all(
  projects.data.map(async (project) => ({
    ...project,
    thumbnailUrl: project.thumbnail
      ? await getSignedUrl(bucket, project.thumbnail)
      : null,
  }))
);
```

Per ulteriore ottimizzazione, valutare cache delle signed URLs con TTL < 1h (es. `Map` in-memory con scadenza).

### File coinvolti
- `app/projects/actions.tsx` (o file equivalente con la lista)
- Server actions che generano signed URLs in loop

### Criteri di accettazione
- [ ] Signed URLs generate in parallelo con Promise.all
- [ ] Tempo di risposta lista progetti ridotto significativamente
- [ ] Funzionalita invariata

---

## PERF-06: Bundle Analyzer

- **Priorita**: P3
- **Effort**: S (1-4h)
- **Stato**: `[ ]`
- **Dipendenze**: PERF-04 completato

### Problema
Nessuna visibilita sulla composizione del bundle. Non si sa quali dipendenze pesano di piu e dove ottimizzare.

### Implementazione

```bash
npm install -D @next/bundle-analyzer
```

```javascript
// next.config.mjs
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

// Wrap config
export default withBundleAnalyzer(nextConfig);
```

Aggiungere script:
```json
// package.json
"analyze": "ANALYZE=true next build"
```

### File coinvolti
- `next.config.mjs`
- `package.json`

### Criteri di accettazione
- [ ] `npm run analyze` genera report bundle visuale
- [ ] Report identifica le dipendenze piu pesanti
- [ ] Documentare risultati e azioni di follow-up
