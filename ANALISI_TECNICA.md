# Analisi Tecnica - GoTo3D Web Application

**Data**: 2026-03-01
**Versione**: 1.0
**Stato applicazione**: Prototipo/MVP

---

## Scorecard

| Area | Voto | Stato |
|------|------|-------|
| Type Safety | 9/10 | Eccellente - strict mode, zero `any` intenzionali, Zod validation |
| Sicurezza | 5/10 | Critico - manca RLS, rate limiting, CSRF su API routes |
| Architettura | 7/10 | Buona - App Router corretto, server actions colocati |
| Performance | 5/10 | Critico - AMQP senza pooling, N+1 queries, zero memoization 3D |
| Code Quality | 6/10 | Sufficiente - dead code, naming inconsistente, console.log |
| Frontend/UX | 5/10 | Critico - accessibilita quasi assente, no dark mode |
| Testing | 3/10 | Insufficiente - copertura minima, test fragili |
| Infrastruttura | 4/10 | Insufficiente - no CI/CD, no monitoring, no logging prod |
| **Media** | **5.5/10** | **Buone fondamenta, non pronto per produzione** |

---

## 1. Architettura

### Struttura App Router
La struttura e ben organizzata con 15 route top-level, server actions colocati in `actions.tsx`, e separazione client/server generalmente corretta.

**Route principali:**
```
/                    Landing page (server component)
/login               Auth
/dashboard           Protetto da middleware
/projects/*          CRUD progetti + viewer 3D
/catalogs/*          CRUD cataloghi
/configurator/*      Configuratore 3D
/artifact/[id]       Asset viewer
/profile             Profilo utente
```

### Dipendenze critiche

| Pacchetto | Versione | Note |
|-----------|----------|------|
| next | 14.2.5 | OK, ma Next 15 disponibile |
| @supabase/auth-helpers-nextjs | 0.10.0 | **Deprecato** - usare `@supabase/ssr` direttamente |
| @supabase/auth-helpers-react | 0.5.0 | **Deprecato** - stesso motivo |
| next-pwa | 5.6.0 | **Non mantenuto** - ultimo commit 2023. Usare `@serwist/next` |
| heic2any | 0.0.4 | Mancano i type definitions |
| three | 0.167.1 | OK |
| zod | 4.3.5 | OK |

### Problemi architetturali

**P1 - Middleware incompleto** (`middleware.ts`)
Solo `/dashboard` e protetto (riga 67 di `utils/supabase/middleware.ts`). Le route `/projects`, `/catalogs`, `/configurator`, `/profile` non hanno protezione a livello middleware - dipendono da check nelle server actions. Codice commentato alle righe 70-76 suggerisce implementazione incompleta.

**P2 - Auth callback senza error handling** (`app/auth/callback/route.ts`)
```typescript
// Riga 14-17: se exchangeCodeForSession fallisce, redirect a /dashboard senza sessione
if (code) {
  const supabase = createClient();
  await supabase.auth.exchangeCodeForSession(code); // nessun check errore!
}
return NextResponse.redirect(`${origin}/dashboard`); // redirect sempre
```

**P3 - `allowedOrigins` potenzialmente invalido** (`next.config.mjs:60`)
```typescript
allowedOrigins: [process.env.NEXT_PUBLIC_SITE_URL || "localhost:8080"]
```
Richiede formato `protocol://host:port` ma la env var potrebbe non includere il protocollo.

**P4 - Image remote patterns hardcoded** (`next.config.mjs:73-95`)
Tre hostname specifici per Supabase e R2. Cambiare ambiente richiede modifica config.

---

## 2. Sicurezza

### 2.1 Punti di forza
- CSP headers completi e restrittivi (`next.config.mjs:13-26`)
- Security headers standard (X-Frame-Options DENY, nosniff, etc.)
- Validazione MIME type e file size su upload (`app/api/image-upload/route.ts:8-18`)
- Sanitizzazione filename contro path traversal (`route.ts:21-26`)
- Ownership verification su tutte le risorse
- Zod schema validation per creazione progetto

### 2.2 Criticita

**CRITICO - Nessun Row Level Security (RLS) su Supabase**
L'intero modello di autorizzazione dipende da check applicativi (`project.user_id === user.id`). Se un singolo check viene omesso o bypassato, qualsiasi utente autenticato puo accedere a dati di altri utenti. Le RLS policy a livello database sono la difesa in profondita fondamentale.

