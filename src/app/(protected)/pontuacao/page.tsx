'use client';

import { Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TAF_TEST_ORDER, TAF_TESTS } from '@/lib/taf/constants';
import { formatTestValue } from '@/lib/taf/time';

export default function ScoreSystemPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-ember-600/10 p-2 text-ember-500">
          <Target className="h-6 w-6" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Sistema de Pontuação</h1>
          <p className="mt-1 text-sm text-muted-foreground">Tabelas oficiais do CFSd 2027 (Masculino)</p>
        </div>
      </div>

      <div className="space-y-8">
        {TAF_TEST_ORDER.map((testType) => {
          const config = TAF_TESTS[testType]!;
          return (
            <Card key={testType} className="border-border/50">
              <CardHeader>
                <CardTitle>{config.name}</CardTitle>
                <CardDescription>
                  Avaliação: {config.direction === 'higher_is_better' ? 'Maior é melhor' : 'Menor é melhor'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto rounded-lg border border-border/50">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-secondary/50 text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3 font-medium">Faixa de Resultado</th>
                        <th className="px-4 py-3 font-medium text-right">Pontos</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {config.scoreRanges.slice().reverse().map((range, i) => (
                        <tr key={i} className={range.score === 12 ? "bg-ember-500/5" : "hover:bg-secondary/30"}>
                          <td className="px-4 py-3">
                            <span className={range.score === 12 ? "font-semibold text-ember-500" : ""}>
                              {range.displayLabel}
                            </span>
                            {range.score === 12 && (
                              <span className="ml-2 text-xs text-ember-500">(Índice Mínimo)</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right font-bold text-foreground">{range.score}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
