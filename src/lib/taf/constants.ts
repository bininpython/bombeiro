// =============================================================================
// Canhoto — Rumo à Farda
// TAF Score Ranges & Constants — CBMMG CFSd BM 2027 (Edital nº 10/2026)
//
// IMPORTANT: These tables EXACTLY match the official edital values.
// Do NOT modify without cross-referencing the edital and any retifications.
// All time-based values are stored in SECONDS (with decimals for centiseconds).
// =============================================================================

import type { TafTestConfig, ScoreRange } from './types';

// =============================================================================
// Score Ranges — Pull Up (Barra Fixa Dinâmica)
// Unit: repetitions — Higher is better
// =============================================================================

const PULL_UP_RANGES: ScoreRange[] = [
  { score: 20, minValue: 15, maxValue: null, minInclusive: true, maxInclusive: false, status: 'maximum', displayLabel: '15 ou mais repetições' },
  { score: 19, minValue: 12, maxValue: 14, minInclusive: true, maxInclusive: true, status: 'passing', displayLabel: '12 a 14 repetições' },
  { score: 18, minValue: 11, maxValue: 11, minInclusive: true, maxInclusive: true, status: 'passing', displayLabel: '11 repetições' },
  { score: 17, minValue: 10, maxValue: 10, minInclusive: true, maxInclusive: true, status: 'passing', displayLabel: '10 repetições' },
  { score: 16, minValue: 9, maxValue: 9, minInclusive: true, maxInclusive: true, status: 'passing', displayLabel: '9 repetições' },
  { score: 15, minValue: 8, maxValue: 8, minInclusive: true, maxInclusive: true, status: 'passing', displayLabel: '8 repetições' },
  { score: 14, minValue: 6, maxValue: 7, minInclusive: true, maxInclusive: true, status: 'passing', displayLabel: '6 a 7 repetições' },
  { score: 13, minValue: 4, maxValue: 5, minInclusive: true, maxInclusive: true, status: 'passing', displayLabel: '4 a 5 repetições' },
  { score: 12, minValue: 3, maxValue: 3, minInclusive: true, maxInclusive: true, status: 'passing', displayLabel: '3 repetições' },
  { score: 0, minValue: null, maxValue: 2, minInclusive: false, maxInclusive: true, status: 'below_minimum', displayLabel: 'Abaixo do mínimo' },
];

// =============================================================================
// Score Ranges — Abdominal (60 seconds)
// Unit: repetitions — Higher is better
// =============================================================================

const ABDOMINAL_RANGES: ScoreRange[] = [
  { score: 20, minValue: 67, maxValue: null, minInclusive: true, maxInclusive: false, status: 'maximum', displayLabel: '67 ou mais' },
  { score: 19, minValue: 61, maxValue: 66, minInclusive: true, maxInclusive: true, status: 'passing', displayLabel: '61 a 66' },
  { score: 18, minValue: 56, maxValue: 60, minInclusive: true, maxInclusive: true, status: 'passing', displayLabel: '56 a 60' },
  { score: 17, minValue: 51, maxValue: 55, minInclusive: true, maxInclusive: true, status: 'passing', displayLabel: '51 a 55' },
  { score: 16, minValue: 49, maxValue: 50, minInclusive: true, maxInclusive: true, status: 'passing', displayLabel: '49 a 50' },
  { score: 15, minValue: 47, maxValue: 48, minInclusive: true, maxInclusive: true, status: 'passing', displayLabel: '47 a 48' },
  { score: 14, minValue: 46, maxValue: 46, minInclusive: true, maxInclusive: true, status: 'passing', displayLabel: '46' },
  { score: 13, minValue: 42, maxValue: 45, minInclusive: true, maxInclusive: true, status: 'passing', displayLabel: '42 a 45' },
  { score: 12, minValue: 40, maxValue: 41, minInclusive: true, maxInclusive: true, status: 'passing', displayLabel: '40 a 41' },
  { score: 0, minValue: null, maxValue: 39, minInclusive: false, maxInclusive: true, status: 'below_minimum', displayLabel: 'Abaixo do mínimo' },
];

