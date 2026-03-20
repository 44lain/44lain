'use client'

import { useTheme } from '@/hooks/useTheme'
import { MOBILE_SHEET_ANIMATION_MS } from '@/lib/constants'
import type { MobileAppSheetProps } from './mobile.types'

/**
 * Painel fullscreen que representa um app aberto no mobile OS.
 * Desliza de baixo para cima ao abrir, inverte ao fechar.
 * Cobre apenas a área de conteúdo (entre status bar e bottom bar).
 */
export default function MobileAppSheet({
  title,
  icon,
  isVisible,
  onClose,
  children,
}: MobileAppSheetProps) {
  const { tokens } = useTheme()

  return (
    <div
      className="absolute inset-0 z-20 flex flex-col overflow-hidden"
      style={{
        background: '#0a0a0f',
        transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
        transition: `transform ${MOBILE_SHEET_ANIMATION_MS}ms cubic-bezier(0.32, 0.72, 0, 1)`,
      }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* Titlebar do app */}
      <div
        className="flex shrink-0 items-center justify-between px-4"
        style={{
          minHeight: 44,
          background: tokens.titlebarGradient,
          borderBottom: `1px solid rgba(255,255,255,0.12)`,
        }}
      >
        <div className="flex items-center gap-2.5">
          <span className="text-[20px] leading-none" aria-hidden="true">
            {icon}
          </span>
          <span className="font-tahoma text-[12px] font-bold text-white">
            {title}
          </span>
        </div>

        {/* Botão fechar */}
        <button
          className="flex h-8 w-8 items-center justify-center rounded font-bold text-white/90 transition-opacity active:opacity-60"
          style={{
            background: 'rgba(190, 30, 30, 0.85)',
            fontSize: 16,
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25)',
          }}
          onClick={onClose}
          aria-label={`Fechar ${title}`}
          autoFocus
        >
          ×
        </button>
      </div>

      {/* Área de conteúdo */}
      <div className="flex-1 overflow-y-auto p-4">
        {children}
      </div>
    </div>
  )
}
