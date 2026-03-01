# Area 6: Infrastruttura

**Punteggio attuale**: 4/10
**Obiettivo**: 7/10
**Effort totale stimato**: ~4-5 giorni

---

## INFRA-01: Setup CI/CD con GitHub Actions

- **Priorita**: P1
- **Effort**: M (4-16h)
- **Stato**: `[ ]`
- **Dipendenze**: -

### Problema
Nessuna pipeline CI/CD. Il deploy dipende interamente dall'integrazione automatica Vercel-GitHub senza check di qualita. Non c'e: lint pre-merge, type checking, test automatici, security scanning.

### Implementazione

Creare `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "npm"

      - run: npm ci

      - name: TypeScript check
        run: npx tsc --noEmit

      - name: Lint
        run: npm run lint

      - name: Unit tests
        run: npm run test:run
        # Attivare dopo TEST-03

      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
```

Opzionale - workflow separato per E2E:

```yaml
# .github/workflows/e2e.yml
name: E2E Tests

on:
  pull_request:
    branches: [main]

jobs:
  cypress:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "npm"
      - run: npm ci
      - name: Cypress run
        uses: cypress-io/github-action@v6
        with:
          build: npm run build
          start: npm start
          wait-on: "http://localhost:3000"
        env:
          CYPRESS_TEST_USER_EMAIL: ${{ secrets.CYPRESS_TEST_USER_EMAIL }}
          CYPRESS_TEST_USER_PASSWORD: ${{ secrets.CYPRESS_TEST_USER_PASSWORD }}
```

### File coinvolti
- `.github/workflows/ci.yml` (nuovo)
- `.github/workflows/e2e.yml` (nuovo, opzionale)

### Criteri di accettazione
- [ ] CI pipeline eseguita su ogni push a main e PR
- [ ] TypeScript type check attivo
- [ ] Lint check attivo
- [ ] Build check attivo
- [ ] Badge CI visibile nel README (opzionale)
- [ ] PR bloccate se CI fallisce (configurare branch protection)

---

## INFRA-02: Integrare Error Tracking (Sentry)

- **Priorita**: P1
- **Effort**: M (4-16h)
- **Stato**: `[ ]`
- **Dipendenze**: Account Sentry

### Problema
Errori in produzione completamente invisibili. Le server actions loggano solo in dev mode. Nessun servizio di error tracking, APM, o telemetria.

### Implementazione

```bash
npx @sentry/wizard@latest -i nextjs
```

Questo setup automatico crea:
- `sentry.client.config.ts`
- `sentry.server.config.ts`
- `sentry.edge.config.ts`
- Aggiorna `next.config.mjs` con `withSentryConfig`

#### Configurazione manuale aggiuntiva

1. **Sostituire console.error con Sentry.captureException** nelle server actions:
   ```typescript
   // PRIMA
   if (process.env.NODE_ENV === "development") {
     console.error("[projects] Error:", error);
   }

   // DOPO
   import * as Sentry from "@sentry/nextjs";
   Sentry.captureException(error, { tags: { module: "projects" } });
   ```

2. **Error boundary integration**:
   ```typescript
   // Canvas3dErrorBoundary.tsx
   componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
     Sentry.captureException(error, { contexts: { react: errorInfo } });
   }
   ```

3. **Performance monitoring** (opzionale):
   ```typescript
   // sentry.client.config.ts
   Sentry.init({
     dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
     tracesSampleRate: 0.1, // 10% delle transazioni
     replaysSessionSampleRate: 0.01, // 1% dei replay
   });
   ```

### File coinvolti
- `sentry.client.config.ts` (nuovo)
- `sentry.server.config.ts` (nuovo)
- `sentry.edge.config.ts` (nuovo)
- `next.config.mjs` (wrap con withSentryConfig)
- `.env.example` (NEXT_PUBLIC_SENTRY_DSN, SENTRY_AUTH_TOKEN)
- Server actions con console.error (~5 file)