// =============================================================================
// Score Ranges — Shuttle Run
// Unit: seconds (with centiseconds) — Lower is better
// =============================================================================

const SHUTTLE_RUN_RANGES: ScoreRange[] = [
  { score: 20, minValue: null, maxValue: 8.88, minInclusive: false, maxInclusive: true, status: 'maximum', displayLabel: 'até 8,88s' },
  { score: 19, minValue: 8.89, maxValue: 9.16, minInclusive: true, maxInclusive: true, status: 'passing', displayLabel: '8,89s a 9,16s' },
  { score: 18, minValue: 9.17, maxValue: 9.42, minInclusive: true, maxInclusive: true, status: 'passing', displayLabel: '9,17s a 9,42s' },
  { score: 17, minValue: 9.43, maxValue: 9.69, minInclusive: true, maxInclusive: true, status: 'passing', displayLabel: '9,43s a 9,69s' },
  { score: 16, minValue: 9.70, maxValue: 9.88, minInclusive: true, maxInclusive: true, status: 'passing', displayLabel: '9,70s a 9,88s' },
  { score: 15, minValue: 9.89, maxValue: 10.11, minInclusive: true, maxInclusive: true, status: 'passing', displayLabel: '9,89s a 10,11s' },
  { score: 14, minValue: 10.12, maxValue: 10.35, minInclusive: true, maxInclusive: true, status: 'passing', displayLabel: '10,12s a 10,35s' },
  { score: 13, minValue: 10.36, maxValue: 10.64, minInclusive: true, maxInclusive: true, status: 'passing', displayLabel: '10,36s a 10,64s' },
  { score: 12, minValue: 10.65, maxValue: 10.84, minInclusive: true, maxInclusive: true, status: 'passing', displayLabel: '10,65s a 10,84s' },
  { score: 0, minValue: 10.85, maxValue: null, minInclusive: true, maxInclusive: false, status: 'below_minimum', displayLabel: 'Abaixo do mínimo' },
];

// =============================================================================
// Score Ranges — Running 2400m
// Unit: seconds — Lower is better
// Edital values are in MM:SS format. We store as total seconds.
//   8min44s  = 524s
//   8min45s  = 525s
//   9min14s  = 554s
//   9min15s  = 555s
//   9min45s  = 585s
//   9min46s  = 586s
//   10min15s = 615s
//   10min16s = 616s
//   10min45s = 645s
//   10min46s = 646s
//   11min15s = 675s
//   11min16s = 676s
//   11min45s = 705s
//   11min46s = 706s
//   12min16s = 736s
//   12min17s = 737s
//   12min45s = 765s
//   12min46s = 766s
// =============================================================================

const RUNNING_RANGES: ScoreRange[] = [
  { score: 20, minValue: null, maxValue: 524, minInclusive: false, maxInclusive: true, status: 'maximum', displayLabel: 'até 8min44s' },
  { score: 19, minValue: 525, maxValue: 554, minInclusive: true, maxInclusive: true, status: 'passing', displayLabel: '8min45s a 9min14s' },
  { score: 18, minValue: 555, maxValue: 585, minInclusive: true, maxInclusive: true, status: 'passing', displayLabel: '9min15s a 9min45s' },
  { score: 17, minValue: 586, maxValue: 615, minInclusive: true, maxInclusive: true, status: 'passing', displayLabel: '9min46s a 10min15s' },
  { score: 16, minValue: 616, maxValue: 645, minInclusive: true, maxInclusive: true, status: 'passing', displayLabel: '10min16s a 10min45s' },
  { score: 15, minValue: 646, maxValue: 675, minInclusive: true, maxInclusive: true, status: 'passing', displayLabel: '10min46s a 11min15s' },
  { score: 14, minValue: 676, maxValue: 705, minInclusive: true, maxInclusive: true, status: 'passing', displayLabel: '11min16s a 11min45s' },
  { score: 13, minValue: 706, maxValue: 736, minInclusive: true, maxInclusive: true, status: 'passing', displayLabel: '11min46s a 12min16s' },
  { score: 12, minValue: 737, maxValue: 765, minInclusive: true, maxInclusive: true, status: 'passing', displayLabel: '12min17s a 12min45s' },
  { score: 0, minValue: 766, maxValue: null, minInclusive: true, maxInclusive: false, status: 'below_minimum', displayLabel: 'Abaixo do mínimo' },
];

