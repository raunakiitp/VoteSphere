import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        'vs-bg': '#050b1a',
        'vs-card': '#0a1628',
        'vs-blue': '#3b82f6',
        'vs-cyan': '#06b6d4',
        'vs-violet': '#7c3aed',
        'vs-emerald': '#10b981',
        'vs-amber': '#f59e0b',
        'vs-neon': '#00d4ff',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float-particle 15s linear infinite',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
  // @ts-expect-error - Safelist is valid but type definition may lag
  safelist: [
    'border-blue-500/20', 'border-cyan-500/20', 'border-violet-500/20', 'border-emerald-500/20', 'border-amber-500/20', 'border-rose-500/20',
    'border-blue-500/40', 'border-cyan-500/40', 'border-violet-500/40', 'border-emerald-500/40', 'border-amber-500/40', 'border-rose-500/40',
    'bg-blue-500/20', 'bg-cyan-500/20', 'bg-violet-500/20', 'bg-emerald-500/20', 'bg-amber-500/20', 'bg-rose-500/20',
    'text-blue-400', 'text-cyan-400', 'text-violet-400', 'text-emerald-400', 'text-amber-400', 'text-rose-400',
  ],
}

export default config
