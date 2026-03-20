'use client'

import { useEffect, useRef, useCallback } from 'react'
import type { Size, Position } from '@/types/window.types'
import { MIN_WINDOW_WIDTH, MIN_WINDOW_HEIGHT } from '@/lib/constants'

export type ResizeDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'

interface UseResizableOptions {
  readonly initialSize: Size
  readonly initialPosition: Position
  readonly minSize?: Size | undefined
  readonly onResizeEnd: (size: Size, position: Position) => void
  readonly enabled?: boolean | undefined
}

/**
 * Hook de resize multi-direcional para janelas.
 * Suporta as 8 direções: n, s, e, w, ne, nw, se, sw.
 * Manipula o DOM diretamente durante resize (60fps, sem setState).
 * Só persiste tamanho e posição no mouseup via onResizeEnd.
 */

function computeResize(
  direction: ResizeDirection,
  startPos: Position,
  startSize: Size,
  dx: number,
  dy: number,
  minW: number,
  minH: number,
): { size: Size; position: Position } {
  let width = startSize.width
  let height = startSize.height
  let x = startPos.x
  let y = startPos.y

  if (direction.includes('e')) {
    width = Math.max(minW, startSize.width + dx)
  }
  if (direction.includes('s')) {
    height = Math.max(minH, startSize.height + dy)
  }
  if (direction.includes('w')) {
    const newWidth = Math.max(minW, startSize.width - dx)
    x = startPos.x + (startSize.width - newWidth)
    width = newWidth
  }
  if (direction.includes('n')) {
    const newHeight = Math.max(minH, startSize.height - dy)
    y = startPos.y + (startSize.height - newHeight)
    height = newHeight
  }

  return { size: { width, height }, position: { x, y } }
}

export function useResizable({
  initialSize,
  initialPosition,
  minSize,
  onResizeEnd,
  enabled = true,
}: UseResizableOptions) {
  const elementRef = useRef<HTMLDivElement>(null)
  const sizeRef = useRef<Size>(initialSize)
  const posRef = useRef<Position>(initialPosition)
  const isResizing = useRef(false)
  const startMouse = useRef({ x: 0, y: 0 })
  const startSize = useRef<Size>(initialSize)
  const startPos = useRef<Position>(initialPosition)
  const directionRef = useRef<ResizeDirection>('se')

  const minW = minSize?.width ?? MIN_WINDOW_WIDTH
  const minH = minSize?.height ?? MIN_WINDOW_HEIGHT

  /**
   * Retorna um handler onMouseDown para a direção especificada.
   * Lê posição e tamanho reais do DOM no início do gesto.
   */
  const getResizeHandler = useCallback(
    (direction: ResizeDirection) =>
      (e: React.MouseEvent) => {
        if (!enabled || !elementRef.current) return
        const el = elementRef.current
        isResizing.current = true
        directionRef.current = direction
        startMouse.current = { x: e.clientX, y: e.clientY }
        // Lê do DOM: evita refs desatualizados
        startSize.current = { width: el.offsetWidth, height: el.offsetHeight }
        startPos.current = { x: el.offsetLeft, y: el.offsetTop }
        sizeRef.current = startSize.current
        posRef.current = startPos.current
        e.preventDefault()
        e.stopPropagation()
      },
    [enabled],
  )

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (!isResizing.current || !elementRef.current) return
      const dx = e.clientX - startMouse.current.x
      const dy = e.clientY - startMouse.current.y
      const { size, position } = computeResize(
        directionRef.current,
        startPos.current,
        startSize.current,
        dx,
        dy,
        minW,
        minH,
      )
      sizeRef.current = size
      posRef.current = position
      elementRef.current.style.width = `${size.width}px`
      elementRef.current.style.height = `${size.height}px`
      elementRef.current.style.left = `${position.x}px`
      elementRef.current.style.top = `${position.y}px`
    }

    function handleMouseUp() {
      if (!isResizing.current) return
      isResizing.current = false
      onResizeEnd(sizeRef.current, posRef.current)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [onResizeEnd, minW, minH])

  return { elementRef, getResizeHandler }
}
