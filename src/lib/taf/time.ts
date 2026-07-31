// =============================================================================
// Canhoto — Rumo à Farda
// Time Utilities — Parse and format durations
//
// All internal storage uses SECONDS (with decimals for centiseconds).
// Running times: stored as total seconds (e.g., 8min44s = 524)
// Shuttle Run: stored as seconds with centiseconds (e.g., 10.84)
// Swimming: stored as whole seconds (e.g., 58)
// =============================================================================

/**
 * Parse a duration string into total seconds.
 *
 * Supported formats:
 * - "MM:SS" → minutes and seconds (e.g., "12:45" → 765)
 * - "MM:SS.cc" → with centiseconds (e.g., "1:30.50" → 90.50)
 * - "SS.cc" → seconds with centiseconds (e.g., "10.84" → 10.84)
 * - "SS" → plain seconds (e.g., "58" → 58)
 * - number → passed through as-is
 *
 * @returns Total seconds, or null if parsing fails
 */
export function parseDuration(input: string | number | null | undefined): number | null {
  if (input === null || input === undefined) return null;

  // If already a number, validate and return
  if (typeof input === 'number') {
    if (isNaN(input) || input < 0) return null;
    return Math.round(input * 100) / 100;
  }

  const trimmed = input.trim();
  if (trimmed === '') return null;

  // Try MM:SS or MM:SS.cc format
  const mmssMatch = trimmed.match(/^(\d{1,3}):(\d{1,2})(?:\.(\d{1,2}))?$/);
  if (mmssMatch) {
    const minutes = parseInt(mmssMatch[1]!, 10);
    const seconds = parseInt(mmssMatch[2]!, 10);
    const centiseconds = mmssMatch[3] ? parseInt(mmssMatch[3].padEnd(2, '0'), 10) : 0;

    if (seconds >= 60) return null;
    if (centiseconds >= 100) return null;

    const totalSeconds = minutes * 60 + seconds + centiseconds / 100;
    return Math.round(totalSeconds * 100) / 100;
  }

  // Try plain number (SS or SS.cc)
  const num = parseFloat(trimmed);
  if (!isNaN(num) && num >= 0) {
    return Math.round(num * 100) / 100;
  }

  return null;
}

/**
 * Format seconds into a human-readable duration string.
 *
 * @param totalSeconds - Total seconds
 * @param format - Output format:
 *   - 'mm:ss' → "12:45" (minutes:seconds)
 *   - 'ss.cc' → "10.84" (seconds.centiseconds)
 *   - 'verbose' → "12min 45s" (human readable)
 *   - 'auto' → chooses based on magnitude
 */
export function formatDuration(
  totalSeconds: number | null | undefined,
  format: 'mm:ss' | 'ss.cc' | 'verbose' | 'auto' = 'auto',
): string {
  if (totalSeconds === null || totalSeconds === undefined || isNaN(totalSeconds)) {
    return '--';
  }

  if (totalSeconds < 0) return '--';

  const resolvedFormat = format === 'auto'
    ? (totalSeconds >= 60 ? 'verbose' : 'ss.cc')
    : format;

  switch (resolvedFormat) {
    case 'mm:ss': {
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = Math.floor(totalSeconds % 60);
      const centis = Math.round((totalSeconds % 1) * 100);
      if (centis > 0) {
        return `${minutes}:${seconds.toString().padStart(2, '0')}.${centis.toString().padStart(2, '0')}`;
      }
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    case 'ss.cc': {
      const rounded = Math.round(totalSeconds * 100) / 100;
      const intPart = Math.floor(rounded);
      const centis = Math.round((rounded - intPart) * 100);
      if (centis > 0) {
        return `${intPart}.${centis.toString().padStart(2, '0')}s`;
      }
      return `${intPart}s`;
    }

    case 'verbose': {
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = Math.floor(totalSeconds % 60);
      const centis = Math.round((totalSeconds % 1) * 100);

      if (minutes === 0) {
        if (centis > 0) {
          return `${seconds}.${centis.toString().padStart(2, '0')}s`;
        }
        return `${seconds}s`;
      }

      let result = `${minutes}min`;
      if (seconds > 0 || centis > 0) {
        result += ` ${seconds.toString().padStart(2, '0')}s`;
      }
      return result;
    }

    default:
      return totalSeconds.toString();
  }
}

/**
 * Format a value based on the test type's measurement unit.
 */
export function formatTestValue(
  value: number | null | undefined,
  testType: string,
): string {
  if (value === null || value === undefined || isNaN(value)) {
    return '--';
  }

  switch (testType) {
    case 'running_2400m':
      return formatDuration(value, 'verbose');
    case 'shuttle_run':
      return formatDuration(value, 'ss.cc');
    case 'swimming_50m':
      return formatDuration(value, 'ss.cc');
    case 'abdominal_60s':
    case 'pull_up_dynamic':
      return `${value} rep`;
    default:
      return value.toString();
  }
}

/**
 * Format the difference between values for display.
 * Positive = improvement needed, negative = already surpassed.
 */
export function formatDifference(
  difference: number,
  testType: string,
  direction: 'higher_is_better' | 'lower_is_better',
): string {
  if (difference === 0) return 'No alvo';

  const absDiff = Math.abs(difference);

  if (direction === 'higher_is_better') {
    if (difference > 0) {
      return `Faltam ${absDiff} rep`;
    }
    return `${absDiff} rep acima`;
  } else {
    // Time-based
    if (difference > 0) {
      if (testType === 'running_2400m') {
        return `Reduzir ${formatDuration(absDiff, 'verbose')}`;
      }
      return `Reduzir ${formatDuration(absDiff, 'ss.cc')}`;
    }
    if (testType === 'running_2400m') {
      return `${formatDuration(absDiff, 'verbose')} abaixo`;
    }
    return `${formatDuration(absDiff, 'ss.cc')} abaixo`;
  }
}
