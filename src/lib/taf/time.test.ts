// =============================================================================
// Time Utilities Tests
// =============================================================================

import { describe, it, expect } from 'vitest';
import { parseDuration, formatDuration, formatTestValue } from './time';

describe('parseDuration', () => {
  it('parses MM:SS format', () => {
    expect(parseDuration('12:45')).toBe(765);
    expect(parseDuration('8:44')).toBe(524);
    expect(parseDuration('0:30')).toBe(30);
    expect(parseDuration('13:20')).toBe(800);
  });

  it('parses MM:SS.cc format', () => {
    expect(parseDuration('1:30.50')).toBe(90.50);
    expect(parseDuration('0:10.84')).toBe(10.84);
  });

  it('parses SS.cc format', () => {
    expect(parseDuration('10.84')).toBe(10.84);
    expect(parseDuration('8.88')).toBe(8.88);
    expect(parseDuration('58')).toBe(58);
  });

  it('passes through numbers', () => {
    expect(parseDuration(765)).toBe(765);
    expect(parseDuration(10.84)).toBe(10.84);
  });

  it('handles null/undefined/empty', () => {
    expect(parseDuration(null)).toBeNull();
    expect(parseDuration(undefined)).toBeNull();
    expect(parseDuration('')).toBeNull();
    expect(parseDuration('  ')).toBeNull();
  });

  it('rejects invalid inputs', () => {
    expect(parseDuration(-5)).toBeNull();
    expect(parseDuration(NaN)).toBeNull();
    expect(parseDuration('abc')).toBeNull();
    expect(parseDuration('12:60')).toBeNull(); // 60 seconds invalid
  });
});

describe('formatDuration', () => {
  it('formats as verbose', () => {
    expect(formatDuration(765, 'verbose')).toBe('12min 45s');
    expect(formatDuration(524, 'verbose')).toBe('8min 44s');
    expect(formatDuration(60, 'verbose')).toBe('1min');
    expect(formatDuration(800, 'verbose')).toBe('13min 20s');
  });

  it('formats as ss.cc', () => {
    expect(formatDuration(10.84, 'ss.cc')).toBe('10.84s');
    expect(formatDuration(8.88, 'ss.cc')).toBe('8.88s');
    expect(formatDuration(58, 'ss.cc')).toBe('58s');
  });

  it('formats as mm:ss', () => {
    expect(formatDuration(765, 'mm:ss')).toBe('12:45');
    expect(formatDuration(524, 'mm:ss')).toBe('8:44');
  });

  it('handles null/undefined', () => {
    expect(formatDuration(null)).toBe('--');
    expect(formatDuration(undefined)).toBe('--');
    expect(formatDuration(NaN)).toBe('--');
  });

  it('auto format chooses based on magnitude', () => {
    expect(formatDuration(765, 'auto')).toBe('12min 45s');
    expect(formatDuration(10.84, 'auto')).toBe('10.84s');
  });
});

describe('formatTestValue', () => {
  it('formats running values as verbose duration', () => {
    expect(formatTestValue(765, 'running_2400m')).toBe('12min 45s');
  });

  it('formats shuttle run as ss.cc', () => {
    expect(formatTestValue(10.84, 'shuttle_run')).toBe('10.84s');
  });

  it('formats swimming as ss.cc', () => {
    expect(formatTestValue(58, 'swimming_50m')).toBe('58s');
  });

  it('formats repetitions', () => {
    expect(formatTestValue(40, 'abdominal_60s')).toBe('40 rep');
    expect(formatTestValue(3, 'pull_up_dynamic')).toBe('3 rep');
  });

  it('handles null', () => {
    expect(formatTestValue(null, 'abdominal_60s')).toBe('--');
  });
});
