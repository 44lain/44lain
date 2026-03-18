import type { WindowConfig } from '@/types/window.types'

/** Configuração estática de cada janela do sistema */
export const windowConfigs: Record<string, WindowConfig> = {
  about: {
    id: 'about',
    title: 'About',
    icon: '👤',
    initialPosition: { x: 80, y: 60 },
    initialSize: { width: 480, height: 360 },
    minSize: { width: 320, height: 240 },
    menuItems: ['File', 'View'],
  },
  projects: {
    id: 'projects',
    title: 'Projects',
    icon: '📁',
    initialPosition: { x: 140, y: 90 },
    initialSize: { width: 560, height: 420 },
    minSize: { width: 400, height: 300 },
    menuItems: ['File', 'Edit', 'View'],
  },
  player: {
    id: 'player',
    title: 'Player',
    icon: '🎵',
    initialPosition: { x: 200, y: 120 },
    initialSize: { width: 320, height: 400 },
    minSize: { width: 280, height: 320 },
  },
  blog: {
    id: 'blog',
    title: 'Blog',
    icon: '📝',
    initialPosition: { x: 160, y: 100 },
    initialSize: { width: 520, height: 380 },
    minSize: { width: 360, height: 280 },
    menuItems: ['File', 'View'],
  },
  contact: {
    id: 'contact',
    title: 'Contact',
    icon: '✉️',
    initialPosition: { x: 220, y: 140 },
    initialSize: { width: 400, height: 340 },
    minSize: { width: 320, height: 260 },
  },
}
