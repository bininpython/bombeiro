// =============================================================================
// Canhoto — Rumo à Farda
// Scoring Engine — Pure functions for calculating TAF scores
//
// This module contains NO side effects, NO database calls, NO UI logic.
// All functions are deterministic and fully testable.
// =============================================================================

import type {
  TafTestType,
  ScoringResult,
  FinalScoreResult,
  ScoreRange,
  OverallStatus,
} from './types';

import {
  TAF_TESTS,
  TAF_TEST_ORDER,
  MINIMUM_PASSING_SCORE,
  MAXIMUM_TEST_SCORE,
  TOTAL_TESTS,
} from './constants';

// =============================================================================
// calculateOfficialScore
//
// Given a test type and raw value, returns the official score and all
// related metadata (status, next range, differences, etc.)
// =============================================================================

export function calculateOfficialScore(
  testType: TafTestType,
  rawValue: number | null | undefined,
): ScoringResult {
  const config = TAF_TESTS[testType];
  if (!config) {
    throw new Error(`Unknown test type: ${testType}`);
  }

  // Handle null/undefined/NaN
  if (rawValue === null || rawValue === undefined || isNaN(rawValue)) {
    return createBelowMinimumResult(testType, 0);
  }

  // Handle negative values
  if (rawValue < 0) {
    return createBelowMinimumResult(testType, rawValue);
  }

  const { scoreRanges, direction } = config;

  // Find which range the value falls into
  let matchedRange: ScoreRange | null = null;
  let matchedIndex = -1;

  for (let i = 0; i < scoreRanges.length; i++) {
    const range = scoreRanges[i]!;
    if (valueInRange(rawValue, range, direction)) {
      matchedRange = range;
      matchedIndex = i;
      break;
    }
  }

  // If no range matched, it's below minimum
  if (!matchedRange) {
    return createBelowMinimumResult(testType, rawValue);
  }

  // Find next range (the one with a higher score)
  // scoreRanges is ordered from highest score to lowest,
  // so the "next range up" is at index - 1
  const nextRange = matchedIndex > 0 ? scoreRanges[matchedIndex - 1]! : null;

  // Calculate differences
  const minimumValue = getMinimumPassingValue(config.scoreRanges, direction);
  const maximumValue = getMaximumScoreValue(config.scoreRanges, direction);

  const differenceToMinimum = calculateDifference(rawValue, minimumValue, direction);
  const differenceToNextScore = nextRange
    ? calculateDifferenceToRange(rawValue, nextRange, direction)
    : null;
  const differenceToMaximum = calculateDifference(rawValue, maximumValue, direction);

  return {
    testType,
    rawValue,
    score: matchedRange.score,
    passing: matchedRange.score >= MINIMUM_PASSING_SCORE,
    status: matchedRange.status,
    currentRange: matchedRange,
    nextRange: nextRange && nextRange.score > matchedRange.score ? nextRange : null,
    differenceToMinimum,
    differenceToNextScore,
    differenceToMaximum,
  };
}

// =============================================================================
// calculateFinalTafScore
//
// Given results for all 5 tests, calculates the official final TAF score.
// Formula: ((sum of scores) / 5) * 2.5
// A candidate only passes if ALL tests have score >= 12.
// =============================================================================

export function calculateFinalTafScore(
  results: Array<{ testType: TafTestType; rawValue: number }>,
): FinalScoreResult {
  // Score each test
  const testResults = TAF_TEST_ORDER.map((testType) => {
    const result = results.find((r) => r.testType === testType);
    return calculateOfficialScore(testType, result?.rawValue ?? null);
  });

  const rawScoreSum = testResults.reduce((sum, r) => sum + r.score, 0);
  const averageScore = rawScoreSum / TOTAL_TESTS;
  const finalScore = averageScore * 2.5;

  const testsPassing = testResults.filter((r) => r.passing).length;
  const testsBelowMinimum = TOTAL_TESTS - testsPassing;
  const allTestsPassing = testsBelowMinimum === 0;

  // Find weakest and strongest
  const weakestTest = findWeakestTest(testResults);
  const strongestTest = findStrongestTest(testResults);

  // Determine overall status
  const overallStatus = determineOverallStatus(testResults, allTestsPassing);

  return {
    testResults,
    rawScoreSum,
    averageScore: Math.round(averageScore * 100) / 100,
    finalScore: Math.round(finalScore * 100) / 100,
    allTestsPassing,
    testsPassing,
    testsBelowMinimum,
    weakestTest,
    strongestTest,
    overallStatus,
  };
}

// =============================================================================
// findWeakestTest — finds the test with the lowest score
// =============================================================================

export function findWeakestTest(results: ScoringResult[]): TafTestType | null {
  if (results.length === 0) return null;

  let weakest = results[0]!;
  for (let i = 1; i < results.length; i++) {
    const current = results[i]!;
    // Below minimum is worse than any passing score
    if (current.score < weakest.score) {
      weakest = current;
    } else if (current.score === weakest.score) {
      // Tiebreaker: the one that is farther from the next range
      if (
        current.differenceToNextScore !== null &&
        weakest.differenceToNextScore !== null
      ) {
        if (Math.abs(current.differenceToNextScore) > Math.abs(weakest.differenceToNextScore)) {
          weakest = current;
        }
      }
    }
  }

  return weakest.testType;
}

// =============================================================================
// findStrongestTest — finds the test with the highest score
// =============================================================================

export function findStrongestTest(results: ScoringResult[]): TafTestType | null {
  if (results.length === 0) return null;

  let strongest = results[0]!;
  for (let i = 1; i < results.length; i++) {
    const current = results[i]!;
    if (current.score > strongest.score) {
      strongest = current;
    }
  }

  return strongest.testType;
}

