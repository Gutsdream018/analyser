import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './frontend/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#030407',
        panel: '#090608',
        'panel-card': '#0C070A',
        'panel-elevated': '#130B10',
        border: '#241117',
        'border-subtle': 'rgba(255, 46, 81, 0.15)',
        'border-hover': 'rgba(255, 46, 81, 0.45)',
        accent: '#FF2E51',
        crimson: '#FF2E51',
        'signal-red': '#FF2E51',
        'signal-lime': '#00F59B',
        'signal-cyan': '#38BDF8',
        text: '#F9FAFB',
        'text-secondary': '#94A3B8',
        muted: '#64748B',
        pos: '#00F59B',
        neg: '#FF2E51',
      },
      fontFamily: {
        sans: ['var(--font-sans)', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['var(--font-mono)', 'SF Mono', 'Menlo', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
