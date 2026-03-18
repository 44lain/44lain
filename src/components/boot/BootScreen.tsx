'use client'

import { useState, useCallback } from 'react'
import BiosPost from './BiosPost'
import BootMenu from './BootMenu'
import type { BootScreenProps } from './boot.types'
import type { Theme } from '@/types/theme.types'
import { BOOT_FADE_DURATION_MS } from '@/lib/constants'

/**
 * Orquestrador das fases do boot.
 * Controla a transição: BIOS POST → Boot Menu → fade-out → Desktop.
 *
 * Exemplo de uso:
 * <BootScreen onBootComplete={(theme) => setTheme(theme)} />
 */

type BootPhase = 'bios' | 'menu' | 'fading'

export default function BootScreen({ onBootComplete }: BootScreenProps) {
  const [phase, setPhase] = useState<BootPhase>('bios')
  const [isFading, setIsFading] = useState(false)

  const handleBiosComplete = useCallback(() => {
    setPhase('menu')
  }, [])

  const handleThemeSelect = useCallback(
    (theme: Theme) => {
      setPhase('fading')
      setIsFading(true)

      // Aguarda fade-out antes de notificar
      setTimeout(() => {
        onBootComplete(theme)
      }, BOOT_FADE_DURATION_MS)
    },
    [onBootComplete]
  )

  return (
    <div
      className="fixed inset-0 z-50"
      style={{
        opacity: isFading ? 0 : 1,
        transition: `opacity ${BOOT_FADE_DURATION_MS}ms ease`,
      }}
    >
      {phase === 'bios' && <BiosPost onComplete={handleBiosComplete} />}
      {(phase === 'menu' || phase === 'fading') && (
        <BootMenu onSelect={handleThemeSelect} />
      )}
    </div>
  )
}