**CRITICO - Nessun rate limiting**
Gli endpoint `/api/image-upload` e `/api/send-to-queue` non hanno rate limiting. Un attaccante puo:
- Inondare lo storage R2 con upload (ogni file fino a 10MB)
- Saturare la coda RabbitMQ con messaggi di processing
- Causare costi elevati su storage e compute

**ALTO - CSRF su API routes**
Le route POST in `/api/` sono vulnerabili a CSRF form-based da origini cross-origin. Le Server Actions di Next.js hanno protezione CSRF integrata, ma le route handler (`route.ts`) no.

**ALTO - Credenziali di test nel repository** (`cypress/e2e/1-authentication/`)
```typescript
// login.cy.ts:12-13
cy.get('input[name="email"]').type(`e2e.test.cy@gmail.com`)
cy.get('input[name="password"]').type('e2e.test.cy')
```
Email e password di test visibili nella storia git.

**MEDIO - Error message information leakage**
`Viewer3d.tsx:78`: `alert(JSON.stringify(error))` espone dettagli di errore all'utente.
Vari toast message mostrano messaggi di errore backend.

**MEDIO - `unsafe-eval` in CSP** (`next.config.mjs:15`)
Necessario per Three.js/R3F, ma amplia la superficie di attacco. Valutare se possibile rimuovere con nonce-based CSP.

### 2.3 Validazione input

| Endpoint/Action | Validazione | Stato |
|----------------|-------------|-------|
| POST /api/image-upload | MIME, size, filename, auth, ownership | OK |
| POST /api/send-to-queue | auth, ownership | OK |
| Server action: createProject | Zod schema (nome, desc, file) | OK |
| Server action: updateProject | **Nessuna validazione** su nome/descrizione | MANCANTE |
| Server action: updateCatalog | **Nessuna validazione** su titolo/descrizione | MANCANTE |
| Server action: deleteProject | auth, ownership | OK |

### 2.4 File size mismatch
- API upload route: limite 10MB (`route.ts:18`)
- Zod file schema: limite 50MB (`lib/validations/project.ts:29`)
- Discrepanza che crea confusione e potenziali bypass

---

## 3. Performance

### 3.1 AMQP/RabbitMQ - Criticita maggiore (`utils/amqpClient.ts`)

**Connessione per-messaggio**: Ogni chiamata a `sendToQueue()` crea una nuova connessione TCP, un nuovo canale, invia il messaggio, aspetta 500ms fissi, e chiude. Sotto carico, questo:
- Esaurisce il pool di connessioni RabbitMQ
- Aggiunge ~500ms+ di latenza per ogni messaggio
- Non ha retry logic - fallimento immediato
- Usa callback API deprecata invece di promise API

```typescript
// utils/amqpClient.ts:10 - nuova connessione per ogni messaggio
amqp.connect(connectionString, (err, connection) => {
  // ...
  setTimeout(() => { connection.close(); resolve(); }, 500); // riga 26: delay fisso
});
```

### 3.2 N+1 Queries
Nelle server actions che listano progetti, per ogni progetto viene chiamata `getSignedUrl()` separatamente per generare URL firmati dei thumbnail. Nessun batching o parallel execution.

### 3.3 Rendering 3D senza memoization

**`Viewer3d.tsx:35-37` - Store mutation nel render body** (non in useEffect):
```typescript
const { setTextureUrl, setObjectUrl, setUsdzUrl } = actions;
setTextureUrl(textureUrl);  // mutation ad ogni render!
setObjectUrl(objectUrl);
setUsdzUrl(usdzUrl);
```

**`Viewer3d.tsx:43` - Camera ricreata ad ogni render:**
```typescript
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
```
Dovrebbe essere in `useMemo` o `useRef`.

**Zero `useMemo`/`useCallback`** nei componenti 3D. I componenti Three Fiber sono particolarmente sensibili a re-render perche ogni render ricrea geometrie, materiali e scene graph.

### 3.4 Bundle size
- `@aws-sdk/client-s3` (~1.2MB) correttamente in `serverComponentsExternalPackages`
- `amqplib` (~4.9MB) idem
- Three.js + R3F + drei + postprocessing: ~1MB client bundle
- Nessun `next/dynamic` per code splitting dei componenti 3D
- Nessun `@next/bundle-analyzer` configurato

