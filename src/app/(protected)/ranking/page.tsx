import { Metadata } from 'next';
import { Trophy, Timer, Flame, Dumbbell, Zap, Waves, ArrowUpFromLine } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Ranking | X1 - Canhoto vs João',
  description: 'Acompanhe a disputa direta do TAF',
};

const TEST_INFO: Record<string, { name: string; icon: any; unit: string; lowerIsBetter: boolean }> = {
  running_2400m: { name: 'Corrida 2.400m', icon: Timer, unit: 'min', lowerIsBetter: true },
  abdominal_60s: { name: 'Abdominal 60s', icon: Dumbbell, unit: 'reps', lowerIsBetter: false },
  pull_up_dynamic: { name: 'Barra Fixa', icon: ArrowUpFromLine, unit: 'reps', lowerIsBetter: false },
  shuttle_run: { name: 'Shuttle Run', icon: Zap, unit: 'seg', lowerIsBetter: true },
  swimming_50m: { name: 'Natação 50m', icon: Waves, unit: 'seg', lowerIsBetter: true },
};

export default async function RankingPage() {
  const supabase = await createClient();

  // Buscar todos os perfis
  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('id, full_name, nickname, avatar_url');

  if (profileError || !profiles || profiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <Trophy className="mb-4 h-12 w-12 text-muted-foreground" />
        <h2 className="text-xl font-bold">O X1 ainda não começou</h2>
        <p className="text-muted-foreground">Nenhum competidor encontrado.</p>
      </div>
    );
  }

  // Buscar XP
  const { data: xpData } = await supabase
    .from('user_xp')
    .select('user_id, total_xp, current_level');

  // Buscar melhores resultados de todos os usuários
  // Vamos buscar todos e agrupar em JS (já que são poucos usuários e resultados no X1)
  const { data: allResults } = await supabase
    .from('training_results')
    .select('user_id, test_slug, raw_value, official_score')
    .order('created_at', { ascending: false });

  // Processar os dados
  const competitors = profiles.map(profile => {
    const xp = xpData?.find(x => x.user_id === profile.id) || { total_xp: 0, current_level: 1 };
    
    // Encontrar o melhor resultado para cada prova (baseado na pontuação oficial e raw_value se empatar)
    const bestResults: Record<string, { raw_value: number; official_score: number }> = {};
    
    if (allResults) {
      const userResults = allResults.filter(r => r.user_id === profile.id);
      Object.keys(TEST_INFO).forEach(slug => {
        const testResults = userResults.filter(r => r.test_slug === slug);
        if (testResults.length > 0) {
          // Sort to get best: 1st by official score, 2nd by raw value (taking lowerIsBetter into account)
          const isLowerBetter = TEST_INFO[slug]?.lowerIsBetter ?? false;
          testResults.sort((a, b) => {
            if (a.official_score !== b.official_score) return b.official_score - a.official_score;
            return isLowerBetter ? a.raw_value - b.raw_value : b.raw_value - a.raw_value;
          });
          bestResults[slug] = {
            raw_value: testResults[0]?.raw_value ?? 0,
            official_score: testResults[0]?.official_score ?? 0
          };
        }
      });
    }

    return {
      ...profile,
      xp: xp.total_xp,
      level: xp.current_level,
      bestResults
    };
  });

  // Ordenar competidores por XP total
  competitors.sort((a, b) => b.xp - a.xp);

  const formatValue = (slug: string, value: number) => {
    if (slug === 'running_2400m') {
      const mins = Math.floor(value / 60);
      const secs = Math.floor(value % 60);
      return `${mins}'${secs.toString().padStart(2, '0')}`;
    }
    return value.toString();
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER XP */}
      <section>
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 shadow-lg shadow-amber-500/20">
            <Trophy className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Ranking Geral (X1)</h1>
            <p className="text-muted-foreground">Acompanhe quem está liderando a jornada rumo à farda.</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {competitors.map((comp, idx) => (
            <Card key={comp.id} className={`relative overflow-hidden ${idx === 0 ? 'border-amber-500/50 shadow-md shadow-amber-500/10' : ''}`}>
              {idx === 0 && (
                <div className="absolute right-0 top-0 h-16 w-16 overflow-hidden">
                  <div className="absolute top-4 -right-5 w-24 rotate-45 bg-gradient-to-r from-amber-400 to-amber-600 py-1 text-center shadow-sm">
                    <span className="text-[10px] font-bold tracking-wider text-white">LÍDER</span>
                  </div>
                </div>
              )}
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-2xl font-bold">
                    {comp.nickname?.charAt(0) || comp.full_name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{comp.full_name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                        Nível {comp.level}
                      </Badge>
                      <span className="text-sm font-medium text-muted-foreground flex items-center">
                        <Flame className="mr-1 h-3.5 w-3.5 text-fire-500" />
                        {comp.xp} XP
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* HEAD-TO-HEAD POR PROVA */}
      <section>
        <h2 className="mb-6 text-2xl font-bold tracking-tight">Comparativo por Prova (Recordes)</h2>
        <div className="grid gap-4">
          {Object.entries(TEST_INFO).map(([slug, info]) => {
            
            // Determinar o vencedor desta prova
            let winnerId: string | null = null;
            let tied = false;

            if (competitors.length >= 2) {
              const resA = competitors[0]?.bestResults[slug];
              const resB = competitors[1]?.bestResults[slug];
              
              if (resA && resB) {
                if (resA.official_score > resB.official_score) {
                  winnerId = competitors[0]?.id ?? null;
                } else if (resB.official_score > resA.official_score) {
                  winnerId = competitors[1]?.id ?? null;
                } else {
                  // Tie break with raw value
                  if (resA.raw_value === resB.raw_value) {
                    tied = true;
                  } else {
                    const aWins = info.lowerIsBetter ? resA.raw_value < resB.raw_value : resA.raw_value > resB.raw_value;
                    winnerId = aWins ? (competitors[0]?.id ?? null) : (competitors[1]?.id ?? null);
                  }
                }
              } else if (resA && !resB) {
                winnerId = competitors[0]?.id ?? null;
              } else if (!resA && resB) {
                winnerId = competitors[1]?.id ?? null;
              }
            }

            return (
              <Card key={slug}>
                <CardHeader className="bg-secondary/30 py-4">
                  <div className="flex items-center gap-2">
                    <info.icon className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{info.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="grid grid-cols-2 divide-x divide-border">
                    {competitors.map((comp) => {
                      const res = comp.bestResults[slug];
                      const isWinner = winnerId === comp.id;
                      
                      return (
                        <div key={comp.id} className={`p-4 text-center ${isWinner ? 'bg-amber-500/5' : ''}`}>
                          <div className="text-sm font-medium text-muted-foreground mb-2">{comp.nickname || comp.full_name.split(' ')[0]}</div>
                          {res ? (
                            <div>
                              <div className={`text-2xl font-bold ${isWinner ? 'text-amber-500' : ''}`}>
                                {formatValue(slug, res.raw_value)} <span className="text-sm font-normal text-muted-foreground">{info.unit}</span>
                              </div>
                              <div className="mt-1 text-xs text-muted-foreground">
                                {res.official_score} pontos oficiais
                              </div>
                              {isWinner && (
                                <Badge className="mt-2 bg-amber-500 hover:bg-amber-600 text-white border-0">Vencendo</Badge>
                              )}
                              {tied && (
                                <Badge variant="outline" className="mt-2 text-muted-foreground">Empate</Badge>
                              )}
                            </div>
                          ) : (
                            <div className="text-sm text-muted-foreground/50 py-2">Sem registro</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

    </div>
  );
}
