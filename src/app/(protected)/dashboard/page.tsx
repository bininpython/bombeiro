import { Metadata } from 'next';
import {
  Timer,
  Dumbbell,
  ArrowUpFromLine,
  Zap,
  Waves,
  PlusCircle,
  ClipboardCheck,
  Flame,
  TrendingUp,
  Minus,
  AlertTriangle,
  CheckCircle2,
  Target,
  Calendar,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { calculateOfficialScore, calculateFinalTafScore, STATUS_LABELS } from '@/lib/taf/scoring';
import { calculateProgressToMinimum } from '@/lib/taf/progress';
import { formatTestValue, formatDifference } from '@/lib/taf/time';
import { TAF_TESTS, TAF_TEST_ORDER } from '@/lib/taf/constants';
import type { TafTestType } from '@/lib/taf/types';

export const metadata: Metadata = {
  title: 'Dashboard',
};

// Icon mapping
const TEST_ICONS: Record<string, React.ElementType> = {
  running_2400m: Timer,
  abdominal_60s: Dumbbell,
  pull_up_dynamic: ArrowUpFromLine,
  shuttle_run: Zap,
  swimming_50m: Waves,
};

// Demo data — in production, this comes from Supabase
const DEMO_RESULTS: Record<string, number | null> = {
  running_2400m: 800, // 13min20s
  abdominal_60s: 30,
  pull_up_dynamic: 2,
  shuttle_run: 11.10,
  swimming_50m: null, // not tested
};

function getScoreColor(score: number, passing: boolean): string {
  if (!passing || score === 0) return 'text-red-500';
  if (score <= 13) return 'text-yellow-500';
  if (score <= 16) return 'text-green-500';
  if (score <= 19) return 'text-amber-500';
  return 'text-fire-500';
}

function getProgressColor(score: number, passing: boolean): string {
  if (!passing || score === 0) return 'bg-red-500';
  if (score <= 13) return 'bg-yellow-500';
  if (score <= 16) return 'bg-green-500';
  if (score <= 19) return 'bg-amber-500';
  return 'bg-fire-500';
}

function getTrendIcon(score: number, passing: boolean) {
  if (!passing) return { icon: AlertTriangle, label: 'Abaixo do mínimo', color: 'text-red-400' };
  if (score >= 16) return { icon: TrendingUp, label: 'Desempenho elevado', color: 'text-green-400' };
  if (score >= 12) return { icon: CheckCircle2, label: 'Índice alcançado', color: 'text-green-400' };
  return { icon: Minus, label: 'Estável', color: 'text-muted-foreground' };
}

export default function DashboardPage() {
  // Calculate scores for all tests
  const testResults = TAF_TEST_ORDER.map((testType) => {
    const rawValue = DEMO_RESULTS[testType] ?? null;
    const result = calculateOfficialScore(testType, rawValue);
    const config = TAF_TESTS[testType]!;
    const progress = calculateProgressToMinimum(testType, rawValue);
    return { ...result, config, progress, rawValue };
  });

  // Calculate final TAF score
  const validResults = TAF_TEST_ORDER
    .filter((t) => DEMO_RESULTS[t] !== null)
    .map((t) => ({ testType: t, rawValue: DEMO_RESULTS[t]! }));

  const finalScore = calculateFinalTafScore(
    TAF_TEST_ORDER.map((t) => ({
      testType: t,
      rawValue: DEMO_RESULTS[t] ?? 0,
    })),
  );

  const daysUntilTaf = 180; // Demo
  const userName = 'Canhoto';
  const trainingStreak = 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            Olá, <span className="gradient-text">{userName}</span>
          </h1>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            {trainingStreak > 0 && (
              <span className="flex items-center gap-1">
                <Flame className="h-4 w-4 text-fire-500" aria-hidden="true" />
                {trainingStreak} dias seguidos
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" aria-hidden="true" />
              {daysUntilTaf} dias até o TAF
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="fire" asChild>
            <Link href="/treinos/novo">
              <PlusCircle className="mr-2 h-4 w-4" aria-hidden="true" />
              Registrar Treino
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/simulados/novo">
              <ClipboardCheck className="mr-2 h-4 w-4" aria-hidden="true" />
              Simulado
            </Link>
          </Button>
        </div>
      </div>

      {/* Status Geral Card */}
      <Card className="border-border/50 bg-gradient-to-br from-card to-card/80">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-5 w-5 text-ember-500" aria-hidden="true" />
              Preparação para o TAF
            </CardTitle>
            <Badge
              variant={finalScore.allTestsPassing ? 'success' : 'destructive'}
              className="text-xs"
            >
              {STATUS_LABELS[finalScore.overallStatus]}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <p className="text-xs text-muted-foreground">Provas no índice</p>
              <p className="text-2xl font-bold text-foreground">
                {finalScore.testsPassing}
                <span className="text-sm font-normal text-muted-foreground">/5</span>
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Nota simulada</p>
              <p className="text-2xl font-bold text-foreground">
                {finalScore.finalScore.toFixed(1)}
                <span className="text-sm font-normal text-muted-foreground">/50</span>
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Prova mais crítica</p>
              <p className="text-sm font-semibold text-red-400">
                {finalScore.weakestTest
                  ? TAF_TESTS[finalScore.weakestTest]?.shortName
                  : '--'}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Melhor prova</p>
              <p className="text-sm font-semibold text-green-400">
                {finalScore.strongestTest
                  ? TAF_TESTS[finalScore.strongestTest]?.shortName
                  : '--'}
              </p>
            </div>
          </div>

          {!finalScore.allTestsPassing && (
            <div className="mt-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive" role="alert">
              <AlertTriangle className="mr-2 inline h-4 w-4" aria-hidden="true" />
              {finalScore.testsBelowMinimum} prova(s) abaixo do índice mínimo.
              Uma nota alta não compensa resultado abaixo do mínimo em outra prova.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {testResults.map((result) => {
          const Icon = TEST_ICONS[result.testType] ?? Target;
          const trend = getTrendIcon(result.score, result.passing);
          const TrendIcon = trend.icon;

          return (
            <Card key={result.testType} className="card-hover border-border/50">
              <CardContent className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`rounded-lg bg-secondary/50 p-2 ${getScoreColor(result.score, result.passing)}`}
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{result.config.shortName}</h3>
                      <p className="text-xs text-muted-foreground">{result.config.category}</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 text-xs ${trend.color}`}>
                    <TrendIcon className="h-3.5 w-3.5" aria-hidden="true" />
                    <span className="sr-only">{trend.label}</span>
                  </div>
                </div>

                {/* Score */}
                <div className="mt-4 flex items-baseline gap-2">
                  {result.rawValue !== null ? (
                    <>
                      <span className={`text-3xl font-bold ${getScoreColor(result.score, result.passing)}`}>
                        {result.score}
                      </span>
                      <span className="text-sm text-muted-foreground">/ 20 pts</span>
                    </>
                  ) : (
                    <span className="text-sm italic text-muted-foreground">Avaliação pendente</span>
                  )}
                </div>

                {/* Result value */}
                {result.rawValue !== null && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    Resultado: {formatTestValue(result.rawValue, result.testType)}
                  </p>
                )}

                {/* Status */}
                {result.rawValue !== null && (
                  <div className="mt-2">
                    {result.passing ? (
                      <Badge variant="success" className="text-xs">
                        <CheckCircle2 className="mr-1 h-3 w-3" aria-hidden="true" />
                        Índice alcançado
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="text-xs">
                        <AlertTriangle className="mr-1 h-3 w-3" aria-hidden="true" />
                        Abaixo do mínimo
                      </Badge>
                    )}
                  </div>
                )}

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-muted-foreground">Progresso até o mínimo</span>
                    <span className={getScoreColor(result.score, result.passing)}>
                      {result.progress}%
                    </span>
                  </div>
                  <Progress
                    value={Math.min(100, result.progress)}
                    indicatorClassName={getProgressColor(result.score, result.passing)}
                    aria-label={`Progresso: ${result.progress}% do mínimo`}
                  />
                </div>

                {/* Difference info */}
                {result.rawValue !== null && !result.passing && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    {formatDifference(
                      result.differenceToMinimum,
                      result.testType,
                      result.config.direction,
                    )}
                  </p>
                )}

                {/* Actions */}
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <Link href={`/treinos/novo?prova=${result.testType}`}>
                      <PlusCircle className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                      Registrar
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1" asChild>
                    <Link href={`/treinos?prova=${result.testType}`}>
                      Histórico
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Next Mission */}
      <Card className="border-ember-600/20 bg-gradient-to-r from-ember-950/30 to-fire-950/30">
        <CardContent className="flex items-center gap-4 p-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ember-600/20 text-ember-500">
            <Flame className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Próxima Missão</p>
            <p className="text-sm text-muted-foreground">
              {finalScore.weakestTest === 'abdominal_60s'
                ? 'Alcançar 40 abdominais em 60 segundos para atingir o índice mínimo.'
                : finalScore.weakestTest === 'pull_up_dynamic'
                  ? 'Completar 3 repetições na barra fixa para atingir o índice mínimo.'
                  : finalScore.weakestTest
                    ? `Melhorar o resultado em ${TAF_TESTS[finalScore.weakestTest]?.shortName ?? ''} — sua prova mais crítica.`
                    : 'Registre seus primeiros resultados para começar a jornada.'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <p className="text-center text-[10px] text-muted-foreground/50">
        Pontuação &quot;0&quot; indica resultado abaixo da faixa mínima pontuada na tabela oficial.
        Esta é uma representação interna do aplicativo.
      </p>
    </div>
  );
}
