'use client'

import { useEffect, useRef, useCallback } from 'react'
import type { Size } from '@/types/window.types'
import { MIN_WINDOW_WIDTH, MIN_WINDOW_HEIGHT } from '@/lib/constants'

interface UseResizableOptions {
  readonly initialSize: Size
  readonly minSize?: Size
  readonly onResizeEnd: (size: Size) => void
  readonly enabled?: boolean
}

/**
 * Hook de resize para janelas.
 * Manipula o DOM diretamente durante resize.
 * Só persiste tamanho no mouseup via onResizeEnd.
 */
export function useResizable({
  initialSize,
  minSize,
  onResizeEnd,
  enabled = true,
}: UseResizableOptions) {
  const elementRef = useRef<HTMLDivElement>(null)
  const sizeRef = useRef<Size>(initialSize)
  const isResizing = useRef(false)
  const startMouse = useRef({ x: 0, y: 0 })
  const startSize = useRef<Size>(initialSize)

  const minW = minSize?.width ?? MIN_WINDOW_WIDTH
  const minH = minSize?.height ?? MIN_WINDOW_HEIGHT

  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!enabled) return
      isResizing.current = true
      startMouse.current = { x: e.clientX, y: e.clientY }
      startSize.current = sizeRef.current
      e.preventDefault()
      e.stopPropagation()
    },
    [enabled]
  )

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (!isResizing.current || !elementRef.current) return
      const dx = e.clientX - startMouse.current.x
      const dy = e.clientY - startMouse.current.y
      const newSize: Size = {
        width: Math.max(minW, startSize.current.width + dx),
        height: Math.max(minH, startSize.current.height + dy),
      }
      sizeRef.current = newSize
      elementRef.current.style.width = `${newSize.width}px`
      elementRef.current.style.height = `${newSize.height}px`
    }

    function handleMouseUp() {
      if (!isResizing.current) return
      isResizing.current = false
      onResizeEnd(sizeRef.current)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [onResizeEnd, minW, minH])

  return { elementRef, handleResizeMouseDown }
}
