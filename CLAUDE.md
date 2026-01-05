# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GoTo3D is a Next.js 14 web application that converts images to 3D models. Users upload images, which are processed through a queue system, and the resulting 3D models can be viewed in a WebGL viewer with AR support on iOS devices.

## Commands

```bash
npm run dev          # Start dev server on port 8080
npm run build        # Production build
npm run lint         # Run ESLint
npm run cypress      # Open Cypress test runner
npm run cypress:run  # Run Cypress tests headlessly
npm run update-types # Regenerate Supabase types from database schema
```

## Architecture

### App Structure (Next.js App Router)
- `app/` - Pages and API routes using Next.js 14 App Router
- `app/api/` - API endpoints (image-upload, send-to-queue)
- `app/[feature]/actions.tsx` - Server actions colocated with pages

### Key Directories
- `components/` - React components organized by feature (wizard, viewer3d, configurator, forms, projects, catalogs)
- `store/` - Valtio state management stores (main, wizard, viewer, configurator, catalog)
- `utils/` - Utility functions for Supabase, S3/R2, and AMQP
- `types/supabase.ts` - Auto-generated database types (regenerate with `npm run update-types`)

### State Management
Uses Valtio for client-side state. Each store exports:
- A proxy state object
- `useStore()` hook for reactive snapshots
- `actions` object with state mutations

### Backend Services
- **Supabase**: Authentication and PostgreSQL database
  - `utils/supabase/client.ts` - Browser client
  - `utils/supabase/server.ts` - Server component client
- **Cloudflare R2**: File storage via S3-compatible API (`utils/s3/`)
- **RabbitMQ**: Job queue for 3D processing (`utils/amqpClient.ts`)

### 3D Rendering
Uses React Three Fiber with Three.js for WebGL rendering:
- `components/viewer3d/` - 3D model viewer with AR support
- `components/configurator/` - 3D model configurator with material controls

### Database Tables
Main entities: `project`, `catalog`, `project_catalog` (junction), `users`, `subscriptions`, `products`, `prices`

Project status workflow: `in queue` -> `processing` -> `done` | `error`

### Environment Variables Required
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase
- `NEXT_CLOUDFLARE_R2_*` - Cloudflare R2 storage credentials
- `SITE_URL` - Production URL

## Conventions

- Path alias `@/*` maps to project root
- Server actions in `actions.tsx` files alongside page components
- PWA enabled (disabled in development)
