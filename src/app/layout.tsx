import type { Metadata, Viewport } from 'next';
import { Inter, Outfit, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Canhoto — Rumo à Farda',
    template: '%s | Canhoto — Rumo à Farda',
  },
  description:
    'Registre seus treinos, acompanhe sua pontuação e transforme evolução diária em preparação para o TAF. Plataforma de monitoramento de desempenho físico para candidatos ao CFSd BM 2027.',
  keywords: [
    'TAF',
    'teste de aptidão física',
    'bombeiro',
    'CBMMG',
    'treino',
    'preparação física',
    'concurso',
    'CFSd',
  ],
  authors: [{ name: 'Canhoto — Rumo à Farda' }],
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    title: 'Canhoto — Rumo à Farda',
    description: 'Cada treino é um passo até a farda.',
    siteName: 'Canhoto — Rumo à Farda',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0d1117' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`dark ${inter.variable} ${outfit.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
