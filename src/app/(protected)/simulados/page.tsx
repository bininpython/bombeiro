'use client';


import Link from 'next/link';
import { ClipboardCheck, PlusCircle, ArrowRight, History, Play } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function SimulationsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <ClipboardCheck className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Simulados</h1>
            <p className="mt-1 text-sm text-muted-foreground">Teste seu desempenho global no TAF</p>
          </div>
        </div>
        <Button variant="fire" asChild>
          <Link href="/simulados/novo">
            <Play className="mr-2 h-4 w-4 fill-current" />
            Iniciar Simulado
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Como Funciona */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Como funciona o Simulado?</CardTitle>
            <CardDescription>O Teste de Capacitação Física é avaliado globalmente</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              No TAF oficial, você precisa não apenas atingir o índice mínimo (12 pontos) em <strong className="text-foreground">todas as 5 provas</strong>, 
              mas também precisa que a soma total dos seus pontos seja no mínimo <strong className="text-foreground">60% da nota máxima (30 pontos)</strong> (isso depende do edital, no CFSd 2027 a aprovação é baseada nas médias e classificação, mas o mínimo por prova é obrigatório).
            </p>
            <p>
              O simulado permite que você junte resultados das 5 provas no mesmo dia (ou de dias próximos) para calcular sua 
              nota final e verificar se você seria aprovado caso o teste fosse hoje.
            </p>
          </CardContent>
        </Card>

        {/* Tipos de Simulado */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Formas de Simular</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-full bg-secondary p-1 text-muted-foreground">
                <span className="flex h-5 w-5 items-center justify-center text-xs font-bold">1</span>
              </div>
              <div>
                <p className="font-medium text-foreground">Simulado Real</p>
                <p className="text-xs text-muted-foreground">Registre os resultados das 5 provas feitas em sequência no mesmo dia, exatamente como no TAF.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-full bg-secondary p-1 text-muted-foreground">
                <span className="flex h-5 w-5 items-center justify-center text-xs font-bold">2</span>
              </div>
              <div>
                <p className="font-medium text-foreground">Simulado Automático</p>
                <p className="text-xs text-muted-foreground">O sistema calcula sua nota usando sua melhor marca ou a média recente de cada prova.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-lg font-semibold text-foreground mt-8 flex items-center gap-2">
        <History className="h-5 w-5" /> Histórico de Simulados
      </h2>

      <div className="space-y-4">
        {/* Demo Simulation History */}
        {[
          { date: '30/10/2026', type: 'Simulado Real', score: 65, status: 'approved' },
          { date: '15/10/2026', type: 'Melhores Marcas', score: 58, status: 'reproved' },
        ].map((sim, i) => (
          <Card key={i} className="border-border/50 hover:bg-card/80 transition-colors">
            <CardContent className="flex items-center justify-between p-4 sm:p-6">
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-muted-foreground">
                  <ClipboardCheck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{sim.type}</h3>
                  <p className="text-sm text-muted-foreground">{sim.date}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Nota Final</p>
                  <p className="text-xl font-bold text-foreground">{sim.score}<span className="text-xs font-normal text-muted-foreground">/100</span></p>
                </div>
                <div className="hidden sm:block">
                  <Badge variant={sim.status === 'approved' ? 'success' : 'destructive'}>
                    {sim.status === 'approved' ? 'Aprovado' : 'Reprovado'}
                  </Badge>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
