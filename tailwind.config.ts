import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Base (compartilhado)
        'wired-black': '#0a0a0f',
        'wired-surface': '#111118',
        'wired-border': 'rgba(255,255,255,0.12)',

        // Tema DEV
        'dev-title-dark': '#0A246A',
        'dev-title-light': '#4a90e2',
        'dev-accent': '#4a90e2',
        'dev-accent-dim': '#1a5fb4',
        'dev-green': '#3a8a10',
        'dev-taskbar': '#1240a0',

        // Tema MUSIC
        'music-title-dark': '#2d0a5a',
        'music-title-light': '#9a4ae2',
        'music-accent': '#9a4ae2',
        'music-accent-dim': '#6a1ab4',
        'music-pink': '#e24aaa',
        'music-taskbar': '#3a1280',

        // Boot screen
        'bios-bg': '#000000',
        'bios-blue': '#0000AA',
        'bios-text': '#AAAAAA',
        'bios-white': '#FFFFFF',
      },
      fontFamily: {
        tahoma: ['Tahoma', 'Verdana', 'sans-serif'],
        electrolize: ['Electrolize', 'monospace'],
        vt323: ['VT323', 'monospace'],
        mono: ['Share Tech Mono', 'Courier New', 'monospace'],
      },
      boxShadow: {
        window: '2px 4px 16px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.15)',
        'window-focus': '2px 4px 24px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(255,255,255,0.25)',
        'btn-xp': 'inset 0 1px 0 rgba(255,255,255,0.3), 0 1px 2px rgba(0,0,0,0.4)',
      },
      borderRadius: {
        window: '6px 6px 4px 4px',
        btn: '3px',
        'btn-start': '12px',
        badge: '10px',
        'titlebar-btn': '3px',
      },
    },
  },
  plugins: [],
}
export default config
