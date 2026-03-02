# Area 5: Testing

**Punteggio attuale**: 3/10
**Obiettivo**: 7/10
**Effort totale stimato**: ~4-5 giorni

---

## TEST-01: Fix Test Cypress Esistenti

- **Priorita**: P2 -> **P1** (regressione attiva)
- **Effort**: S (1-4h)
- **Stato**: `[x]` completato 2026-03-02 (baseUrl configurata, cy.login() custom command, test fixtures create, test riscritti con baseUrl e senza hardcoded waits/credentials)
- **Dipendenze**: SEC-05 (credenziali env vars)

> **RISOLTO 2026-03-02**: Regressione risolta. I file immagine di test (`cypress/e2e/2-project/files/1-5.jpg`) sono stati eliminati dal working tree ma i test in `cypress/e2e/2-project/new.cy.ts` (righe 46-53) li referenziano ancora. I test di upload sono **sicuramente rotti**.
>
> **Verificato 2026-03-02**: `cypress/e2e/2-project/files/` esiste ma e vuota. `cypress.config.ts` esiste ma senza `baseUrl`. `cypress/support/commands.ts` e un template vuoto senza custom commands. Test file presenti ma non funzionanti.

### Problema
1. **REGRESSIONE**: File immagine test (`cypress/e2e/2-project/files/1-5.jpg`) eliminati - test di upload rotti
2. Configurazione minima: nessun `baseUrl`, fixture, custom commands
3. Asserzioni deboli: `cy.url().should('include', 'dashboard')` troppo generico
4. Intercept troppo ampio: `cy.intercept('**')` cattura tutto

### Implementazione

#### 1. Ripristinare file test
Generare immagini di test minimali (1x1 pixel) o usare fixture Cypress:

```bash
# Creare immagini test minimali
mkdir -p cypress/e2e/2-project/files
# Usare file placeholder piccoli
```

O meglio, usare `cypress/fixtures/`:
```
cypress/fixtures/
  test-image-1.jpg
  test-image-2.jpg
```

#### 2. Configurare Cypress
```typescript
// cypress.config.ts
import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:8080",
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
```

#### 3. Custom commands
```typescript
// cypress/support/commands.ts
Cypress.Commands.add("login", (email?: string, password?: string) => {
  const userEmail = email || Cypress.env("TEST_USER_EMAIL");
  const userPassword = password || Cypress.env("TEST_USER_PASSWORD");

  cy.visit("/login");
  cy.get('input[name="email"]').type(userEmail);
  cy.get('input[name="password"]').type(userPassword);
  cy.get('button[type="submit"]').click();
  cy.url().should("eq", `${Cypress.config("baseUrl")}/dashboard`);
});
```

#### 4. Fix asserzioni
```typescript
// PRIMA
cy.url().should('include', 'dashboard')

// DOPO
cy.url().should("eq", `${Cypress.config("baseUrl")}/dashboard`);
```

#### 5. Fix intercept
```typescript
// PRIMA
cy.intercept('**').as('create')

// DOPO
cy.intercept('POST', '/api/image-upload').as('imageUpload');
cy.wait('@imageUpload').its('response.statusCode').should('eq', 200);
```

### File coinvolti
- `cypress.config.ts`
- `cypress/support/commands.ts`
- `cypress/support/e2e.ts`
- `cypress/e2e/1-authentication/login.cy.ts`
- `cypress/e2e/1-authentication/signup.cy.ts`
- `cypress/e2e/2-project/new.cy.ts`
- `cypress/fixtures/` (nuovi file)

### Criteri di accettazione
- [ ] `baseUrl` configurato
- [ ] Custom command `cy.login()` disponibile
- [ ] File immagine test presenti (fixture o rigenerati)
- [ ] Asserzioni specifiche (URL esatto, status code, contenuto)
- [ ] Intercept mirati per endpoint specifici
- [ ] `npm run cypress:run` passa su tutti i test esistenti

---

## TEST-02: Espandere Copertura E2E

- **Priorita**: P2
- **Effort**: M (4-16h)
- **Stato**: `[ ]` (verificato 2026-03-02: solo 2 suite test - auth e project creation, nessuna directory 3-catalog o 4-permissions)
- **Dipendenze**: TEST-01

### Problema
Copertura attuale minima: solo auth (4 test) e creazione progetto (2 test). Mancano completamente: cataloghi, eliminazione, aggiornamento, permessi.

### Test da aggiungere

#### Cataloghi
```
cypress/e2e/3-catalog/
  create.cy.ts    - Creazione catalogo (valido, campi vuoti)
  update.cy.ts    - Aggiornamento titolo/descrizione
  delete.cy.ts    - Eliminazione con conferma
  projects.cy.ts  - Aggiunta/rimozione progetti da catalogo
```

#### Progetti - operazioni CRUD
```
cypress/e2e/2-project/
  update.cy.ts    - Aggiornamento nome/descrizione
  delete.cy.ts    - Eliminazione con conferma, verifica rimozione
  view.cy.ts      - Visualizzazione progetto con modello 3D
```

#### Permessi e autorizzazione
```
cypress/e2e/4-permissions/
  unauthorized.cy.ts  - Accesso a /projects senza login -> redirect
  ownership.cy.ts     - Tentativo accesso progetto altrui -> errore
```

### Struttura test consigliata
```typescript
describe("Catalog CRUD", () => {
  beforeEach(() => {
    cy.login();
  });

  it("should create a new catalog", () => {
    cy.visit("/catalogs/new");
    cy.get('input[name="title"]').type("Test Catalog");
    cy.get('textarea[name="description"]').type("Description");
    cy.get('button[type="submit"]').click();
    cy.url().should("match", /\/catalogs\/\d+/);
  });

  it("should reject empty title", () => {
    cy.visit("/catalogs/new");
    cy.get('button[type="submit"]').click();
    cy.contains("obbligatorio").should("be.visible");
  });
});
```

