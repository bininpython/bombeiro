-- =============================================================================
-- Canhoto — Rumo à Farda
-- Migration 003: Seed TAF Data
--
-- Seeds the official TAF edition, tests, score ranges, and achievements.
-- Data matches: CBMMG — CFSd BM 2027 — Edital nº 10/2026 (Masculino)
-- =============================================================================

-- ============================================
-- TAF Edition
-- ============================================

INSERT INTO taf_editions (id, name, organization, edital_number, year, audience, source_description, active)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'CBMMG — CFSd BM 2027 — Edital nº 10/2026',
  'Corpo de Bombeiros Militar de Minas Gerais',
  '10/2026',
  2027,
  'masculine',
  'Teste de Capacitação Física para o Curso de Formação de Soldados BM 2027. Dados baseados no edital público. Esta aplicação não possui vínculo oficial com o CBMMG.',
  TRUE
) ON CONFLICT (id) DO NOTHING;

-- ============================================
-- TAF Tests
-- ============================================

-- 1. Corrida 2400m
INSERT INTO taf_tests (id, edition_id, slug, name, short_name, category, unit, measurement_direction, official_order, minimum_score, maximum_score, icon)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'running_2400m',
  'Corrida de 2.400 metros',
  'Corrida',
  'Resistência Aeróbica',
  'seconds',
  'lower_is_better',
  1, 12, 20, 'Timer'
) ON CONFLICT (id) DO NOTHING;

-- 2. Abdominal
INSERT INTO taf_tests (id, edition_id, slug, name, short_name, category, unit, measurement_direction, official_order, minimum_score, maximum_score, icon)
VALUES (
  '22222222-2222-2222-2222-222222222222',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'abdominal_60s',
  'Flexão Abdominal em 60 segundos',
  'Abdominal',
  'Flexão Abdominal',
  'repetitions',
  'higher_is_better',
  2, 12, 20, 'Dumbbell'
) ON CONFLICT (id) DO NOTHING;

-- 3. Barra Fixa
INSERT INTO taf_tests (id, edition_id, slug, name, short_name, category, unit, measurement_direction, official_order, minimum_score, maximum_score, icon)
VALUES (
  '33333333-3333-3333-3333-333333333333',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'pull_up_dynamic',
  'Barra Fixa Dinâmica',
  'Barra',
  'Força de Membros Superiores',
  'repetitions',
  'higher_is_better',
  3, 12, 20, 'ArrowUpFromLine'
) ON CONFLICT (id) DO NOTHING;

-- 4. Shuttle Run
INSERT INTO taf_tests (id, edition_id, slug, name, short_name, category, unit, measurement_direction, official_order, minimum_score, maximum_score, icon)
VALUES (
  '44444444-4444-4444-4444-444444444444',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'shuttle_run',
  'Shuttle Run',
  'Shuttle Run',
  'Agilidade',
  'seconds',
  'lower_is_better',
  4, 12, 20, 'Zap'
) ON CONFLICT (id) DO NOTHING;

-- 5. Natação
INSERT INTO taf_tests (id, edition_id, slug, name, short_name, category, unit, measurement_direction, official_order, minimum_score, maximum_score, icon)
VALUES (
  '55555555-5555-5555-5555-555555555555',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'swimming_50m',
  'Natação de 50 metros',
  'Natação',
  'Habilidade Natatória',
  'seconds',
  'lower_is_better',
  5, 12, 20, 'Waves'
) ON CONFLICT (id) DO NOTHING;

-- ============================================
-- Score Ranges — Corrida 2400m (lower_is_better, values in seconds)
-- ============================================

