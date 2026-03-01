# Area 1: Sicurezza

**Punteggio attuale**: 5/10
**Obiettivo**: 8/10
**Effort totale stimato**: ~4-5 giorni

---

## SEC-01: Implementare Row Level Security su Supabase

- **Priorita**: P0
- **Effort**: M (4-16h)
- **Stato**: `[ ]`
- **Dipendenze**: Accesso admin Supabase

### Problema
L'intero modello di autorizzazione dipende da check applicativi (`project.user_id === user.id`). Se un singolo check viene omesso, qualsiasi utente autenticato puo accedere a dati altrui. Non c'e difesa in profondita a livello database.

### Implementazione

1. **Abilitare RLS** su tutte le tabelle:
   ```sql
   ALTER TABLE project ENABLE ROW LEVEL SECURITY;
   ALTER TABLE catalog ENABLE ROW LEVEL SECURITY;
   ALTER TABLE project_catalog ENABLE ROW LEVEL SECURITY;
   ```

2. **Policy per `project`**:
   ```sql
   -- SELECT: solo i propri progetti
   CREATE POLICY "Users can view own projects"
     ON project FOR SELECT
     USING (auth.uid() = user_id);

   -- INSERT: solo con il proprio user_id
   CREATE POLICY "Users can create own projects"
     ON project FOR INSERT
     WITH CHECK (auth.uid() = user_id);

   -- UPDATE: solo i propri progetti
   CREATE POLICY "Users can update own projects"
     ON project FOR UPDATE
     USING (auth.uid() = user_id);

   -- DELETE: solo i propri progetti
   CREATE POLICY "Users can delete own projects"
     ON project FOR DELETE
     USING (auth.uid() = user_id);
   ```

3. **Policy per `catalog`**: stesso pattern di `project`

4. **Policy per `project_catalog`** (junction table):
   ```sql
   -- SELECT: solo se l'utente possiede il catalogo
   CREATE POLICY "Users can view own project_catalog"
     ON project_catalog FOR SELECT
     USING (
       EXISTS (SELECT 1 FROM catalog WHERE catalog.id = project_catalog.catalog_id AND catalog.user_id = auth.uid())
     );
   ```

5. **Rigenerare i tipi** dopo le modifiche: `npm run update-types`

### File coinvolti
- Supabase Dashboard > SQL Editor (o file migrazione)
- `types/supabase.ts` (rigenerazione)

### Criteri di accettazione
- [ ] RLS abilitato su project, catalog, project_catalog
- [ ] Ogni tabella ha policy per SELECT, INSERT, UPDATE, DELETE
- [ ] Test manuale: utente A non vede progetti di utente B
- [ ] Test manuale: API call con token utente A su progetto utente B restituisce errore
- [ ] Tipi Supabase rigenerati

---

## SEC-02: Rate Limiting su API Routes e Server Actions

- **Priorita**: P0
- **Effort**: S (1-4h)
- **Stato**: `[ ]`
- **Dipendenze**: -

> **AGGIORNAMENTO**: `/api/send-to-queue` e stata eliminata. La logica di invio alla coda e ora nella server action `submitProjectToQueue` in `app/projects/new/actions.ts`. Il rate limiting va applicato alla API route rimasta e alla server action.

### Problema
`/api/image-upload` e la server action `submitProjectToQueue` non hanno rate limiting. Un attaccante puo saturare storage e coda di processing.

### Implementazione

**Opzione A - Upstash Redis (consigliata per Vercel)**:
```bash
npm install @upstash/ratelimit @upstash/redis
```

Creare `lib/rate-limit.ts`:
```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const rateLimiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "60 s"), // 10 req/min
  analytics: true,
});

export const uploadRateLimiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "60 s"), // 5 upload/min
  analytics: true,
});
```

Applicare nella API route:
```typescript
// app/api/image-upload/route.ts
const identifier = user.id;
const { success } = await uploadRateLimiter.limit(identifier);
if (!success) {
  return NextResponse.json({ error: "Troppe richieste" }, { status: 429 });
}
```