### 3.5 `listObjects` senza prefix (`utils/s3/api.ts:11`)
```typescript
const response = await clientS3.send(new ListObjectsV2Command({ Bucket }));
// Lista TUTTI gli oggetti del bucket, poi filtra client-side
const filtered = response.Contents.filter((c) => c?.Key?.startsWith(path));
```
Con molti file, questo diventa costosissimo. Usare il parametro `Prefix` della API S3.

---

## 4. Code Quality

### 4.1 Dead code e codice commentato

| File | Righe | Descrizione |
|------|-------|-------------|
| `store/wizardStore.ts` | 55, 113-114, 140-144 | Codice commentato, reset incompleto |
| `utils/supabase/middleware.ts` | 70-76 | Protezione route commentata |
| `components/viewer3d/Viewer3d.tsx` | 72 | Ref commentato |
| `next.config.mjs` | 1-5 | Setup Cloudflare commentato |

### 4.2 Naming inconsistente

| File | Problema |
|------|----------|
| `store/configuratorStore.ts:22` | Esporta `state` invece del pattern `{feature}Store` |
| `store/wizardStore.ts:102` | Funzione `resetwizardStore` (camelCase errato) |
| `components/forms/RadioCardProject.tsx:11` | Props `d`, `pro` invece di `isDefault`, `isPro` |

### 4.3 Type safety issues

Nonostante `strict: true` e `noImplicitAny`, ci sono alcune debolezze:

- **`configuratorStore.ts:61`**: Cast forzato `as THREE.Color | number`
- **`configuratorStore.ts:33-38`**: `initConfigState` con istanza `THREE.Color` condivisa - rischio mutation
- **Import non usato**: `Viewer3d.tsx:8` importa `_Object` da `@aws-sdk/client-s3` in un componente client
- **`wizardStore.ts:13`**: `files: FileList | []` - tipo union ambiguo

### 4.4 Console logging in produzione
19 istanze di `console.log`/`console.error` nel codice. In produzione:
- Le server actions loggano solo in development mode (corretto ma invisibile in prod)
- `ServiceWorkerRegister.tsx` ha `console.log()` attivi in produzione
- `Viewer3d.tsx:101` ha `console.error('API Error:', error)` che espone dettagli

### 4.5 Alert in produzione
- `Viewer3d.tsx:68`: `alert("AR")` - debug rimasto nel codice
- `Viewer3d.tsx:78`: `alert(JSON.stringify(error))` - errore esposto all'utente
- `Configurator3d.tsx:90`: `alert("Salvato")` - TODO non implementato

### 4.6 Componenti duplicati
`components/catalogs/Form.tsx` ridefinisce inline `Card`, `CardHeader`, `CardContent`, `Input`, `Textarea`, `Button`, `Toggle` quando componenti simili esistono gia in `components/forms/` e `components/ui/`.

### 4.7 Inconsistenza error handling
Tre pattern diversi usati nel codice:
1. `toast.error()` - componenti wizard
2. `alert()` - viewer 3D, configuratore
3. Catch silenzioso - vari componenti

Dovrebbe esserci un unico pattern: toast notification.

---

## 5. Frontend

### 5.1 Accessibilita (A11Y) - CRITICO

Solo **5 attributi aria** nell'intera codebase. Gap principali:

| Problema | File | Dettaglio |
|----------|------|-----------|
| Bottoni icona senza label | `Viewer3d.tsx:51,67` | ArrowsExpandIcon, CubeTransparentIcon clickabili senza aria-label |
| Menu hamburger | `Menu.tsx:51` | Manca aria-label, aria-expanded |
| Radio input nascosti | `RadioCardProject.tsx:32` | Input hidden senza label accessibile |
| Immagini senza alt | Vari Step component | Alt text mancante o generico |
| No focus management | `Configurator3d.tsx` | Click handler senza keyboard support |
| No skip-to-content | `layout.tsx` | Manca link per saltare la navigazione |
| Card come link | `Card.tsx:10` | `<a>` senza href valido |

### 5.2 SSR/Hydration issues

**"use client" non necessario su:**
- `components/Card.tsx` - nessuna interattivita
- `components/Accordion.tsx` - potrebbe essere SSR con progressive enhancement
- `components/BlurImage.tsx` - solo useState per loading state

**Hydration mismatch potenziale:**
- `ToastComponent.tsx`: Supabase subscription su mount
- `ProjectCard.tsx`: Real-time subscription crea mismatch