INSERT INTO taf_score_ranges (taf_test_id, score, minimum_value, maximum_value, minimum_inclusive, maximum_inclusive, result_status, display_label, sort_order) VALUES
('11111111-1111-1111-1111-111111111111', 20, NULL, 524, FALSE, TRUE, 'maximum', 'até 8min44s', 1),
('11111111-1111-1111-1111-111111111111', 19, 525, 554, TRUE, TRUE, 'passing', '8min45s a 9min14s', 2),
('11111111-1111-1111-1111-111111111111', 18, 555, 585, TRUE, TRUE, 'passing', '9min15s a 9min45s', 3),
('11111111-1111-1111-1111-111111111111', 17, 586, 615, TRUE, TRUE, 'passing', '9min46s a 10min15s', 4),
('11111111-1111-1111-1111-111111111111', 16, 616, 645, TRUE, TRUE, 'passing', '10min16s a 10min45s', 5),
('11111111-1111-1111-1111-111111111111', 15, 646, 675, TRUE, TRUE, 'passing', '10min46s a 11min15s', 6),
('11111111-1111-1111-1111-111111111111', 14, 676, 705, TRUE, TRUE, 'passing', '11min16s a 11min45s', 7),
('11111111-1111-1111-1111-111111111111', 13, 706, 736, TRUE, TRUE, 'passing', '11min46s a 12min16s', 8),
('11111111-1111-1111-1111-111111111111', 12, 737, 765, TRUE, TRUE, 'passing', '12min17s a 12min45s', 9),
('11111111-1111-1111-1111-111111111111', 0, 766, NULL, TRUE, FALSE, 'below_minimum', 'Abaixo do mínimo', 10)
ON CONFLICT (taf_test_id, score, sort_order) DO NOTHING;

-- ============================================
-- Score Ranges — Abdominal 60s (higher_is_better, repetitions)
-- ============================================

INSERT INTO taf_score_ranges (taf_test_id, score, minimum_value, maximum_value, minimum_inclusive, maximum_inclusive, result_status, display_label, sort_order) VALUES
('22222222-2222-2222-2222-222222222222', 20, 67, NULL, TRUE, FALSE, 'maximum', '67 ou mais', 1),
('22222222-2222-2222-2222-222222222222', 19, 61, 66, TRUE, TRUE, 'passing', '61 a 66', 2),
('22222222-2222-2222-2222-222222222222', 18, 56, 60, TRUE, TRUE, 'passing', '56 a 60', 3),
('22222222-2222-2222-2222-222222222222', 17, 51, 55, TRUE, TRUE, 'passing', '51 a 55', 4),
('22222222-2222-2222-2222-222222222222', 16, 49, 50, TRUE, TRUE, 'passing', '49 a 50', 5),
('22222222-2222-2222-2222-222222222222', 15, 47, 48, TRUE, TRUE, 'passing', '47 a 48', 6),
('22222222-2222-2222-2222-222222222222', 14, 46, 46, TRUE, TRUE, 'passing', '46', 7),
('22222222-2222-2222-2222-222222222222', 13, 42, 45, TRUE, TRUE, 'passing', '42 a 45', 8),
('22222222-2222-2222-2222-222222222222', 12, 40, 41, TRUE, TRUE, 'passing', '40 a 41', 9),
('22222222-2222-2222-2222-222222222222', 0, NULL, 39, FALSE, TRUE, 'below_minimum', 'Abaixo do mínimo', 10)
ON CONFLICT (taf_test_id, score, sort_order) DO NOTHING;

-- ============================================
-- Score Ranges — Barra Fixa Dinâmica (higher_is_better, repetitions)
-- ============================================

INSERT INTO taf_score_ranges (taf_test_id, score, minimum_value, maximum_value, minimum_inclusive, maximum_inclusive, result_status, display_label, sort_order) VALUES
('33333333-3333-3333-3333-333333333333', 20, 15, NULL, TRUE, FALSE, 'maximum', '15 ou mais repetições', 1),
('33333333-3333-3333-3333-333333333333', 19, 12, 14, TRUE, TRUE, 'passing', '12 a 14 repetições', 2),
('33333333-3333-3333-3333-333333333333', 18, 11, 11, TRUE, TRUE, 'passing', '11 repetições', 3),
('33333333-3333-3333-3333-333333333333', 17, 10, 10, TRUE, TRUE, 'passing', '10 repetições', 4),
('33333333-3333-3333-3333-333333333333', 16, 9, 9, TRUE, TRUE, 'passing', '9 repetições', 5),
('33333333-3333-3333-3333-333333333333', 15, 8, 8, TRUE, TRUE, 'passing', '8 repetições', 6),
('33333333-3333-3333-3333-333333333333', 14, 6, 7, TRUE, TRUE, 'passing', '6 a 7 repetições', 7),
('33333333-3333-3333-3333-333333333333', 13, 4, 5, TRUE, TRUE, 'passing', '4 a 5 repetições', 8),
('33333333-3333-3333-3333-333333333333', 12, 3, 3, TRUE, TRUE, 'passing', '3 repetições', 9),
('33333333-3333-3333-3333-333333333333', 0, NULL, 2, FALSE, TRUE, 'below_minimum', 'Abaixo do mínimo', 10)
ON CONFLICT (taf_test_id, score, sort_order) DO NOTHING;

