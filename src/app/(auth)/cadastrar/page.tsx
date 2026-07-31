import Link from 'next/link';
import { Lock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function RegisterPage() {
  return (
    <div className="flex w-full items-center justify-center p-4">
      <Card className="w-full max-w-md border-fire-500/20 bg-card/50 backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <Lock className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-bold">Sistema Fechado</CardTitle>
          <CardDescription>
            O acesso a esta plataforma é restrito aos candidatos João Vitor e Abner.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-sm text-muted-foreground">
          Novos cadastros estão desativados. Se você é um dos participantes do X1, utilize as credenciais de acesso fornecidas pelo administrador.
        </CardContent>
        <CardFooter>
          <Button asChild variant="fire" className="w-full">
            <Link href="/entrar">
              Ir para o Login <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
