'use client';


import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';


export default function CalendarPage() {


  // Demo calendar data
  const days = Array.from({ length: 35 }, (_, i) => i + 1 - 4); // Simulating a calendar grid

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-primary/10 p-2 text-primary">
          <CalendarIcon className="h-6 w-6" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Calendário</h1>
          <p className="mt-1 text-sm text-muted-foreground">Seu histórico de treinos e simulados</p>
        </div>
      </div>

      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle>Outubro 2026</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium text-muted-foreground mb-2">
            <div>D</div>
            <div>S</div>
            <div>T</div>
            <div>Q</div>
            <div>Q</div>
            <div>S</div>
            <div>S</div>
          </div>
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {days.map((day, i) => {
              const isCurrentMonth = day > 0 && day <= 31;
              const isToday = day === 28;
              const hasTraining = [2, 5, 8, 10, 15, 20, 25].includes(day);
              
              return (
                <div 
                  key={i} 
                  className={`flex aspect-square flex-col items-center justify-center rounded-lg border sm:p-2 ${
                    isCurrentMonth 
                      ? isToday 
                        ? 'border-primary bg-primary/10 font-bold text-primary' 
                        : 'border-border/30 bg-card hover:bg-secondary/50' 
                      : 'border-transparent text-muted-foreground/30'
                  }`}
                >
                  <span className={!isCurrentMonth ? 'opacity-30' : ''}>
                    {day > 0 && day <= 31 ? day : day <= 0 ? 30 + day : day - 31}
                  </span>
                  
                  {isCurrentMonth && hasTraining && (
                    <div className="mt-1 h-1.5 w-1.5 rounded-full bg-ember-500" />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-border/50 bg-secondary/30">
          <CardContent className="p-4 text-center">
            <h3 className="text-sm font-medium text-muted-foreground">Treinos este mês</h3>
            <p className="text-2xl font-bold text-foreground mt-1">12</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-secondary/30">
          <CardContent className="p-4 text-center">
            <h3 className="text-sm font-medium text-muted-foreground">Dias seguidos (Ofensiva)</h3>
            <p className="text-2xl font-bold text-fire-500 mt-1 flex items-center justify-center gap-1">
              3 <span className="text-sm font-normal">dias</span>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