-- ============================================
-- Score Ranges — Shuttle Run (lower_is_better, seconds)
-- ============================================

INSERT INTO taf_score_ranges (taf_test_id, score, minimum_value, maximum_value, minimum_inclusive, maximum_inclusive, result_status, display_label, sort_order) VALUES
('44444444-4444-4444-4444-444444444444', 20, NULL, 8.88, FALSE, TRUE, 'maximum', 'até 8,88s', 1),
('44444444-4444-4444-4444-444444444444', 19, 8.89, 9.16, TRUE, TRUE, 'passing', '8,89s a 9,16s', 2),
('44444444-4444-4444-4444-444444444444', 18, 9.17, 9.42, TRUE, TRUE, 'passing', '9,17s a 9,42s', 3),
('44444444-4444-4444-4444-444444444444', 17, 9.43, 9.69, TRUE, TRUE, 'passing', '9,43s a 9,69s', 4),
('44444444-4444-4444-4444-444444444444', 16, 9.70, 9.88, TRUE, TRUE, 'passing', '9,70s a 9,88s', 5),
('44444444-4444-4444-4444-444444444444', 15, 9.89, 10.11, TRUE, TRUE, 'passing', '9,89s a 10,11s', 6),
('44444444-4444-4444-4444-444444444444', 14, 10.12, 10.35, TRUE, TRUE, 'passing', '10,12s a 10,35s', 7),
('44444444-4444-4444-4444-444444444444', 13, 10.36, 10.64, TRUE, TRUE, 'passing', '10,36s a 10,64s', 8),
('44444444-4444-4444-4444-444444444444', 12, 10.65, 10.84, TRUE, TRUE, 'passing', '10,65s a 10,84s', 9),
('44444444-4444-4444-4444-444444444444', 0, 10.85, NULL, TRUE, FALSE, 'below_minimum', 'Abaixo do mínimo', 10)
ON CONFLICT (taf_test_id, score, sort_order) DO NOTHING;

-- ============================================
-- Score Ranges — Natação 50m (lower_is_better, seconds)
-- ============================================

INSERT INTO taf_score_ranges (taf_test_id, score, minimum_value, maximum_value, minimum_inclusive, maximum_inclusive, result_status, display_label, sort_order) VALUES
('55555555-5555-5555-5555-555555555555', 20, NULL, 29, FALSE, TRUE, 'maximum', 'até 29s', 1),
('55555555-5555-5555-5555-555555555555', 19, 30, 32, TRUE, TRUE, 'passing', '30s a 32s', 2),
('55555555-5555-5555-5555-555555555555', 18, 33, 36, TRUE, TRUE, 'passing', '33s a 36s', 3),
('55555555-5555-5555-5555-555555555555', 17, 37, 40, TRUE, TRUE, 'passing', '37s a 40s', 4),
('55555555-5555-5555-5555-555555555555', 16, 41, 43, TRUE, TRUE, 'passing', '41s a 43s', 5),
('55555555-5555-5555-5555-555555555555', 15, 44, 47, TRUE, TRUE, 'passing', '44s a 47s', 6),
('55555555-5555-5555-5555-555555555555', 14, 48, 50, TRUE, TRUE, 'passing', '48s a 50s', 7),
('55555555-5555-5555-5555-555555555555', 13, 51, 54, TRUE, TRUE, 'passing', '51s a 54s', 8),
('55555555-5555-5555-5555-555555555555', 12, 55, 58, TRUE, TRUE, 'passing', '55s a 58s', 9),
('55555555-5555-5555-5555-555555555555', 0, 59, NULL, TRUE, FALSE, 'below_minimum', 'Abaixo do mínimo', 10)
ON CONFLICT (taf_test_id, score, sort_order) DO NOTHING;

