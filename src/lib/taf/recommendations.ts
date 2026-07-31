// =============================================================================
// Canhoto — Rumo à Farda
// Recommendations Engine — Deterministic, transparent, no external AI
// =============================================================================

import type {
  TafTestType,
  Recommendation,
  TrainingResultEntry,
  TrendType,
} from './types';

import { TAF_TESTS, MINIMUM_PASSING_SCORE } from './constants';
import { calculateOfficialScore } from './scoring';
import { detectTrend, calculateConsistency } from './progress';

// =============================================================================
// generateFeedback
//
// Generate contextual feedback after saving a training result.
// =============================================================================

export function generateFeedback(
  testType: TafTestType,
  currentValue: number,
  history: TrainingResultEntry[],
): Recommendation[] {
  const recommendations: Recommendation[] = [];
  const config = TAF_TESTS[testType];
  if (!config) return recommendations;

  const result = calculateOfficialScore(testType, currentValue);
  const testHistory = history.filter((h) => h.testType === testType);
  const sortedHistory = [...testHistory].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  const previousResult = sortedHistory.length > 0 ? sortedHistory[0] : null;
  const bestResult = testHistory.length > 0
    ? (config.direction === 'higher_is_better'
      ? testHistory.reduce((best, r) => (r.rawValue > best.rawValue ? r : best))
      : testHistory.reduce((best, r) => (r.rawValue < best.rawValue ? r : best)))
    : null;

  // 1. Score status feedback
  if (result.status === 'below_minimum') {
    const diff = Math.abs(result.differenceToMinimum);
    if (config.direction === 'higher_is_better') {
      recommendations.push({
        testType,
        type: 'encouragement',
        message: `Você realizou ${currentValue} ${config.unit === 'repetitions' ? 'repetições' : 'segundos'}. Faltam ${diff} para alcançar o índice mínimo de ${MINIMUM_PASSING_SCORE} pontos.`,
        priority: 'medium',
      });
    } else {
      recommendations.push({
        testType,
        type: 'encouragement',
        message: `Seu tempo foi de ${currentValue}s. Você precisa reduzir ${diff.toFixed(2)}s para alcançar o índice mínimo.`,
        priority: 'medium',
      });
    }
  } else if (result.score === MINIMUM_PASSING_SCORE) {
    recommendations.push({
      testType,
      type: 'milestone',
      message: `Você alcançou ${result.score} pontos — o índice mínimo! Agora o foco é criar margem de segurança.`,
      priority: 'medium',
    });
  } else if (result.score === 20) {
    recommendations.push({
      testType,
      type: 'milestone',
      message: `Pontuação máxima alcançada! Mantenha a consistência nos treinos.`,
      priority: 'low',
    });
  } else {
    recommendations.push({
      testType,
      type: 'encouragement',
      message: `Resultado registrado: ${result.score} pontos. ${result.nextRange ? `Faltam ${result.differenceToNextScore !== null ? Math.abs(result.differenceToNextScore) : '?'} para a próxima faixa (${result.nextRange.score} pontos).` : ''}`,
      priority: 'low',
    });
  }

  // 2. Comparison with previous result
  if (previousResult) {
    const diff = config.direction === 'higher_is_better'
      ? currentValue - previousResult.rawValue
      : previousResult.rawValue - currentValue;

    if (diff > 0) {
      if (config.direction === 'higher_is_better') {
        recommendations.push({
          testType,
          type: 'encouragement',
          message: `Você melhorou ${Math.abs(diff)} ${config.unit === 'repetitions' ? 'repetições' : 'segundos'} em relação ao último treino.`,
          priority: 'low',
        });
      } else {
        recommendations.push({
          testType,
          type: 'encouragement',
          message: `Você reduziu ${Math.abs(diff).toFixed(2)}s em relação ao último treino.`,
          priority: 'low',
        });
      }
    } else if (diff < 0) {
      recommendations.push({
        testType,
        type: 'regression',
        message: 'Seu resultado caiu em relação ao último treino. Analise descanso, alimentação, técnica e intensidade antes de aumentar a carga.',
        priority: 'medium',
      });
    }
  }

  // 3. New personal record
  if (bestResult) {
    const isNewRecord = config.direction === 'higher_is_better'
      ? currentValue > bestResult.rawValue
      : currentValue < bestResult.rawValue;

    if (isNewRecord) {
      recommendations.push({
        testType,
        type: 'milestone',
        message: 'Novo recorde pessoal! Continue nesse ritmo.',
        priority: 'low',
      });
    }
  }

  // 4. Trend analysis
  if (testHistory.length >= 3) {
    const allResults = [...testHistory, {
      id: 'current',
      testType,
      rawValue: currentValue,
      score: result.score,
      passing: result.passing,
      date: new Date().toISOString(),
    }];

    const trend = detectTrend(allResults, testType);

    if (trend === 'strong_evolution') {
      recommendations.push({
        testType,
        type: 'encouragement',
        message: 'Você vem evoluindo consistentemente nas últimas sessões. Excelente trabalho!',
        priority: 'low',
      });
    } else if (trend === 'stability') {
      recommendations.push({
        testType,
        type: 'plateau',
        message: 'Seu resultado está estável há algumas sessões. Considere revisar a técnica, variar os estímulos e garantir recuperação adequada.',
        priority: 'medium',
      });
    } else if (trend === 'regression') {
      recommendations.push({
        testType,
        type: 'regression',
        message: 'Tendência de queda identificada. Considere avaliar seu descanso, alimentação e possíveis sobrecargas antes de intensificar o treinamento.',
        priority: 'high',
      });
    }
  }

  // 5. Consistency check
  const consistency = calculateConsistency(
    [...testHistory, {
      id: 'current',
      testType,
      rawValue: currentValue,
      score: result.score,
      passing: result.passing,
      date: new Date().toISOString(),
    }],
    testType,
  );

  if (consistency === 'reached_once' && result.passing) {
    recommendations.push({
      testType,
      type: 'consistency',
      message: 'Você atingiu o mínimo pela primeira vez! O objetivo agora é repetir o resultado para construir consistência.',
      priority: 'medium',
    });
  }

  // 6. Pain check
  const lastEntryWithPain = sortedHistory.find((r) => r.painReported);
  if (lastEntryWithPain) {
    recommendations.push({
      testType,
      type: 'health',
      message: 'Foi registrada dor recentemente. Priorize a recuperação e consulte um profissional de saúde se a dor persistir.',
      priority: 'critical',
    });
  }

  return recommendations;
}

