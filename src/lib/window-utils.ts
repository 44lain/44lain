import type { Position, Size, Bounds } from '@/types/window.types'
import { TASKBAR_HEIGHT, DESKTOP_PADDING } from './constants'

/** Garante que a janela fique dentro dos limites do desktop */
export function clampWindowPosition(
  position: Position,
  size: Size,
  bounds: Bounds
): Position {
  return {
    x: Math.max(bounds.minX, Math.min(position.x, bounds.maxX - size.width)),
    y: Math.max(bounds.minY, Math.min(position.y, bounds.maxY - size.height)),
  }
}

/** Calcula os limites disponíveis do desktop (desconta taskbar) */
export function getDesktopBounds(): Bounds {
  if (typeof window === 'undefined') {
    return { minX: 0, minY: 0, maxX: 1024, maxY: 768 }
  }
  return {
    minX: DESKTOP_PADDING,
    minY: DESKTOP_PADDING,
    maxX: window.innerWidth - DESKTOP_PADDING,
    maxY: window.innerHeight - TASKBAR_HEIGHT - DESKTOP_PADDING,
  }
}

/** Gera posição inicial com offset cascata para janelas empilhadas */
export function getCascadePosition(index: number): Position {
  const offset = 30 * index
  return {
    x: 80 + offset,
    y: 60 + offset,
  }
}
