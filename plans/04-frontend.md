# Area 4: Frontend & UX

**Punteggio attuale**: 5/10
**Obiettivo**: 7/10
**Effort totale stimato**: ~4-6 giorni

---

## FE-01: Error Boundary per Canvas 3D

- **Priorita**: P1
- **Effort**: S (1-4h)
- **Stato**: `[x]` completato 2026-03-02 (creato `components/viewer3d/Canvas3dErrorBoundary.tsx`, wrappato Canvas in Viewer3d e Configurator3d)
- **Dipendenze**: -

### Problema
Nessun Error Boundary intorno al Canvas Three.js. Se Three.js crasha (file 3D corrotto, WebGL non supportato, memory overflow), l'intera pagina diventa bianca senza feedback.

### Implementazione

Creare `components/ui/Canvas3dErrorBoundary.tsx`:

```typescript
"use client";

import React, { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class Canvas3dErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex h-full items-center justify-center bg-gray-100 p-8 text-center">
          <div>
            <h3 className="text-lg font-semibold">Impossibile caricare il modello 3D</h3>
            <p className="mt-2 text-sm text-gray-600">
              Il tuo browser potrebbe non supportare WebGL oppure il file e corrotto.
            </p>
            <button
              className="mt-4 rounded bg-palette1 px-4 py-2 text-white"
              onClick={() => this.setState({ hasError: false, error: null })}
            >
              Riprova
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

Wrappare i componenti 3D:
```typescript
// Dove Viewer3d viene usato
<Canvas3dErrorBoundary>
  <Viewer3d {...props} />
</Canvas3dErrorBoundary>

// Dove Configurator3d viene usato
<Canvas3dErrorBoundary>
  <Configurator3d {...props} />
</Canvas3dErrorBoundary>
```

### File coinvolti
- `components/ui/Canvas3dErrorBoundary.tsx` (nuovo)
- `app/projects/[id]/page.tsx` (wrap Viewer3d)
- `app/configurator/[id]/page.tsx` (wrap Configurator3d)

### Criteri di accettazione
- [ ] Error boundary cattura errori Three.js
- [ ] Messaggio user-friendly mostrato al posto della pagina bianca
- [ ] Bottone "Riprova" resetta lo stato
- [ ] Pagina non crasha con file 3D corrotto

---

## FE-02: Audit Accessibilita (A11Y)

- **Priorita**: P2
- **Effort**: L (2-5 giorni)
- **Stato**: `[x]` completato 2026-03-02 (aria-labels su Viewer3d fullscreen/AR, Menu hamburger con aria-expanded, skip-to-content in layout.tsx, main id="main-content")
- **Dipendenze**: -

> **Verificato 2026-03-02**: Header.tsx ha 3 aria-label ("Back to homepage", "Home", "Logout"). `ui/Accordion.tsx` usa `aria-labelledby`. Mancano: aria-label su bottoni Viewer3d (fullscreen, AR), aria-expanded su menu hamburger, skip-to-content in layout.tsx.

### Problema
Solo 5 attributi aria nell'intera codebase. Mancano: aria-labels su bottoni icona, aria-expanded su menu, alt text su immagini, focus management, skip-to-content.

### Implementazione

#### Fase 1: Bottoni icona e interattivi

```typescript
// Viewer3d.tsx:51 - Fullscreen button
<button aria-label="Attiva schermo intero">
  <ArrowsExpandIcon className="h-8 w-8" />
</button>

// Viewer3d.tsx:67 - AR button
<button aria-label="Visualizza in realta aumentata">
  <CubeTransparentIcon className="h-8 w-8" />
</button>

// Menu.tsx:51 - Hamburger
<button
  aria-label="Apri menu navigazione"
  aria-expanded={isOpen}
>
```

#### Fase 2: Skip-to-content

```typescript
// app/layout.tsx - primo figlio di <body>
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-palette1 focus:px-4 focus:py-2 focus:text-white"
>
  Salta al contenuto principale
</a>

// Aggiungere id al main
<main id="main-content">
```

#### Fase 3: Form accessibili

```typescript
// RadioCardProject.tsx - Associare label a input
<label htmlFor={`radio-${value}`} className="...">
  <input id={`radio-${value}`} type="radio" ... />
  {/* contenuto label */}
