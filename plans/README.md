# Piano di Implementazione - GoTo3D

Piano di remediation derivato dall'[Analisi Tecnica](../ANALISI_TECNICA.md) del 2026-03-01.
**Ultimo aggiornamento**: 2026-03-02 (verifica stato attuale codebase)

## Stato di avanzamento

| # | Area | File | Priorita | Task | Completati | Parziali | Pendenti |
|---|------|------|----------|------|------------|----------|----------|
| 1 | [Sicurezza](./01-sicurezza.md) | `01-sicurezza.md` | P0-P1 | 7 | 6 | 1 | 0 |
| 2 | [Performance](./02-performance.md) | `02-performance.md` | P0-P3 | 6 | 5 | 1 | 0 |
| 3 | [Code Quality](./03-code-quality.md) | `03-code-quality.md` | P0-P3 | 6 | 6 | 0 | 0 |
| 4 | [Frontend & UX](./04-frontend.md) | `04-frontend.md` | P1-P3 | 7 | 5 | 0 | 2 |
| 5 | [Testing](./05-testing.md) | `05-testing.md` | P1-P3 | 4 | 2 | 0 | 2 |
| 6 | [Infrastruttura](./06-infrastruttura.md) | `06-infrastruttura.md` | P1-P3 | 6 | 4 | 0 | 2 |

## Lavoro significativo fuori piano

Le seguenti modifiche sono state fatte ma non erano previste nei piani originali:

1. **Wizard riscritto** - upload parallelo (max 4 concorrenti), progress tracking, rollback su errore, validazione Zod client-side (`components/wizard/Wizard.tsx`)
2. **Server actions** - nuovo `app/projects/new/actions.ts` con `createProject`, `submitProjectToQueue`, `rollbackProject`
3. **Eliminazione `/api/send-to-queue`** - logica spostata in server action `submitProjectToQueue`
4. **Nuovo UploadProgress** component + utility `lib/utils/parallelLimit.ts`
5. **Dashboard refactoring** - componenti separati in `components/dashboard/` (StatCard, EmptyState, QuickActions)
6. **Validazione Zod migliorata** - `lib/validations/project.ts` con `wizardFormSchema`, `fileSchema`, `filesSchema`
7. **WizardStore migliorato** - tracking upload progress, pulizia dead code parziale

## Criticita emerse

- **REGRESSIONE**: file immagine test eliminati (`cypress/e2e/2-project/files/1-5.jpg`) senza aggiornare i test Cypress -> test sicuramente rotti
- ~~**BUG REACT**: hook condizionale in `ProjectCard.tsx` (`useEffect` dentro `if`) viola regole dei Hooks~~ -> **Ridimensionato 2026-03-02**: la condizione e dentro l'hook (corretto), non attorno. Restano problemi di cleanup subscription.
- ~~**Piani da aggiornare**: SEC-02, INFRA-05, TEST-04 referenziano `/api/send-to-queue` che non esiste piu~~ -> **Aggiornato 2026-03-02**: tutti i piani ora referenziano correttamente `submitProjectToQueue`

### Completamenti dal 2026-03-01
- **INFRA-03** (auth-helpers -> @supabase/ssr): gia completato, `@supabase/ssr@0.8.0` in uso
- **INFRA-04** (next-pwa -> @serwist/next): gia completato, `@serwist/next@9.5.6` configurato
- **FE-03** ("use client" cleanup): gia corretto, Card.tsx non ha "use client", gli altri lo richiedono
- **PERF-05** (N+1 queries): parzialmente risolto con `Promise.all` in `getProjects()` e pagina progetto
- **CQ-02** (dead code): `next.config.mjs` gia pulito (nessun commento Cloudflare)

## Ordine di esecuzione consigliato

```
Fase 1 - Blocchi P0 (~3-4 giorni)
├── 01-sicurezza: SEC-01 (RLS), SEC-02 (rate limiting), SEC-04 (auth callback), SEC-05 (credentials)
├── 02-performance: PERF-01 (AMQP refactor)
└── 03-code-quality: CQ-01 (rimuovere alert)

Fase 2 - Rischio alto P1 (~5-6 giorni)
├── 01-sicurezza: SEC-03 (middleware), SEC-06 (validazione), SEC-07 (file size)
├── 02-performance: PERF-02 (Viewer3d fix), PERF-03 (S3 prefix)
├── 04-frontend: FE-01 (Error Boundary 3D)
├── 06-infrastruttura: INFRA-01 (CI/CD), INFRA-02 (Sentry)
└── 06-infrastruttura: ~~INFRA-03 (Supabase auth migration)~~ [COMPLETATO]

Fase 3 - Miglioramenti P2 (~8-10 giorni)
├── 02-performance: PERF-04 (lazy loading), ~~PERF-05 (N+1 queries)~~ [PARZIALE]
├── 03-code-quality: CQ-02 a CQ-05
├── 04-frontend: FE-02 (A11Y), ~~FE-03 (SSR cleanup)~~ [COMPLETATO]
├── 05-testing: TEST-01 (fix Cypress), TEST-02 (expand E2E), TEST-03 (component tests)
└── 06-infrastruttura: ~~INFRA-04 (PWA migration)~~ [COMPLETATO], INFRA-05 (API constants)

Fase 4 - Nice-to-have P3 (backlog)
├── 02-performance: PERF-06 (bundle analyzer)
├── 04-frontend: FE-04 (dark mode), FE-05 (i18n)
├── 05-testing: TEST-04 (API integration tests)
├── 06-infrastruttura: INFRA-06 (Next.js 15)
└── 03-code-quality: CQ-06 (ESLint strict)
```

## Convenzioni

- Ogni task ha un ID univoco: `{AREA}-{NN}` (es. `SEC-01`, `PERF-03`)
- **Priorita**: P0 (bloccante) > P1 (alto) > P2 (medio) > P3 (basso)
- **Effort**: XS (<1h), S (1-4h), M (4-16h), L (2-5gg), XL (1-2 sett.)
- **Stato**: `[ ]` da fare, `[~]` parziale/in corso, `[x]` completato, `[-]` annullato
- Ogni task elenca i file da modificare e i criteri di accettazione
