'use client'

import { useCallback } from 'react'
import { useTheme } from '@/hooks/useTheme'
import { useWindowStore } from '@/stores/windowStore'
import { windowConfigs } from '@/data/window-configs'
import Taskbar from './Taskbar'
import DesktopIconGrid from './DesktopIconGrid'
import WindowManager from '@/components/windows/WindowManager'
import type { DesktopIconConfig } from './desktop.types'

/** Ícones visíveis no desktop, mapeados às janelas — calculados no render para usar tokens */
function buildDesktopIcons(theme: 'dev' | 'music'): DesktopIconConfig[] {
  return Object.values(windowConfigs).map((config) => {
    const src = theme === 'dev' ? config.devIcon : config.musicIcon
    const base = {
      id: config.id,
      label: config.title,
      emoji: config.icon,
      windowId: config.id,
    }
    return src ? { ...base, iconSrc: src } : base
  })
}

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

  const bgImage = tokens.theme === 'dev' ? '/bg-winxp.webp' : '/bg-snake.webm'
  const desktopIcons = buildDesktopIcons(tokens.theme)

  return (
    <div
      className="relative h-screen w-screen overflow-hidden"
      style={{
        backgroundImage: `url('${bgImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >

      {/* Grid de ícones */}
      <DesktopIconGrid icons={desktopIcons} onIconOpen={handleIconOpen} />

      {/* Janelas gerenciadas */}
      <WindowManager />

      {/* Taskbar */}
      <Taskbar />
    </div>
  )
}
