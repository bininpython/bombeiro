import { Metadata } from 'next';
import { Construction } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Histórico de Treinos',
};

export default function TreinosPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] animate-fade-in text-center px-4">
      <div className="rounded-full bg-secondary/50 p-4 text-muted-foreground mb-4">
        <Construction className="h-12 w-12" />
      </div>
      <h1 className="text-2xl font-bold text-foreground mb-2">Página em Construção</h1>
      <p className="text-muted-foreground max-w-md">
        O histórico detalhado de treinos está sendo desenvolvido e estará disponível em breve.
      </p>
    </div>
  );
}
