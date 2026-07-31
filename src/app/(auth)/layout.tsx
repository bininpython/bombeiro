import React from 'react';
import { Logo } from '@/components/shared/logo';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="mb-8">
        <Logo size="lg" />
      </div>
      <div className="w-full max-w-md">{children}</div>
      <p className="mt-8 text-center text-xs text-muted-foreground/60">
        O Canhoto — Rumo à Farda é uma ferramenta independente. Não possui vínculo oficial com o CBMMG.
      </p>
    </div>
  );
}