### 5.3 3D Rendering bugs

**`Viewer3d.tsx:34-37`**: Store mutation direttamente nel corpo del componente (non in useEffect). Causa update infiniti con React StrictMode.

**`Viewer3d.tsx:43`**: Camera ricreata ad ogni render. Genera garbage collection pressure e possibili glitch visivi.

**Nessun Error Boundary** intorno al Canvas 3D. Se Three.js crasha, l'intera pagina diventa bianca.

### 5.4 i18n assente
Tutti i testi UI e messaggi di errore sono hardcoded in italiano. Nessun sistema di internazionalizzazione. Se l'app dovra supportare altre lingue, servira un refactoring significativo.

---

## 6. Testing

### 6.1 Copertura attuale

| Feature | Test | Note |
|---------|------|------|
| Signup | 2 test (valido + duplicato) | Email random: fragile |
| Login | 2 test (valido + password errata) | Credenziali hardcoded |
| Creazione progetto | 2 test (con/senza immagini) | File test eliminati (git status) |
| Cataloghi | 0 | Completamente scoperto |
| Eliminazione | 0 | Completamente scoperto |
| Aggiornamento | 0 | Completamente scoperto |
| Permessi/Auth | 0 | Nessun test di autorizzazione |
| API routes | 0 | Nessun test unitario |
| Componenti | 0 | Nessun component test |

### 6.2 Problemi test esistenti

**File di test mancanti**: I file immagine per i test Cypress (`cypress/e2e/2-project/files/1-5.jpg`) risultano eliminati dal git status. I test di creazione progetto con immagini falliranno.

**Configurazione minima** (`cypress.config.ts`): Nessun `baseUrl`, nessun fixture, nessun custom command, nessun setup/teardown.

**Asserzioni deboli**:
```typescript
cy.url().should('include', 'dashboard') // potrebbe matchare '/admin-dashboard'
```

**Intercept troppo ampio**:
```typescript
cy.intercept('**').as('create') // cattura TUTTE le request
cy.wait('@create').then(interception => {
  console.log(interception) // non verifica nulla
})
```

---

## 7. Infrastruttura

### 7.1 CI/CD - Assente
Nessun file `.github/workflows/`, nessun `vercel.json` custom. Il deploy dipende interamente dall'integrazione automatica Vercel-GitHub. Non c'e:
- Pipeline di test automatica
- Lint check pre-merge
- Type checking pre-deploy
- Security scanning

### 7.2 Monitoring e Logging - Assente
- Nessun servizio di error tracking (Sentry, LogRocket, etc.)
- Errori in produzione invisibili (logging solo in dev mode)
- Nessun APM o telemetria
- Nessun health check endpoint

### 7.3 PWA - Minimale
- `next-pwa` non mantenuto (ultimo commit 2023)
- Manifest con singola icona riutilizzata per 192x192 e 512x512
- Nessuna icona maskable
- Nessuna pagina offline fallback
- Nessuna strategia di cache personalizzata

### 7.4 Database
- Nessun index esplicito visibile (potrebbe essere gestito da Supabase)
- Mancano timestamp `updated_at` su molte tabelle
- Colonna `telegram_user` su project non usata nel frontend
- Array JSON (`files[]`, `model_urls[]`) senza validazione a livello DB

---

## 8. Roadmap di Remediation

### Legenda Priorita
- **P0**: Blocco per produzione - da risolvere prima del lancio
- **P1**: Rischio alto - da risolvere entro il primo mese
- **P2**: Miglioramento significativo - da pianificare nel trimestre
- **P3**: Nice-to-have - da fare quando possibile

### Legenda Effort
- **XS**: < 1 ora
- **S**: 1-4 ore
- **M**: 4-16 ore (1-2 giorni)
- **L**: 2-5 giorni
- **XL**: 1-2 settimane

---

