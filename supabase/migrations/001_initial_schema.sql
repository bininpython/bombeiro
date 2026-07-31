-- =============================================================================
-- Canhoto — Rumo à Farda
-- Migration 001: Initial Schema
--
-- Creates all tables, types, triggers, and indexes.
-- Run this migration in your Supabase SQL Editor.
-- =============================================================================

-- ============================================
-- Custom ENUM types
-- ============================================

CREATE TYPE experience_level AS ENUM ('beginner', 'intermediate', 'advanced', 'athlete');
CREATE TYPE session_type AS ENUM ('training', 'simulation', 'free');
CREATE TYPE planned_session_status AS ENUM ('scheduled', 'completed', 'skipped', 'rescheduled');
CREATE TYPE milestone_status AS ENUM ('pending', 'in_progress', 'achieved');
CREATE TYPE goal_type AS ENUM ('minimum', 'safe', 'advanced', 'maximum', 'custom');
CREATE TYPE goal_status AS ENUM ('active', 'achieved', 'abandoned');
CREATE TYPE result_status AS ENUM ('below_minimum', 'passing', 'maximum');
CREATE TYPE measurement_direction AS ENUM ('higher_is_better', 'lower_is_better');
CREATE TYPE measurement_unit AS ENUM ('repetitions', 'seconds', 'milliseconds');
CREATE TYPE simulation_source AS ENUM ('manual', 'best', 'latest', 'average_last_3', 'last_simulation');
CREATE TYPE physical_condition AS ENUM ('great', 'good', 'normal', 'tired', 'exhausted');
CREATE TYPE notification_type AS ENUM ('training_reminder', 'record_achieved', 'new_range', 'goal_proximity', 'inactivity', 'simulation_scheduled', 'weekly_summary', 'taf_approaching');

-- ============================================
-- Function: auto-update updated_at
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Table: profiles
-- ============================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  nickname TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  birth_date DATE,
  height_cm SMALLINT CHECK (height_cm IS NULL OR (height_cm > 0 AND height_cm < 300)),
  weight_kg NUMERIC(5,2) CHECK (weight_kg IS NULL OR (weight_kg > 0 AND weight_kg < 500)),
  experience_level experience_level NOT NULL DEFAULT 'beginner',
  target_taf_date DATE,
  weekly_availability SMALLINT CHECK (weekly_availability IS NULL OR (weekly_availability >= 0 AND weekly_availability <= 7)),
  training_location TEXT,
  has_pool_access BOOLEAN DEFAULT FALSE,
  has_pull_up_bar BOOLEAN DEFAULT FALSE,
  has_professional_guidance BOOLEAN DEFAULT FALSE,
  onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Table: user_preferences
-- ============================================

CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  theme TEXT NOT NULL DEFAULT 'dark' CHECK (theme IN ('dark', 'light', 'system')),
  locale TEXT NOT NULL DEFAULT 'pt-BR',
  week_starts_on SMALLINT NOT NULL DEFAULT 1 CHECK (week_starts_on >= 0 AND week_starts_on <= 6),
  notifications_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  reminder_time TIME DEFAULT '07:00:00',
  target_level goal_type NOT NULL DEFAULT 'minimum',
  reduce_motion BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Table: taf_editions
-- ============================================

CREATE TABLE taf_editions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  organization TEXT NOT NULL,
  edital_number TEXT NOT NULL,
  year SMALLINT NOT NULL,
  audience TEXT NOT NULL DEFAULT 'masculine',
  source_description TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  effective_from DATE,
  effective_until DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_taf_editions_active ON taf_editions(active);

-- ============================================
-- Table: taf_tests
-- ============================================

CREATE TABLE taf_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  edition_id UUID NOT NULL REFERENCES taf_editions(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  short_name TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL,
  unit measurement_unit NOT NULL,
  measurement_direction measurement_direction NOT NULL,
  official_order SMALLINT NOT NULL,
  minimum_score SMALLINT NOT NULL DEFAULT 12,
  maximum_score SMALLINT NOT NULL DEFAULT 20,
  icon TEXT DEFAULT 'Activity',
  active BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE(edition_id, slug)
);