// =============================================================================
// generateHealthWarning
//
// When severe symptoms are reported, always show this warning.
// =============================================================================

export function generateHealthWarning(): Recommendation {
  return {
    testType: 'abdominal_60s', // Generic
    type: 'health',
    message: 'Interrompa o exercício e procure avaliação de um profissional de saúde.',
    priority: 'critical',
  };
}

// =============================================================================
// Trend Labels (Portuguese)
// =============================================================================

export const TREND_LABELS: Record<TrendType, string> = {
  strong_evolution: 'Evolução Forte',
  gradual_evolution: 'Evolução Gradual',
  stability: 'Estabilidade',
  oscillation: 'Oscilação',
  regression: 'Regressão',
  insufficient_data: 'Dados Insuficientes',
};

export const TREND_ICONS: Record<TrendType, string> = {
  strong_evolution: 'TrendingUp',
  gradual_evolution: 'ArrowUpRight',
  stability: 'Minus',
  oscillation: 'Activity',
  regression: 'TrendingDown',
  insufficient_data: 'HelpCircle',
};

export const CONSISTENCY_LABELS: Record<string, string> = {
  never_reached: 'Ainda não alcançado',
  reached_once: 'Alcançado uma vez',
  reached_twice: 'Alcançado duas vezes',
  consistent: 'Consistente',
  consistent_under_simulation: 'Consistente em simulado',
};
