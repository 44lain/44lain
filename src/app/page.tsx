'use client'

import { useCallback, useState } from 'react'
import { useThemeStore } from '@/stores/themeStore'
import BootScreen from '@/components/boot/BootScreen'
import Desktop from '@/components/desktop/Desktop'
import type { Theme } from '@/types/theme.types'

/**
 * Entry point do WIRED_OS.
 * Renderiza BootScreen até o boot completar, depois renderiza o Desktop.
 */
export default function Home() {
  const setTheme = useThemeStore((state) => state.setTheme)
  const [booted, setBooted] = useState(false)

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

  return <Desktop />
}
