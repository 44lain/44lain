'use client'

import { useCallback } from 'react'
import { useTheme } from '@/hooks/useTheme'
import type { DesktopIconProps } from './desktop.types'

/**
 * Ícone individual do desktop.
 * Click simples → seleciona (highlight OS-style).
 * Double-click → abre janela.
 */
export default function DesktopIcon({ emoji, label, selected, onClick, onDoubleClick }: DesktopIconProps) {
  const { tokens } = useTheme()

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation() // evita que o clique suba e desselecione no container
      onClick(e)
    },
    [onClick]
  )

  const handleDoubleClick = useCallback(() => {
    onDoubleClick()
  }, [onDoubleClick])

  return (
    <button
      className="flex w-[72px] flex-col items-center gap-1 rounded p-1.5 focus-visible:outline-none"
      style={selected ? {
        background: `${tokens.accentColor}40`,
        boxShadow: `inset 0 0 0 1px ${tokens.accentColor}70`,
      } : undefined}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      aria-label={`Abrir ${label}`}
      aria-pressed={selected}
    >
      <span
        className="text-[32px] leading-none"
        style={selected ? { filter: 'brightness(1.15)' } : undefined}
        aria-hidden="true"
      >
        {emoji}
      </span>
      <span
        className="w-full text-center font-tahoma text-[10px] leading-tight text-white"
        style={{
          textShadow: selected
            ? `0 0 8px ${tokens.accentColor}, 1px 1px 2px rgba(0,0,0,0.8)`
            : '1px 1px 2px rgba(0,0,0,0.8)',
        }}
      >
        {label}
      </span>
    </button>
  )
}
