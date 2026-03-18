'use client'

import { useState, useCallback } from 'react'
import { ICON_GRID_GAP, TASKBAR_HEIGHT, DESKTOP_PADDING } from '@/lib/constants'
import DesktopIcon from './DesktopIcon'
import type { DesktopIconGridProps } from './desktop.types'

/**
 * Grid de ícones no desktop.
 * Gerencia o estado de seleção: click simples seleciona, double-click abre.
 * Clique na área vazia do grid desseleciona.
 */
export default function DesktopIconGrid({ icons, onIconOpen }: DesktopIconGridProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const handleIconClick = useCallback((id: string) => {
    setSelectedId(id)
  }, [])

  const handleIconOpen = useCallback(
    (windowId: string) => {
      setSelectedId(null)
      onIconOpen(windowId)
    },
    [onIconOpen]
  )

  return (
    <div
      className="absolute left-0 top-0 flex flex-col flex-wrap content-start"
      style={{
        padding: DESKTOP_PADDING,
        gap: ICON_GRID_GAP,
        height: `calc(100% - ${TASKBAR_HEIGHT}px)`,
      }}
      onClick={() => setSelectedId(null)}
    >
      {icons.map((icon) => (
        <DesktopIcon
          key={icon.id}
          emoji={icon.emoji}
          label={icon.label}
          selected={selectedId === icon.id}
          onClick={() => handleIconClick(icon.id)}
          onDoubleClick={() => handleIconOpen(icon.windowId)}
        />
      ))}
    </div>
  )
}
