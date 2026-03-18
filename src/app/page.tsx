'use client'

import { useCallback, useState } from 'react'
import { useThemeStore } from '@/stores/themeStore'
import BootScreen from '@/components/boot/BootScreen'
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

  // Desktop placeholder — será substituído pelo componente Desktop real
  return (
    <main className="flex h-screen w-screen items-center justify-center bg-wired-black font-tahoma text-white">
      <p className="text-sm opacity-60">
        WIRED_OS Desktop — loading...
      </p>
    </main>
  )
}
