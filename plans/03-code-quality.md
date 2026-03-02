# Area 3: Code Quality

**Punteggio attuale**: 6/10
**Obiettivo**: 8/10
**Effort totale stimato**: ~2-3 giorni

---

## CQ-01: Rimuovere alert() dal Codice di Produzione

- **Priorita**: P0
- **Effort**: XS (<1h)
- **Stato**: `[x]` completato 2026-03-02 (alert rimossi, sostituiti con toast)
- **Dipendenze**: -

### Problema
3 istanze di `alert()` nel codice di produzione:
- `components/viewer3d/Viewer3d.tsx:68` - `alert("AR")` (debug)
- `components/viewer3d/Viewer3d.tsx:78` - `alert(JSON.stringify(error))` (leak info)
- `components/configurator/Configurator3d.tsx:90` - `alert("Salvato")` (TODO)

### Implementazione

**Viewer3d.tsx:68** - Rimuovere `alert("AR")` (e solo debug):
```typescript
// PRIMA
alert("AR");
mainActions.showLoading();

// DOPO
mainActions.showLoading();
```

**Viewer3d.tsx:78** - Sostituire con toast:
```typescript
// PRIMA
alert(`Error ${JSON.stringify(error)}`);

// DOPO
import { toast } from "react-toastify";
toast.error("Errore durante l'avvio AR");
```

**Configurator3d.tsx:90** - Sostituire con toast (o implementare la funzionalita):
```typescript
// PRIMA
alert("Salvato");

// DOPO
toast.success("Configurazione salvata");
```

### File coinvolti
- `components/viewer3d/Viewer3d.tsx`
- `components/configurator/Configurator3d.tsx`

### Criteri di accettazione
- [ ] Zero `alert()` nel codebase
- [ ] Errori mostrati via toast notification
- [ ] Nessun dettaglio tecnico esposto all'utente
- [ ] `grep -r "alert(" components/` restituisce 0 risultati

---

## CQ-02: Pulizia Dead Code

- **Priorita**: P2
- **Effort**: S (1-4h)
- **Stato**: `[x]` completato 2026-03-02
- **Dipendenze**: -

> **Completato 2026-03-02**: Dead code rimosso da `store/wizardStore.ts`, `components/viewer3d/Model3d.tsx` (import USDZLoader commentato, console.log, variabili commentate, codice USDZ commentato), `components/Card.tsx` eliminato (dead code, non importato). `next.config.mjs` gia pulito.

### Problema
Codice commentato e dead code sparso nel codebase che riduce la leggibilita e confonde sulle intenzioni.

### Azioni specifiche

| File | Righe | Azione | Stato |
|------|-------|--------|-------|
| `store/wizardStore.ts` | 55 | Rimuovere console.log commentato | ~~fatto~~ |
| `store/wizardStore.ts` | 113-114 | Rimuovere reset commentato (catalog_id, project_id) | ~~fatto~~ |
| `store/wizardStore.ts` | 140-144 | Rimuovere azioni commentate | ~~fatto~~ |
| `utils/supabase/middleware.ts` | 70-76 | Rimuovere (viene implementato in SEC-03) | pendente |
| `utils/supabase/middleware.ts` | 5-6 | Rimuovere commento tutorial | pendente |
| `components/viewer3d/Viewer3d.tsx` | 72 | Rimuovere ref commentato | pendente |
| `next.config.mjs` | 1-5 | ~~Rimuovere setup Cloudflare commentato~~ | ~~fatto~~ (file pulito, nessun commento Cloudflare) |
| `components/viewer3d/Viewer3d.tsx` | 8 | Rimuovere import `_Object` non usato | pendente |

### File coinvolti
- `store/wizardStore.ts`
- `utils/supabase/middleware.ts`
- `components/viewer3d/Viewer3d.tsx`
- `next.config.mjs`

### Criteri di accettazione
- [ ] Zero blocchi di codice commentato
- [ ] Zero import non utilizzati
- [ ] `npm run lint` passa senza warning
- [ ] Funzionalita invariata

---

## CQ-03: Standardizzare Error Handling

- **Priorita**: P2
- **Effort**: S (1-4h)
- **Stato**: `[x]` completato 2026-03-02
- **Dipendenze**: CQ-01 (alert rimossi)

> **Completato 2026-03-02**: Tutti gli `alert()` sostituiti con `toast.error()`/`toast.success()` (CQ-01). Catch silenzioso in `Model3d.tsx` sostituito con `toast.error("Errore nel caricamento del modello 3D")`. Pattern unificato: toast per UI, ActionResult per server actions. Fullscreen catch in Viewer3d mantenuto silenzioso (fallback legittimo).
>
> **Verificato 2026-03-02**: Catch silenziosi trovati in `Viewer3d.tsx:59-61` (fullscreen, con commento) e `Model3d.tsx:79-81` (3D model loading, senza notifica). `catalogs/Form.tsx`, `wizard/Wizard.tsx` e `DangerZone.tsx` usano correttamente `toast.error()`.

### Problema
Tre pattern diversi per gli errori:
1. `toast.error()` - wizard
2. `alert()` - viewer, configurator
3. Catch silenzioso `catch {}` - vari

### Implementazione

Standardizzare su toast notification ovunque:

1. Sostituire tutti i catch silenziosi con toast o logging:
   ```typescript
   // PRIMA
   } catch {
     // silenzioso
   }

   // DOPO
   } catch (error) {
     toast.error("Operazione non riuscita");
   }
   ```