// =============================================================================
// Score Ranges — Swimming 50m
// Unit: seconds — Lower is better
// =============================================================================

const SWIMMING_RANGES: ScoreRange[] = [
  { score: 20, minValue: null, maxValue: 29, minInclusive: false, maxInclusive: true, status: 'maximum', displayLabel: 'até 29s' },
  { score: 19, minValue: 30, maxValue: 32, minInclusive: true, maxInclusive: true, status: 'passing', displayLabel: '30s a 32s' },
  { score: 18, minValue: 33, maxValue: 36, minInclusive: true, maxInclusive: true, status: 'passing', displayLabel: '33s a 36s' },
  { score: 17, minValue: 37, maxValue: 40, minInclusive: true, maxInclusive: true, status: 'passing', displayLabel: '37s a 40s' },
  { score: 16, minValue: 41, maxValue: 43, minInclusive: true, maxInclusive: true, status: 'passing', displayLabel: '41s a 43s' },
  { score: 15, minValue: 44, maxValue: 47, minInclusive: true, maxInclusive: true, status: 'passing', displayLabel: '44s a 47s' },
  { score: 14, minValue: 48, maxValue: 50, minInclusive: true, maxInclusive: true, status: 'passing', displayLabel: '48s a 50s' },
  { score: 13, minValue: 51, maxValue: 54, minInclusive: true, maxInclusive: true, status: 'passing', displayLabel: '51s a 54s' },
  { score: 12, minValue: 55, maxValue: 58, minInclusive: true, maxInclusive: true, status: 'passing', displayLabel: '55s a 58s' },
  { score: 0, minValue: 59, maxValue: null, minInclusive: true, maxInclusive: false, status: 'below_minimum', displayLabel: 'Abaixo do mínimo' },
];

// =============================================================================
// Test Configurations
// =============================================================================

export const TAF_TESTS: Record<string, TafTestConfig> = {
  running_2400m: {
    slug: 'running_2400m',
    name: 'Corrida de 2.400 metros',
    shortName: 'Corrida',
    category: 'Resistência Aeróbica',
    unit: 'seconds',
    direction: 'lower_is_better',
    officialOrder: 1,
    minimumScore: 12,
    maximumScore: 20,
    icon: 'Timer',
    scoreRanges: RUNNING_RANGES,
  },
  abdominal_60s: {
    slug: 'abdominal_60s',
    name: 'Flexão Abdominal em 60 segundos',
    shortName: 'Abdominal',
    category: 'Flexão Abdominal',
    unit: 'repetitions',
    direction: 'higher_is_better',
    officialOrder: 2,
    minimumScore: 12,
    maximumScore: 20,
    icon: 'Dumbbell',
    scoreRanges: ABDOMINAL_RANGES,
  },
  pull_up_dynamic: {
    slug: 'pull_up_dynamic',
    name: 'Barra Fixa Dinâmica',
    shortName: 'Barra',
    category: 'Força de Membros Superiores',
    unit: 'repetitions',
    direction: 'higher_is_better',
    officialOrder: 3,
    minimumScore: 12,
    maximumScore: 20,
    icon: 'ArrowUpFromLine',
    scoreRanges: PULL_UP_RANGES,
  },
  shuttle_run: {
    slug: 'shuttle_run',
    name: 'Shuttle Run',
    shortName: 'Shuttle Run',
    category: 'Agilidade',
    unit: 'seconds',
    direction: 'lower_is_better',
    officialOrder: 4,
    minimumScore: 12,
    maximumScore: 20,
    icon: 'Zap',
    scoreRanges: SHUTTLE_RUN_RANGES,
  },
  swimming_50m: {
    slug: 'swimming_50m',
    name: 'Natação de 50 metros',
    shortName: 'Natação',
    category: 'Habilidade Natatória',
    unit: 'seconds',
    direction: 'lower_is_better',
    officialOrder: 5,
    minimumScore: 12,
    maximumScore: 20,
    icon: 'Waves',
    scoreRanges: SWIMMING_RANGES,
  },
};