// =============================================================================
// determineOverallStatus
// =============================================================================

export function determineOverallStatus(
  results: ScoringResult[],
  allPassing: boolean,
): OverallStatus {
  if (results.length === 0) return 'start_of_journey';

  const passingCount = results.filter((r) => r.passing).length;
  const avgScore = results.reduce((s, r) => s + r.score, 0) / results.length;
  const allMaximum = results.every((r) => r.score === MAXIMUM_TEST_SCORE);

  if (allMaximum) return 'maximum_performance';
  if (allPassing && avgScore >= 16) return 'passing_all';
  if (allPassing && avgScore >= 14) return 'ready_for_simulation';
  if (allPassing && avgScore >= 13) return 'safety_margin';
  if (allPassing) return 'minimum_reached';

  // Not all passing
  if (passingCount >= 3) return 'near_minimum';
  if (passingCount >= 1) return 'building_base';

  return 'start_of_journey';
}

// =============================================================================
// Status label mapping (Portuguese)
// =============================================================================

export const STATUS_LABELS: Record<OverallStatus, string> = {
  start_of_journey: 'Início da Jornada',
  building_base: 'Construindo a Base',
  near_minimum: 'Próximo do Índice Mínimo',
  minimum_reached: 'Índice Mínimo Alcançado',
  safety_margin: 'Criando Margem de Segurança',
  ready_for_simulation: 'Pronto para o Simulado',
  passing_all: 'Apto pelos Índices',
  maximum_performance: 'Desempenho Máximo',
};

// =============================================================================
// Internal Helper Functions
// =============================================================================

function createBelowMinimumResult(testType: TafTestType, rawValue: number): ScoringResult {
  const config = TAF_TESTS[testType]!;
  const belowRange = config.scoreRanges.find((r) => r.status === 'below_minimum') ?? null;
  const minimumRange = config.scoreRanges.find((r) => r.score === MINIMUM_PASSING_SCORE) ?? null;
  const maximumValue = getMaximumScoreValue(config.scoreRanges, config.direction);
  const minimumValue = getMinimumPassingValue(config.scoreRanges, config.direction);

  return {
    testType,
    rawValue,
    score: 0,
    passing: false,
    status: 'below_minimum',
    currentRange: belowRange,
    nextRange: minimumRange,
    differenceToMinimum: calculateDifference(rawValue, minimumValue, config.direction),
    differenceToNextScore: minimumRange
      ? calculateDifferenceToRange(rawValue, minimumRange, config.direction)
      : null,
    differenceToMaximum: calculateDifference(rawValue, maximumValue, config.direction),
  };
}

/**
 * Check if a raw value falls within a scoring range.
 *
 * For higher_is_better tests (reps):
 *   - The value must be >= minValue (if defined) and <= maxValue (if defined)
 *
 * For lower_is_better tests (time):
 *   - The value must be >= minValue (if defined) and <= maxValue (if defined)
 *   - BUT the ranges are ordered so that the LOWEST times get the HIGHEST scores
 */
function valueInRange(
  value: number,
  range: ScoreRange,
  _direction: string,
): boolean {
  // Check minimum bound
  if (range.minValue !== null) {
    if (range.minInclusive) {
      if (value < range.minValue) return false;
    } else {
      if (value <= range.minValue) return false;
    }
  }

  // Check maximum bound
  if (range.maxValue !== null) {
    if (range.maxInclusive) {
      if (value > range.maxValue) return false;
    } else {
      if (value >= range.maxValue) return false;
    }
  }

  return true;
}

/**
 * Get the minimum raw value required for minimum passing score.
 * For higher_is_better: the minValue of the 12-point range
 * For lower_is_better: the maxValue of the 12-point range
 */
function getMinimumPassingValue(ranges: ScoreRange[], direction: string): number {
  const minRange = ranges.find((r) => r.score === MINIMUM_PASSING_SCORE);
  if (!minRange) return 0;

  if (direction === 'higher_is_better') {
    return minRange.minValue ?? 0;
  } else {
    return minRange.maxValue ?? 0;
  }
}

/**
 * Get the raw value required for maximum score.
 * For higher_is_better: the minValue of the 20-point range
 * For lower_is_better: the maxValue of the 20-point range
 */
function getMaximumScoreValue(ranges: ScoreRange[], direction: string): number {
  const maxRange = ranges.find((r) => r.score === MAXIMUM_TEST_SCORE);
  if (!maxRange) return 0;

  if (direction === 'higher_is_better') {
    return maxRange.minValue ?? 0;
  } else {
    return maxRange.maxValue ?? 0;
  }
}

/**
 * Calculate the difference between current value and target value.
 * Returns positive value when improvement is needed, negative when already past.
 *
 * For higher_is_better: target - current (positive means need more reps)
 * For lower_is_better: current - target (positive means need less time)
 */
function calculateDifference(
  currentValue: number,
  targetValue: number,
  direction: string,
): number {
  if (direction === 'higher_is_better') {
    return Math.round((targetValue - currentValue) * 100) / 100;
  } else {
    return Math.round((currentValue - targetValue) * 100) / 100;
  }
}

/**
 * Calculate difference to reach a specific scoring range.
 */
function calculateDifferenceToRange(
  currentValue: number,
  range: ScoreRange,
  direction: string,
): number {
  if (direction === 'higher_is_better') {
    // Need to reach the minimum value of the target range
    const target = range.minValue ?? 0;
    return Math.round((target - currentValue) * 100) / 100;
  } else {
    // Need to reach the maximum value of the target range (lower is better)
    const target = range.maxValue ?? 0;
    return Math.round((currentValue - target) * 100) / 100;
  }
}
