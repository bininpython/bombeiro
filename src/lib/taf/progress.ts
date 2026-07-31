// =============================================================================
// Canhoto — Rumo à Farda
// Progress & Readiness Calculations
// =============================================================================

import type {
  TafTestType,
  ProgressResult,
  TrendType,
  ConsistencyStatus,
  TrainingResultEntry,
  Milestone,
  MilestoneStatus,
} from './types';

import {
  TAF_TESTS,
  getMinimumValueForTest,
  getMaximumValueForTest,
  MINIMUM_PASSING_SCORE,
} from './constants';
import { calculateOfficialScore } from './scoring';

// =============================================================================
// calculateProgressToMinimum
//
// How close is the user to the minimum passing value?
// Returns 0-100+ (can exceed 100 if already past minimum).
// =============================================================================

export function calculateProgressToMinimum(
  testType: TafTestType,
  currentValue: number | null,
): number {
  if (currentValue === null || currentValue === undefined || isNaN(currentValue)) {
    return 0;
  }

  const config = TAF_TESTS[testType];
  if (!config) return 0;

  const minimumValue = getMinimumValueForTest(testType);

  if (config.direction === 'higher_is_better') {
    // For reps: progress = current / minimum * 100
    if (minimumValue === 0) return 100;
    return Math.round((currentValue / minimumValue) * 100);
  } else {
    // For time (lower is better): we need to figure out starting point
    // Progress = how much of the gap from "very bad" to minimum has been covered
    // Use the below_minimum threshold as starting reference
    const belowRange = config.scoreRanges.find((r) => r.status === 'below_minimum');
    const worstReasonable = belowRange?.minValue ?? belowRange?.maxValue ?? minimumValue * 1.5;
    const startValue = typeof worstReasonable === 'number' ? worstReasonable : minimumValue * 1.5;

    if (currentValue <= minimumValue) return 100;
    if (currentValue >= startValue) return 0;

    const totalRange = startValue - minimumValue;
    if (totalRange === 0) return 100;

    const covered = startValue - currentValue;
    return Math.round((covered / totalRange) * 100);
  }
}

// =============================================================================
// calculateProgressToTarget
//
// How close is the user to their personal target score?
// =============================================================================

export function calculateProgressToTarget(
  testType: TafTestType,
  currentValue: number | null,
  targetValue: number,
): number {
  if (currentValue === null || currentValue === undefined || isNaN(currentValue)) {
    return 0;
  }

  const config = TAF_TESTS[testType];
  if (!config) return 0;

  if (config.direction === 'higher_is_better') {
    if (targetValue === 0) return 100;
    return Math.min(100, Math.round((currentValue / targetValue) * 100));
  } else {
    // For time: lower is better
    if (currentValue <= targetValue) return 100;
    // Use a reasonable starting point
    const startValue = targetValue * 1.5;
    if (currentValue >= startValue) return 0;

    const totalRange = startValue - targetValue;
    if (totalRange === 0) return 100;

    const covered = startValue - currentValue;
    return Math.min(100, Math.round((covered / totalRange) * 100));
  }
}

// =============================================================================
// detectTrend
//
// Analyze recent results to determine if the user is improving, stable, etc.
// Requires at least 3 data points for meaningful analysis.
// =============================================================================

export function detectTrend(
  results: TrainingResultEntry[],
  testType?: TafTestType,
): TrendType {
  const filtered = testType
    ? results.filter((r) => r.testType === testType)
    : results;

  if (filtered.length < 3) return 'insufficient_data';

  // Sort by date ascending
  const sorted = [...filtered].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  // Take last 5 results
  const recent = sorted.slice(-5);
  const direction = testType ? TAF_TESTS[testType]?.direction : 'higher_is_better';

  // Calculate improvements between consecutive results
  let improvements = 0;
  let regressions = 0;
  let stable = 0;

  for (let i = 1; i < recent.length; i++) {
    const prev = recent[i - 1]!.rawValue;
    const curr = recent[i]!.rawValue;

    const diff = direction === 'higher_is_better' ? curr - prev : prev - curr;

    if (diff > 0) improvements++;
    else if (diff < 0) regressions++;
    else stable++;
  }

  const total = improvements + regressions + stable;

  if (improvements === total) return 'strong_evolution';
  if (improvements > regressions && improvements >= total * 0.6) return 'gradual_evolution';
  if (stable >= total * 0.6) return 'stability';
  if (regressions > improvements) return 'regression';

  return 'oscillation';
}

