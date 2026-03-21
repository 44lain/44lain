'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { TASKBAR_HEIGHT, DESKTOP_PADDING, ICON_GRID_GAP } from '@/lib/constants'
import DesktopIcon from './DesktopIcon'
import type { DesktopIconGridProps } from './desktop.types'
import type { Position } from '@/types/window.types'

/** Dimensões de cada ícone no layout de grade */
const ICON_W = 72
const ICON_H = 84 // ~40px img + gap + ~20px label + padding

/**
 * Calcula posições iniciais em grade (coluna de cima para baixo).
 * Quando a coluna atinge a altura disponível, abre nova coluna.
 */
function calcInitialPositions(ids: readonly string[], availableH: number): Record<string, Position> {
  const result: Record<string, Position> = {}
  let x = DESKTOP_PADDING
  let y = DESKTOP_PADDING
  for (const id of ids) {
    result[id] = { x, y }
    y += ICON_H + ICON_GRID_GAP
    if (y + ICON_H > availableH) {
      y = DESKTOP_PADDING
      x += ICON_W + ICON_GRID_GAP
    }
  }
  return result
}

/**
 * Grid de ícones arrastáveis no desktop.
 *
 * Comportamento de clique (estilo WinXP):
 * - 1º clique → seleciona o ícone
 * - 2º clique (ícone já selecionado) → abre o app
 * - Clique na área vazia → desseleciona
 */
export default function DesktopIconGrid({ icons, onIconOpen }: DesktopIconGridProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  // Posições absolutas de cada ícone
  const [positions, setPositions] = useState<Record<string, Position>>(() => {
    const availableH = (typeof window !== 'undefined' ? window.innerHeight : 600) - TASKBAR_HEIGHT
    return calcInitialPositions(icons.map(i => i.id), availableH)
  })

  // Recalcular posições se os ícones mudarem (layout inicial apenas)
  useEffect(() => {
    setPositions(prev => {
      const availableH = window.innerHeight - TASKBAR_HEIGHT
      const newPos = calcInitialPositions(icons.map(i => i.id), availableH)
      // Manter posições customizadas se já existirem
      const merged: Record<string, Position> = {}
      for (const icon of icons) {
        merged[icon.id] = prev[icon.id] ?? newPos[icon.id] ?? { x: DESKTOP_PADDING, y: DESKTOP_PADDING }
      }
      return merged
    })
  }, [icons])

  // Estado de drag
  const dragging = useRef<{
    id: string
    startMouse: Position
    startPos: Position
  } | null>(null)

  const handleIconPointerDown = useCallback(
    (id: string, e: React.PointerEvent) => {
      if (e.button !== 0) return
      e.preventDefault()
      e.stopPropagation()
      const pos = positions[id] ?? { x: 0, y: 0 }
      dragging.current = {
        id,
        startMouse: { x: e.clientX, y: e.clientY },
        startPos: pos,
      }
      ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    },
    [positions]
  )

  useEffect(() => {
    let hasMoved = false

    function onPointerMove(e: PointerEvent) {
      if (!dragging.current) return
      const dx = e.clientX - dragging.current.startMouse.x
      const dy = e.clientY - dragging.current.startMouse.y
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) hasMoved = true
      if (!hasMoved) return

      const containerH = (containerRef.current?.offsetHeight ?? window.innerHeight) 
      const containerW = (containerRef.current?.offsetWidth ?? window.innerWidth)
      const newX = Math.max(0, Math.min(containerW - ICON_W, dragging.current.startPos.x + dx))
      const newY = Math.max(0, Math.min(containerH - ICON_H, dragging.current.startPos.y + dy))
      setPositions(prev => ({
        ...prev,
        [dragging.current!.id]: { x: newX, y: newY },
      }))
    }

    function onPointerUp() {
      if (dragging.current && hasMoved) {
        // Drag finalizado — não dispara clique
        dragging.current = null
        hasMoved = false
        return
      }
      dragging.current = null
      hasMoved = false
    }

    document.addEventListener('pointermove', onPointerMove)
    document.addEventListener('pointerup', onPointerUp)
    return () => {
      document.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerup', onPointerUp)
    }
  }, [])

  const handleIconClick = useCallback(
    (id: string) => {
      if (selectedId === id) {
        // Segundo clique: abre o app
        setSelectedId(null)
        onIconOpen(id)
      } else {
        // Primeiro clique: seleciona
        setSelectedId(id)
      }
    },
    [selectedId, onIconOpen]
  )

  return (
    <div
      ref={containerRef}
      className="absolute left-0 top-0 w-full"
      style={{ height: `calc(100% - ${TASKBAR_HEIGHT}px)` }}
      onClick={() => setSelectedId(null)}
    >
      {icons.map((icon) => {
        const pos = positions[icon.id] ?? { x: DESKTOP_PADDING, y: DESKTOP_PADDING }
        return (
          <div
            key={icon.id}
            className="absolute"
            style={{ left: pos.x, top: pos.y, width: ICON_W }}
            onClick={e => e.stopPropagation()}
          >
            <DesktopIcon
              emoji={icon.emoji}
              {...(icon.iconSrc ? { iconSrc: icon.iconSrc } : {})}
              label={icon.label}
              selected={selectedId === icon.id}
              onClick={() => handleIconClick(icon.id)}
              onPointerDown={(e) => handleIconPointerDown(icon.id, e)}
            />
          </div>
        )
      })}
    </div>
  )
}