### Criteri di accettazione
- [ ] Sentry SDK installato e configurato
- [ ] Errori client-side catturati automaticamente
- [ ] Errori server-side catturati nelle server actions
- [ ] Error boundaries inviano a Sentry
- [ ] Source maps uploadati per debugging
- [ ] Dashboard Sentry mostra errori del progetto

---

## INFRA-03: Migrare da auth-helpers a @supabase/ssr

- **Priorita**: P1
- **Effort**: S (1-4h)
- **Stato**: `[ ]`
- **Dipendenze**: -

### Problema
`@supabase/auth-helpers-nextjs@0.10.0` e `@supabase/auth-helpers-react@0.5.0` sono deprecati. Il progetto usa gia `@supabase/ssr@0.8.0` per il middleware e server client. I pacchetti auth-helpers vanno rimossi.

### Implementazione

1. **Verificare utilizzo**:
   ```bash
   grep -rn "auth-helpers" --include="*.ts" --include="*.tsx"
   ```

2. **Rimuovere pacchetti**:
   ```bash
   npm uninstall @supabase/auth-helpers-nextjs @supabase/auth-helpers-react
   ```

3. **Sostituire eventuali import**:
   - `createClientComponentClient` -> `createBrowserClient` da `@supabase/ssr`
   - `createServerComponentClient` -> gia implementato in `utils/supabase/server.ts`
   - `createRouteHandlerClient` -> pattern gia in uso

4. **Verificare** che tutti i client usino i pattern in `utils/supabase/`:
   - `utils/supabase/client.ts` (browser)
   - `utils/supabase/server.ts` (server components)
   - `utils/supabase/middleware.ts` (middleware)

### File coinvolti
- `package.json` (rimuovere dipendenze)
- Eventuali file che importano da `@supabase/auth-helpers-*`

### Criteri di accettazione
- [ ] `@supabase/auth-helpers-nextjs` rimosso
- [ ] `@supabase/auth-helpers-react` rimosso
- [ ] Zero import da pacchetti rimossi
- [ ] Auth funziona correttamente (login, logout, session refresh)
- [ ] `npm run build` passa

---

## INFRA-04: Migrare da next-pwa a @serwist/next

- **Priorita**: P2
- **Effort**: M (4-16h)
- **Stato**: `[ ]`
- **Dipendenze**: -

### Problema
`next-pwa@5.6.0` non e piu mantenuto (ultimo commit 2023). Mancano: icone maskable, offline fallback, strategie di cache personalizzate.

### Implementazione

```bash
npm uninstall next-pwa
npm install @serwist/next
npm install -D serwist
```

1. **Aggiornare `next.config.mjs`**:
   ```javascript
   import withSerwistInit from "@serwist/next";

   const withSerwist = withSerwistInit({
     swSrc: "app/sw.ts",
     swDest: "public/sw.js",
     disable: process.env.NODE_ENV === "development",
   });

   export default withSerwist(nextConfig);
   ```

2. **Creare service worker** (`app/sw.ts`):
   ```typescript
   import { defaultCache } from "@serwist/next/worker";
   import { Serwist } from "serwist";

   const serwist = new Serwist({
     precacheEntries: self.__SW_MANIFEST,
     skipWaiting: true,
     clientsClaim: true,
     navigationPreload: true,
     runtimeCaching: defaultCache,
     fallbacks: {
       entries: [{ url: "/offline", matcher: ({ request }) => request.destination === "document" }],
     },
   });

   serwist.addEventListeners();
   ```

3. **Aggiornare manifest** (`public/manifest.json`):
   ```json
   {
     "icons": [
       { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
       { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" },
       { "src": "/icons/icon-maskable.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
     ]
   }
   ```

4. **Creare pagina offline** (`app/offline/page.tsx`)

5. **Generare icone** di dimensioni appropriate (192, 512, maskable)

### File coinvolti
- `next.config.mjs` (sostituire wrapper PWA)
- `app/sw.ts` (nuovo)
- `app/offline/page.tsx` (nuovo)
- `public/manifest.json` (aggiornare)
- `public/icons/` (nuove icone)
- `package.json` (dipendenze)

