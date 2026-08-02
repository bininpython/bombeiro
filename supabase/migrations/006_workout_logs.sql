-- =============================================================================
-- Migration 006: Workout Logs
--
-- Tabela para armazenar os checklists de exercícios diários da ficha de treino
-- =============================================================================

CREATE TABLE workout_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_id TEXT NOT NULL,
  date DATE NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, exercise_id, date)
);

CREATE INDEX idx_workout_logs_user_date ON workout_logs(user_id, date);

-- Enable RLS
ALTER TABLE workout_logs ENABLE ROW LEVEL SECURITY;

-- Policy for Select
CREATE POLICY "Users can view their own workout logs"
ON workout_logs FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy for Insert
CREATE POLICY "Users can insert their own workout logs"
ON workout_logs FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy for Delete
CREATE POLICY "Users can delete their own workout logs"
ON workout_logs FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
