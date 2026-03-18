'use client'

import { useCallback } from 'react'
import { useTheme } from '@/hooks/useTheme'
import { useWindowStore } from '@/stores/windowStore'
import { windowConfigs } from '@/data/window-configs'
import Taskbar from './Taskbar'
import DesktopIconGrid from './DesktopIconGrid'
import WindowManager from '@/components/windows/WindowManager'
import type { DesktopIconConfig } from './desktop.types'

/** Ícones visíveis no desktop, mapeados às janelas */
const DESKTOP_ICONS: DesktopIconConfig[] = Object.values(windowConfigs).map((config) => ({
  id: config.id,
  label: config.title,
  emoji: config.icon,
  windowId: config.id,
}))

/**
 * Container principal do desktop.
 * Renderiza wallpaper (gradient fallback), ícones, janelas e taskbar.
 */
export default function Desktop() {
  const { tokens } = useTheme()
  const openWindow = useWindowStore((s) => s.openWindow)

  const handleIconOpen = useCallback(
    (windowId: string) => {
      openWindow(windowId)
    },
    [openWindow]
  )

  return (
    <div
      className="relative h-screen w-screen overflow-hidden"
      style={{
        background: `radial-gradient(ellipse at 30% 50%, ${tokens.accentDimColor}22 0%, ${tokens.taskbarColor}11 50%, #0a0a0f 100%)`,
      }}
    >
      {/* Grid de ícones */}
      <DesktopIconGrid icons={DESKTOP_ICONS} onIconOpen={handleIconOpen} />

      {/* Janelas gerenciadas */}
      <WindowManager />

      {/* Taskbar */}
      <Taskbar />
    </div>
  )
}
