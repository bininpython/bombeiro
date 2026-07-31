// =============================================================================
// Canhoto — Rumo à Farda
// Scoring Engine Tests — Comprehensive coverage of all scoring boundaries
// =============================================================================

import { describe, it, expect } from 'vitest';
import { calculateOfficialScore, calculateFinalTafScore } from './scoring';
import type { TafTestType } from './types';

// =============================================================================
// Abdominal (60s) — Higher is better
// =============================================================================

describe('calculateOfficialScore — Abdominal', () => {
  const test: TafTestType = 'abdominal_60s';

  // Mandatory test cases from the prompt
  it('39 abdominais → abaixo do mínimo (score 0)', () => {
    const result = calculateOfficialScore(test, 39);
    expect(result.score).toBe(0);
    expect(result.passing).toBe(false);
    expect(result.status).toBe('below_minimum');
  });

  it('40 abdominais → 12 pontos', () => {
    const result = calculateOfficialScore(test, 40);
    expect(result.score).toBe(12);
    expect(result.passing).toBe(true);
  });

  it('41 abdominais → 12 pontos', () => {
    const result = calculateOfficialScore(test, 41);
    expect(result.score).toBe(12);
    expect(result.passing).toBe(true);
  });

  it('42 abdominais → 13 pontos', () => {
    const result = calculateOfficialScore(test, 42);
    expect(result.score).toBe(13);
    expect(result.passing).toBe(true);
  });

  it('46 abdominais → 14 pontos', () => {
    const result = calculateOfficialScore(test, 46);
    expect(result.score).toBe(14);
    expect(result.passing).toBe(true);
  });

  it('67 abdominais → 20 pontos', () => {
    const result = calculateOfficialScore(test, 67);
    expect(result.score).toBe(20);
    expect(result.passing).toBe(true);
    expect(result.status).toBe('maximum');
  });

  // Full range boundary testing
  it('0 abdominais → abaixo do mínimo', () => {
    const result = calculateOfficialScore(test, 0);
    expect(result.score).toBe(0);
    expect(result.passing).toBe(false);
  });

  it('45 abdominais → 13 pontos (upper bound)', () => {
    const result = calculateOfficialScore(test, 45);
    expect(result.score).toBe(13);
  });

  it('47 abdominais → 15 pontos', () => {
    const result = calculateOfficialScore(test, 47);
    expect(result.score).toBe(15);
  });

  it('48 abdominais → 15 pontos', () => {
    const result = calculateOfficialScore(test, 48);
    expect(result.score).toBe(15);
  });

  it('49 abdominais → 16 pontos', () => {
    const result = calculateOfficialScore(test, 49);
    expect(result.score).toBe(16);
  });

  it('50 abdominais → 16 pontos', () => {
    const result = calculateOfficialScore(test, 50);
    expect(result.score).toBe(16);
  });

  it('51 abdominais → 17 pontos', () => {
    const result = calculateOfficialScore(test, 51);
    expect(result.score).toBe(17);
  });

  it('55 abdominais → 17 pontos', () => {
    const result = calculateOfficialScore(test, 55);
    expect(result.score).toBe(17);
  });

  it('56 abdominais → 18 pontos', () => {
    const result = calculateOfficialScore(test, 56);
    expect(result.score).toBe(18);
  });

  it('60 abdominais → 18 pontos', () => {
    const result = calculateOfficialScore(test, 60);
    expect(result.score).toBe(18);
  });

  it('61 abdominais → 19 pontos', () => {
    const result = calculateOfficialScore(test, 61);
    expect(result.score).toBe(19);
  });

  it('66 abdominais → 19 pontos', () => {
    const result = calculateOfficialScore(test, 66);
    expect(result.score).toBe(19);
  });

  it('100 abdominais → 20 pontos', () => {
    const result = calculateOfficialScore(test, 100);
    expect(result.score).toBe(20);
  });

  // Difference calculations
  it('30 abdominais → differenceToMinimum = 10', () => {
    const result = calculateOfficialScore(test, 30);
    expect(result.differenceToMinimum).toBe(10);
  });

  it('40 abdominais → differenceToMinimum = 0', () => {
    const result = calculateOfficialScore(test, 40);
    expect(result.differenceToMinimum).toBe(0);
  });

  it('50 abdominais → differenceToMinimum = -10 (already past)', () => {
    const result = calculateOfficialScore(test, 50);
    expect(result.differenceToMinimum).toBe(-10);
  });
});

