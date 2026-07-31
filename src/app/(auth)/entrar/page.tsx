'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, KeyRound, User, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Custom simple login state
  const [selectedUser, setSelectedUser] = useState<'joao' | 'abner'>('joao');
  const [accessCode, setAccessCode] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    if (accessCode.length < 4) {
      setError('Código muito curto.');
      setIsSubmitting(false);
      return;
    }

    const email = selectedUser === 'joao' ? 'joao@cbmmg.com' : 'abner@cbmmg.com';
    const supabase = createClient();

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password: accessCode,
    });

    if (authError) {
      setError('Código incorreto ou banco de dados não inicializado.');
      setIsSubmitting(false);
      return;
    }

    router.push('/dashboard');
    router.refresh();
  }

  return (
    <Card className="border-border/50">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-fire-500/10">
          <Flame className="h-6 w-6 text-fire-500" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">X1 - Acesso Restrito</CardTitle>
        <CardDescription>
          Selecione seu perfil e digite seu código de acesso
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          
          {error && (
            <div className="rounded-md bg-destructive/15 p-3 text-sm font-medium text-destructive text-center">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Quem é você?</Label>
              <div className="grid grid-cols-2 gap-4">
                <div 
                  onClick={() => setSelectedUser('joao')}
                  className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 p-4 transition-all ${
                    selectedUser === 'joao' 
                      ? 'border-fire-500 bg-fire-500/10 shadow-sm shadow-fire-500/20' 
                      : 'border-border hover:bg-secondary'
                  }`}
                >
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                    <User className="h-5 w-5 text-foreground" />
                  </div>
                  <span className="font-semibold">João Victor</span>
                </div>
                
                <div 
                  onClick={() => setSelectedUser('abner')}
                  className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 p-4 transition-all ${
                    selectedUser === 'abner' 
                      ? 'border-fire-500 bg-fire-500/10 shadow-sm shadow-fire-500/20' 
                      : 'border-border hover:bg-secondary'
                  }`}
                >
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                    <User className="h-5 w-5 text-foreground" />
                  </div>
                  <span className="font-semibold">Abner</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <Label htmlFor="code">Código Secreto</Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="code"
                  type="password"
                  placeholder="Seu código..."
                  className="pl-10 text-lg tracking-widest h-12"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-md font-bold"
            variant="fire"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              'Entrar na Competição'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