CREATE INDEX idx_taf_tests_edition ON taf_tests(edition_id);

-- ============================================
-- Table: taf_score_ranges
-- ============================================

CREATE TABLE taf_score_ranges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  taf_test_id UUID NOT NULL REFERENCES taf_tests(id) ON DELETE CASCADE,
  score SMALLINT NOT NULL CHECK (score >= 0 AND score <= 20),
  minimum_value NUMERIC(10,2),
  maximum_value NUMERIC(10,2),
  minimum_inclusive BOOLEAN NOT NULL DEFAULT TRUE,
  maximum_inclusive BOOLEAN NOT NULL DEFAULT TRUE,
  result_status result_status NOT NULL,
  display_label TEXT NOT NULL,
  sort_order SMALLINT NOT NULL DEFAULT 0,
  UNIQUE(taf_test_id, score, sort_order)
);

CREATE INDEX idx_taf_score_ranges_test ON taf_score_ranges(taf_test_id);

-- ============================================
-- Table: training_sessions
-- ============================================

CREATE TABLE training_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_date DATE NOT NULL DEFAULT CURRENT_DATE,
  title TEXT,
  session_type session_type NOT NULL DEFAULT 'training',
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ,
  perceived_effort SMALLINT CHECK (perceived_effort IS NULL OR (perceived_effort >= 1 AND perceived_effort <= 10)),
  physical_condition physical_condition,
  pain_reported BOOLEAN DEFAULT FALSE,
  pain_notes TEXT,
  general_notes TEXT,
  location TEXT,
  surface_type TEXT,
  equipment TEXT,
  photo_url TEXT,
  planned_session_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_training_sessions_user ON training_sessions(user_id);
CREATE INDEX idx_training_sessions_date ON training_sessions(user_id, session_date DESC);

CREATE TRIGGER training_sessions_updated_at
  BEFORE UPDATE ON training_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Table: training_results
-- ============================================

CREATE TABLE training_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES training_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  taf_test_id UUID NOT NULL REFERENCES taf_tests(id),
  test_slug TEXT NOT NULL,
  raw_value NUMERIC(10,2) NOT NULL,
  value_unit measurement_unit NOT NULL,
  duration_ms INTEGER,
  repetitions INTEGER,
  official_score SMALLINT NOT NULL DEFAULT 0 CHECK (official_score >= 0 AND official_score <= 20),
  passing BOOLEAN NOT NULL DEFAULT FALSE,
  result_status result_status NOT NULL DEFAULT 'below_minimum',
  execution_valid BOOLEAN NOT NULL DEFAULT TRUE,
  attempt_number SMALLINT NOT NULL DEFAULT 1,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_training_results_user ON training_results(user_id);
CREATE INDEX idx_training_results_session ON training_results(session_id);
CREATE INDEX idx_training_results_test ON training_results(user_id, test_slug);
CREATE INDEX idx_training_results_date ON training_results(user_id, created_at DESC);

CREATE TRIGGER training_results_updated_at
  BEFORE UPDATE ON training_results
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Table: planned_sessions
-- ============================================

CREATE TABLE planned_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scheduled_date DATE NOT NULL,
  status planned_session_status NOT NULL DEFAULT 'scheduled',
  title TEXT,
  description TEXT,
  recovery_day BOOLEAN NOT NULL DEFAULT FALSE,
  skip_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_planned_sessions_user ON planned_sessions(user_id, scheduled_date);

CREATE TRIGGER planned_sessions_updated_at
  BEFORE UPDATE ON planned_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Table: planned_session_tests
-- ============================================

CREATE TABLE planned_session_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  planned_session_id UUID NOT NULL REFERENCES planned_sessions(id) ON DELETE CASCADE,
  taf_test_id UUID NOT NULL REFERENCES taf_tests(id),
  test_slug TEXT NOT NULL,
  target_value NUMERIC(10,2),
  target_score SMALLINT,
  sort_order SMALLINT NOT NULL DEFAULT 0
);

CREATE INDEX idx_planned_session_tests_session ON planned_session_tests(planned_session_id);

-- ============================================
-- Table: user_goals
-- ============================================