// =============================================================================
// Barra Fixa Dinâmica — Higher is better
// =============================================================================

describe('calculateOfficialScore — Barra Fixa', () => {
  const test: TafTestType = 'pull_up_dynamic';

  // Mandatory test cases
  it('3 barras → 12 pontos', () => {
    const result = calculateOfficialScore(test, 3);
    expect(result.score).toBe(12);
    expect(result.passing).toBe(true);
  });

  it('2 barras → abaixo do mínimo', () => {
    const result = calculateOfficialScore(test, 2);
    expect(result.score).toBe(0);
    expect(result.passing).toBe(false);
    expect(result.status).toBe('below_minimum');
  });

  // Full range
  it('0 barras → abaixo do mínimo', () => {
    const result = calculateOfficialScore(test, 0);
    expect(result.score).toBe(0);
  });

  it('1 barra → abaixo do mínimo', () => {
    const result = calculateOfficialScore(test, 1);
    expect(result.score).toBe(0);
  });

  it('4 barras → 13 pontos', () => {
    const result = calculateOfficialScore(test, 4);
    expect(result.score).toBe(13);
  });

  it('5 barras → 13 pontos', () => {
    const result = calculateOfficialScore(test, 5);
    expect(result.score).toBe(13);
  });

  it('6 barras → 14 pontos', () => {
    const result = calculateOfficialScore(test, 6);
    expect(result.score).toBe(14);
  });

  it('7 barras → 14 pontos', () => {
    const result = calculateOfficialScore(test, 7);
    expect(result.score).toBe(14);
  });

  it('8 barras → 15 pontos', () => {
    const result = calculateOfficialScore(test, 8);
    expect(result.score).toBe(15);
  });

  it('9 barras → 16 pontos', () => {
    const result = calculateOfficialScore(test, 9);
    expect(result.score).toBe(16);
  });

  it('10 barras → 17 pontos', () => {
    const result = calculateOfficialScore(test, 10);
    expect(result.score).toBe(17);
  });

  it('11 barras → 18 pontos', () => {
    const result = calculateOfficialScore(test, 11);
    expect(result.score).toBe(18);
  });

  it('12 barras → 19 pontos', () => {
    const result = calculateOfficialScore(test, 12);
    expect(result.score).toBe(19);
  });

  it('14 barras → 19 pontos', () => {
    const result = calculateOfficialScore(test, 14);
    expect(result.score).toBe(19);
  });

  it('15 barras → 20 pontos', () => {
    const result = calculateOfficialScore(test, 15);
    expect(result.score).toBe(20);
  });

  it('20 barras → 20 pontos', () => {
    const result = calculateOfficialScore(test, 20);
    expect(result.score).toBe(20);
  });
});

// =============================================================================
// Shuttle Run — Lower is better (seconds with centiseconds)
// =============================================================================

