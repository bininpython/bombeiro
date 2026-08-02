import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { startOfWeek, endOfWeek, format } from 'date-fns';
import WorkoutChecklist from './WorkoutChecklist';

export const metadata: Metadata = {
  title: 'Checklist de Treinos | X1',
};

export default async function TreinosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Buscar logs da semana atual
  const today = new Date();
  const start = format(startOfWeek(today, { weekStartsOn: 0 }), 'yyyy-MM-dd');
  const end = format(endOfWeek(today, { weekStartsOn: 0 }), 'yyyy-MM-dd');

  const { data: logs } = await supabase
    .from('workout_logs')
    .select('exercise_id, date')
    .eq('user_id', user?.id)
    .gte('date', start)
    .lte('date', end);

  return (
    <div className="animate-fade-in max-w-2xl mx-auto pb-10 px-2 sm:px-4">
      <div className="flex flex-col gap-2 py-6">
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
          Minha Ficha
        </h1>
        <p className="text-muted-foreground">
          Acompanhe seus exercícios diários e marque-os como concluídos.
        </p>
      </div>

      <WorkoutChecklist initialLogs={logs || []} />
    </div>
  );
}
