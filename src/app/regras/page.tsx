import { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Regras das Provas',
};

export default function RegrasPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard"><ChevronLeft className="h-5 w-5" /></Link>
        </Button>
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <BookOpen className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Regras das Provas</h1>
            <p className="mt-1 text-sm text-muted-foreground">Orientações gerais de execução baseadas no edital CFSd</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Corrida de 2.400 metros</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• O candidato deverá percorrer a distância de 2.400 metros em pista de atletismo ou local demarcado.</p>
            <p>• O tempo máximo é de 12 minutos e 45 segundos para a pontuação mínima.</p>
            <p>• É permitido caminhar, mas não parar totalmente ou sair da pista.</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Flexão Abdominal (60s)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• Posição inicial: decúbito dorsal, pernas flexionadas, pés fixados ao solo.</p>
            <p>• Mãos cruzadas sobre o peito, tocando os ombros opostos.</p>
            <p>• Execução: flexionar o tronco até que os cotovelos toquem as coxas, retornando até que as escápulas toquem o solo.</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Barra Fixa Dinâmica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• Pegada pronada, corpo na vertical, sem contato com o solo.</p>
            <p>• Flexionar os braços até que o queixo ultrapasse o nível da barra e retornar à extensão total.</p>
            <p>• Não é permitido "pedalar", usar impulso das pernas ou balanço do corpo (kipping).</p>
          </CardContent>
        </Card>
        
        <p className="text-xs text-muted-foreground/70 text-center mt-8">
          Estas são orientações simplificadas. Consulte o edital nº 10/2026 oficial para as regras completas e detalhadas de execução.
        </p>
      </div>
    </div>
  );
}
