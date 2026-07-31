import { Metadata } from 'next';
import { PlusCircle, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/server';
import { calculateOfficialScore, calculateFinalTafScore } from '@/lib/taf/scoring';
import { TAF_TEST_ORDER, TAF_TESTS } from '@/lib/taf/constants';
import { formatTestValue } from '@/lib/taf/time';

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

  // Buscar melhores resultados do usuário para cruzar com a tabela
  const { data: allResults } = await supabase
    .from('training_results')
    .select('test_slug, raw_value, official_score')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false });

  // Agrupar e achar o melhor
  const bestResults: Record<string, { rawValue: number | null }> = {};
  TAF_TEST_ORDER.forEach(slug => {
    bestResults[slug] = { rawValue: null };
  });

  if (allResults) {
    TAF_TEST_ORDER.forEach(slug => {
      const userTests = allResults.filter(r => r.test_slug === slug);
      if (userTests.length > 0) {
        // Pega o de maior official_score, e se empatar, pega o melhor raw_value
        userTests.sort((a, b) => {
          if (a.official_score !== b.official_score) {
            return b.official_score - a.official_score;
          }
          const lowerIsBetter = TAF_TESTS[slug]?.direction === 'lower_is_better';
          return lowerIsBetter ? a.raw_value - b.raw_value : b.raw_value - a.raw_value;
        });
        bestResults[slug]!.rawValue = userTests[0]?.raw_value ?? null;
      }
    });
  }

  // Calcular status atual em todas as provas
  const testResultsArray = TAF_TEST_ORDER.map((slug) => {
    const raw = bestResults[slug]!.rawValue;
    return calculateOfficialScore(slug, raw);
  });
  
  const finalScoreResult = calculateFinalTafScore(
    TAF_TEST_ORDER.map(t => ({ testType: t, rawValue: bestResults[t]!.rawValue ?? 0 }))
  );

  const userName = profile?.nickname || profile?.full_name?.split(' ')[0] || 'Competidor';
  
  // Calculo fixo de dias até o TAF
  const today = new Date();
  const tafDate = new Date('2027-01-01');
  const diffTime = Math.abs(tafDate.getTime() - today.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const isApproved = finalScoreResult.passing;

  return (
    <div className="space-y-8 animate-fade-in max-w-2xl mx-auto pb-10">
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
          {isApproved ? (
            <>
              <CheckCircle2 className="h-10 w-10 text-green-500 mb-2" />
              <h2 className="text-xl font-bold text-green-500">APROVADO HOJE</h2>
              <p className="text-sm text-muted-foreground">Nota Total: {finalScoreResult.totalScore}</p>
            </>
          ) : (
            <>
              <AlertTriangle className="h-10 w-10 text-red-500 mb-2" />
              <h2 className="text-xl font-bold text-red-500">REPROVADO HOJE</h2>
              <p className="text-sm text-muted-foreground">Nota Total: {finalScoreResult.totalScore}</p>
            </>
          )}
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

      {/* Resultados Individuais (Tabela do Edital cruzada) */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold border-b border-border pb-2">Seus Resultados vs Edital</h2>
        <div className="grid gap-3">
          {testResultsArray.map((res) => {
             const config = TAF_TESTS[res.testType]!;
             const isTested = res.rawValue !== null && res.rawValue !== undefined;
             const isPass = res.passing;
             const formattedValue = isTested ? formatTestValue(res.rawValue!, res.testType) : '--';
             
             return (
               <Card key={res.testType} className={`p-4 border-l-4 ${isTested ? (isPass ? 'border-l-green-500' : 'border-l-red-500') : 'border-l-muted'}`}>
                 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                   <div className="flex items-center gap-3">
                     <span className="font-semibold">{config.shortName}</span>
                   </div>
                   
                   <div className="flex items-center gap-4 text-sm">
                     <div className="flex flex-col items-end">
                       <span className="text-xs text-muted-foreground">Sua Marca</span>
                       <span className="font-bold">{formattedValue}</span>
                     </div>
                     <ArrowRight className="h-4 w-4 text-muted-foreground" />
                     <div className="flex flex-col items-end">
                       <span className="text-xs text-muted-foreground">Edital</span>
                       <span className={`font-bold text-base ${isTested ? (isPass ? 'text-green-500' : 'text-red-500') : 'text-muted-foreground'}`}>
                         {isTested ? `${res.score} pts` : '0 pts'}
                       </span>
                     </div>
                   </div>
                 </div>
                 
                 {isTested && (
                   <div className="mt-2 text-xs text-muted-foreground text-right">
                     {res.differenceToNextScore && res.differenceToNextScore !== 0 ? (
                       <span>Faltam {Math.abs(res.differenceToNextScore).toFixed(res.testType === 'shuttle_run' ? 2 : 0)} para a nota {res.nextRange?.score}</span>
                     ) : res.score === 20 ? (
                       <span className="text-green-500 font-medium">Nota Máxima!</span>
                     ) : (
                       <span>Abaixo do mínimo exigido.</span>
                     )}
                   </div>
                 )}
               </Card>
             );
          })}
        </div>
      </section>

    </div>
  );
}