describe('calculateOfficialScore — Shuttle Run', () => {
  const test: TafTestType = 'shuttle_run';

  // Mandatory test cases
  it('10.84s → 12 pontos', () => {
    const result = calculateOfficialScore(test, 10.84);
    expect(result.score).toBe(12);
    expect(result.passing).toBe(true);
  });

  it('10.85s → abaixo do mínimo', () => {
    const result = calculateOfficialScore(test, 10.85);
    expect(result.score).toBe(0);
    expect(result.passing).toBe(false);
    expect(result.status).toBe('below_minimum');
  });

  // Full range
  it('8.00s → 20 pontos', () => {
    const result = calculateOfficialScore(test, 8.0);
    expect(result.score).toBe(20);
  });

  it('8.88s → 20 pontos (upper boundary)', () => {
    const result = calculateOfficialScore(test, 8.88);
    expect(result.score).toBe(20);
  });

  it('8.89s → 19 pontos', () => {
    const result = calculateOfficialScore(test, 8.89);
    expect(result.score).toBe(19);
  });

  it('9.16s → 19 pontos', () => {
    const result = calculateOfficialScore(test, 9.16);
    expect(result.score).toBe(19);
  });

  it('9.17s → 18 pontos', () => {
    const result = calculateOfficialScore(test, 9.17);
    expect(result.score).toBe(18);
  });

  it('9.42s → 18 pontos', () => {
    const result = calculateOfficialScore(test, 9.42);
    expect(result.score).toBe(18);
  });

  it('9.43s → 17 pontos', () => {
    const result = calculateOfficialScore(test, 9.43);
    expect(result.score).toBe(17);
  });

  it('9.69s → 17 pontos', () => {
    const result = calculateOfficialScore(test, 9.69);
    expect(result.score).toBe(17);
  });

  it('9.70s → 16 pontos', () => {
    const result = calculateOfficialScore(test, 9.70);
    expect(result.score).toBe(16);
  });

  it('9.88s → 16 pontos', () => {
    const result = calculateOfficialScore(test, 9.88);
    expect(result.score).toBe(16);
  });

  it('9.89s → 15 pontos', () => {
    const result = calculateOfficialScore(test, 9.89);
    expect(result.score).toBe(15);
  });

  it('10.11s → 15 pontos', () => {
    const result = calculateOfficialScore(test, 10.11);
    expect(result.score).toBe(15);
  });

  it('10.12s → 14 pontos', () => {
    const result = calculateOfficialScore(test, 10.12);
    expect(result.score).toBe(14);
  });

  it('10.35s → 14 pontos', () => {
    const result = calculateOfficialScore(test, 10.35);
    expect(result.score).toBe(14);
  });

  it('10.36s → 13 pontos', () => {
    const result = calculateOfficialScore(test, 10.36);
    expect(result.score).toBe(13);
  });

  it('10.64s → 13 pontos', () => {
    const result = calculateOfficialScore(test, 10.64);
    expect(result.score).toBe(13);
  });

  it('10.65s → 12 pontos', () => {
    const result = calculateOfficialScore(test, 10.65);
    expect(result.score).toBe(12);
  });

  it('11.10s → abaixo do mínimo', () => {
    const result = calculateOfficialScore(test, 11.10);
    expect(result.score).toBe(0);
    expect(result.passing).toBe(false);
  });

  // Difference calculations for time (lower is better)
  it('11.10s → differenceToMinimum = 0.26s', () => {
    const result = calculateOfficialScore(test, 11.10);
    expect(result.differenceToMinimum).toBe(0.26);
  });
});

// =============================================================================
// Corrida 2400m — Lower is better (seconds)
// =============================================================================