2. Cercare tutti i pattern con:
   ```bash
   grep -rn "catch\s*{" components/
   grep -rn "catch\s*(" components/ | grep -v toast
   ```

3. Per server actions, mantenere il pattern `ActionResult<T>`:
   ```typescript
   type ActionResult<T> = { success: true; data: T } | { success: false; error: string };
   ```

### File coinvolti
- Tutti i componenti con catch blocks (stimati ~10 file)
- Focus su: `components/viewer3d/`, `components/configurator/`, `components/wizard/`

### Criteri di accettazione
- [ ] Unico pattern di error handling: toast per UI, ActionResult per server actions
- [ ] Zero catch silenziosi senza almeno un log
- [ ] Messaggi di errore user-friendly (no stack trace, no JSON.stringify)

---

## CQ-04: Fix Naming Inconsistente

- **Priorita**: P2
- **Effort**: S (1-4h)
- **Stato**: `[x]` completato 2026-03-02 (`state` → `configuratorStore`, `resetwizardStore` → `resetWizardStore`, `d`/`pro` → `isDefault`/`isPro` con tutti i riferimenti aggiornati)
- **Dipendenze**: -

### Problema

| File | Attuale | Corretto |
|------|---------|----------|
| `store/configuratorStore.ts:22` | `export const state = proxy(...)` | `export const configuratorStore = proxy(...)` |
| `store/wizardStore.ts:102` | `resetwizardStore` | `resetWizardStore` |
| `components/forms/RadioCardProject.tsx:11` | Props `d`, `pro` | `isDefault`, `isPro` |

### Implementazione

Per ogni rinomina, usare find-and-replace globale per aggiornare tutti i riferimenti.

**configuratorStore.ts**: rinominare `state` -> `configuratorStore` in:
- `store/configuratorStore.ts` (definizione)
- Tutti i file che importano `state` da questo modulo

**wizardStore.ts**: rinominare `resetwizardStore` -> `resetWizardStore` in:
- `store/wizardStore.ts` (definizione)
- Tutti i file che chiamano questa funzione

**RadioCardProject.tsx**: rinominare props `d` -> `isDefault`, `pro` -> `isPro` in:
- `components/forms/RadioCardProject.tsx` (definizione)
- Tutti i file che passano queste props

### File coinvolti
- `store/configuratorStore.ts` + tutti i consumatori
- `store/wizardStore.ts` + tutti i consumatori
- `components/forms/RadioCardProject.tsx` + tutti i consumatori

### Criteri di accettazione
- [ ] Naming consistente con convenzioni del progetto
- [ ] Zero breaking changes (tutti i riferimenti aggiornati)
- [ ] `npm run build` passa senza errori

---

## CQ-05: Estrarre Componenti Duplicati da catalogs/Form.tsx

- **Priorita**: P2
- **Effort**: S (1-4h)
- **Stato**: `[x]` completato 2026-03-02 (7 componenti estratti in `components/ui/Card.tsx` e `components/ui/FormElements.tsx`, Form.tsx ora importa da moduli condivisi)
- **Dipendenze**: -

### Problema
`components/catalogs/Form.tsx` ridefinisce inline `Card`, `CardHeader`, `CardContent`, `Input`, `Textarea`, `Button`, `Toggle` quando componenti simili esistono gia in `components/forms/` e `components/ui/`.

### Implementazione

1. Verificare quali componenti in `components/ui/` e `components/forms/` sono compatibili
2. Sostituire i componenti inline con import dai moduli condivisi
3. Se mancano componenti in `components/ui/`, estrarli da `catalogs/Form.tsx`
4. Rimuovere le definizioni inline

### File coinvolti
- `components/catalogs/Form.tsx` (refactoring principale)
- `components/ui/` (potenziali nuovi componenti estratti)

### Criteri di accettazione
- [ ] Zero componenti definiti inline in catalogs/Form.tsx
- [ ] Tutti i componenti importati da moduli condivisi
- [ ] Aspetto visivo invariato
- [ ] `npm run build` passa

---

## CQ-06: ESLint Rules Piu Stretti

- **Priorita**: P3
- **Effort**: S (1-4h)
- **Stato**: `[x]` completato 2026-03-02 (aggiunte regole `no-console`, `no-alert`, `prefer-const`, `no-var`; tutti gli errori corretti)
- **Dipendenze**: CQ-02, CQ-03 completati

### Problema
`.eslintrc.json` ha configurazione minima. Mancano regole per: variabili non usate, console.log in produzione, any types espliciti.

### Implementazione

```json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:eslint-plugin-next-on-pages/recommended"
  ],
  "rules": {
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["error", {
      "argsIgnorePattern": "^_",
      "varsIgnorePattern": "^_"
    }],
    "no-alert": "error",
    "prefer-const": "error",
    "no-var": "error"
  }
}
```

**Nota**: Installare `@typescript-eslint/eslint-plugin` se non presente.

### File coinvolti
- `.eslintrc.json`
- `package.json` (eventuali nuove dev dependencies)

### Criteri di accettazione
- [ ] `no-console` warn attivo (eccetto warn/error)
- [ ] `no-alert` error attivo
- [ ] `no-unused-vars` error attivo
- [ ] `npm run lint` passa (dopo aver fixato eventuali violazioni)
