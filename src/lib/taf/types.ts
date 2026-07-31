// =============================================================================
// Canhoto — Rumo à Farda
// TAF Domain Types
// =============================================================================

/** The five official TAF test types */
export type TafTestType =
  | 'running_2400m'
  | 'abdominal_60s'
  | 'pull_up_dynamic'
  | 'shuttle_run'
  | 'swimming_50m';

/** Whether higher or lower values are better for a test */
export type MeasurementDirection = 'higher_is_better' | 'lower_is_better';

/** Unit of measurement for a test */
export type MeasurementUnit = 'repetitions' | 'seconds' | 'milliseconds';

/** Status of a single test result */
export type ResultStatus = 'below_minimum' | 'passing' | 'maximum';

/** Overall TAF status */
export type OverallStatus =
  | 'start_of_journey'
  | 'building_base'
  | 'near_minimum'
  | 'minimum_reached'
  | 'safety_margin'
  | 'ready_for_simulation'
  | 'passing_all'
  | 'maximum_performance';

/** Trend classification for a series of results */
export type TrendType =
  | 'strong_evolution'
  | 'gradual_evolution'
  | 'stability'
  | 'oscillation'
  | 'regression'
  | 'insufficient_data';

/** Consistency classification */
export type ConsistencyStatus =
  | 'never_reached'
  | 'reached_once'
  | 'reached_twice'
  | 'consistent'
  | 'consistent_under_simulation';

/** Perceived effort level (1-10) */
export type PerceivedEffort = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

/** Physical condition during training */
export type PhysicalCondition = 'great' | 'good' | 'normal' | 'tired' | 'exhausted';

/** Goal type */
export type GoalType = 'minimum' | 'safe' | 'advanced' | 'maximum' | 'custom';

/** Training session type */
export type SessionType = 'training' | 'simulation' | 'free';

/** Planned session status */
export type PlannedSessionStatus = 'scheduled' | 'completed' | 'skipped' | 'rescheduled';

/** Milestone status */
export type MilestoneStatus = 'pending' | 'in_progress' | 'achieved';

/** Simulation source type */
export type SimulationSourceType = 'manual' | 'best' | 'latest' | 'average_last_3' | 'last_simulation';

/** Experience level */
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced' | 'athlete';

// =============================================================================
// Score Range — represents a single row in the scoring table
// =============================================================================

export interface ScoreRange {
  /** Points awarded (0 = below minimum, used internally) */
  score: number;
  /** Minimum value for this range (inclusive or exclusive based on direction) */
  minValue: number | null;
  /** Maximum value for this range (inclusive or exclusive based on direction) */
  maxValue: number | null;
  /** Whether minValue is inclusive */
  minInclusive: boolean;
  /** Whether maxValue is inclusive */
  maxInclusive: boolean;
  /** Status for this range */
  status: ResultStatus;
  /** Human-readable label */
  displayLabel: string;
}

// =============================================================================
// Test Configuration
// =============================================================================

export interface TafTestConfig {
  slug: TafTestType;
  name: string;
  shortName: string;
  category: string;
  unit: MeasurementUnit;
  direction: MeasurementDirection;
  officialOrder: number;
  minimumScore: number;
  maximumScore: number;
  /** Icon name from Lucide */
  icon: string;
  /** Score ranges ordered from highest score to lowest */
  scoreRanges: ScoreRange[];
}

// =============================================================================
// Scoring Results
// =============================================================================

export interface ScoringResult {
  /** Test type */
  testType: TafTestType;
  /** Raw value submitted */
  rawValue: number;
  /** Official score (0 if below minimum) */
  score: number;
  /** Whether this score passes the minimum threshold */
  passing: boolean;
  /** Result status */
  status: ResultStatus;
  /** The range this result falls into, or null if below minimum */
  currentRange: ScoreRange | null;
  /** The next scoring range above current, or null if at maximum */
  nextRange: ScoreRange | null;
  /** Difference to reach minimum passing score (negative = already past it) */
  differenceToMinimum: number;
  /** Difference to reach next score level */
  differenceToNextScore: number | null;
  /** Difference to reach maximum score */
  differenceToMaximum: number;
}

