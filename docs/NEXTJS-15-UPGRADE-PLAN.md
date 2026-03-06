# Next.js 15 Upgrade Plan - goto3d-web

## Panoramica

Upgrade da **Next.js 14.2.5** a **Next.js 15.x** per risolvere 2 vulnerabilita' di sicurezza (1 high, 1 medium) e allinearsi alle ultime best practice.

**Branch**: `feat/nextjs-15-upgrade`
**Stima effort**: 4-8 ore
**Rischio**: Medio - breaking changes gestibili con codemod + modifiche manuali

---

## Vulnerabilita' da risolvere

| Severita' | Descrizione | Range vulnerabile | Fix minimo |
|-----------|-------------|-------------------|------------|
| **High** | DoS via HTTP request deserialization (React Server Components) | >= 13.0.0, < 15.0.8 | `15.0.8` |
| **Medium** | DoS via Image Optimizer remotePatterns | >= 10.0.0, < 15.5.10 | `15.5.10` |

**Target version**: `next@15.5.10` o superiore (risolve entrambe)

---

## Analisi Dipendenze

### Dipendenze che richiedono aggiornamento

| Package | Versione attuale | Azione | Note |
|---------|-----------------|--------|------|
| `next` | 14.2.5 | -> `^15.5.10` | Upgrade principale |
| `react` | 18.3.1 | -> `^19.0.0` | Consigliato per Next.js 15 |
| `react-dom` | 18.3.1 | -> `^19.0.0` | Deve corrispondere a React |
| `@types/react` | 18.3.22 | -> `^19.0.0` | Tipi per React 19 |
| `@types/react-dom` | 18.3.7 | -> `^19.0.0` | Tipi per React DOM 19 |
| `@sentry/nextjs` | 10.40.0 | -> `^11.0.0+` | Necessario per supporto Next.js 15 |
| `eslint-config-next` | 15.5.12 | -> corrispondere a Next.js | Gia' in v15, allineare |
| `@next/bundle-analyzer` | 16.1.6 | verificare compatibilita' | Gia' ahead, dovrebbe funzionare |

### Dipendenze compatibili (nessuna azione richiesta)

| Package | Versione | Status |
|---------|----------|--------|
| `next-intl` | 4.8.3 | Supporta Next.js 15 (in peer deps) |
| `@serwist/next` | 9.5.6 | Verificare compatibilita', potrebbe servire `--legacy-peer-deps` |
| `@supabase/ssr` | 0.8.0 | Compatibile |
| `@supabase/supabase-js` | 2.98.0 | Compatibile |
| `@react-three/fiber` | 8.18.0 | Compatibile (verificare con React 19) |
| `@react-three/drei` | 9.122.0 | Compatibile (verificare con React 19) |
| `valtio` | 1.13.2 | Compatibile |
| `zod` | 4.3.6 | Compatibile |
| `three` | 0.175.0 | Compatibile |

---

## Step di Upgrade (in ordine)

### STEP 1: Esecuzione Codemod automatico

Next.js fornisce un codemod per automatizzare le modifiche piu' comuni.

```bash
npx @next/codemod@latest upgrade latest
```

Questo codemod gestisce automaticamente:
- Conversione `cookies()`, `headers()`, `draftMode()` da sync ad async
- Aggiornamento import deprecati
- Aggiornamento `next.config.mjs`

### STEP 2: Aggiornamento dipendenze core

```bash
npm install next@latest react@latest react-dom@latest
npm install -D @types/react@latest @types/react-dom@latest
```

### STEP 3: Fix API Async (Breaking Change Principale)

**File**: `utils/supabase/server.ts`

La funzione `cookies()` di `next/headers` e' ora **asincrona** in Next.js 15.

