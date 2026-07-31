-- =============================================================================
-- Canhoto — Rumo à Farda
-- Migration 004: Ranking RLS
--
-- Enables all authenticated users to view profiles, user_xp, and training_results
-- of other users so we can build a head-to-head ranking.
-- =============================================================================

-- 1. Profiles
-- Drop the restrictive policy
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
-- Add the permissive policy (read-only for all logged in users)
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  USING (auth.role() = 'authenticated');

-- 2. User XP
DROP POLICY IF EXISTS "Users can view own xp" ON user_xp;
CREATE POLICY "Users can view all user xp"
  ON user_xp FOR SELECT
  USING (auth.role() = 'authenticated');

-- 3. Training Results
DROP POLICY IF EXISTS "Users can view own training results" ON training_results;
CREATE POLICY "Users can view all training results"
  ON training_results FOR SELECT
  USING (auth.role() = 'authenticated');
