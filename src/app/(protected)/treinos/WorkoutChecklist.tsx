'use client';

import { useState } from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { format, startOfWeek, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WORKOUT_ROUTINE } from '@/lib/workout/constants';
import { toggleExerciseCompletion } from '@/app/actions/workout';
import { toast } from '@/hooks/use-toast';

type WorkoutChecklistProps = {
  initialLogs: { exercise_id: string; date: string }[];
};

export default function WorkoutChecklist({ initialLogs }: WorkoutChecklistProps) {
  // O domingo é o dia 0 no date-fns (padrão)
  const today = new Date();
  const currentDayOfWeek = today.getDay();
  const currentWeekStart = startOfWeek(today, { weekStartsOn: 0 }); // Domingo
  
  const [logs, setLogs] = useState(initialLogs);
  const [activeTab, setActiveTab] = useState(currentDayOfWeek.toString());

  const handleToggle = async (exerciseId: string, dayOfWeek: number) => {
    const targetDate = addDays(currentWeekStart, dayOfWeek);
    const dateStr = format(targetDate, 'yyyy-MM-dd');
    
    // Verifica se já está concluído
    const isCompleted = logs.some(log => log.exercise_id === exerciseId && log.date === dateStr);
    
    // Otimistic update
    if (isCompleted) {
      setLogs(prev => prev.filter(log => !(log.exercise_id === exerciseId && log.date === dateStr)));
    } else {
      setLogs(prev => [...prev, { exercise_id: exerciseId, date: dateStr }]);
    }

    const result = await toggleExerciseCompletion(exerciseId, dateStr, !isCompleted);
    
    if (result.error) {
      // Revert optimistic update se falhar
      if (isCompleted) {
        setLogs(prev => [...prev, { exercise_id: exerciseId, date: dateStr }]);
      } else {
        setLogs(prev => prev.filter(log => !(log.exercise_id === exerciseId && log.date === dateStr)));
      }
      toast({
        title: 'Erro',
        description: result.error,
        variant: 'destructive',
      });
    } else if (!isCompleted) {
        // Tocou som ou feedback visual adicional?
    }
  };

  return (
    <div className="w-full">
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-7 mb-6 bg-card/50">
          {[0, 1, 2, 3, 4, 5, 6].map(dayIdx => {
            const date = addDays(currentWeekStart, dayIdx);
            const isToday = dayIdx === currentDayOfWeek;
            return (
              <TabsTrigger 
                key={dayIdx} 
                value={dayIdx.toString()}
                className={`flex flex-col h-auto py-2 ${isToday ? 'border-b-2 border-fire-500 rounded-none' : ''}`}
              >
                <span className="text-xs uppercase text-muted-foreground">
                  {format(date, 'eee', { locale: ptBR }).substring(0, 3)}
                </span>
                <span className={`text-lg font-bold ${isToday ? 'text-fire-500' : ''}`}>
                  {format(date, 'd')}
                </span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {WORKOUT_ROUTINE.map(day => (
          <TabsContent key={day.dayOfWeek} value={day.dayOfWeek.toString()} className="animate-fade-in">
            <div className="mb-6">
              <h2 className="text-2xl font-bold gradient-text">{day.title}</h2>
              <p className="text-muted-foreground text-sm mt-1">
                {format(addDays(currentWeekStart, day.dayOfWeek), "EEEE, d 'de' MMMM", { locale: ptBR })}
              </p>
            </div>

            <div className="space-y-3">
              {day.exercises.map(ex => {
                const dateStr = format(addDays(currentWeekStart, day.dayOfWeek), 'yyyy-MM-dd');
                const isCompleted = logs.some(log => log.exercise_id === ex.id && log.date === dateStr);

                return (
                  <Card 
                    key={ex.id}
                    className={`flex items-center justify-between p-4 cursor-pointer transition-all ${
                      isCompleted ? 'bg-green-500/10 border-green-500/50' : 'bg-card/80 hover:bg-card border-border/50'
                    }`}
                    onClick={() => handleToggle(ex.id, day.dayOfWeek)}
                  >
                    <div className="flex flex-col">
                      <span className={`font-semibold ${isCompleted ? 'text-green-500 line-through opacity-80' : 'text-foreground'}`}>
                        {ex.name}
                      </span>
                      <div className="text-sm flex gap-3 text-muted-foreground">
                        {ex.sets && <span><strong>Séries:</strong> {ex.sets}</span>}
                        {ex.reps && <span><strong>Reps:</strong> {ex.reps}</span>}
                        {ex.duration && <span><strong>Duração:</strong> {ex.duration}</span>}
                      </div>
                    </div>
                    
                    <button className="flex-shrink-0 transition-transform active:scale-95 p-2">
                      {isCompleted ? (
                        <CheckCircle2 className="h-8 w-8 text-green-500 animate-in zoom-in" />
                      ) : (
                        <Circle className="h-8 w-8 text-muted-foreground hover:text-foreground transition-colors" />
                      )}
                    </button>
                  </Card>
                );
              })}
            </div>
            
            {day.exercises.every(ex => logs.some(log => log.exercise_id === ex.id && log.date === format(addDays(currentWeekStart, day.dayOfWeek), 'yyyy-MM-dd'))) && (
              <div className="mt-8 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-center animate-bounce">
                <span className="font-bold text-green-500">🔥 Excelente! Você completou todos os exercícios do dia. 🔥</span>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
