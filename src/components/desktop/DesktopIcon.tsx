'use client'

import Image from 'next/image'
import { useCallback } from 'react'
import { useTheme } from '@/hooks/useTheme'
import type { DesktopIconProps } from './desktop.types'

/**
 * Ícone individual do desktop.
 * 1º clique → seleciona.
 * 2º clique (quando já selecionado) → abre o app.
 * onPointerDown → inicia drag (gerenciado pelo DesktopIconGrid).
 */
export default function DesktopIcon({ emoji, iconSrc, label, selected, onClick, onPointerDown }: DesktopIconProps) {
  const { tokens } = useTheme()

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onClick(e)
    },
    [onClick]
  )

  return (
    <button
      className="flex w-[72px] flex-col items-center gap-1 rounded p-1.5 focus-visible:outline-none select-none cursor-default"
      style={selected ? {
        background: `${tokens.accentColor}40`,
        boxShadow: `inset 0 0 0 1px ${tokens.accentColor}70`,
      } : undefined}
      onClick={handleClick}
      onPointerDown={onPointerDown}
      aria-label={`Abrir ${label}`}
      aria-pressed={selected}
      draggable={false}
    >
      {iconSrc ? (
        <Image
          src={iconSrc}
          alt={label}
          width={40}
          height={40}
          className="pointer-events-none"
          style={selected ? { filter: 'brightness(1.15) drop-shadow(0 0 4px rgba(255,255,255,0.3))' } : undefined}
          draggable={false}
        />
      ) : (
        <span
          className="text-[32px] leading-none"
          style={selected ? { filter: 'brightness(1.15)' } : undefined}
          aria-hidden="true"
        >
          {emoji}
        </span>
      )}
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