// =============================================================================
// calculateConsistency
//
// Has the user consistently reached the minimum score?
// =============================================================================

export function calculateConsistency(
  results: TrainingResultEntry[],
  testType: TafTestType,
): ConsistencyStatus {
  const filtered = results
    .filter((r) => r.testType === testType)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (filtered.length === 0) return 'never_reached';

  const passingResults = filtered.filter((r) => r.passing);

  if (passingResults.length === 0) return 'never_reached';
  if (passingResults.length === 1) return 'reached_once';
  if (passingResults.length === 2) return 'reached_twice';

  // Check if the last 3 results are all passing
  const lastThree = filtered.slice(0, 3);
  if (lastThree.length >= 3 && lastThree.every((r) => r.passing)) {
    return 'consistent';
  }

  return 'reached_twice';
}

// =============================================================================
// generateMilestones
//
// Generate intermediate milestones for a test based on current value and target.
// =============================================================================

export function generateMilestones(
  testType: TafTestType,
  currentValue: number,
  targetScore: number,
): Milestone[] {
  const config = TAF_TESTS[testType];
  if (!config) return [];

  const milestones: Milestone[] = [];
  let order = 1;

  if (config.direction === 'higher_is_better') {
    // For reps, generate milestones from current value up to target
    const rangesAbove = config.scoreRanges
      .filter((r) => r.score >= MINIMUM_PASSING_SCORE && r.score <= targetScore)
      .sort((a, b) => a.score - b.score);

    // Add intermediate steps if current is far from minimum
    const minValue = getMinimumValueForTest(testType);
    if (currentValue < minValue) {
      const gap = minValue - currentValue;
      const steps = Math.ceil(gap / 5);
      for (let i = 1; i <= steps && currentValue + i * 5 < minValue; i++) {
        const stepValue = currentValue + i * 5;
        milestones.push({
          id: `${testType}-step-${order}`,
          testType,
          title: `Alcançar ${stepValue} repetições`,
          targetValue: stepValue,
          targetScore: 0,
          order: order++,
          status: 'pending' as MilestoneStatus,
        });
      }
    }

    // Add milestones for each scoring range
    for (const range of rangesAbove) {
      if (range.minValue !== null && range.minValue > currentValue) {
        milestones.push({
          id: `${testType}-score-${range.score}`,
          testType,
          title:
            range.score === MINIMUM_PASSING_SCORE
              ? `Mínimo oficial — ${range.minValue} rep (${range.score} pts)`
              : `${range.minValue} rep — ${range.score} pontos`,
          targetValue: range.minValue,
          targetScore: range.score,
          order: order++,
          status: 'pending' as MilestoneStatus,
        });
      }
    }
  } else {
    // For time, milestones go DOWN (reduce time)
    const rangesAbove = config.scoreRanges
      .filter((r) => r.score >= MINIMUM_PASSING_SCORE && r.score <= targetScore)
      .sort((a, b) => a.score - b.score);

    for (const range of rangesAbove) {
      const targetValue = range.maxValue ?? range.minValue ?? 0;
      if (targetValue > 0 && targetValue < currentValue) {
        const formattedTime = testType === 'running_2400m'
          ? formatSecondsVerbose(targetValue)
          : `${targetValue}s`;

        milestones.push({
          id: `${testType}-score-${range.score}`,
          testType,
          title:
            range.score === MINIMUM_PASSING_SCORE
              ? `Mínimo oficial — ${formattedTime} (${range.score} pts)`
              : `${formattedTime} — ${range.score} pontos`,
          targetValue,
          targetScore: range.score,
          order: order++,
          status: 'pending' as MilestoneStatus,
        });
      }
    }
  }

  return milestones;
}

// =============================================================================
// generateNextMilestone
//
// Get just the next milestone the user should aim for.
// =============================================================================

export function generateNextMilestone(
  testType: TafTestType,
  currentValue: number,
  targetScore: number = 20,
): Milestone | null {
  const milestones = generateMilestones(testType, currentValue, targetScore);
  return milestones.length > 0 ? milestones[0]! : null;
}

// =============================================================================
// Helpers
// =============================================================================

function formatSecondsVerbose(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  if (minutes === 0) return `${seconds}s`;
  return `${minutes}min${seconds > 0 ? ` ${seconds.toString().padStart(2, '0')}s` : ''}`;
}
