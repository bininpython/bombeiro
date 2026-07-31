'use client';

import { useState } from 'react';
import Link from 'next/link';

import { 
  ChevronLeft, 
  Wand2, 
  Play,
  CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function NewSimulationPage() {

  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate generation delay
    setTimeout(() => {
      setIsGenerating(false);
      setStep(2);
    }, 1500);
  };

  if (step === 2) {
    return (
      <div className="mx-auto max-w-2xl space-y-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setStep(1)} aria-label="Voltar">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Resultado do Simulado</h1>
            <p className="text-sm text-muted-foreground">Baseado nas suas melhores marcas recentes</p>
          </div>
        </div>

        <Card className="border-border/50 bg-gradient-to-br from-card to-card/80">
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <Badge variant="success" className="mb-4 text-sm px-3 py-1">
              <CheckCircle2 className="mr-1 h-4 w-4" />
              Aprovado
            </Badge>
            <h2 className="text-sm font-medium text-muted-foreground">Nota Final Estimada</h2>
            <div className="mt-2 flex items-baseline justify-center gap-2">
              <span className="text-6xl font-bold text-foreground">78</span>
              <span className="text-xl text-muted-foreground">/ 100 pts</span>
            </div>
            
            <p className="mt-4 text-sm text-muted-foreground max-w-md">
              Você alcançou o índice mínimo nas 5 provas. 
              Sua nota atual o coloca em uma posição competitiva, mas continue buscando a nota máxima (100) para garantir a classificação.
            </p>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <h3 className="font-semibold text-foreground">Detalhamento por Prova</h3>
          
          {[
            { name: 'Corrida 2.400m', score: 14, result: '11:30', passed: true },
            { name: 'Abdominal 60s', score: 16, result: '50 rep', passed: true },
            { name: 'Barra Fixa', score: 13, result: '4 rep', passed: true },
            { name: 'Shuttle Run', score: 17, result: '9.60s', passed: true },
            { name: 'Natação 50m', score: 18, result: '35s', passed: true },
          ].map((test, i) => (
            <div key={i} className="flex items-center justify-between rounded-xl border border-border/50 bg-card p-4">
              <div>
                <p className="font-medium text-foreground">{test.name}</p>
                <p className="text-sm text-muted-foreground">Melhor marca: {test.result}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-foreground">{test.score} <span className="text-xs font-normal text-muted-foreground">pts</span></p>
                <span className="text-xs text-success flex items-center justify-end gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Índice
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3 pt-4">
          <Button variant="outline" className="flex-1" asChild>
            <Link href="/simulados">Voltar aos Simulados</Link>
          </Button>
          <Button variant="fire" className="flex-1" asChild>
            <Link href="/dashboard">Ir ao Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild aria-label="Voltar">
          <Link href="/simulados">
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-bold text-foreground">Novo Simulado</h1>
          <p className="text-sm text-muted-foreground">Escolha como deseja simular seu TAF</p>
        </div>
      </div>

      <div className="grid gap-4">
        {/* Simulado Manual */}
        <Card className="border-border/50 card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5 text-ember-500" />
              Simulado Real (Manual)
            </CardTitle>
            <CardDescription>
              Você realizou as 5 provas hoje e quer registrar todas as marcas de uma vez.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Iniciar Registro Manual
            </Button>
          </CardContent>
        </Card>

        {/* Simulado Automático (Melhores Marcas) */}
        <Card className="border-border/50 card-hover border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="h-5 w-5 text-primary" />
              Simulado Automático
            </CardTitle>
            <CardDescription>
              O sistema calcula sua nota final usando suas <strong>melhores marcas</strong> registradas em cada prova.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="fire" 
              className="w-full" 
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? 'Calculando...' : 'Gerar Simulado com Melhores Marcas'}
            </Button>
          </CardContent>
        </Card>
        
        {/* Simulado Automático (Média) */}
        <Card className="border-border/50 card-hover opacity-70 grayscale">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="h-5 w-5 text-muted-foreground" />
              Média Recente
            </CardTitle>
            <CardDescription>
              O sistema calcula sua nota usando a média das últimas 3 sessões de cada prova.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" disabled>
              Gerar Simulado com Médias (Em breve)
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
