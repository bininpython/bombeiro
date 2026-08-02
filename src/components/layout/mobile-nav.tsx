'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, PlusCircle, Trophy, User, CheckSquare, LineChart } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Início', icon: LayoutDashboard },
  { href: '/treinos', label: 'Treinos', icon: CheckSquare },
  { href: '/treinos/novo', label: 'Novo', icon: PlusCircle, isAction: true },
  { href: '/evolucao', label: 'Evolução', icon: LineChart },
  { href: '/perfil', label: 'Perfil', icon: User },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-lg md:hidden"
      aria-label="Navegação mobile"
    >
      <div className="mx-auto flex max-w-lg items-center justify-around py-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

          if (item.isAction) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center"
                aria-label={item.label}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-ember-600 to-fire-600 text-white shadow-lg shadow-ember-900/25 transition-transform active:scale-95">
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <span className="mt-0.5 text-[10px] font-medium text-ember-500">{item.label}</span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center px-3 py-2 touch-target',
                isActive ? 'text-primary' : 'text-muted-foreground',
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <item.icon className="h-5 w-5" aria-hidden="true" />
              <span className="mt-0.5 text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
      {/* Safe area for bottom notch */}
      <div className="h-safe-area-inset-bottom bg-card" />
    </nav>
  );
}
