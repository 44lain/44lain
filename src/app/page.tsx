'use client'

import { useCallback, useState, useEffect } from 'react'
import { useThemeStore } from '@/stores/themeStore'
import { useIsMobile } from '@/hooks/useIsMobile'
import BootScreen from '@/components/boot/BootScreen'
import Desktop from '@/components/desktop/Desktop'
import MobileDesktop from '@/components/mobile/MobileDesktop'
import MsnPopup from '@/components/ui/MsnPopup'
import type { Theme } from '@/types/theme.types'

/**
 * Entry point do WIRED_OS.
 * Após o boot: renderiza MobileDesktop em viewports < 768px, Desktop nos demais.
 * Reproduz o som de inicialização e exibe o popup de boas-vindas estilo MSN.
 */
export default function Home() {
  const setTheme = useThemeStore((state) => state.setTheme)
  const [booted, setBooted] = useState(false)
  const [showMsnPopup, setShowMsnPopup] = useState(false)
  const isMobile = useIsMobile()

  const handleBootComplete = useCallback(
    (theme: Theme) => {
      setTheme(theme)
      setBooted(true)
      // Som de inicialização do WinXP
      const startup = new Audio('/sounds/winxp-startup.mp3')
      startup.play().catch(() => undefined)
      // Popup MSN aparece 8 segundos após o login
      setTimeout(() => setShowMsnPopup(true), 8000)
    },
    [setTheme]
  )

  // Re-exibir popup quando a taskbar/bottombar clicar na notificação
  useEffect(() => {
    const handler = () => setShowMsnPopup(true)
    window.addEventListener('msn:reopen', handler)
    return () => window.removeEventListener('msn:reopen', handler)
  }, [])

  if (!booted) {
    return <BootScreen onBootComplete={handleBootComplete} />
  }

  return (
    <>
      {isMobile ? <MobileDesktop /> : <Desktop />}
      {showMsnPopup && <MsnPopup onClose={() => setShowMsnPopup(false)} />}
    </>
  )
}
