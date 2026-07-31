import Link from 'next/link';
import {
  Timer,
  Dumbbell,
  ArrowUpFromLine,
  Zap,
  Waves,
  BarChart3,
  Target,
  Shield,
  TrendingUp,
  ClipboardCheck,
  ChevronRight,
  Flame,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Logo } from '@/components/shared/logo';

const TESTS = [
  { icon: Timer, name: 'Corrida 2.400m', desc: 'Resistência aeróbica', color: 'text-blue-400' },
  { icon: Dumbbell, name: 'Abdominal 60s', desc: 'Flexão abdominal', color: 'text-green-400' },
  { icon: ArrowUpFromLine, name: 'Barra Fixa', desc: 'Força superior', color: 'text-purple-400' },
  { icon: Zap, name: 'Shuttle Run', desc: 'Agilidade', color: 'text-yellow-400' },
  { icon: Waves, name: 'Natação 50m', desc: 'Habilidade natatória', color: 'text-cyan-400' },
];

const FEATURES = [
  {
    icon: Target,
    title: 'Pontuação do Edital',
    desc: 'Cálculo automático baseado nas faixas oficiais. Saiba exatamente quantos pontos seu resultado vale.',
  },
  {
    icon: TrendingUp,
    title: 'Roadmap de Evolução',
    desc: 'Marcos personalizados para cada prova. Acompanhe o caminho do seu resultado atual até a aprovação.',
  },
  {
    icon: BarChart3,
    title: 'Análises e Gráficos',
    desc: 'Visualize sua evolução ao longo do tempo. Identifique tendências, estagnação e pontos críticos.',
  },
  {
    icon: ClipboardCheck,
    title: 'Simulação do TAF',
    desc: 'Simule o resultado oficial com seus melhores resultados, últimos registros ou médias recentes.',
  },
  {
    icon: Flame,
    title: 'Motivação com Propósito',
    desc: 'Mensagens contextualizadas, conquistas e patentes. Gamificação elegante que respeita sua jornada.',
  },
  {
    icon: Lock,
    title: 'Segurança dos Dados',
    desc: 'Seus treinos pertencem a você. Autenticação segura, dados isolados e sem compartilhamento.',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Logo size="sm" />
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/entrar">Entrar</Link>
            </Button>
            <Button variant="fire" asChild>
              <Link href="/cadastrar">Começar</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-16">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-ember-600/10 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-fire-600/10 blur-3xl" />
          <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember-900/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-8 flex justify-center">
            <Logo size="xl" showText={false} />
          </div>

          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            Seu caminho até o TAF{' '}
            <span className="gradient-text">começa com um resultado registrado.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Registre seus treinos, acompanhe sua pontuação e transforme evolução diária em preparação para a farda.
          </p>

          <p className="mt-3 text-sm italic text-muted-foreground/70">
            &ldquo;Cada treino é um passo até a farda.&rdquo;
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button variant="fire" size="xl" asChild>
              <Link href="/cadastrar">
                Começar minha jornada
                <ChevronRight className="ml-1 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <Link href="#como-funciona">Conhecer o sistema</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* As Cinco Provas */}
      <section className="border-t border-border/50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              As Cinco Provas do TAF
            </h2>
            <p className="mt-3 text-muted-foreground">
              Teste de Capacitação Física — CFSd BM 2027
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {TESTS.map((test, i) => (
              <Card key={i} className="card-hover border-border/50 bg-card/50">
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <div className={`mb-3 rounded-xl bg-secondary/50 p-3 ${test.color}`}>
                    <test.icon className="h-7 w-7" />
                  </div>
                  <h3 className="font-semibold text-foreground">{test.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{test.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Cada prova vale até 20 pontos. Mínimo de 12 pontos em cada uma para aprovação.
          </p>
        </div>
      </section>

      {/* Como Funciona */}
      <section id="como-funciona" className="border-t border-border/50 bg-card/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              Como Funciona
            </h2>
            <p className="mt-3 text-muted-foreground">
              Três passos para transformar treino em progresso mensurável
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                step: '01',
                title: 'Registre',
                desc: 'Após cada treino, registre seu resultado. O app calcula automaticamente sua pontuação baseada nas faixas do edital.',
              },
              {
                step: '02',
                title: 'Acompanhe',
                desc: 'Visualize sua evolução em gráficos, identifique tendências e saiba exatamente o que falta para cada meta.',
              },
              {
                step: '03',
                title: 'Evolua',
                desc: 'Receba marcos personalizados, simule o TAF oficial e acompanhe seu caminho até a aprovação.',
              },
            ].map((item, i) => (
              <div key={i} className="relative">
                <span className="font-display text-6xl font-bold text-ember-600/20">
                  {item.step}
                </span>
                <h3 className="mt-2 text-xl font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border/50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              Preparação Inteligente
            </h2>
            <p className="mt-3 text-muted-foreground">
              Ferramentas projetadas para quem leva a preparação a sério
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature, i) => (
              <Card key={i} className="card-hover border-border/50">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-ember-600/10 text-ember-500">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="border-t border-border/50 bg-gradient-to-b from-card/50 to-background py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Comece a registrar sua evolução hoje
          </h2>
          <p className="mt-4 text-muted-foreground">
            Cada treino é um passo. Cada registro é uma prova de que você está mais perto.
          </p>
          <div className="mt-8">
            <Button variant="fire" size="xl" asChild>
              <Link href="/cadastrar">
                Começar minha jornada
                <ChevronRight className="ml-1 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
            <Logo size="sm" />
            <nav className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <Link href="/sobre" className="hover:text-foreground">Sobre</Link>
              <Link href="/regras" className="hover:text-foreground">Regras das Provas</Link>
              <Link href="/privacidade" className="hover:text-foreground">Privacidade</Link>
            </nav>
          </div>
          <div className="mt-8 border-t border-border/30 pt-8">
            <p className="text-center text-xs text-muted-foreground/70">
              O Canhoto — Rumo à Farda é uma ferramenta independente de acompanhamento de treinos.
              Não representa nem possui vínculo oficial com o Corpo de Bombeiros Militar de Minas Gerais.
              Os dados devem ser conferidos com o edital e eventuais retificações oficiais.
            </p>
            <p className="mt-2 text-center text-xs text-muted-foreground/50">
              © {new Date().getFullYear()} Canhoto — Rumo à Farda. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
