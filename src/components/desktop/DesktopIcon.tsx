'use client'

import { useCallback } from 'react'
import type { DesktopIconProps } from './desktop.types'

/**
 * Ícone individual do desktop.
 * Ativa no double-click (abre a janela correspondente).
 */
export default function DesktopIcon({ emoji, label, onDoubleClick }: DesktopIconProps) {
  const handleDoubleClick = useCallback(() => {
    onDoubleClick()
  }, [onDoubleClick])

  return (
    <button
      className="flex w-[72px] flex-col items-center gap-1 rounded p-1.5 hover:bg-white/[0.12] focus-visible:bg-white/[0.12] focus-visible:outline-none"
      onDoubleClick={handleDoubleClick}
      aria-label={`Open ${label}`}
    >
      <span className="text-[32px] leading-none" aria-hidden="true">
        {emoji}
      </span>
      <span
        className="w-full text-center font-tahoma text-[10px] leading-tight text-white"
        style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
      >
        {label}
      </span>
    </button>
  )
}