/** Ordered list of test slugs in official TAF order */
export const TAF_TEST_ORDER: TafTestType[] = [
  'running_2400m',
  'abdominal_60s',
  'pull_up_dynamic',
  'shuttle_run',
  'swimming_50m',
];

/** Edition information */
export const CURRENT_EDITION = {
  name: 'CBMMG — CFSd BM 2027 — Edital nº 10/2026',
  organization: 'Corpo de Bombeiros Militar de Minas Gerais',
  editalNumber: '10/2026',
  year: 2027,
  audience: 'masculine',
};

/** Minimum score required to pass each test */
export const MINIMUM_PASSING_SCORE = 12;

/** Maximum score for each test */
export const MAXIMUM_TEST_SCORE = 20;

/** Number of tests */
export const TOTAL_TESTS = 5;

/** Maximum raw score sum (5 * 20) */
export const MAXIMUM_RAW_SUM = TOTAL_TESTS * MAXIMUM_TEST_SCORE;

/** Maximum final score: (100 / 5) * 2.5 = 50 */
export const MAXIMUM_FINAL_SCORE = 50;

// =============================================================================
// Helper: get the minimum raw value required for minimum passing score (12)
// =============================================================================

export function getMinimumValueForTest(testType: string): number {
  const config = TAF_TESTS[testType];
  if (!config) throw new Error(`Unknown test type: ${testType}`);

  const minRange = config.scoreRanges.find((r) => r.score === MINIMUM_PASSING_SCORE);
  if (!minRange) throw new Error(`No minimum range found for test: ${testType}`);

  if (config.direction === 'higher_is_better') {
    // For reps, the minimum value of the 12-point range
    return minRange.minValue ?? 0;
  } else {
    // For time, the maximum value of the 12-point range (higher time = worse)
    return minRange.maxValue ?? 0;
  }
}

// =============================================================================
// Helper: get the value required for maximum score (20)
// =============================================================================

export function getMaximumValueForTest(testType: string): number {
  const config = TAF_TESTS[testType];
  if (!config) throw new Error(`Unknown test type: ${testType}`);

  const maxRange = config.scoreRanges.find((r) => r.score === MAXIMUM_TEST_SCORE);
  if (!maxRange) throw new Error(`No maximum range found for test: ${testType}`);

  if (config.direction === 'higher_is_better') {
    // For reps, the minimum value of the 20-point range
    return maxRange.minValue ?? 0;
  } else {
    // For time, the maximum value of the 20-point range (lower time = better)
    return maxRange.maxValue ?? 0;
  }
}

// =============================================================================
// Gamification Constants
// =============================================================================

export const RANKS: Array<{ slug: string; name: string; minXp: number; level: number }> = [
  { slug: 'recruta_da_jornada', name: 'Recruta da Jornada', minXp: 0, level: 1 },
  { slug: 'base_em_construcao', name: 'Base em Construção', minXp: 500, level: 2 },
  { slug: 'ritmo_de_combate', name: 'Ritmo de Combate', minXp: 1500, level: 3 },
  { slug: 'indice_alcancado', name: 'Índice Alcançado', minXp: 3500, level: 4 },
  { slug: 'margem_de_seguranca', name: 'Margem de Segurança', minXp: 6000, level: 5 },
  { slug: 'pronto_para_o_desafio', name: 'Pronto para o Desafio', minXp: 10000, level: 6 },
  { slug: 'rumo_a_farda', name: 'Rumo à Farda', minXp: 15000, level: 7 },
];

export const XP_REWARDS = {
  register_training: 25,
  complete_planned: 40,
  new_record: 75,
  new_score_range: 100,
  complete_week: 150,
  complete_simulation: 200,
  consistency_streak: 50,
  planned_recovery: 15,
};
