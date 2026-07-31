'use client';


import { 
  Map, 
  CheckCircle2, 
  Lock,
  Timer,
  Dumbbell,
  ArrowUpFromLine,
  Zap,
  Waves
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TAF_TESTS, TAF_TEST_ORDER } from '@/lib/taf/constants';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const TEST_ICONS: Record<string, React.ElementType> = {
  running_2400m: Timer,
  abdominal_60s: Dumbbell,
  pull_up_dynamic: ArrowUpFromLine,
  shuttle_run: Zap,
  swimming_50m: Waves,
};

// Demo Data
const DEMO_MILESTONES = {
  running_2400m: [
    { id: 1, title: 'Completar os 2.400m', target: 'Sem parar', status: 'achieved', points: 0 },
    { id: 2, title: 'Baixar de 14 minutos', target: '13:59', status: 'achieved', points: 0 },
    { id: 3, title: 'Índice Mínimo', target: '12:45', status: 'in_progress', points: 12 },
    { id: 4, title: 'Margem de Segurança', target: '11:45', status: 'pending', points: 14 },
    { id: 5, title: 'Pontuação Máxima', target: '8:44', status: 'pending', points: 20 },
  ],
  abdominal_60s: [
    { id: 1, title: 'Técnica Correta', target: '10 repetições perfeitas', status: 'achieved', points: 0 },
    { id: 2, title: '30 repetições', target: '30 rep', status: 'achieved', points: 0 },
    { id: 3, title: 'Índice Mínimo', target: '40 rep', status: 'achieved', points: 12 },
    { id: 4, title: 'Margem de Segurança', target: '50 rep', status: 'in_progress', points: 16 },
    { id: 5, title: 'Pontuação Máxima', target: '67 rep', status: 'pending', points: 20 },
  ],
  pull_up_dynamic: [
    { id: 1, title: '1 Repetição Válida', target: '1 rep', status: 'achieved', points: 0 },
    { id: 2, title: 'Índice Mínimo', target: '3 rep', status: 'in_progress', points: 12 },
    { id: 3, title: 'Margem de Segurança', target: '6 rep', status: 'pending', points: 14 },
    { id: 4, title: '10 Repetições', target: '10 rep', status: 'pending', points: 17 },
    { id: 5, title: 'Pontuação Máxima', target: '15 rep', status: 'pending', points: 20 },
  ],
  shuttle_run: [
    { id: 1, title: 'Técnica e Virada', target: 'Sem derrubar blocos', status: 'achieved', points: 0 },
    { id: 2, title: 'Baixar de 12s', target: '11.99s', status: 'achieved', points: 0 },
    { id: 3, title: 'Índice Mínimo', target: '10.84s', status: 'in_progress', points: 12 },
    { id: 4, title: 'Margem de Segurança', target: '9.88s', status: 'pending', points: 16 },
    { id: 5, title: 'Pontuação Máxima', target: '8.88s', status: 'pending', points: 20 },
  ],
  swimming_50m: [
    { id: 1, title: 'Completar os 50m', target: 'Sem parar', status: 'pending', points: 0 },
    { id: 2, title: 'Baixar de 1:10s', target: '1:09s', status: 'pending', points: 0 },
    { id: 3, title: 'Índice Mínimo', target: '58s', status: 'pending', points: 12 },
    { id: 4, title: 'Margem de Segurança', target: '47s', status: 'pending', points: 15 },
    { id: 5, title: 'Pontuação Máxima', target: '29s', status: 'pending', points: 20 },
  ],
};

export default function RoadmapPage() {
  const [activeTab, setActiveTab] = useState<string>(TAF_TEST_ORDER[0]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-ember-600/10 p-2 text-ember-500">
          <Map className="h-6 w-6" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Roadmap de Evolução</h1>
          <p className="mt-1 text-sm text-muted-foreground">O caminho passo a passo até a nota máxima</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto pb-2 scrollbar-hide">
        <div className="flex gap-2">
          {TAF_TEST_ORDER.map((testType) => {
            const config = TAF_TESTS[testType]!;
            const isActive = activeTab === testType;
            return (
              <button
                key={testType}
                onClick={() => setActiveTab(testType)}
                className={cn(
                  'whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card text-muted-foreground hover:bg-secondary/50'
                )}
              >
                {config.shortName}
              </button>
            );
          })}
        </div>
      </div>

      {/* Milestones */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            {(() => {
              const Icon = TEST_ICONS[activeTab] || Target;
              return <Icon className="h-5 w-5 text-ember-500" />;
            })()}
            {TAF_TESTS[activeTab]?.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative space-y-6 pl-4 before:absolute before:inset-y-0 before:left-[21px] before:w-[2px] before:bg-border/50">
            {DEMO_MILESTONES[activeTab as keyof typeof DEMO_MILESTONES].map((milestone, i, arr) => {
              const isLast = i === arr.length - 1;
              const isAchieved = milestone.status === 'achieved';
              const isInProgress = milestone.status === 'in_progress';
              const isPending = milestone.status === 'pending';

              return (
                <div key={milestone.id} className="relative flex items-start gap-4">
                  <div className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-background">
                    {isAchieved ? (
                      <CheckCircle2 className="h-6 w-6 text-success" />
                    ) : isInProgress ? (
                      <div className="h-4 w-4 rounded-full border-4 border-ember-500 bg-background" />
                    ) : (
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  
                  <div className={cn(
                    "flex-1 rounded-xl border p-4 transition-all",
                    isAchieved ? "border-success/30 bg-success/5" :
                    isInProgress ? "border-ember-500/50 bg-ember-500/5 shadow-md shadow-ember-900/10" :
                    "border-border/50 bg-card/50 opacity-70 grayscale"
                  )}>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className={cn(
                          "font-semibold",
                          isAchieved ? "text-foreground" :
                          isInProgress ? "text-ember-500" :
                          "text-muted-foreground"
                        )}>
                          {milestone.title}
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">Alvo: {milestone.target}</p>
                      </div>
                      
                      {milestone.points > 0 && (
                        <Badge variant={isAchieved ? 'success' : isInProgress ? 'fire' : 'secondary'}>
                          {milestone.points} pts
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
