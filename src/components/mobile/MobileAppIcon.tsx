'use client'

import { useCallback } from 'react'
import { useTheme } from '@/hooks/useTheme'
import type { MobileAppIconProps } from './mobile.types'

/**
 * Ícone de app individual no launcher mobile.
 * Tap único abre o app (sem double-click — padrão mobile).
 * Touch target mínimo de 44px garantido pelo padding.
 */
export default function MobileAppIcon({ app, onOpen }: MobileAppIconProps) {
  const { tokens } = useTheme()

  const handleTap = useCallback(() => {
    onOpen(app.id)
  }, [app.id, onOpen])

  return (
    <button
      className="flex flex-col items-center gap-2 rounded-2xl p-2 transition-opacity active:opacity-60"
      style={{ minWidth: 72 }}
      onClick={handleTap}
      aria-label={`Open ${app.title}`}
    >
      {/* Ícone com glassmorphism temável */}
      <div
        className="flex h-[56px] w-[56px] items-center justify-center rounded-2xl text-[32px] leading-none"
        style={{
          background: `linear-gradient(145deg, ${tokens.accentDimColor}50, ${tokens.titleDarkColor}90)`,
          boxShadow: `0 4px 12px rgba(0,0,0,0.5), inset 0 1px 0 ${tokens.accentColor}35`,
          border: `1px solid ${tokens.accentColor}25`,
        }}
        aria-hidden="true"
      >
        {app.icon}
      </div>

      {/* Label */}
      <span
        className="font-tahoma text-[11px] font-bold text-white/90 leading-tight"
        style={{ textShadow: '0 1px 4px rgba(0,0,0,0.9)' }}
      >
        {app.title}
      </span>
    </button>
  )
}
