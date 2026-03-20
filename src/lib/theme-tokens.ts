import type { Theme, ThemeTokens } from '@/types/theme.types'

const DEV_TOKENS: ThemeTokens = {
  theme: 'dev',
  titlebarGradient: 'linear-gradient(180deg, #4a90e2 0%, #1240a0 100%)',
  taskbarGradient: 'linear-gradient(180deg, #1e4fc8 0%, #3a6eff 50%, #1c45b8 100%)',
  startButtonGradient: 'linear-gradient(180deg, #5aaa30 0%, #3a8a10 50%, #2a7000 100%)',
  accentColor: '#4a90e2',
  accentDimColor: '#1a5fb4',
  secondaryColor: '#3a8a10',
  taskbarColor: '#1240a0',
  titleDarkColor: '#0A246A',
  titleLightColor: '#4a90e2',
  displayFont: 'Tahoma, Verdana, sans-serif',
  startLabel: '⊞ Iniciar',
}

const MUSIC_TOKENS: ThemeTokens = {
  theme: 'music',
  titlebarGradient: 'linear-gradient(180deg, #9a4ae2 0%, #3a1280 100%)',
  taskbarGradient: 'linear-gradient(180deg, #6a2aaa 0%, #4a1a8a 30%, #3a1280 70%, #220860 100%)',
  startButtonGradient: 'linear-gradient(180deg, #aa5aee 0%, #8a3acc 50%, #6a10aa 100%)',
  accentColor: '#9a4ae2',
  accentDimColor: '#6a1ab4',
  secondaryColor: '#e24aaa',
  taskbarColor: '#3a1280',
  titleDarkColor: '#2d0a5a',
  titleLightColor: '#9a4ae2',
  displayFont: 'Electrolize, monospace',
  startLabel: '♪ Iniciar',
}

/** Mapeia tema → tokens visuais resolvidos */
export function getThemeTokens(theme: Theme): ThemeTokens {
  return theme === 'dev' ? DEV_TOKENS : MUSIC_TOKENS
}