-- ============================================
-- Achievements
-- ============================================

INSERT INTO achievements (slug, title, description, icon, xp_reward, criteria_json) VALUES
('first_training', 'Primeiro Treino', 'Registrou seu primeiro treino na plataforma.', 'Flame', 50, '{"type": "session_count", "count": 1}'),
('first_pull_up', 'Primeira Barra', 'Completou a primeira repetição válida na barra fixa.', 'ArrowUpFromLine', 75, '{"type": "test_value", "test": "pull_up_dynamic", "minValue": 1}'),
('ten_sessions', 'Dez Treinos', 'Completou 10 sessões de treino.', 'Award', 100, '{"type": "session_count", "count": 10}'),
('min_abdominal', 'Índice Mínimo — Abdominal', 'Alcançou o índice mínimo no abdominal (40+ repetições).', 'Target', 150, '{"type": "test_score", "test": "abdominal_60s", "minScore": 12}'),
('min_running', 'Índice Mínimo — Corrida', 'Alcançou o índice mínimo na corrida de 2.400m.', 'Timer', 150, '{"type": "test_score", "test": "running_2400m", "minScore": 12}'),
('min_pull_up', 'Índice Mínimo — Barra', 'Alcançou o índice mínimo na barra fixa (3+ repetições).', 'ArrowUpFromLine', 150, '{"type": "test_score", "test": "pull_up_dynamic", "minScore": 12}'),
('min_shuttle', 'Índice Mínimo — Shuttle Run', 'Alcançou o índice mínimo no Shuttle Run.', 'Zap', 150, '{"type": "test_score", "test": "shuttle_run", "minScore": 12}'),
('min_swimming', 'Índice Mínimo — Natação', 'Alcançou o índice mínimo na natação de 50m.', 'Waves', 150, '{"type": "test_score", "test": "swimming_50m", "minScore": 12}'),
('min_all_tests', 'Índice Mínimo em Todas', 'Alcançou o índice mínimo em todas as cinco provas.', 'Shield', 300, '{"type": "all_tests_passing"}'),
('first_simulation', 'Primeiro Simulado', 'Completou o primeiro simulado oficial do TAF.', 'ClipboardCheck', 200, '{"type": "simulation_count", "count": 1}'),
('three_simulations', 'Três Simulados', 'Completou três simulados oficiais.', 'ClipboardList', 250, '{"type": "simulation_count", "count": 3}'),
('new_personal_record', 'Nova Melhor Marca', 'Estabeleceu um novo recorde pessoal em qualquer prova.', 'Trophy', 75, '{"type": "personal_record"}'),
('consistent_week', 'Semana Consistente', 'Completou todos os treinos planejados de uma semana.', 'Calendar', 150, '{"type": "weekly_adherence", "minPercentage": 100}'),
('score_40', 'Pontuação 40', 'Alcançou 40 pontos ou mais na nota final simulada do TCF.', 'Star', 400, '{"type": "final_score", "minScore": 40}'),
('max_score', 'Pontuação Máxima', 'Alcançou 50 pontos — a pontuação máxima simulada do TCF.', 'Crown', 500, '{"type": "final_score", "minScore": 50}'),
('twenty_five_sessions', '25 Treinos', 'Completou 25 sessões de treino.', 'Medal', 200, '{"type": "session_count", "count": 25}'),
('fifty_sessions', '50 Treinos', 'Completou 50 sessões de treino. Meio centurião!', 'Swords', 300, '{"type": "session_count", "count": 50}'),
('hundred_sessions', '100 Treinos', 'Completou 100 sessões de treino. Dedicação exemplar!', 'BadgeCheck', 500, '{"type": "session_count", "count": 100}')
ON CONFLICT (slug) DO NOTHING;