</label>
```

#### Fase 4: Immagini

- Verificare che tutti i componenti `Image` e `BlurImage` abbiano alt text descrittivo
- Pattern: `alt={project.name}` o `alt={`Anteprima modello ${project.name}`}`

#### Fase 5: Keyboard navigation

- Tutti gli `onClick` handler devono avere equivalente `onKeyDown` (Enter/Space)
- Oppure usare `<button>` invece di `<div onClick>`

### File coinvolti
- `components/viewer3d/Viewer3d.tsx`
- `components/Menu.tsx`
- `components/forms/RadioCardProject.tsx`
- `app/layout.tsx`
- `components/Card.tsx`
- `components/BlurImage.tsx`
- Tutti i componenti con handler interattivi

### Criteri di accettazione
- [ ] Tutti i bottoni interattivi hanno aria-label
- [ ] Menu hamburger ha aria-expanded
- [ ] Skip-to-content link presente
- [ ] Tutte le immagini hanno alt text
- [ ] Form inputs hanno label associate
- [ ] Navigazione base possibile con solo tastiera
- [ ] Lighthouse Accessibility score > 80

---

## FE-03: Pulizia "use client" Non Necessari

- **Priorita**: P2
- **Effort**: XS (<1h)
- **Stato**: `[x]` completato
- **Dipendenze**: -

> **Verificato 2026-03-02**: `Card.tsx` non ha "use client" e non usa hooks (gia corretto). `BlurImage.tsx` ha "use client" ed e necessario (usa `useState` per loading + `setSrc`). `Accordion.tsx` ha "use client" ed e necessario (usa `useState` per `isOpen` e `icon`). Nessuna azione necessaria.

### Problema (risolto)
I componenti analizzati hanno "use client" solo dove effettivamente necessario.

### Azioni

| Componente | Motivo "use client" | Azione | Stato |
|-----------|---------------------|--------|-------|
| `components/Card.tsx` | Nessuna interattivita | ~~Rimuovere~~ | ~~fatto~~ (gia senza "use client") |
| `components/BlurImage.tsx` | `useState` per loading | Mantenere (necessario) | N/A |
| `components/Accordion.tsx` | `useState` per isOpen | Mantenere (necessario) | N/A |

**Nota**: prima di rimuovere, verificare che il componente non usi hooks, event handlers, o browser APIs.

### File coinvolti
- `components/Card.tsx`
- `components/BlurImage.tsx`
- `components/Accordion.tsx`

### Criteri di accettazione
- [ ] "use client" rimosso dove non necessario
- [ ] Componenti funzionano come Server Components
- [ ] Nessun errore di hydration
- [ ] `npm run build` passa

---

## FE-04: Dark Mode

- **Priorita**: P3
- **Effort**: L (2-5 giorni)
- **Stato**: `[ ]` (verificato 2026-03-02: nessun `darkMode` in tailwind.config.js, colori dark commentati nel config, solo 3 classi `dark:` in Modal.tsx)
- **Dipendenze**: Design palette dark mode

### Problema
Nessun supporto dark mode. Palette colori hardcoded per tema chiaro.

### Implementazione

1. **Tailwind config**:
   ```javascript
   // tailwind.config.js
   module.exports = {
     darkMode: "class", // o "media" per seguire preferenze sistema
     // ...
   };
   ```

2. **CSS variables per palette**:
   ```css
   /* styles/globals.css */
   :root {
     --bg-primary: #ffffff;
     --text-primary: #1a1a1a;
     /* ... */
   }

   .dark {
     --bg-primary: #1a1a1a;
     --text-primary: #f5f5f5;
     /* ... */
   }
   ```

3. **Toggle component** con persistenza in localStorage

4. **Aggiornare componenti** con classi `dark:`:
   ```html
   <div className="bg-white dark:bg-gray-900 text-black dark:text-white">
   ```

### File coinvolti
- `tailwind.config.js`
- `styles/globals.css`
- `app/layout.tsx` (classe dark su html)
- Tutti i componenti con colori hardcoded (~30+ file)
- Nuovo componente ThemeToggle

### Criteri di accettazione
- [ ] Toggle dark/light mode funzionante
- [ ] Preferenza salvata in localStorage
- [ ] Tutti i componenti hanno stili dark mode
- [ ] Viewer 3D ha sfondo appropriato in dark mode
- [ ] Nessun flash bianco al caricamento

---

## FE-05: Internazionalizzazione (i18n)

- **Priorita**: P3
- **Effort**: XL (1-2 settimane)
- **Stato**: `[ ]` (verificato 2026-03-02: `next-intl` non in package.json, nessuna directory `messages/`)
- **Dipendenze**: Definizione scope lingue supportate

### Problema
Tutti i testi UI e messaggi di errore sono hardcoded in italiano. Nessun sistema i18n. Messaggi Zod, toast, UI labels - tutto in italiano inline.

### Implementazione consigliata

**Libreria**: `next-intl` (integrazione nativa App Router)

```bash
npm install next-intl
```

1. Creare file di traduzione:
   ```
   messages/
     it.json
     en.json
   ```

2. Configurare middleware per locale detection

3. Migrare progressivamente:
   - Fase 1: Messaggi di errore e validazione Zod
   - Fase 2: Labels UI e titoli pagine
   - Fase 3: Contenuti dinamici

### Effort breakdown
- Setup next-intl + middleware: S
- Estrazione stringhe IT: M
- Traduzione EN: M (o esterna)
- Testing: S

### File coinvolti
- `middleware.ts` (locale routing)
- `messages/it.json`, `messages/en.json` (nuovi)
- `lib/validations/project.ts` (messaggi Zod)
- Tutti i componenti con testo hardcoded (~40+ file)

### Criteri di accettazione
- [ ] next-intl configurato con IT come lingua default
- [ ] Almeno EN come seconda lingua
- [ ] Messaggi di errore traducibili
- [ ] UI labels traducibili
- [ ] URL con prefisso locale (opzionale)

---

## FE-06: Fix Hydration Mismatch e Hook Condizionale

- **Priorita**: P2
- **Effort**: S (1-4h)
- **Stato**: `[x]` completato 2026-03-02 (ToastComponent riscritto con cleanup `supabase.removeChannel()`, dead code rimosso; ProjectCard gia corretto con `channel.unsubscribe()` nel return)
- **Dipendenze**: -

> **ATTENZIONE RIDIMENSIONATA**: Verificato 2026-03-02 - il "bug critico" degli hook condizionali in `ProjectCard.tsx` e stato **ridimensionato**. L'`useEffect` e chiamato incondizionatamente (riga 39), con la condizione `if (artifact) return;` **dentro** l'hook (riga 40), il che e corretto secondo le Rules of Hooks. Restano problemi di cleanup nella subscription e potenziali hydration mismatch in `ToastComponent.tsx`.

### Problema
- `ToastComponent.tsx`: Supabase real-time subscription creata su mount puo causare mismatch
- `ProjectCard.tsx`: Real-time subscription su mount produce contenuto diverso tra server e client
- **BUG CRITICO**: `ProjectCard.tsx` chiama `useEffect` condizionalmente (`if (!artifact) { useEffect(...) }`), violando le Rules of Hooks

### Implementazione

**1. Fix hook condizionale (prioritario)**:
```typescript
// PRIMA (BUG) - hook dentro if
if (!artifact) {
  useEffect(() => { ... }, []);
}

