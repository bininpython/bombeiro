import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

const sizes = {
  sm: { icon: 32, text: 'text-lg' },
  md: { icon: 40, text: 'text-xl' },
  lg: { icon: 56, text: 'text-2xl' },
  xl: { icon: 72, text: 'text-3xl' },
};

export function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const s = sizes[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Original symbol: abstract shield + flame + ascending line */}
      <svg
        width={s.icon}
        height={s.icon}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        role="img"
      >
        {/* Shield base */}
        <path
          d="M32 4L8 16V32C8 46.4 18.4 58.8 32 62C45.6 58.8 56 46.4 56 32V16L32 4Z"
          fill="url(#shield-gradient)"
          stroke="hsl(0, 72%, 45%)"
          strokeWidth="1.5"
          opacity="0.9"
        />
        {/* Abstract flame */}
        <path
          d="M32 48C32 48 22 38 22 30C22 24 26 20 32 16C38 20 42 24 42 30C42 38 32 48 32 48Z"
          fill="url(#flame-gradient)"
          opacity="0.95"
        />
        {/* Inner flame */}
        <path
          d="M32 44C32 44 26 37 26 32C26 28 28.5 25 32 22C35.5 25 38 28 38 32C38 37 32 44 32 44Z"
          fill="url(#inner-flame)"
          opacity="0.9"
        />
        {/* Ascending performance line */}
        <path
          d="M18 42L26 34L32 38L46 20"
          stroke="hsl(0, 0%, 100%)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.7"
        />
        <circle cx="46" cy="20" r="2.5" fill="hsl(20, 95%, 60%)" />
        {/* Gradients */}
        <defs>
          <linearGradient id="shield-gradient" x1="32" y1="4" x2="32" y2="62" gradientUnits="userSpaceOnUse">
            <stop stopColor="hsl(220, 14%, 18%)" />
            <stop offset="1" stopColor="hsl(220, 16%, 10%)" />
          </linearGradient>
          <linearGradient id="flame-gradient" x1="32" y1="16" x2="32" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="hsl(20, 95%, 60%)" />
            <stop offset="1" stopColor="hsl(0, 72%, 45%)" />
          </linearGradient>
          <linearGradient id="inner-flame" x1="32" y1="22" x2="32" y2="44" gradientUnits="userSpaceOnUse">
            <stop stopColor="hsl(45, 93%, 60%)" />
            <stop offset="1" stopColor="hsl(20, 95%, 55%)" />
          </linearGradient>
        </defs>
      </svg>
      {showText && (
        <div className="flex flex-col leading-tight">
          <span className={`${s.text} font-display font-bold tracking-tight text-foreground`}>
            Canhoto
          </span>
          <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Rumo à Farda
          </span>
        </div>
      )}
    </div>
  );
}
