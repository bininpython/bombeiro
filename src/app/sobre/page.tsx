import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-8">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Voltar para Home
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Sobre o Canhoto</h1>
        <div className="prose prose-neutral dark:prose-invert">
          <p>O Canhoto - Rumo à Farda é uma plataforma dedicada a ajudar candidatos a se prepararem para o Teste de Aptidão Física (TAF).</p>
          <p>Nossa missão é transformar esforço diário em resultados reais através de tecnologia e gamificação inteligente.</p>
        </div>
      </div>
    </div>
  );
}
