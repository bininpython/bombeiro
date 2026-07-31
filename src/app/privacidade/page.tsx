import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-8">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Voltar para Home
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Política de Privacidade</h1>
        <div className="prose prose-neutral dark:prose-invert">
          <p>A sua privacidade é importante para nós. Esta política explica como coletamos, usamos e protegemos seus dados.</p>
          <h2>1. Coleta de Dados</h2>
          <p>Coletamos informações necessárias para fornecer nossos serviços de acompanhamento de TAF, como nome, e-mail e resultados de treinos.</p>
          <h2>2. Uso das Informações</h2>
          <p>Seus dados são usados exclusivamente para personalizar sua experiência e fornecer análises precisas sobre seu desempenho.</p>
        </div>
      </div>
    </div>
  );
}
