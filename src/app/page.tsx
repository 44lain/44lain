'use client'

import { useCallback, useState } from 'react'
import { useThemeStore } from '@/stores/themeStore'
import { useIsMobile } from '@/hooks/useIsMobile'
import BootScreen from '@/components/boot/BootScreen'
import Desktop from '@/components/desktop/Desktop'
import MobileDesktop from '@/components/mobile/MobileDesktop'
import type { Theme } from '@/types/theme.types'

/**
 * Entry point do WIRED_OS.
 * Após o boot: renderiza MobileDesktop em viewports < 768px, Desktop nos demais.
 * A boot sequence é compartilhada — funciona em qualquer dispositivo.
 */
export default function Home() {
  const setTheme = useThemeStore((state) => state.setTheme)
  const [booted, setBooted] = useState(false)
  const isMobile = useIsMobile()

  const handleBootComplete = useCallback(
    (theme: Theme) => {
      setTheme(theme)
      setBooted(true)
    },
    [setTheme]
  )

  if (!booted) {
    return <BootScreen onBootComplete={handleBootComplete} />
  }

  return isMobile ? <MobileDesktop /> : <Desktop />
}