CREATE TABLE user_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  taf_test_id UUID REFERENCES taf_tests(id),
  test_slug TEXT,
  goal_type goal_type NOT NULL DEFAULT 'minimum',
  target_value NUMERIC(10,2),
  target_score SMALLINT,
  target_date DATE,
  status goal_status NOT NULL DEFAULT 'active',
  achieved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_user_goals_user ON user_goals(user_id);

CREATE TRIGGER user_goals_updated_at
  BEFORE UPDATE ON user_goals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Table: milestones
-- ============================================

CREATE TABLE milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  taf_test_id UUID REFERENCES taf_tests(id),
  test_slug TEXT NOT NULL,
  title TEXT NOT NULL,
  target_value NUMERIC(10,2) NOT NULL,
  target_score SMALLINT NOT NULL DEFAULT 0,
  milestone_order SMALLINT NOT NULL DEFAULT 0,
  status milestone_status NOT NULL DEFAULT 'pending',
  achieved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_milestones_user ON milestones(user_id, test_slug);

-- ============================================
-- Table: simulations
-- ============================================

CREATE TABLE simulations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  edition_id UUID REFERENCES taf_editions(id),
  simulation_date DATE NOT NULL DEFAULT CURRENT_DATE,
  source_type simulation_source NOT NULL DEFAULT 'manual',
  final_score NUMERIC(5,2) NOT NULL DEFAULT 0,
  raw_score_sum SMALLINT NOT NULL DEFAULT 0,
  average_score NUMERIC(5,2) NOT NULL DEFAULT 0,
  all_tests_passing BOOLEAN NOT NULL DEFAULT FALSE,
  overall_status TEXT NOT NULL DEFAULT 'start_of_journey',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_simulations_user ON simulations(user_id, simulation_date DESC);

-- ============================================
-- Table: simulation_results
-- ============================================

CREATE TABLE simulation_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  simulation_id UUID NOT NULL REFERENCES simulations(id) ON DELETE CASCADE,
  taf_test_id UUID NOT NULL REFERENCES taf_tests(id),
  test_slug TEXT NOT NULL,
  raw_value NUMERIC(10,2) NOT NULL,
  official_score SMALLINT NOT NULL DEFAULT 0,
  passing BOOLEAN NOT NULL DEFAULT FALSE,
  official_order SMALLINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_simulation_results_sim ON simulation_results(simulation_id);

-- ============================================
-- Table: achievements
-- ============================================

CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Award',
  xp_reward INTEGER NOT NULL DEFAULT 0,
  criteria_json JSONB,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- Table: user_achievements
-- ============================================

CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id),
  earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadata_json JSONB,
  UNIQUE(user_id, achievement_id)
);

CREATE INDEX idx_user_achievements_user ON user_achievements(user_id);

-- ============================================
-- Table: user_xp
-- ============================================

CREATE TABLE user_xp (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  total_xp INTEGER NOT NULL DEFAULT 0 CHECK (total_xp >= 0),
  current_level SMALLINT NOT NULL DEFAULT 1,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER user_xp_updated_at
  BEFORE UPDATE ON user_xp
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Table: notifications
-- ============================================

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  scheduled_for TIMESTAMPTZ,
  metadata_json JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_unread ON notifications(user_id) WHERE read_at IS NULL;

-- ============================================
-- Table: weekly_summaries
-- ============================================

CREATE TABLE weekly_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  sessions_completed SMALLINT NOT NULL DEFAULT 0,
  sessions_planned SMALLINT NOT NULL DEFAULT 0,
  personal_records SMALLINT NOT NULL DEFAULT 0,
  adherence_percentage NUMERIC(5,2) NOT NULL DEFAULT 0,
  average_effort NUMERIC(3,1),
  summary_json JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, week_start)
);

CREATE INDEX idx_weekly_summaries_user ON weekly_summaries(user_id, week_start DESC);

-- ============================================
-- Trigger: Auto-create profile on user signup
-- ============================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));

  INSERT INTO user_preferences (user_id)
  VALUES (NEW.id);

  INSERT INTO user_xp (user_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
