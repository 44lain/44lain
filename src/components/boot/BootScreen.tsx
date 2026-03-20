'use client'

import { useState, useCallback } from 'react'
import BiosPost from './BiosPost'
import BootMenu from './BootMenu'
import BiosLoading from './BiosLoading'
import type { BootScreenProps } from './boot.types'
import type { Theme } from '@/types/theme.types'
import { BOOT_FADE_DURATION_MS } from '@/lib/constants'

/**
 * Orquestrador das fases do boot.
 * Controla a transição: BIOS POST → Boot Menu → OS Loading → fade-out → Desktop.
 *
 * Exemplo de uso:
 * <BootScreen onBootComplete={(theme) => setTheme(theme)} />
 */

type BootPhase = 'bios' | 'menu' | 'loading' | 'fading'

export default function BootScreen({ onBootComplete }: BootScreenProps) {
  const [phase, setPhase] = useState<BootPhase>('bios')
  const [isFading, setIsFading] = useState(false)
  const [selectedTheme, setSelectedTheme] = useState<Theme>('dev')

  const handleBiosComplete = useCallback(() => {
    setPhase('menu')
  }, [])

  // Salva o tema escolhido e entra na fase de loading
  const handleThemeSelect = useCallback((theme: Theme) => {
    setSelectedTheme(theme)
    setPhase('loading')
  }, [])

  // Após o loading completar, faz fade-out e notifica
  const handleLoadingComplete = useCallback(() => {
    setIsFading(true)
    setPhase('fading')
    setTimeout(() => {
      onBootComplete(selectedTheme)
    }, BOOT_FADE_DURATION_MS)
  }, [selectedTheme, onBootComplete])

  return (
    <div
      className="fixed inset-0 z-50"
      style={{
        opacity: isFading ? 0 : 1,
        transition: `opacity ${BOOT_FADE_DURATION_MS}ms ease`,
      }}
    >
      {phase === 'bios' && <BiosPost onComplete={handleBiosComplete} />}
      {phase === 'menu' && <BootMenu onSelect={handleThemeSelect} />}
      {(phase === 'loading' || phase === 'fading') && (
        <BiosLoading theme={selectedTheme} onComplete={handleLoadingComplete} />
      )}
    </div>
  )
}
