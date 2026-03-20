'use client'

import { useTheme } from '@/hooks/useTheme'
import { MOBILE_BOTTOM_BAR_HEIGHT } from '@/lib/constants'
import type { MobileBottomBarProps } from './mobile.types'

/**
 * Barra de navegação inferior do mobile OS.
 * Contém: botão back (somente quando há app aberto) + home pill temável.
 */
export default function MobileBottomBar({ canGoBack, onHome, onBack }: MobileBottomBarProps) {
  const { tokens } = useTheme()

  return (
    <div
      className="relative z-10 flex w-full shrink-0 items-center justify-between px-8"
      style={{
        height: MOBILE_BOTTOM_BAR_HEIGHT,
        background: tokens.taskbarGradient,
        borderTop: `1px solid rgba(255,255,255,0.08)`,
      }}
      role="toolbar"
      aria-label="Navigation bar"
    >
      {/* Back button — aparece apenas quando há app aberto */}
      <button
        className="flex h-10 w-10 items-center justify-center rounded-full transition-all"
        style={
          canGoBack
            ? {
                background: `${tokens.accentDimColor}55`,
                border: `1px solid ${tokens.accentColor}40`,
                opacity: 1,
              }
            : { opacity: 0, pointerEvents: 'none' }
        }
        onClick={onBack}
        disabled={!canGoBack}
        aria-label="Go back"
        tabIndex={canGoBack ? 0 : -1}
      >
        <span className="font-vt323 text-[20px] text-white/80" aria-hidden="true">
          ◀
        </span>
      </button>

      {/* Home pill */}
      <button
        className="flex h-10 items-center gap-2 rounded-full px-6 font-tahoma text-[12px] font-bold text-white shadow-btn-xp transition-opacity active:opacity-80"
        style={{ background: tokens.startButtonGradient }}
        onClick={onHome}
        aria-label="Go to home screen"
      >
        {tokens.startLabel}
      </button>

      {/* Spacer simétrico */}
      <div className="h-10 w-10" aria-hidden="true" />
    </div>
  )
}