describe('calculateOfficialScore — Corrida 2400m', () => {
  const test: TafTestType = 'running_2400m';

  // Mandatory test cases
  it('12min45s (765s) → 12 pontos', () => {
    const result = calculateOfficialScore(test, 765);
    expect(result.score).toBe(12);
    expect(result.passing).toBe(true);
  });

  it('12min46s (766s) → abaixo do mínimo', () => {
    const result = calculateOfficialScore(test, 766);
    expect(result.score).toBe(0);
    expect(result.passing).toBe(false);
    expect(result.status).toBe('below_minimum');
  });

  // Full range
  it('8min00s (480s) → 20 pontos', () => {
    const result = calculateOfficialScore(test, 480);
    expect(result.score).toBe(20);
  });

  it('8min44s (524s) → 20 pontos', () => {
    const result = calculateOfficialScore(test, 524);
    expect(result.score).toBe(20);
  });

  it('8min45s (525s) → 19 pontos', () => {
    const result = calculateOfficialScore(test, 525);
    expect(result.score).toBe(19);
  });

  it('9min14s (554s) → 19 pontos', () => {
    const result = calculateOfficialScore(test, 554);
    expect(result.score).toBe(19);
  });

  it('9min15s (555s) → 18 pontos', () => {
    const result = calculateOfficialScore(test, 555);
    expect(result.score).toBe(18);
  });

  it('9min45s (585s) → 18 pontos', () => {
    const result = calculateOfficialScore(test, 585);
    expect(result.score).toBe(18);
  });

  it('9min46s (586s) → 17 pontos', () => {
    const result = calculateOfficialScore(test, 586);
    expect(result.score).toBe(17);
  });

  it('10min15s (615s) → 17 pontos', () => {
    const result = calculateOfficialScore(test, 615);
    expect(result.score).toBe(17);
  });

  it('10min16s (616s) → 16 pontos', () => {
    const result = calculateOfficialScore(test, 616);
    expect(result.score).toBe(16);
  });

  it('10min45s (645s) → 16 pontos', () => {
    const result = calculateOfficialScore(test, 645);
    expect(result.score).toBe(16);
  });

  it('10min46s (646s) → 15 pontos', () => {
    const result = calculateOfficialScore(test, 646);
    expect(result.score).toBe(15);
  });

  it('11min15s (675s) → 15 pontos', () => {
    const result = calculateOfficialScore(test, 675);
    expect(result.score).toBe(15);
  });

  it('11min16s (676s) → 14 pontos', () => {
    const result = calculateOfficialScore(test, 676);
    expect(result.score).toBe(14);
  });

  it('11min45s (705s) → 14 pontos', () => {
    const result = calculateOfficialScore(test, 705);
    expect(result.score).toBe(14);
  });

  it('11min46s (706s) → 13 pontos', () => {
    const result = calculateOfficialScore(test, 706);
    expect(result.score).toBe(13);
  });

  it('12min16s (736s) → 13 pontos', () => {
    const result = calculateOfficialScore(test, 736);
    expect(result.score).toBe(13);
  });

  it('12min17s (737s) → 12 pontos', () => {
    const result = calculateOfficialScore(test, 737);
    expect(result.score).toBe(12);
  });

  it('13min20s (800s) → abaixo do mínimo', () => {
    const result = calculateOfficialScore(test, 800);
    expect(result.score).toBe(0);
    expect(result.passing).toBe(false);
  });

  // Difference: 13min20s (800s) to 12min45s (765s) = 35s
  it('13min20s → differenceToMinimum = 35s', () => {
    const result = calculateOfficialScore(test, 800);
    expect(result.differenceToMinimum).toBe(35);
  });
});

// =============================================================================
// Natação 50m — Lower is better (seconds)
// =============================================================================

describe('calculateOfficialScore — Natação 50m', () => {
  const test: TafTestType = 'swimming_50m';

  // Mandatory test cases
  it('58 segundos → 12 pontos', () => {
    const result = calculateOfficialScore(test, 58);
    expect(result.score).toBe(12);
    expect(result.passing).toBe(true);
  });

  it('59 segundos → abaixo do mínimo', () => {
    const result = calculateOfficialScore(test, 59);
    expect(result.score).toBe(0);
    expect(result.passing).toBe(false);
    expect(result.status).toBe('below_minimum');
  });

  // Full range
  it('25 segundos → 20 pontos', () => {
    const result = calculateOfficialScore(test, 25);
    expect(result.score).toBe(20);
  });

  it('29 segundos → 20 pontos', () => {
    const result = calculateOfficialScore(test, 29);
    expect(result.score).toBe(20);
  });

  it('30 segundos → 19 pontos', () => {
    const result = calculateOfficialScore(test, 30);
    expect(result.score).toBe(19);
  });

  it('32 segundos → 19 pontos', () => {
    const result = calculateOfficialScore(test, 32);
    expect(result.score).toBe(19);
  });

  it('33 segundos → 18 pontos', () => {
    const result = calculateOfficialScore(test, 33);
    expect(result.score).toBe(18);
  });

  it('36 segundos → 18 pontos', () => {
    const result = calculateOfficialScore(test, 36);
    expect(result.score).toBe(18);
  });

  it('37 segundos → 17 pontos', () => {
    const result = calculateOfficialScore(test, 37);
    expect(result.score).toBe(17);
  });

  it('40 segundos → 17 pontos', () => {
    const result = calculateOfficialScore(test, 40);
    expect(result.score).toBe(17);
  });

  it('41 segundos → 16 pontos', () => {
    const result = calculateOfficialScore(test, 41);
    expect(result.score).toBe(16);
  });

  it('43 segundos → 16 pontos', () => {
    const result = calculateOfficialScore(test, 43);
    expect(result.score).toBe(16);
  });

  it('44 segundos → 15 pontos', () => {
    const result = calculateOfficialScore(test, 44);
    expect(result.score).toBe(15);
  });

  it('47 segundos → 15 pontos', () => {
    const result = calculateOfficialScore(test, 47);
    expect(result.score).toBe(15);
  });

  it('48 segundos → 14 pontos', () => {
    const result = calculateOfficialScore(test, 48);
    expect(result.score).toBe(14);
  });

  it('50 segundos → 14 pontos', () => {
    const result = calculateOfficialScore(test, 50);
    expect(result.score).toBe(14);
  });

  it('51 segundos → 13 pontos', () => {
    const result = calculateOfficialScore(test, 51);
    expect(result.score).toBe(13);
  });

  it('54 segundos → 13 pontos', () => {
    const result = calculateOfficialScore(test, 54);
    expect(result.score).toBe(13);
  });

  it('55 segundos → 12 pontos', () => {
    const result = calculateOfficialScore(test, 55);
    expect(result.score).toBe(12);
  });

  it('70 segundos → abaixo do mínimo', () => {
    const result = calculateOfficialScore(test, 70);
    expect(result.score).toBe(0);
  });
});