```typescript
// PRIMA (Next.js 14)
import { cookies } from "next/headers";
export const createClient = () => {
  const cookieStore = cookies(); // sincrono
  return createServerClient<Database>(/* ... */);
};

// DOPO (Next.js 15)
import { cookies } from "next/headers";
export const createClient = async () => {
  const cookieStore = await cookies(); // asincrono
  return createServerClient<Database>(/* ... */);
};
```

**Impatto a cascata**: Tutti i file che chiamano `createClient()` dovranno usare `await`:

File da aggiornare:
- `app/[locale]/page.tsx` - `await createClient()` (gia' in funzione async, solo aggiungere await)
- `app/[locale]/layout.tsx` - `await createClient()`
- `app/[locale]/dashboard/page.tsx` - `await createClient()`
- `app/[locale]/projects/page.tsx` - `await createClient()`
- `app/[locale]/projects/[id]/page.tsx` - `await createClient()`
- `app/[locale]/projects/new/page.tsx` - `await createClient()`
- `app/[locale]/catalogs/page.tsx` - `await createClient()`
- `app/[locale]/catalogs/[id]/page.tsx` - `await createClient()`
- `app/[locale]/catalogs/new/page.tsx` - `await createClient()`
- `app/[locale]/configurator/page.tsx` - `await createClient()`
- `app/[locale]/configurator/[id]/page.tsx` - `await createClient()`
- `app/[locale]/configurator/new/page.tsx` - `await createClient()`
- `app/[locale]/profile/page.tsx` - `await createClient()`
- Tutti i file `actions.tsx` che usano `createClient()`
- `app/api/` route handlers

### STEP 4: Aggiornamento `params` e `searchParams`

In Next.js 15, `params` e `searchParams` nelle page/layout sono ora **Promise**.

```typescript
// PRIMA (Next.js 14)
export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;
}

// DOPO (Next.js 15)
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
}
```

File da aggiornare:
- `app/[locale]/layout.tsx` - `params.locale`
- `app/[locale]/projects/[id]/page.tsx` - `params.id`
- `app/[locale]/catalogs/[id]/page.tsx` - `params.id`
- `app/[locale]/configurator/[id]/page.tsx` - `params.id`
- `app/[locale]/artifact/[id]/page.tsx` - `params.id`
- `app/[locale]/artifact/[id]/[project]/page.tsx` - `params.id`, `params.project`

### STEP 5: Aggiornamento Caching Behavior

Next.js 15 cambia il comportamento di default del caching:
- `fetch()` ora usa `no-store` di default (prima era `force-cache`)
- I GET Route Handlers non sono piu' cached di default

**Nel nostro progetto**: Non ci sono chiamate `fetch()` dirette (si usa Supabase SDK), quindi l'impatto dovrebbe essere minimo. Verificare comunque che non ci siano regressioni nelle performance.

### STEP 6: Aggiornamento Sentry

```bash
npm install @sentry/nextjs@latest
```

Verificare che:
- `withSentryConfig()` in `next.config.mjs` sia compatibile con la nuova API
- `instrumentation.ts` e `instrumentation-client.ts` funzionino correttamente
- I file `sentry.server.config.ts` e `sentry.edge.config.ts` non abbiano breaking changes

Consultare: https://docs.sentry.io/platforms/javascript/guides/nextjs/

### STEP 7: Aggiornamento next.config.mjs

```javascript
// Verificare e aggiornare queste sezioni:

// 1. `experimental.serverActions` - potrebbe non servire piu' experimental
//    In Next.js 15, Server Actions sono stabili
//    Cambiare da:
experimental: {
  serverActions: { allowedOrigins: [...] }
}
//    A:
serverActions: { allowedOrigins: [...] }  // non piu' experimental

// 2. `experimental.serverComponentsExternalPackages` -> `serverExternalPackages`
//    Rinominato in Next.js 15
//    Da: experimental.serverComponentsExternalPackages: ["@aws-sdk", "amqplib"]
//    A: serverExternalPackages: ["@aws-sdk", "amqplib"]
```

### STEP 8: Verifica React Three Fiber con React 19

React Three Fiber e @react-three/drei devono supportare React 19.
- Verificare che `@react-three/fiber@8.18.0` supporti React 19
- Se necessario, aggiornare: `npm install @react-three/fiber@latest @react-three/drei@latest`

### STEP 9: Aggiornamento ESLint (opzionale)

Next.js 15 supporta ESLint 9 con il nuovo formato flat config.
- `eslint-config-next` e' gia' a `15.5.12`, quindi e' allineato
- Valutare migrazione a flat config ESLint 9 (non bloccante)

### STEP 10: Verifica PWA (Serwist)

- Verificare che `@serwist/next@9.5.6` funzioni con Next.js 15
- Se ci sono errori, aggiornare: `npm install @serwist/next@latest serwist@latest`
- Testare il service worker in produzione build

---

## Checklist di Test Post-Upgrade

### Test Funzionali
- [ ] Homepage carica correttamente (entrambe le lingue IT/EN)
- [ ] Login/Logout funziona (Supabase Auth)
- [ ] Login con Google funziona
- [ ] Dashboard mostra statistiche corrette
- [ ] Creazione nuovo progetto (upload immagini + invio a coda)
- [ ] Visualizzazione progetto con viewer 3D
- [ ] Creazione/modifica/eliminazione catalogo
- [ ] Configuratore 3D funziona
- [ ] Navigazione tra le pagine fluida
- [ ] Cambio lingua (IT <-> EN) funziona

### Test Tecnici
- [ ] `npm run build` compila senza errori
- [ ] `npm run lint` passa senza errori
- [ ] Nessun warning di deprecation nella console
- [ ] Middleware i18n funziona (redirect corretti)
- [ ] Middleware Supabase (sessione aggiornata correttamente)
- [ ] Server Actions funzionano (form submissions)
- [ ] API routes funzionano (`/api/image-upload`, `/api/send-to-queue`)
- [ ] Sentry cattura errori correttamente
- [ ] PWA Service Worker si registra (production build)
- [ ] Immagini ottimizzate via `next/image` caricate correttamente
- [ ] Font locali caricati correttamente
- [ ] AR viewer funziona su iOS (se testabile)

### Test di Performance
- [ ] Tempo di build non significativamente aumentato
- [ ] TTFB (Time to First Byte) accettabile
- [ ] LCP (Largest Contentful Paint) non peggiorato
- [ ] Nessun memory leak evidente

---

## Strategia di Rollback

Se l'upgrade causa problemi critici:

1. **Rollback immediato**: `git checkout main` - il branch main resta intatto
2. **Fix parziale**: Se solo alcune dipendenze causano problemi, e' possibile fare rollback selettivo nel `package.json`
3. **Workaround temporaneo**: Usare `--legacy-peer-deps` per dipendenze con conflitti peer

---

## Risorse

- [Next.js 15 Upgrade Guide (Ufficiale)](https://nextjs.org/docs/app/guides/upgrading/version-15)
- [Next.js 15 Blog Post](https://nextjs.org/blog/next-15)
- [Sentry Next.js 15 Support](https://github.com/getsentry/sentry-javascript/issues/15422)
- [next-intl 4.0 Blog](https://next-intl.dev/blog/next-intl-4-0)
- [Serwist Documentation](https://serwist.pages.dev/docs/next)
- [React 19 Upgrade Guide](https://react.dev/blog/2024/12/05/react-19)

---

## Note

- Il codemod di Next.js (`npx @next/codemod@latest upgrade`) automatizza gran parte dello STEP 3 e 4
- Procedere uno step alla volta, verificando la build dopo ogni step
- Se React 19 causa problemi con React Three Fiber, e' possibile restare su React 18 (Next.js 15 supporta entrambi)
- La priorita' e' risolvere le vulnerabilita': la versione target minima e' `next@15.5.10`