### File coinvolti
- `cypress/e2e/3-catalog/` (nuova directory, 4 file)
- `cypress/e2e/2-project/update.cy.ts`, `delete.cy.ts`, `view.cy.ts` (nuovi)
- `cypress/e2e/4-permissions/` (nuova directory, 2 file)

### Criteri di accettazione
- [ ] Almeno 15 nuovi test E2E
- [ ] Copertura CRUD completa per progetti e cataloghi
- [ ] Test di autorizzazione (redirect, ownership)
- [ ] Tutti i test passano in `npm run cypress:run`

---

## TEST-03: Setup Component Testing

- **Priorita**: P2
- **Effort**: L (2-5 giorni)
- **Stato**: `[x]` completato 2026-03-02 (Vitest + Testing Library configurati, 28 test per validazioni, costanti e rate limiter. Scripts `test` e `test:run` aggiunti)
- **Dipendenze**: -

### Problema
Zero component test. I componenti critici (Wizard, Form, Viewer3d) non hanno test unitari. Bug di rendering o logica scoperti solo manualmente.

### Implementazione

#### Setup Vitest + Testing Library

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitejs/plugin-react
```

```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "."),
    },
  },
});
```

```typescript
// vitest.setup.ts
import "@testing-library/jest-dom";
```

#### Script
```json
// package.json
"test": "vitest",
"test:run": "vitest run"
```

#### Componenti prioritari da testare

1. **Wizard Store** (`store/wizardStore.ts`):
   - nextStep/prevStep navigation
   - Validation checks (checksMandatory)
   - resetWizardStore

2. **Form Validation** (`lib/validations/project.ts`):
   - projectSchema con dati validi/invalidi
   - fileSchema con file grandi/tipo sbagliato
   - validateProjectFormData

3. **Input Components** (`components/forms/`):
   - Input rendering e onChange
   - Textarea rendering
   - RadioCardProject selection

### Esempio test

```typescript
// __tests__/lib/validations/project.test.ts
import { describe, it, expect } from "vitest";
import { projectSchema } from "@/lib/validations/project";

describe("projectSchema", () => {
  it("validates correct project data", () => {
    const result = projectSchema.safeParse({
      name: "Test Project",
      description: "A description",
      detail: "reduced",
      order: "sequential",
      feature: "normal",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty name", () => {
    const result = projectSchema.safeParse({
      name: "",
      detail: "reduced",
      order: "sequential",
      feature: "normal",
    });
    expect(result.success).toBe(false);
  });

  it("rejects name over 100 chars", () => {
    const result = projectSchema.safeParse({
      name: "a".repeat(101),
      detail: "reduced",
      order: "sequential",
      feature: "normal",
    });
    expect(result.success).toBe(false);
  });
});
```

### File coinvolti
- `vitest.config.ts` (nuovo)
- `vitest.setup.ts` (nuovo)
- `package.json` (scripts)
- `__tests__/` (nuova directory con test)

### Criteri di accettazione
- [ ] Vitest configurato e funzionante
- [ ] Almeno 10 test per validation schemas
- [ ] Almeno 5 test per wizard store logic
- [ ] Almeno 5 test per form components
- [ ] `npm test` passa tutti i test
- [ ] Script `test:run` disponibile per CI

---

## TEST-04: API e Server Actions Integration Tests

- **Priorita**: P3
- **Effort**: M (4-16h)
- **Stato**: `[ ]` (verificato 2026-03-02: zero test per API routes o server actions)
- **Dipendenze**: TEST-03 (Vitest setup)

> **AGGIORNAMENTO**: `/api/send-to-queue` e stata eliminata. La logica e ora nella server action `submitProjectToQueue` (`app/projects/new/actions.ts`). Testare anche `createProject` e `rollbackProject`.

### Problema
Le API routes (`/api/image-upload`) e le server actions (`createProject`, `submitProjectToQueue`) non hanno test. Validazione, autenticazione e error handling verificati solo manualmente.

### Implementazione

Usare Vitest con mock di Supabase e S3:

```typescript
// __tests__/api/image-upload.test.ts
import { describe, it, expect, vi } from "vitest";

// Mock Supabase
vi.mock("@/utils/supabase/server", () => ({
  createClient: () => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: "user-123" } },
        error: null,
      }),
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { id: 1, user_id: "user-123" },
            error: null,
          }),
        }),
      }),
    }),
  }),
}));

describe("POST /api/image-upload", () => {
  it("rejects unauthenticated requests", async () => { /* ... */ });
  it("rejects invalid MIME types", async () => { /* ... */ });
  it("rejects oversized files", async () => { /* ... */ });
  it("rejects unauthorized project access", async () => { /* ... */ });
  it("uploads valid image successfully", async () => { /* ... */ });
});
```

### File coinvolti
- `__tests__/api/image-upload.test.ts` (nuovo)
- `__tests__/actions/project-actions.test.ts` (nuovo - per createProject, submitProjectToQueue, rollbackProject)

### Criteri di accettazione
- [ ] Test per autenticazione (401)
- [ ] Test per autorizzazione/ownership (403)
- [ ] Test per validazione input (400)
- [ ] Test per upload valido (200)
- [ ] Test per server actions (createProject, submitProjectToQueue)
- [ ] Test per rate limiting (429) - se implementato
- [ ] Tutti i test passano con mock