// =============================================================================
// Edge Cases
// =============================================================================

describe('calculateOfficialScore — Edge Cases', () => {
  it('handles null value', () => {
    const result = calculateOfficialScore('abdominal_60s', null);
    expect(result.score).toBe(0);
    expect(result.passing).toBe(false);
    expect(result.status).toBe('below_minimum');
  });

  it('handles undefined value', () => {
    const result = calculateOfficialScore('abdominal_60s', undefined);
    expect(result.score).toBe(0);
    expect(result.passing).toBe(false);
  });

  it('handles NaN', () => {
    const result = calculateOfficialScore('abdominal_60s', NaN);
    expect(result.score).toBe(0);
    expect(result.passing).toBe(false);
  });

  it('handles negative values', () => {
    const result = calculateOfficialScore('abdominal_60s', -5);
    expect(result.score).toBe(0);
    expect(result.passing).toBe(false);
  });

  it('throws for unknown test type', () => {
    expect(() =>
      calculateOfficialScore('unknown_test' as TafTestType, 10),
    ).toThrow('Unknown test type');
  });

  it('provides nextRange when not at maximum', () => {
    const result = calculateOfficialScore('abdominal_60s', 42);
    expect(result.score).toBe(13);
    expect(result.nextRange).not.toBeNull();
    expect(result.nextRange?.score).toBe(14);
  });

  it('nextRange is null at maximum score', () => {
    const result = calculateOfficialScore('abdominal_60s', 67);
    expect(result.score).toBe(20);
    expect(result.nextRange).toBeNull();
  });
});

// =============================================================================
// Final TAF Score Calculation
// =============================================================================

