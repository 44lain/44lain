'use client'

import { useEffect, useRef, useCallback } from 'react'
import type { Position } from '@/types/window.types'

interface UseDraggableOptions {
  readonly initialPosition: Position
  readonly onDragEnd: (position: Position) => void
  readonly enabled?: boolean | undefined
}

/**
 * Hook de drag para janelas via Pointer Events.
 * Pointer Events são usados de ponta a ponta — misturar pointerdown com
 * mouseup faz o preventDefault() bloquear o mouseup, mantendo isDragging=true.
 * setPointerCapture garante recebimento de eventos mesmo fora da janela.
 */
export function useDraggable({ initialPosition, onDragEnd, enabled = true }: UseDraggableOptions) {
  const elementRef = useRef<HTMLDivElement>(null)
  const posRef = useRef<Position>(initialPosition)
  const isDragging = useRef(false)
  const dragOffset = useRef<Position>({ x: 0, y: 0 })

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!enabled || !elementRef.current) return
      if (e.button !== 0) return // apenas botão primário
      isDragging.current = true
      // Lê posição real do DOM para evitar salto quando posRef está desatualizado
      const rect = elementRef.current.getBoundingClientRect()
      posRef.current = { x: rect.left, y: rect.top }
      dragOffset.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
      // Captura o pointer: recebe pointermove/pointerup mesmo fora do elemento
      e.currentTarget.setPointerCapture(e.pointerId)
    },
    [enabled]
  )

  useEffect(() => {
    function handlePointerMove(e: PointerEvent) {
      if (!isDragging.current || !elementRef.current) return
      const newPos: Position = {
        x: e.clientX - dragOffset.current.x,
        y: e.clientY - dragOffset.current.y,
      }
      posRef.current = newPos
      elementRef.current.style.left = `${newPos.x}px`
      elementRef.current.style.top = `${newPos.y}px`
    }

    function handlePointerUp() {
      if (!isDragging.current) return
      isDragging.current = false
      onDragEnd(posRef.current)
    }

    document.addEventListener('pointermove', handlePointerMove)
    document.addEventListener('pointerup', handlePointerUp)
    return () => {
      document.removeEventListener('pointermove', handlePointerMove)
      document.removeEventListener('pointerup', handlePointerUp)
    }
  }, [onDragEnd])

  return { elementRef, handlePointerDown }
}