Applicare nella server action:
```typescript
// app/projects/new/actions.ts - submitProjectToQueue
const { success } = await rateLimiter.limit(user.id);
if (!success) {
  return { success: false, error: "Troppe richieste, riprova tra poco" };
}
```

**Opzione B - In-memory (se no Redis)**:
```typescript
// lib/rate-limit.ts - Map-based, resetta al restart
const requests = new Map<string, { count: number; resetAt: number }>();
```

### File coinvolti
- `lib/rate-limit.ts` (nuovo)
- `app/api/image-upload/route.ts`
- `app/projects/new/actions.ts` (server action `submitProjectToQueue`)
- `.env.example` (aggiungere UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN)

### Criteri di accettazione
- [ ] Rate limiter configurato con soglie ragionevoli
- [ ] `/api/image-upload` restituisce 429 dopo N richieste/minuto
- [ ] `submitProjectToQueue` restituisce errore dopo N richieste/minuto
- [ ] Rate limit per-utente (non globale)
- [ ] Test manuale: chiamate rapide successive restituiscono 429

---

## SEC-03: Protezione Route nel Middleware

- **Priorita**: P1
- **Effort**: S (1-4h)
- **Stato**: `[ ]`
- **Dipendenze**: -

### Problema
Solo `/dashboard` e protetto nel middleware (`utils/supabase/middleware.ts:67`). Le route `/projects`, `/catalogs`, `/configurator`, `/profile` non sono protette a livello middleware. Il codice commentato alle righe 70-76 conferma l'incompletezza.

### Implementazione

```typescript
// utils/supabase/middleware.ts - righe 67-76
const { error } = await supabase.auth.getUser();

const protectedPaths = ["/dashboard", "/projects", "/catalogs", "/configurator", "/profile"];
const isProtected = protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path));

if (isProtected && error) {
  return NextResponse.redirect(new URL("/login", request.url));
}
```

Rimuovere il codice commentato alle righe 70-76.

### File coinvolti
- `utils/supabase/middleware.ts`

### Criteri di accettazione
- [ ] Tutte le route protette richiedono autenticazione
- [ ] Utente non autenticato su `/projects` viene redirectato a `/login`
- [ ] Route pubbliche (`/`, `/login`, `/faq`) restano accessibili
- [ ] Codice commentato rimosso

---

## SEC-04: Fix Auth Callback Error Handling

- **Priorita**: P0
- **Effort**: XS (<1h)
- **Stato**: `[ ]`
- **Dipendenze**: -

### Problema
`app/auth/callback/route.ts` non verifica il risultato di `exchangeCodeForSession`. Se fallisce, l'utente viene comunque redirectato a `/dashboard` senza sessione valida.

### Implementazione

```typescript
// app/auth/callback/route.ts
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
    }
  } else {
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }

  return NextResponse.redirect(`${origin}/dashboard`);
}
```

### File coinvolti
- `app/auth/callback/route.ts`

### Criteri di accettazione
- [ ] Errore di code exchange redirecta a `/login` con parametro errore
- [ ] Assenza di code redirecta a `/login`
- [ ] Solo code exchange riuscito redirecta a `/dashboard`

---

## SEC-05: Rimuovere Credenziali Test dal Repository

- **Priorita**: P0
- **Effort**: XS (<1h)
- **Stato**: `[ ]`
- **Dipendenze**: -

### Problema
`cypress/e2e/1-authentication/login.cy.ts` e `signup.cy.ts` contengono email e password hardcoded visibili nella storia git.

### Implementazione

1. Creare `cypress.env.json` (gia in `.gitignore` di default Cypress):
   ```json
   {
     "TEST_USER_EMAIL": "e2e.test.cy@gmail.com",
     "TEST_USER_PASSWORD": "e2e.test.cy"
   }
   ```

2. Aggiornare i test:
   ```typescript
   // login.cy.ts
   cy.get('input[name="email"]').type(Cypress.env("TEST_USER_EMAIL"));
   cy.get('input[name="password"]').type(Cypress.env("TEST_USER_PASSWORD"));
   ```

