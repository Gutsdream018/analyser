import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0B0D11',
        panel: '#11141A',
        pos: '#10B981',
        neg: '#F43F5E',
        accent: '#D9A441',
      },
    },
  },
  plugins: [],
};
export default config;