| # | Priorita | Area | Descrizione | Effort | Dipendenze |
|---|----------|------|-------------|--------|------------|
| 1 | **P0** | Sicurezza | Implementare RLS policies su Supabase per tutte le tabelle (project, catalog, project_catalog) | M | Accesso admin Supabase |
| 2 | **P0** | Sicurezza | Aggiungere rate limiting su `/api/image-upload` e `/api/send-to-queue` (es. Upstash Redis + `@upstash/ratelimit`) | S | - |
| 3 | **P0** | Performance | Refactoring AMQP client: connection pooling, promise API, retry con exponential backoff, timeout configurabile | M | - |
| 4 | **P0** | Sicurezza | Fix auth callback: verificare risultato `exchangeCodeForSession`, redirect a `/login` su errore | XS | - |
| 5 | **P0** | Sicurezza | Rimuovere credenziali test da Cypress files, usare env vars | XS | - |
| 6 | **P0** | Code Quality | Rimuovere tutti gli `alert()` dal codice di produzione | XS | - |
| 7 | **P1** | Sicurezza | Proteggere tutte le route autenticate nel middleware (non solo /dashboard) | S | - |
| 8 | **P1** | Sicurezza | Aggiungere validazione server-side su updateProject e updateCatalog | S | - |
| 9 | **P1** | Sicurezza | Allineare limite file size: 10MB in API route vs 50MB in Zod schema | XS | - |
| 10 | **P1** | Performance | Fix Viewer3d: spostare store mutations in useEffect, memoizzare camera | S | - |
| 11 | **P1** | Performance | Fix `listObjects`: usare parametro `Prefix` invece di filtro client-side | XS | - |
| 12 | **P1** | Frontend | Aggiungere Error Boundary intorno a Canvas 3D | S | - |
| 13 | **P1** | Infrastruttura | Setup CI/CD base: GitHub Actions con lint, type-check, test | M | - |
| 14 | **P1** | Infrastruttura | Integrare error tracking (Sentry) per logging in produzione | M | Account Sentry |
| 15 | **P1** | Dipendenze | Rimuovere `@supabase/auth-helpers-*` deprecati, migrare completamente a `@supabase/ssr` | S | - |
| 16 | **P2** | Accessibilita | Audit A11Y completo: aria-labels, focus management, semantic HTML, skip-to-content | L | - |
| 17 | **P2** | Testing | Ripristinare file test Cypress mancanti, aggiungere test per cataloghi e permessi | M | - |
| 18 | **P2** | Testing | Aggiungere component testing (Vitest + Testing Library) per componenti critici | L | Setup Vitest |
| 19 | **P2** | Code Quality | Pulizia dead code: rimuovere codice commentato, import non usati, TODO | S | - |
| 20 | **P2** | Code Quality | Standardizzare error handling su toast notification ovunque | S | Dipende da #6 |
| 21 | **P2** | Code Quality | Estrarre componenti duplicati da `catalogs/Form.tsx` in componenti UI condivisi | S | - |
| 22 | **P2** | Performance | Aggiungere `next/dynamic` per lazy loading componenti 3D | S | - |
| 23 | **P2** | Performance | Risolvere N+1 queries nelle server actions (batch signed URLs) | M | - |
| 24 | **P2** | Infrastruttura | Migrare da `next-pwa` a `@serwist/next` (mantenuto attivamente) | M | - |
| 25 | **P2** | Architettura | Centralizzare costanti API endpoints, magic strings status | S | - |
| 26 | **P2** | Frontend | Rimuovere `"use client"` non necessari (Card, Accordion, BlurImage) | XS | - |
| 27 | **P3** | Frontend | Implementare dark mode | L | Design palette |
| 28 | **P3** | Frontend | Setup sistema i18n (next-intl o similar) | XL | Definizione scope lingue |
| 29 | **P3** | Architettura | Aggiornare a Next.js 15 | L | Verificare compatibilita deps |
| 30 | **P3** | Infrastruttura | Aggiungere bundle analyzer e ottimizzare | S | - |
| 31 | **P3** | Testing | Aggiungere API integration tests | M | - |
| 32 | **P3** | Code Quality | Setup ESLint rules piu stretti (no-console, no-unused-vars, etc.) | S | - |

---

## Riepilogo azioni immediate (P0)

Prima di andare in produzione, queste 6 azioni sono **bloccanti**:

1. **RLS su Supabase** - senza questo, qualsiasi utente autenticato puo accedere a dati altrui
2. **Rate limiting** - senza questo, le API sono vulnerabili ad abuso
3. **AMQP connection pooling** - senza questo, il sistema crasha sotto carico
4. **Fix auth callback** - senza questo, utenti possono finire in dashboard senza sessione
5. **Rimuovere credenziali test** - leak di credenziali nel repository
6. **Rimuovere alert()** - debug code in produzione

Effort totale P0 stimato: **~3-4 giorni**
