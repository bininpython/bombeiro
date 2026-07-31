'use client';

import { Metadata } from 'next';
import { User, Mail, Calendar, MapPin, Award, Settings, Shield, LogOut } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function ProfilePage() {
  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <User className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Perfil do Candidato</h1>
            <p className="mt-1 text-sm text-muted-foreground">Suas informações e conquistas</p>
          </div>
        </div>
        <Button variant="outline" size="sm">
          <Settings className="mr-2 h-4 w-4" />
          Editar
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Profile Info */}
        <Card className="border-border/50 md:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="h-24 w-24 rounded-full bg-secondary flex items-center justify-center text-3xl font-bold text-muted-foreground">
                C
              </div>
              <h2 className="mt-4 text-xl font-bold text-foreground">Canhoto</h2>
              <p className="text-sm text-muted-foreground">Candidato CFSd 2027</p>
              
              <Badge variant="fire" className="mt-2">Nível 5: Intermediário</Badge>
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">candidato@canhoto.app</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">Ingressou em Out/2026</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">Belo Horizonte, MG</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">Edital: 10/2026 CBMMG</span>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-border/50">
              <Button variant="ghost" className="w-full text-destructive hover:text-destructive hover:bg-destructive/10">
                <LogOut className="mr-2 h-4 w-4" />
                Sair da conta
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="border-border/50 md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-ember-500" />
              Conquistas Desbloqueadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: 'Primeiro Treino', desc: 'Registrou sua primeira marca', date: '10/10/2026' },
                { title: 'Dez Treinos', desc: 'Completou 10 sessões', date: '25/10/2026' },
                { title: 'Mínimo: Abdominal', desc: 'Alcançou o índice mínimo na prova', date: '15/10/2026' },
                { title: 'Primeiro Simulado', desc: 'Completou um TAF completo', date: '30/10/2026' },
              ].map((achievement, i) => (
                <div key={i} className="flex gap-4 rounded-xl border border-border/50 bg-card p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ember-600/10 text-ember-500">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">{achievement.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{achievement.desc}</p>
                    <p className="text-[10px] text-muted-foreground/70 mt-2">{achievement.date}</p>
                  </div>
                </div>
              ))}
              
              {/* Locked Achievement */}
              <div className="flex gap-4 rounded-xl border border-border/50 bg-card/50 p-4 opacity-60 grayscale">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-muted-foreground text-sm">Centurião</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Completar 100 sessões</p>
                  <p className="text-[10px] text-muted-foreground/70 mt-2">Bloqueado</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-center">
              <Button variant="outline" className="w-full sm:w-auto">
                Ver todas as conquistas
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
