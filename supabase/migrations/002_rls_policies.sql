-- =============================================================================
-- Canhoto — Rumo à Farda
-- Migration 002: Row Level Security Policies
--
-- Activates RLS on all user-data tables and creates access policies.
-- Official TAF tables (editions, tests, ranges) are read-only for users.
-- =============================================================================

-- ============================================
-- Enable RLS on all tables
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE taf_editions ENABLE ROW LEVEL SECURITY;
ALTER TABLE taf_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE taf_score_ranges ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE planned_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE planned_session_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulation_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_xp ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_summaries ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Profiles: users can only access their own
-- ============================================

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Insert handled by trigger, but allow for safety
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- User Preferences: users own their data
-- ============================================

CREATE POLICY "Users can view own preferences"
  ON user_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON user_preferences FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON user_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- TAF Editions: read-only for authenticated users
-- ============================================

CREATE POLICY "Authenticated users can view editions"
  ON taf_editions FOR SELECT
  TO authenticated
  USING (true);

-- ============================================
-- TAF Tests: read-only for authenticated users
-- ============================================

CREATE POLICY "Authenticated users can view tests"
  ON taf_tests FOR SELECT
  TO authenticated
  USING (true);

-- ============================================
-- TAF Score Ranges: read-only for authenticated users
-- ============================================

CREATE POLICY "Authenticated users can view score ranges"
  ON taf_score_ranges FOR SELECT
  TO authenticated
  USING (true);

-- ============================================
-- Training Sessions: users own their sessions
-- ============================================

CREATE POLICY "Users can view own sessions"
  ON training_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own sessions"
  ON training_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
  ON training_sessions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own sessions"
  ON training_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- Training Results: users own their results
-- ============================================

CREATE POLICY "Users can view own results"
  ON training_results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own results"
  ON training_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own results"
  ON training_results FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own results"
  ON training_results FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- Planned Sessions: users own their plans
-- ============================================

CREATE POLICY "Users can view own planned sessions"
  ON planned_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own planned sessions"
  ON planned_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own planned sessions"
  ON planned_sessions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own planned sessions"
  ON planned_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- Planned Session Tests: access through parent
-- ============================================

CREATE POLICY "Users can view own planned session tests"
  ON planned_session_tests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM planned_sessions ps
      WHERE ps.id = planned_session_tests.planned_session_id
      AND ps.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create own planned session tests"
  ON planned_session_tests FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM planned_sessions ps
      WHERE ps.id = planned_session_tests.planned_session_id
      AND ps.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own planned session tests"
  ON planned_session_tests FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM planned_sessions ps
      WHERE ps.id = planned_session_tests.planned_session_id
      AND ps.user_id = auth.uid()
    )
  );

-- ============================================
-- User Goals: users own their goals
-- ============================================

CREATE POLICY "Users can view own goals"
  ON user_goals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own goals"
  ON user_goals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals"
  ON user_goals FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals"
  ON user_goals FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- Milestones: users own their milestones
-- ============================================

CREATE POLICY "Users can view own milestones"
  ON milestones FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own milestones"
  ON milestones FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own milestones"
  ON milestones FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own milestones"
  ON milestones FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- Simulations: users own their simulations
-- ============================================

CREATE POLICY "Users can view own simulations"
  ON simulations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own simulations"
  ON simulations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own simulations"
  ON simulations FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- Simulation Results: access through parent
-- ============================================

CREATE POLICY "Users can view own simulation results"
  ON simulation_results FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM simulations s
      WHERE s.id = simulation_results.simulation_id
      AND s.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create own simulation results"
  ON simulation_results FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM simulations s
      WHERE s.id = simulation_results.simulation_id
      AND s.user_id = auth.uid()
    )
  );

-- ============================================
-- Achievements: read-only global data
-- ============================================

CREATE POLICY "Authenticated users can view achievements"
  ON achievements FOR SELECT
  TO authenticated
  USING (true);

-- ============================================
-- User Achievements: users own their earned achievements
-- ============================================

CREATE POLICY "Users can view own achievements"
  ON user_achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can earn achievements"
  ON user_achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- User XP: users own their XP
-- ============================================

CREATE POLICY "Users can view own xp"
  ON user_xp FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own xp"
  ON user_xp FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own xp"
  ON user_xp FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- Notifications: users own their notifications
-- ============================================

CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can create own notifications"
  ON notifications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own notifications"
  ON notifications FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- Weekly Summaries: users own their summaries
-- ============================================

CREATE POLICY "Users can view own weekly summaries"
  ON weekly_summaries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own weekly summaries"
  ON weekly_summaries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own weekly summaries"
  ON weekly_summaries FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
