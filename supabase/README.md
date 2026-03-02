# Supabase - Database Migrations

## Setup iniziale

### 1. Installare Supabase CLI

```bash
npm install -g supabase
```

### 2. Login

```bash
supabase login
```

### 3. Collegare il progetto remoto

```bash
supabase link --project-ref hmulxbvwdgyogleepxmu
```

## Comandi principali

### Verificare lo stato delle migrazioni

```bash
# Lista migrazioni applicate sul db remoto
supabase migration list --linked

# Confrontare schema locale vs remoto
supabase db diff --linked
```

### Applicare migrazioni al db remoto

```bash
# Push di tutte le migrazioni pendenti
supabase db push --linked
```

### Creare una nuova migrazione

```bash
# Creare file di migrazione vuoto
supabase migration new nome_migrazione

# Oppure generare diff automatico dallo schema remoto
supabase db diff --linked -f nome_migrazione
```

### Sincronizzare schema remoto in locale

```bash
# Pull dello schema remoto (sovrascrive migrazioni locali)
supabase db pull --linked

# Pull solo delle nuove migrazioni remote
supabase migration list --linked
```

### Rigenerare i tipi TypeScript

```bash
npm run update-types
```

Questo aggiorna `types/supabase.ts` con i tipi generati dallo schema del database.

### Reset del database locale (solo sviluppo)

```bash
# Ricreare il db locale applicando tutte le migrazioni da zero
supabase db reset
```

## Struttura migrazioni

```
supabase/migrations/
  20240716193019_remote_schema.sql   # Schema iniziale
  20240716193032_schema.sql
  20240716193652_remote_schema.sql
  20240717125224_remote_schema.sql
  20240717131008_remote_schema.sql
  20240721201550_remote_schema.sql
  20240723124926_remote_schema.sql
  20240808191414_schema.sql
  20240808191429_schema.sql
  20260302103156_fix_rls_policies_sec01.sql  # SEC-01: Fix RLS policies
```

## RLS (Row Level Security)

Le policy RLS attive proteggono l'accesso ai dati per utente:

| Tabella | SELECT | INSERT | UPDATE | DELETE |
|---------|--------|--------|--------|--------|
| `project` | `user_id = auth.uid()` | `user_id = auth.uid()` | `user_id = auth.uid()` | `user_id = auth.uid()` |
| `catalog` | `user_id = auth.uid()` OR `public = true` | `user_id = auth.uid()` | `user_id = auth.uid()` | `user_id = auth.uid()` |
| `project_catalog` | owner del catalogo | owner del catalogo | - | owner del catalogo |

> **Nota**: Esistono policy `anon` su `project` (SELECT/UPDATE) usate dal worker backend di processing 3D. Queste andranno migrate a `service_role` key in futuro.