### Criteri di accettazione
- [ ] @serwist/next configurato e funzionante
- [ ] Service worker generato in build
- [ ] Pagina offline fallback funzionante
- [ ] Icone maskable presenti
- [ ] Manifest completo con tutte le icone
- [ ] PWA installabile da browser
- [ ] Lighthouse PWA score > 80

---

## INFRA-05: Centralizzare Costanti e Magic Strings

- **Priorita**: P2
- **Effort**: S (1-4h)
- **Stato**: `[ ]`
- **Dipendenze**: -

### Problema
Magic strings sparsi nel codice: endpoint API (`/api/image-upload`), valori status (`"in queue"`, `"processing"`, `"done"`, `"error"`), nomi bucket, limiti file, etc.

> **AGGIORNAMENTO**: `/api/send-to-queue` e stata eliminata. La logica e nella server action `submitProjectToQueue`, quindi non serve piu centralizzare quell'endpoint. Il focus resta su status values, limiti file (SEC-07) e altri magic strings.

### Implementazione

Creare `lib/constants.ts`:

```typescript
// API Endpoints
export const API_ENDPOINTS = {
  IMAGE_UPLOAD: "/api/image-upload",
} as const;

// Project Status
export const PROJECT_STATUS = {
  IN_QUEUE: "in queue",
  PROCESSING: "processing",
  DONE: "done",
  ERROR: "error",
} as const;

export type ProjectStatus = (typeof PROJECT_STATUS)[keyof typeof PROJECT_STATUS];

// File Limits
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_FILES_PER_PROJECT = 20;

// Signed URL
export const SIGNED_URL_EXPIRY_SECONDS = 3600; // 1 ora
```

Aggiornare tutti i file che usano queste costanti.

### File coinvolti
- `lib/constants.ts` (nuovo)
- `components/wizard/Wizard.tsx` (API endpoints)
- `store/wizardStore.ts` (status)
- `app/api/image-upload/route.ts` (file limits)
- `lib/validations/project.ts` (file limits - allineare con SEC-07)
- `app/projects/new/actions.ts` (status `"in queue"`)
- `utils/s3/api.ts` (signed URL expiry)
- Server actions con status values

### Criteri di accettazione
- [ ] Zero magic strings nel codice
- [ ] Tutte le costanti in `lib/constants.ts`
- [ ] TypeScript type per ProjectStatus
- [ ] `grep -rn '"in queue"' --include="*.ts*"` restituisce solo constants.ts

---

## INFRA-06: Aggiornamento a Next.js 15

- **Priorita**: P3
- **Effort**: L (2-5 giorni)
- **Stato**: `[ ]`
- **Dipendenze**: Tutte le altre attivita completate, verifica compatibilita dipendenze

### Problema
Next.js 14.2.5 e funzionale ma Next.js 15 porta: React 19 support, miglioramenti App Router, Turbopack stabile, async request APIs, caching migliorato.

### Implementazione

1. **Verificare compatibilita**:
   ```bash
   npx @next/codemod@latest upgrade
   ```

2. **Breaking changes da gestire**:
   - `cookies()`, `headers()`, `params` diventano async in Next 15
   - Caching opt-in invece di opt-out
   - Nuove API per Server Actions
   - React 19 changes (ref as prop, use() hook)

3. **Aggiornare dipendenze correlate**:
   - `@supabase/ssr` (verificare compatibilita Next 15)
   - `@react-three/fiber` (verificare compatibilita React 19)
   - `@serwist/next` o equivalente PWA

4. **Test completi** dopo migrazione

### File coinvolti
- `package.json`
- `next.config.mjs`
- Tutti i file con `cookies()`, `headers()`, `params` (server components e actions)
- Potenzialmente tutti i componenti per React 19

### Criteri di accettazione
- [ ] Next.js 15 installato
- [ ] Codemod applicati
- [ ] `npm run build` passa senza errori
- [ ] Tutti i test E2E passano
- [ ] Tutte le pagine funzionano correttamente
- [ ] Performance uguale o migliore