3. Aggiungere a `.gitignore`:
   ```
   cypress.env.json
   ```

4. Creare `cypress.env.example.json`:
   ```json
   {
     "TEST_USER_EMAIL": "your-test-email@example.com",
     "TEST_USER_PASSWORD": "your-test-password"
   }
   ```

### File coinvolti
- `cypress/e2e/1-authentication/login.cy.ts`
- `cypress/e2e/1-authentication/signup.cy.ts`
- `cypress.env.json` (nuovo, gitignored)
- `cypress.env.example.json` (nuovo)
- `.gitignore`

### Criteri di accettazione
- [ ] Nessuna credenziale hardcoded nei file test
- [ ] `cypress.env.json` in `.gitignore`
- [ ] File example documentato
- [ ] Test funzionano con env vars

---

## SEC-06: Validazione Server-Side su Update Actions

- **Priorita**: P1
- **Effort**: S (1-4h)
- **Stato**: `[~]` parziale
- **Dipendenze**: -

> **PROGRESSO**: La validazione Zod e stata implementata per la **creazione progetto** in `app/projects/new/actions.ts` (usa `projectSchema.safeParse`). Manca ancora la validazione su `updateProject` e `updateCatalog`.

### Problema
`updateProject` e `updateCatalog` nelle server actions non validano i dati in input (nome, descrizione). Un utente potrebbe inviare dati malformati o eccessivamente lunghi.

### Implementazione

Riutilizzare gli schema Zod esistenti in `lib/validations/project.ts`:

```typescript
// app/projects/[id]/actions.tsx - nella funzione updateProject
import { projectSchema } from "@/lib/validations/project";

const validation = projectSchema.partial().safeParse({
  name: formData.get("name"),
  description: formData.get("description"),
});

if (!validation.success) {
  return { success: false, error: validation.error.errors[0].message };
}
```

Creare `lib/validations/catalog.ts`:
```typescript
import { z } from "zod";

export const catalogSchema = z.object({
  title: z.string().min(1, "Il titolo e obbligatorio").max(100, "Max 100 caratteri"),
  description: z.string().max(500, "Max 500 caratteri").optional().or(z.literal("")),
});
```

### File coinvolti
- `app/projects/[id]/actions.tsx`
- `app/catalogs/[id]/actions.tsx`
- `lib/validations/catalog.ts` (nuovo)

### Criteri di accettazione
- [ ] updateProject valida nome e descrizione con Zod
- [ ] updateCatalog valida titolo e descrizione con Zod
- [ ] Errori di validazione restituiscono messaggi chiari
- [ ] Input eccessivamente lunghi vengono rifiutati

---

## SEC-07: Allineare Limiti File Size

- **Priorita**: P1
- **Effort**: XS (<1h)
- **Stato**: `[~]` parziale
- **Dipendenze**: -

> **PROGRESSO**: I limiti sono ora **allineati a 10MB** in entrambi i file (API route e Zod schema). Manca ancora la centralizzazione in `lib/constants.ts` come previsto.

### Problema (originale)
- API route (`app/api/image-upload/route.ts:18`): limite 10MB
- Zod schema (`lib/validations/project.ts:29`): limite 50MB
- Questa discrepanza confonde e potrebbe permettere upload che falliscono lato API ma passano la validazione client.

### Stato attuale
- Entrambi i file usano 10MB, ma il valore e definito separatamente in ciascuno
- Il file `lib/constants.ts` non esiste ancora

### Implementazione

1. Definire costante condivisa:
   ```typescript
   // lib/constants.ts
   export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
   export const MAX_FILES_PER_PROJECT = 20;
   ```

2. Usare la costante in entrambi i file:
   - `app/api/image-upload/route.ts`
   - `lib/validations/project.ts`

### File coinvolti
- `lib/constants.ts` (nuovo)
- `app/api/image-upload/route.ts`
- `lib/validations/project.ts`

### Criteri di accettazione
- [ ] Stesso limite in validazione Zod e API route
- [ ] Costante definita in un unico posto
- [ ] File > 10MB rifiutati sia client-side (Zod) che server-side (API)
