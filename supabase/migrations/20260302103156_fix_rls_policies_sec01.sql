-- ============================================================
-- SEC-01: Fix insecure RLS policies for GoTo3D
-- Fixes: INSERT/UPDATE policies that allow any authenticated
-- user to modify any row (missing user_id checks)
-- ============================================================

-- =====================
-- 1. FIX PROJECT TABLE
-- =====================

-- Fix INSERT: restrict to own user_id (was: with_check = true)
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON project;
CREATE POLICY "Users can create own projects"
  ON project FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Fix UPDATE: restrict to own user_id (was: qual = true)
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON project;
CREATE POLICY "Users can update own projects"
  ON project FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- =====================
-- 2. FIX CATALOG TABLE
-- =====================

-- Fix INSERT: restrict to own user_id (was: with_check = true)
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON catalog;
CREATE POLICY "Users can create own catalogs"
  ON catalog FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Fix UPDATE: restrict to own user_id (was: qual = true)
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON catalog;
CREATE POLICY "Users can update own catalogs"
  ON catalog FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- Add policy for public catalogs (missing - public=true catalogs should be visible to all authenticated users)
CREATE POLICY "Users can view public catalogs"
  ON catalog FOR SELECT TO authenticated
  USING (public = true);

-- ==============================
-- 3. FIX PROJECT_CATALOG TABLE
-- ==============================

-- Replace broad ALL policy with specific owner-based policies
DROP POLICY IF EXISTS "Enable * for authenticated users only" ON project_catalog;

CREATE POLICY "Users can view own project_catalog"
  ON project_catalog FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM catalog
      WHERE catalog.id = project_catalog.catalog_id
        AND catalog.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own project_catalog"
  ON project_catalog FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM catalog
      WHERE catalog.id = project_catalog.catalog_id
        AND catalog.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own project_catalog"
  ON project_catalog FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM catalog
      WHERE catalog.id = project_catalog.catalog_id
        AND catalog.user_id = auth.uid()
    )
  );
