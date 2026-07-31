'use client';

import { Award, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AchievementsPage() {
  const achievements = [
    { title: 'Primeiro Treino', desc: 'Registrou sua primeira marca', unlocked: true },
    { title: 'Dez Treinos', desc: 'Completou 10 sessões', unlocked: true },
    { title: 'Mínimo: Abdominal', desc: 'Alcançou o índice mínimo na prova', unlocked: true },
    { title: 'Primeiro Simulado', desc: 'Completou um TAF completo', unlocked: true },
    { title: 'Mínimo em Todas', desc: 'Atingiu o índice nas 5 provas', unlocked: false },
    { title: 'Meio Centurião', desc: 'Completou 50 sessões de treino', unlocked: false },
    { title: 'Centurião', desc: 'Completou 100 sessões de treino', unlocked: false },
    { title: 'Nota Máxima', desc: 'Atingiu 20 pontos em uma prova', unlocked: false },
    { title: '50 Pontos', desc: 'Nota máxima no simulado', unlocked: false },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-ember-600/10 p-2 text-ember-500">
          <Award className="h-6 w-6" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Conquistas</h1>
          <p className="mt-1 text-sm text-muted-foreground">Medalhas e marcos da sua jornada</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((achievement, i) => (
          <Card key={i} className={`border-border/50 ${!achievement.unlocked ? 'opacity-60 grayscale bg-card/50' : ''}`}>
            <CardContent className="flex gap-4 p-5">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${achievement.unlocked ? 'bg-ember-600/10 text-ember-500' : 'bg-secondary text-muted-foreground'}`}>
                {achievement.unlocked ? <Award className="h-6 w-6" /> : <Lock className="h-6 w-6" />}
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm">{achievement.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{achievement.desc}</p>
                {achievement.unlocked ? (
                  <p className="text-[10px] text-success mt-2">Desbloqueado</p>
                ) : (
                  <p className="text-[10px] text-muted-foreground/70 mt-2">Bloqueado</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