describe('calculateFinalTafScore', () => {
  it('calculates perfect score: all 20s → final score 50', () => {
    const results = [
      { testType: 'running_2400m' as TafTestType, rawValue: 480 },
      { testType: 'abdominal_60s' as TafTestType, rawValue: 70 },
      { testType: 'pull_up_dynamic' as TafTestType, rawValue: 20 },
      { testType: 'shuttle_run' as TafTestType, rawValue: 8.0 },
      { testType: 'swimming_50m' as TafTestType, rawValue: 25 },
    ];

    const final = calculateFinalTafScore(results);
    expect(final.rawScoreSum).toBe(100);
    expect(final.averageScore).toBe(20);
    expect(final.finalScore).toBe(50);
    expect(final.allTestsPassing).toBe(true);
    expect(final.testsPassing).toBe(5);
    expect(final.testsBelowMinimum).toBe(0);
    expect(final.overallStatus).toBe('maximum_performance');
  });

  it('calculates minimum passing: all 12s → final score 30', () => {
    const results = [
      { testType: 'running_2400m' as TafTestType, rawValue: 765 },
      { testType: 'abdominal_60s' as TafTestType, rawValue: 40 },
      { testType: 'pull_up_dynamic' as TafTestType, rawValue: 3 },
      { testType: 'shuttle_run' as TafTestType, rawValue: 10.84 },
      { testType: 'swimming_50m' as TafTestType, rawValue: 58 },
    ];

    const final = calculateFinalTafScore(results);
    expect(final.rawScoreSum).toBe(60);
    expect(final.averageScore).toBe(12);
    expect(final.finalScore).toBe(30);
    expect(final.allTestsPassing).toBe(true);
    expect(final.overallStatus).toBe('minimum_reached');
  });

  it('one test below minimum → NOT passing despite high total', () => {
    const results = [
      { testType: 'running_2400m' as TafTestType, rawValue: 480 }, // 20
      { testType: 'abdominal_60s' as TafTestType, rawValue: 70 }, // 20
      { testType: 'pull_up_dynamic' as TafTestType, rawValue: 2 }, // 0 - BELOW
      { testType: 'shuttle_run' as TafTestType, rawValue: 8.0 }, // 20
      { testType: 'swimming_50m' as TafTestType, rawValue: 25 }, // 20
    ];

    const final = calculateFinalTafScore(results);
    expect(final.allTestsPassing).toBe(false);
    expect(final.testsBelowMinimum).toBe(1);
    // Even though the math gives a high score, allTestsPassing is false
    expect(final.rawScoreSum).toBe(80); // 20+20+0+20+20
  });

  it('handles missing results (treats as 0)', () => {
    const results = [
      { testType: 'abdominal_60s' as TafTestType, rawValue: 50 },
    ];

    const final = calculateFinalTafScore(results);
    expect(final.testsPassing).toBe(1);
    expect(final.testsBelowMinimum).toBe(4);
    expect(final.allTestsPassing).toBe(false);
  });

  it('example user "Canhoto" scenario', () => {
    // abdominal: 30 (below min), barra: 2 (below min),
    // corrida: 13min20s=800s (below min), shuttle: 11.10s (below min),
    // natação: not tested (0)
    const results = [
      { testType: 'running_2400m' as TafTestType, rawValue: 800 },
      { testType: 'abdominal_60s' as TafTestType, rawValue: 30 },
      { testType: 'pull_up_dynamic' as TafTestType, rawValue: 2 },
      { testType: 'shuttle_run' as TafTestType, rawValue: 11.10 },
    ];

    const final = calculateFinalTafScore(results);
    expect(final.allTestsPassing).toBe(false);
    expect(final.testsBelowMinimum).toBe(5); // All 5 below (swimming not provided)
    expect(final.overallStatus).toBe('start_of_journey');
  });

  it('identifies weakest and strongest test', () => {
    const results = [
      { testType: 'running_2400m' as TafTestType, rawValue: 580 }, // 18
      { testType: 'abdominal_60s' as TafTestType, rawValue: 67 }, // 20
      { testType: 'pull_up_dynamic' as TafTestType, rawValue: 3 }, // 12
      { testType: 'shuttle_run' as TafTestType, rawValue: 9.50 }, // 17
      { testType: 'swimming_50m' as TafTestType, rawValue: 45 }, // 15
    ];

    const final = calculateFinalTafScore(results);
    expect(final.weakestTest).toBe('pull_up_dynamic');
    expect(final.strongestTest).toBe('abdominal_60s');
  });

  it('formula: (sum / 5) * 2.5', () => {
    // 18 + 17 + 15 + 16 + 14 = 80
    // 80 / 5 = 16
    // 16 * 2.5 = 40
    const results = [
      { testType: 'running_2400m' as TafTestType, rawValue: 555 }, // 18
      { testType: 'abdominal_60s' as TafTestType, rawValue: 51 }, // 17
      { testType: 'pull_up_dynamic' as TafTestType, rawValue: 8 }, // 15
      { testType: 'shuttle_run' as TafTestType, rawValue: 9.80 }, // 16
      { testType: 'swimming_50m' as TafTestType, rawValue: 48 }, // 14
    ];

    const final = calculateFinalTafScore(results);
    expect(final.rawScoreSum).toBe(80);
    expect(final.averageScore).toBe(16);
    expect(final.finalScore).toBe(40);
    expect(final.allTestsPassing).toBe(true);
  });
});
