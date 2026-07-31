'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Timer,
  Dumbbell,
  ArrowUpFromLine,
  Zap,
  Waves,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { calculateOfficialScore } from '@/lib/taf/scoring';
import { calculateProgressToMinimum } from '@/lib/taf/progress';
import { parseDuration, formatTestValue, formatDifference } from '@/lib/taf/time';
import { TAF_TESTS, TAF_TEST_ORDER } from '@/lib/taf/constants';
import type { TafTestType } from '@/lib/taf/types';
import { cn } from '@/lib/utils';

const TEST_ICONS: Record<string, React.ElementType> = {
  running_2400m: Timer,
  abdominal_60s: Dumbbell,
  pull_up_dynamic: ArrowUpFromLine,
  shuttle_run: Zap,
  swimming_50m: Waves,
};

const trainingSchema = z.object({
  testType: z.string().min(1, 'Selecione uma prova'),
  rawValue: z.string().min(1, 'Informe o resultado'),
  perceivedEffort: z.number().min(1).max(10).optional(),
  painReported: z.boolean().default(false),
  painNotes: z.string().optional(),
  notes: z.string().optional(),
  location: z.string().optional(),
});

type TrainingForm = z.infer<typeof trainingSchema>;

export default function NewTrainingPage() {

  const searchParams = useSearchParams();
  const preselectedTest = searchParams.get('prova') as TafTestType | null;

  const [step, setStep] = useState(preselectedTest ? 2 : 1);
  const [selectedTest, setSelectedTest] = useState<TafTestType | null>(preselectedTest);
  const [scoringResult, setScoringResult] = useState<ReturnType<typeof calculateOfficialScore> | null>(null);
  const [saved, setSaved] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TrainingForm>({
    resolver: zodResolver(trainingSchema),
    defaultValues: {
      testType: preselectedTest || '',
      rawValue: '',
      painReported: false,
    },
  });

  const watchedValue = watch('rawValue');
  const watchedPain = watch('painReported');

  // Calculate score in real-time
  const liveScore = (() => {
    if (!selectedTest || !watchedValue) return null;
    const config = TAF_TESTS[selectedTest];
    if (!config) return null;

    let numericValue: number | null = null;
    if (config.unit === 'repetitions') {
      numericValue = parseInt(watchedValue, 10);
    } else {
      numericValue = parseDuration(watchedValue);
    }

    if (numericValue === null || isNaN(numericValue)) return null;
    return calculateOfficialScore(selectedTest, numericValue);
  })();

  function selectTest(testType: TafTestType) {
    setSelectedTest(testType);
    setValue('testType', testType);
    setStep(2);
  }

  async function onSubmit(data: TrainingForm) {
    if (!selectedTest) return;

    const config = TAF_TESTS[selectedTest];
    if (!config) return;

    let numericValue: number | null = null;
    if (config.unit === 'repetitions') {
      numericValue = parseInt(data.rawValue, 10);
    } else {
      numericValue = parseDuration(data.rawValue);
    }

    if (numericValue === null) return;

    const result = calculateOfficialScore(selectedTest, numericValue);
    setScoringResult(result);

    // In production, save to Supabase here
    // const supabase = createClient();
    // await supabase.from('training_sessions').insert(...)

    setSaved(true);
    setStep(4);
  }

  // Step 1: Select test
  if (step === 1) {
    return (
      <div className="mx-auto max-w-lg space-y-4 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Registrar Treino</h1>
          <p className="mt-1 text-sm text-muted-foreground">Selecione a prova que você treinou</p>
        </div>

        <div className="space-y-3">
          {TAF_TEST_ORDER.map((testType) => {
            const config = TAF_TESTS[testType]!;
            const Icon = TEST_ICONS[testType] ?? Dumbbell;

            return (
              <button
                key={testType}
                onClick={() => selectTest(testType)}
                className="flex w-full items-center gap-4 rounded-xl border border-border/50 bg-card p-4 text-left transition-all hover:border-primary/30 hover:bg-card/80 active:scale-[0.98]"
              >
                <div className="rounded-lg bg-secondary/50 p-3 text-foreground">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{config.shortName}</p>
                  <p className="text-xs text-muted-foreground">{config.category}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Step 4: Feedback
  if (step === 4 && scoringResult && selectedTest) {
    const config = TAF_TESTS[selectedTest]!;
    const progress = calculateProgressToMinimum(selectedTest, scoringResult.rawValue);

    return (
      <div className="mx-auto max-w-lg space-y-6 animate-fade-in">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10 animate-score-pop">
            <CheckCircle2 className="h-8 w-8 text-success" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Treino Registrado!</h1>
        </div>

        <Card className="border-border/50">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground">{config.shortName}</p>
            <p className="mt-1 text-lg font-semibold text-foreground">
              {formatTestValue(scoringResult.rawValue, selectedTest)}
            </p>

            <div className="mt-4">
              <span
                className={cn(
                  'text-5xl font-bold animate-score-pop',
                  scoringResult.passing ? 'text-success' : 'text-destructive',
                )}
              >
                {scoringResult.score}
              </span>
              <span className="text-lg text-muted-foreground"> / 20 pontos</span>
            </div>

            {scoringResult.passing ? (
              <Badge variant="success" className="mt-3">
                <CheckCircle2 className="mr-1 h-3 w-3" aria-hidden="true" />
                Índice Alcançado
              </Badge>
            ) : (
              <Badge variant="destructive" className="mt-3">
                <AlertTriangle className="mr-1 h-3 w-3" aria-hidden="true" />
                Abaixo do Mínimo
              </Badge>
            )}

            {/* Progress */}
            <div className="mt-6">
              <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                <span>Progresso até o mínimo</span>
                <span>{progress}%</span>
              </div>
              <Progress
                value={Math.min(100, progress)}
                indicatorClassName={scoringResult.passing ? 'bg-success' : 'bg-destructive'}
              />
            </div>

            {/* Difference info */}
            {!scoringResult.passing && (
              <p className="mt-3 text-sm text-muted-foreground">
                {formatDifference(
                  scoringResult.differenceToMinimum,
                  selectedTest,
                  config.direction,
                )}{' '}
                para alcançar o índice mínimo.
              </p>
            )}

            {scoringResult.passing && scoringResult.nextRange && (
              <p className="mt-3 text-sm text-muted-foreground">
                Próxima faixa: {scoringResult.nextRange.score} pontos
                {scoringResult.differenceToNextScore !== null && (
                  <>
                    {' — '}
                    {formatDifference(
                      scoringResult.differenceToNextScore,
                      selectedTest,
                      config.direction,
                    )}
                  </>
                )}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Motivational message */}
        <Card className="border-ember-600/20 bg-gradient-to-r from-ember-950/30 to-fire-950/30">
          <CardContent className="flex items-center gap-3 p-4">
            <Flame className="h-5 w-5 shrink-0 text-ember-500" aria-hidden="true" />
            <p className="text-sm text-foreground">
              {scoringResult.passing
                ? 'Primeiro objetivo alcançado. Agora construa margem de segurança.'
                : `Continue treinando. ${formatDifference(
                    scoringResult.differenceToMinimum,
                    selectedTest,
                    config.direction,
                  )} para o mínimo.`}
            </p>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              setSaved(false);
              setScoringResult(null);
              setStep(1);
              setSelectedTest(null);
            }}
          >
            Novo treino
          </Button>
          <Button variant="fire" className="flex-1" asChild>
            <a href="/dashboard">Ir ao Dashboard</a>
          </Button>
        </div>
      </div>
    );
  }

  // Steps 2-3: Input result
  const config = selectedTest ? TAF_TESTS[selectedTest] : null;
  const Icon = selectedTest ? (TEST_ICONS[selectedTest] ?? Dumbbell) : Dumbbell;

  return (
    <div className="mx-auto max-w-lg space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => setStep(1)} aria-label="Voltar">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-foreground">{config?.shortName}</h1>
          <p className="text-xs text-muted-foreground">{config?.category}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="border-border/50">
          <CardContent className="space-y-6 p-6">
            {/* Main value input */}
            <div className="space-y-2">
              <Label htmlFor="rawValue" className="text-base font-semibold">
                {config?.unit === 'repetitions' ? 'Repetições' : 'Tempo'}
              </Label>
              <p className="text-xs text-muted-foreground">
                {config?.unit === 'repetitions'
                  ? 'Quantidade de repetições válidas'
                  : config?.slug === 'running_2400m'
                    ? 'Formato: MM:SS (ex: 12:45)'
                    : 'Formato: SS.cc (ex: 10.84)'}
              </p>
              <Input
                id="rawValue"
                type={config?.unit === 'repetitions' ? 'number' : 'text'}
                inputMode={config?.unit === 'repetitions' ? 'numeric' : 'decimal'}
                placeholder={
                  config?.unit === 'repetitions'
                    ? 'Ex: 40'
                    : config?.slug === 'running_2400m'
                      ? 'Ex: 12:45'
                      : 'Ex: 10.84'
                }
                className="text-center text-2xl font-bold h-14"
                autoFocus
                {...register('rawValue')}
                aria-invalid={!!errors.rawValue}
              />
              {errors.rawValue && (
                <p className="text-xs text-destructive">{errors.rawValue.message}</p>
              )}
            </div>

            {/* Live score preview */}
            {liveScore && (
              <div className="rounded-lg bg-secondary/30 p-4 text-center animate-slide-up">
                <p className="text-xs text-muted-foreground">Pontuação instantânea</p>
                <p
                  className={cn(
                    'text-4xl font-bold mt-1',
                    liveScore.passing ? 'text-success' : 'text-destructive',
                  )}
                >
                  {liveScore.score}
                  <span className="text-base text-muted-foreground"> pts</span>
                </p>
                {liveScore.passing ? (
                  <p className="mt-1 text-xs text-success">✓ Índice alcançado</p>
                ) : (
                  <p className="mt-1 text-xs text-destructive">✗ Abaixo do mínimo</p>
                )}
              </div>
            )}

            {/* Optional fields */}
            <div className="space-y-4 border-t border-border/50 pt-4">
              <p className="text-xs font-medium text-muted-foreground">Informações opcionais</p>

              {/* Perceived effort */}
              <div className="space-y-2">
                <Label htmlFor="perceivedEffort">Percepção de esforço (1-10)</Label>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setValue('perceivedEffort', n)}
                      className={cn(
                        'flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-medium transition-colors touch-target',
                        watch('perceivedEffort') === n
                          ? n <= 3
                            ? 'border-green-500 bg-green-500/20 text-green-400'
                            : n <= 6
                              ? 'border-yellow-500 bg-yellow-500/20 text-yellow-400'
                              : 'border-red-500 bg-red-500/20 text-red-400'
                          : 'border-border bg-secondary/30 text-muted-foreground hover:bg-secondary/50',
                      )}
                      aria-label={`Esforço ${n}`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pain */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="painReported"
                  className="h-5 w-5 rounded border-border accent-destructive"
                  {...register('painReported')}
                />
                <Label htmlFor="painReported" className="text-sm">
                  Senti dor ou desconforto durante o exercício
                </Label>
              </div>

              {watchedPain && (
                <div className="space-y-2 animate-slide-up">
                  <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive" role="alert">
                    Se a dor for intensa, interrompa o exercício e procure avaliação de um profissional de saúde.
                  </div>
                  <Label htmlFor="painNotes">Descreva a dor</Label>
                  <Input
                    id="painNotes"
                    placeholder="Local, intensidade, tipo..."
                    {...register('painNotes')}
                  />
                </div>
              )}

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Observações</Label>
                <Input
                  id="notes"
                  placeholder="Condições, técnica, equipamento..."
                  {...register('notes')}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Button
          type="submit"
          variant="fire"
          className="mt-4 w-full"
          size="lg"
          disabled={isSubmitting || !watchedValue}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Salvar Treino
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
