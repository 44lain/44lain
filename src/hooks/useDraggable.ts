'use client'

import { useEffect, useRef, useCallback } from 'react'
import type { Position } from '@/types/window.types'

interface UseDraggableOptions {
  readonly initialPosition: Position
  readonly onDragEnd: (position: Position) => void
  readonly enabled?: boolean | undefined
}

/**
 * Hook de drag para janelas.
 * Manipula o DOM diretamente durante drag (sem setState no mousemove).
 * Só persiste posição no mouseup via onDragEnd.
 */
export function useDraggable({ initialPosition, onDragEnd, enabled = true }: UseDraggableOptions) {
  const elementRef = useRef<HTMLDivElement>(null)
  const posRef = useRef<Position>(initialPosition)
  const isDragging = useRef(false)
  const dragOffset = useRef<Position>({ x: 0, y: 0 })

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!enabled || !elementRef.current) return
      isDragging.current = true
      dragOffset.current = {
        x: e.clientX - posRef.current.x,
        y: e.clientY - posRef.current.y,
      }
      e.preventDefault()
    },
    [enabled]
  )

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (!isDragging.current || !elementRef.current) return
      const newPos: Position = {
        x: e.clientX - dragOffset.current.x,
        y: e.clientY - dragOffset.current.y,
      }
      posRef.current = newPos
      elementRef.current.style.left = `${newPos.x}px`
      elementRef.current.style.top = `${newPos.y}px`
    }

    function handleMouseUp() {
      if (!isDragging.current) return
      isDragging.current = false
      onDragEnd(posRef.current)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [onDragEnd])

  return { elementRef, handleMouseDown }
}
