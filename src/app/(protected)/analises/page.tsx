'use client';


import { BarChart3, TrendingUp, Calendar as CalendarIcon, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TAF_TESTS, TAF_TEST_ORDER } from '@/lib/taf/constants';
import { cn } from '@/lib/utils';
import { useState } from 'react';

// Demo data for the chart
const DEMO_HISTORY = [
  { date: '10/10', score: 10 },
  { date: '15/10', score: 12 },
  { date: '20/10', score: 12 },
  { date: '25/10', score: 14 },
  { date: '30/10', score: 15 },
  { date: '04/11', score: 16 },
];

export default function AnalysisPage() {
  const [activeTab, setActiveTab] = useState<string>(TAF_TEST_ORDER[0]);
  const config = TAF_TESTS[activeTab]!;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-primary/10 p-2 text-primary">
          <BarChart3 className="h-6 w-6" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Análises e Gráficos</h1>
          <p className="mt-1 text-sm text-muted-foreground">Acompanhe seu desempenho ao longo do tempo</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto pb-2 scrollbar-hide">
        <div className="flex gap-2">
          {TAF_TEST_ORDER.map((testType) => {
            const testConfig = TAF_TESTS[testType]!;
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
                {testConfig.shortName}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Main Chart Card */}
        <Card className="border-border/50 md:col-span-2">
          <CardHeader>
            <CardTitle>Evolução da Pontuação</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Simple CSS Bar Chart Simulation */}
            <div className="mt-4 flex h-64 items-end gap-2 border-b border-l border-border/50 pb-2 pl-2">
              {DEMO_HISTORY.map((entry, i) => {
                const heightPercentage = (entry.score / 20) * 100;
                const isMax = entry.score === Math.max(...DEMO_HISTORY.map(d => d.score));
                
                return (
                  <div key={i} className="group relative flex flex-1 flex-col items-center justify-end">
                    {/* Tooltip */}
                    <div className="absolute -top-10 hidden rounded bg-popover px-2 py-1 text-xs text-popover-foreground shadow-md group-hover:block">
                      {entry.score} pts
                    </div>
                    {/* Bar */}
                    <div 
                      className={cn(
                        "w-full max-w-[40px] rounded-t-md transition-all duration-500",
                        isMax ? "bg-ember-500" : "bg-primary/60 hover:bg-primary/80"
                      )}
                      style={{ height: `${heightPercentage}%` }}
                    />
                    {/* Label */}
                    <span className="absolute -bottom-6 text-[10px] text-muted-foreground">{entry.date}</span>
                  </div>
                );
              })}
            </div>
            
            {/* Legend */}
            <div className="mt-10 flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-full bg-primary/60" />
                <span>Pontuação</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-full bg-ember-500" />
                <span>Melhor marca</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-[2px] w-4 border-t border-dashed border-muted-foreground" />
                <span>Mínimo (12)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Column */}
        <div className="space-y-6">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Média Recente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">14.3<span className="text-lg text-muted-foreground"> pts</span></div>
              <p className="mt-1 flex items-center gap-1 text-xs text-success">
                <TrendingUp className="h-3 w-3" />
                +2.1 desde o mês passado
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Consistência
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">85<span className="text-lg text-muted-foreground">%</span></div>
              <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <Activity className="h-3 w-3" />
                No índice nas últimas 6 sessões
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Sessões
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">24</div>
              <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <CalendarIcon className="h-3 w-3" />
                Últimos 90 dias
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
