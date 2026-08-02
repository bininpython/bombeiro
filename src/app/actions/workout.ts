'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function toggleExerciseCompletion(exerciseId: string, dateStr: string, isCompleted: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Usuário não autenticado' };
  }

  try {
    if (isCompleted) {
      // Inserir registro
      const { error } = await supabase
        .from('workout_logs')
        .insert({
          user_id: user.id,
          exercise_id: exerciseId,
          date: dateStr,
        });
      
      if (error && error.code !== '23505') { // Ignorar erro de duplicidade se já existir
        throw error;
      }
    } else {
      // Remover registro
      const { error } = await supabase
        .from('workout_logs')
        .delete()
        .match({
          user_id: user.id,
          exercise_id: exerciseId,
          date: dateStr,
        });

      if (error) {
        throw error;
      }
    }

    revalidatePath('/treinos');
    revalidatePath('/evolucao');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Erro ao alternar exercício:', error);
    return { error: 'Ocorreu um erro ao atualizar o exercício' };
  }
}
