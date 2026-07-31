import { Metadata } from 'next';
import { PlusCircle, Trophy, Flame } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Início | X1',
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Buscar perfil atual
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, nickname')
    .eq('id', user?.id)
    .single();

  // Buscar XP atual
  const { data: xpData } = await supabase
    .from('user_xp')
    .select('total_xp, current_level')
    .eq('user_id', user?.id)
    .single();

  const userName = profile?.nickname || profile?.full_name?.split(' ')[0] || 'Competidor';
  const xp = xpData?.total_xp || 0;
  const level = xpData?.current_level || 1;

  // Calculo fixo de dias até o TAF (apenas ilustrativo)
  const today = new Date();
  const tafDate = new Date('2027-01-01'); // Supondo início do ano
  const diffTime = Math.abs(tafDate.getTime() - today.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4 text-center items-center py-6">
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
          E aí, <span className="gradient-text">{userName}</span>!
        </h1>
        <p className="text-muted-foreground text-lg">
          Faltam <strong>{diffDays} dias</strong> para o TAF.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-border/50 bg-card/80 flex flex-col items-center text-center justify-center p-6">
          <Flame className="h-10 w-10 text-fire-500 mb-2" />
          <h2 className="text-2xl font-bold">{xp} XP</h2>
          <p className="text-sm text-muted-foreground">Nível {level}</p>
        </Card>
        
        <Card className="border-fire-500/30 bg-fire-500/10 shadow-sm shadow-fire-500/20 flex flex-col justify-center items-center p-4">
           <Button variant="fire" size="lg" className="w-full h-16 text-lg font-bold" asChild>
             <Link href="/treinos/novo">
               <PlusCircle className="mr-2 h-6 w-6" />
               Registrar Tempo
             </Link>
           </Button>
        </Card>
      </div>

      <div className="pt-6">
        <Button variant="outline" size="lg" className="w-full h-16 text-lg" asChild>
          <Link href="/ranking">
            <Trophy className="mr-2 h-6 w-6 text-ember-500" />
            Ver Comparativo do X1
          </Link>
        </Button>
      </div>
    </div>
  );
}