export interface FinalScoreResult {
  /** Individual test results */
  testResults: ScoringResult[];
  /** Sum of all five scores (max 100) */
  rawScoreSum: number;
  /** Average of all five scores (max 20) */
  averageScore: number;
  /** Official final score: (sum / 5) * 2.5 (max 50) */
  finalScore: number;
  /** Whether all tests have passing scores (>=12) */
  allTestsPassing: boolean;
  /** Number of tests passing */
  testsPassing: number;
  /** Number of tests below minimum */
  testsBelowMinimum: number;
  /** The test with the lowest score / most critical */
  weakestTest: TafTestType | null;
  /** The test with the highest score */
  strongestTest: TafTestType | null;
  /** Overall status label */
  overallStatus: OverallStatus;
}

// =============================================================================
// Progress & Readiness
// =============================================================================

export interface ProgressResult {
  testType: TafTestType;
  currentValue: number;
  /** Percentage of progress toward minimum (0-100+) */
  progressToMinimum: number;
  /** Percentage of progress toward personal target */
  progressToTarget: number;
  targetValue: number;
  differenceToMinimum: number;
  differenceToTarget: number;
}

export interface ReadinessResult {
  /** Readiness for minimum (0-100%) */
  readinessForMinimum: number;
  /** Readiness for personal goal (0-100%) */
  readinessForGoal: number;
  /** Consistency status */
  consistency: ConsistencyStatus;
  /** Overall readiness across all tests */
  overallReadiness: number;
  /** Whether all tests are above minimum */
  allAboveMinimum: boolean;
}

// =============================================================================
// Training & History
// =============================================================================

export interface TrainingResultEntry {
  id: string;
  testType: TafTestType;
  rawValue: number;
  score: number;
  passing: boolean;
  date: string;
  perceivedEffort?: PerceivedEffort;
  painReported?: boolean;
}

// =============================================================================
// Recommendations
// =============================================================================

export interface Recommendation {
  testType: TafTestType;
  type: 'encouragement' | 'warning' | 'milestone' | 'consistency' | 'health' | 'plateau' | 'regression';
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

// =============================================================================
// Simulation
// =============================================================================

export interface SimulationInput {
  running_2400m?: number;
  abdominal_60s?: number;
  pull_up_dynamic?: number;
  shuttle_run?: number;
  swimming_50m?: number;
}

export interface SimulationResult extends FinalScoreResult {
  simulationDate: string;
  sourceType: SimulationSourceType;
  /** Tests that would cause elimination */
  eliminatingTests: TafTestType[];
  /** Margin of safety for each passing test */
  safetyMargins: Record<TafTestType, number>;
}

// =============================================================================
// Milestones
// =============================================================================

export interface Milestone {
  id: string;
  testType: TafTestType;
  title: string;
  targetValue: number;
  targetScore: number;
  order: number;
  status: MilestoneStatus;
  achievedAt?: string;
}

// =============================================================================
// Gamification
// =============================================================================

export interface Achievement {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  earned: boolean;
  earnedAt?: string;
}

export type Rank =
  | 'recruta_da_jornada'
  | 'base_em_construcao'
  | 'ritmo_de_combate'
  | 'indice_alcancado'
  | 'margem_de_seguranca'
  | 'pronto_para_o_desafio'
  | 'rumo_a_farda';

export interface RankInfo {
  slug: Rank;
  name: string;
  minXp: number;
  maxXp: number;
  level: number;
}

// =============================================================================
// Weekly Summary
// =============================================================================

export interface WeeklySummary {
  weekStart: string;
  weekEnd: string;
  sessionsCompleted: number;
  sessionsPlanned: number;
  testsTrainedMap: Record<TafTestType, number>;
  personalRecords: number;
  recoveryDays: number;
  adherencePercentage: number;
  averagePerceivedEffort: number;
  improvements: string[];
}
