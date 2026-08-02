import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { startOfWeek, endOfWeek, format, subWeeks, eachDayOfInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Flame, Trophy, CalendarDays, TrendingUp } from 'lucide-react';
import { WORKOUT_ROUTINE } from '@/lib/workout/constants';

export const metadata: Metadata = {
  title: 'Evolução | X1',
};

export default async function EvolucaoPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Vamos pegar logs das últimas 4 semanas
  const today = new Date();
  const currentWeekStart = startOfWeek(today, { weekStartsOn: 0 });
  const fourWeeksAgo = subWeeks(currentWeekStart, 3);
  
  const startStr = format(fourWeeksAgo, 'yyyy-MM-dd');
  const endStr = format(endOfWeek(today, { weekStartsOn: 0 }), 'yyyy-MM-dd');

  const { data: logs } = await supabase
    .from('workout_logs')
    .select('exercise_id, date')
    .eq('user_id', user?.id)
    .gte('date', startStr)
    .lte('date', endStr);

  const safeLogs = logs || [];

  // Calcular métricas da SEMANA ATUAL
  const currentWeekStartStr = format(currentWeekStart, 'yyyy-MM-dd');
  const currentWeekEndStr = endStr;
  
  const currentWeekLogs = safeLogs.filter(
    (l) => l.date >= currentWeekStartStr && l.date <= currentWeekEndStr
  );

  let totalExercisesThisWeek = 0;
  WORKOUT_ROUTINE.forEach(day => {
    totalExercisesThisWeek += day.exercises.length;
  });

  const completedExercisesThisWeek = currentWeekLogs.length;
  const progressPercent = totalExercisesThisWeek > 0 
    ? Math.round((completedExercisesThisWeek / totalExercisesThisWeek) * 100) 
    : 0;

  // Dias ativos na semana atual (dias em que fez pelo menos 1 exercício)
  const activeDaysThisWeek = new Set(currentWeekLogs.map(l => l.date)).size;

  // Streak (dias seguidos até hoje)
  // Requer uma lógica que olhe o passado de trás pra frente a partir de hoje
  const allDates = [...new Set(safeLogs.map(l => l.date))].sort().reverse();
  let streak = 0;
  let checkDate = new Date();
  
  // Normalizar checkDate para string yyyy-MM-dd
  while (true) {
    const dStr = format(checkDate, 'yyyy-MM-dd');
    if (allDates.includes(dStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      // Se não tem no dia de hoje, olha ontem. Se não tiver também, corta.
      if (streak === 0 && format(checkDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) {
         checkDate.setDate(checkDate.getDate() - 1);
         if (allDates.includes(format(checkDate, 'yyyy-MM-dd'))) {
           streak++;
           checkDate.setDate(checkDate.getDate() - 1);
           continue;
         }
      }
      break;
    }
  }

  // Obter mapa de dias concluídos (para mapa de calor ou lista da semana)
  const daysInWeek = eachDayOfInterval({ start: currentWeekStart, end: endOfWeek(today, { weekStartsOn: 0 }) });

  return (
    <div className="animate-fade-in max-w-4xl mx-auto pb-10 px-4">
      <div className="flex flex-col gap-2 py-6">
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
          Evolução & Monitoramento
        </h1>
        <p className="text-muted-foreground">
          Acompanhe sua disciplina e adesão à ficha de treinos.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="p-6 flex flex-col items-center text-center justify-center bg-card/80 border-border/50 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-4 -mt-4 bg-fire-500/10 p-6 rounded-full">
            <TrendingUp className="h-8 w-8 text-fire-500 opacity-50" />
          </div>
          <p className="text-sm font-medium text-muted-foreground mb-1">Adesão na Semana</p>
          <h3 className="text-4xl font-black gradient-text">{progressPercent}%</h3>
        </Card>
        
        <Card className="p-6 flex flex-col items-center text-center justify-center bg-card/80 border-border/50 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-4 -mt-4 bg-orange-500/10 p-6 rounded-full">
            <Flame className="h-8 w-8 text-orange-500 opacity-50" />
          </div>
          <p className="text-sm font-medium text-muted-foreground mb-1">Dias Seguidos</p>
          <h3 className="text-4xl font-black text-orange-500">{streak}</h3>
        </Card>

        <Card className="p-6 flex flex-col items-center text-center justify-center bg-card/80 border-border/50 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-4 -mt-4 bg-green-500/10 p-6 rounded-full">
            <CheckCircle2Icon className="h-8 w-8 text-green-500 opacity-50" />
          </div>
          <p className="text-sm font-medium text-muted-foreground mb-1">Exercícios Feitos</p>
          <h3 className="text-4xl font-black text-green-500">{completedExercisesThisWeek}</h3>
          <p className="text-xs text-muted-foreground mt-1">de {totalExercisesThisWeek} previstos</p>
        </Card>

        <Card className="p-6 flex flex-col items-center text-center justify-center bg-card/80 border-border/50 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-4 -mt-4 bg-blue-500/10 p-6 rounded-full">
            <CalendarDays className="h-8 w-8 text-blue-500 opacity-50" />
          </div>
          <p className="text-sm font-medium text-muted-foreground mb-1">Dias de Treino</p>
          <h3 className="text-4xl font-black text-blue-500">{activeDaysThisWeek}</h3>
          <p className="text-xs text-muted-foreground mt-1">na semana</p>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6 bg-card/80 border-border/50">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-fire-500" /> Meta da Semana
          </h3>
          <Progress value={progressPercent} className="h-4 bg-secondary" indicatorColor="bg-gradient-to-r from-fire-500 to-orange-400" />
          <div className="mt-4 text-sm text-muted-foreground text-center">
            {progressPercent === 100 
              ? "Incrível! Você fechou a semana 100%!" 
              : `Faltam ${totalExercisesThisWeek - completedExercisesThisWeek} exercícios para completar a semana.`}
          </div>
        </Card>

        <Card className="p-6 bg-card/80 border-border/50">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-fire-500" /> Visão da Semana
          </h3>
          <div className="flex justify-between items-center h-full pb-4">
            {daysInWeek.map(date => {
              const dStr = format(date, 'yyyy-MM-dd');
              const exNoDia = safeLogs.filter(l => l.date === dStr).length;
              const hasActivity = exNoDia > 0;
              const isToday = format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
              
              return (
                <div key={dStr} className="flex flex-col items-center gap-2">
                  <div className="text-xs font-medium text-muted-foreground uppercase">
                    {format(date, 'eee', { locale: ptBR }).substring(0, 3)}
                  </div>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    hasActivity 
                      ? 'bg-fire-500 text-white shadow-lg shadow-fire-500/30 ring-2 ring-fire-500/50 ring-offset-2 ring-offset-background' 
                      : isToday 
                        ? 'border-2 border-fire-500 text-fire-500' 
                        : 'bg-secondary text-muted-foreground'
                  }`}>
                    {format(date, 'd')}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {hasActivity ? `${exNoDia} ex` : '-'}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
      
    </div>
  );
}

// Pequeno Helper Icon
function CheckCircle2Icon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
