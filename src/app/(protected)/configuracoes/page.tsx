'use client';

import { Settings, Moon, Sun, Bell, Monitor } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function SettingsPage() {
  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-primary/10 p-2 text-primary">
          <Settings className="h-6 w-6" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
          <p className="mt-1 text-sm text-muted-foreground">Preferências do aplicativo</p>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Tema */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Aparência</CardTitle>
            <CardDescription>Personalize o tema do aplicativo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 justify-start">
                <Sun className="mr-2 h-4 w-4" /> Claro
              </Button>
              <Button variant="outline" className="flex-1 justify-start border-primary text-primary">
                <Moon className="mr-2 h-4 w-4" /> Escuro
              </Button>
              <Button variant="outline" className="flex-1 justify-start hidden sm:flex">
                <Monitor className="mr-2 h-4 w-4" /> Sistema
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notificações */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Notificações</CardTitle>
            <CardDescription>Gerencie seus alertas e lembretes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-border/50 p-4">
              <div className="space-y-0.5">
                <div className="font-medium">Lembretes de Treino</div>
                <div className="text-sm text-muted-foreground">Receba alertas para não perder o ritmo.</div>
              </div>
              <Button variant="outline" size="sm">
                Ativar
              </Button>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border/50 p-4">
              <div className="space-y-0.5">
                <div className="font-medium">Resumo Semanal</div>
                <div className="text-sm text-muted-foreground">E-mail com sua evolução da semana.</div>
              </div>
              <Button variant="outline" size="sm">
                Ativar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
