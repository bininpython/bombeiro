import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        // Custom Canhoto colors
        fire: {
          50: 'hsl(20, 100%, 95%)',
          100: 'hsl(20, 100%, 90%)',
          200: 'hsl(20, 100%, 80%)',
          300: 'hsl(20, 100%, 70%)',
          400: 'hsl(20, 95%, 60%)',
          500: 'hsl(20, 90%, 50%)',
          600: 'hsl(16, 90%, 45%)',
          700: 'hsl(12, 85%, 38%)',
          800: 'hsl(8, 80%, 30%)',
          900: 'hsl(4, 75%, 22%)',
        },
        ember: {
          50: 'hsl(0, 85%, 95%)',
          100: 'hsl(0, 85%, 90%)',
          200: 'hsl(0, 80%, 80%)',
          300: 'hsl(0, 75%, 68%)',
          400: 'hsl(0, 72%, 55%)',
          500: 'hsl(0, 70%, 45%)',
          600: 'hsl(0, 72%, 38%)',
          700: 'hsl(0, 75%, 30%)',
          800: 'hsl(0, 78%, 22%)',
          900: 'hsl(0, 80%, 15%)',
        },
        graphite: {
          50: 'hsl(220, 10%, 95%)',
          100: 'hsl(220, 10%, 90%)',
          200: 'hsl(220, 10%, 80%)',
          300: 'hsl(220, 8%, 65%)',
          400: 'hsl(220, 8%, 50%)',
          500: 'hsl(220, 8%, 38%)',
          600: 'hsl(220, 10%, 25%)',
          700: 'hsl(220, 12%, 18%)',
          800: 'hsl(220, 14%, 12%)',
          900: 'hsl(220, 16%, 8%)',
          950: 'hsl(220, 18%, 5%)',
        },
        success: {
          DEFAULT: 'hsl(142, 70%, 45%)',
          foreground: 'hsl(0, 0%, 100%)',
        },
        warning: {
          DEFAULT: 'hsl(45, 93%, 47%)',
          foreground: 'hsl(0, 0%, 0%)',
        },
        danger: {
          DEFAULT: 'hsl(0, 72%, 51%)',
          foreground: 'hsl(0, 0%, 100%)',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        'slide-up': {
          from: { transform: 'translateY(10px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'score-pop': {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '60%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'pulse-slow': 'pulse-slow 2s ease-in-out infinite',
        'slide-up': 'slide-up 0.4s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'score-pop': 'score-pop 0.5s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