// DOPO - hook sempre chiamato, condizione dentro
useEffect(() => {
  if (!artifact) {
    // subscription logic
  }
}, [artifact]);
```

**2. Wrappare le subscription in `useEffect`** con stato iniziale consistente:
```typescript
// Pattern: stato iniziale server-safe, subscription solo client-side
const [realtimeData, setRealtimeData] = useState(initialData); // server-safe

useEffect(() => {
  // Subscription solo dopo mount (client-side)
  const channel = supabase.channel("...").on("...", (payload) => {
    setRealtimeData(payload.new);
  }).subscribe();

  return () => { supabase.removeChannel(channel); };
}, []);
```

### File coinvolti
- `components/projects/ProjectCard.tsx` (fix hook condizionale + hydration)
- `components/ToastComponent.tsx`

### Criteri di accettazione
- [ ] Zero hook condizionali (tutte le chiamate a useEffect/useState al top-level)
- [ ] Zero hydration warning in console
- [ ] Real-time updates funzionano dopo mount
- [ ] SSR produce HTML consistente

---

## FE-07: Fix Card.tsx href

- **Priorita**: P2
- **Effort**: XS (<1h)
- **Stato**: `[x]` completato 2026-03-02 (Card.tsx era dead code - non importato da nessun file - eliminato come parte di CQ-02)
- **Dipendenze**: -

### Problema
`components/Card.tsx:10`: usa `<a>` senza `href` valido. Dovrebbe usare `<Link>` di Next.js o avere un href corretto.

### Implementazione

Sostituire `<a>` con `<Link>` di Next.js:
```typescript
import Link from "next/link";

// <a ...> diventa <Link href={url} ...>
```

### File coinvolti
- `components/Card.tsx`

### Criteri di accettazione
- [ ] `<a>` sostituito con `<Link>` di Next.js
- [ ] Navigazione funziona correttamente
- [ ] Prefetch attivo per performance
