-- =============================================================================
-- Canhoto — Rumo à Farda
-- Migration 005: Fix Auth Trigger
--
-- Fixes the handle_new_user trigger to explicitly use the public schema.
-- Supabase auth triggers run in a context where search_path might not include public.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));

  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id);

  INSERT INTO public.user_xp (user_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
