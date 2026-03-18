'use client'

import { ICON_GRID_GAP, TASKBAR_HEIGHT, DESKTOP_PADDING } from '@/lib/constants'
import DesktopIcon from './DesktopIcon'
import type { DesktopIconGridProps } from './desktop.types'

/**
 * Grid de ícones no desktop.
 * Ocupa a área disponível excluindo a taskbar.
 */
export default function DesktopIconGrid({ icons, onIconOpen }: DesktopIconGridProps) {
  return (
    <div
      className="absolute left-0 top-0 flex flex-col flex-wrap content-start"
      style={{
        padding: DESKTOP_PADDING,
        gap: ICON_GRID_GAP,
        height: `calc(100% - ${TASKBAR_HEIGHT}px)`,
      }}
    >
      {icons.map((icon) => (
        <DesktopIcon
          key={icon.id}
          emoji={icon.emoji}
          label={icon.label}
          onDoubleClick={() => onIconOpen(icon.windowId)}
        />
      ))}
    </div>
  )
}
