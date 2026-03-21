'use client'

import { useTheme } from '@/hooks/useTheme'
import { useNotificationStore } from '@/stores/notificationStore'
import { MOBILE_BOTTOM_BAR_HEIGHT } from '@/lib/constants'
import type { MobileBottomBarProps } from './mobile.types'

/**
 * Barra de navegação inferior do mobile OS.
 * Contém: botão back | home pill | botão de abas (app switcher).
 * Também exibe indicador de notificação MSN.
 */
export default function MobileBottomBar({ canGoBack, onHome, onBack, openAppIds, onTabsToggle }: MobileBottomBarProps) {
  const { tokens } = useTheme()
  const hasMsnNotification = useNotificationStore((s) => s.hasMsnNotification)
  const setHasMsnNotification = useNotificationStore((s) => s.setHasMsnNotification)

  const handleNotificationClick = () => {
    setHasMsnNotification(false)
    window.dispatchEvent(new CustomEvent('msn:reopen'))
  }

  return (
    <div
      className="relative z-10 flex w-full shrink-0 items-center justify-between px-6"
      style={{
        height: MOBILE_BOTTOM_BAR_HEIGHT,
        background: tokens.taskbarGradient,
        borderTop: `1px solid rgba(255,255,255,0.08)`,
      }}
      role="toolbar"
      aria-label="Barra de navegação"
    >
      {/* Back button */}
      <button
        className="flex h-10 w-10 items-center justify-center rounded-full transition-all"
        style={
          canGoBack
            ? {
                background: `${tokens.accentDimColor}55`,
                border: `1px solid ${tokens.accentColor}40`,
              }
            : { opacity: 0.25, pointerEvents: 'none' }
        }
        onClick={onBack}
        disabled={!canGoBack}
        aria-label="Voltar"
        tabIndex={canGoBack ? 0 : -1}
      >
        <span className="font-vt323 text-[20px] text-white/80" aria-hidden="true">◀</span>
      </button>

      {/* Home pill */}
      <div className="relative flex items-center gap-2">
        <button
          className="flex h-10 items-center gap-2 rounded-full px-6 font-tahoma text-[12px] font-bold text-white shadow-btn-xp transition-opacity active:opacity-80"
          style={{ background: tokens.startButtonGradient }}
          onClick={onHome}
          aria-label="Tela inicial"
        >
          {tokens.startLabel}
        </button>
        {/* Indicador de notificação MSN */}
        {hasMsnNotification && (
          <button
            onClick={handleNotificationClick}
            className="absolute -right-8 -top-1 flex h-6 w-6 items-center justify-center rounded-full text-[13px] transition-opacity active:opacity-60"
            style={{
              background: '#f8a400',
              boxShadow: '0 0 6px #f8a40088',
            }}
            aria-label="Nova mensagem MSN"
            title="Nova mensagem MSN"
          >
            💬
          </button>
        )}
      </div>

      {/* Tabs / App switcher */}
      <button
        className="relative flex h-10 w-10 items-center justify-center rounded-full transition-all"
        style={{
          background: `${tokens.accentDimColor}55`,
          border: `1px solid ${tokens.accentColor}40`,
        }}
        onClick={onTabsToggle}
        aria-label="Apps abertos"
      >
        <span className="font-vt323 text-[18px] text-white/80" aria-hidden="true">⊞</span>
        {openAppIds.length > 0 && (
          <span
            className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full font-tahoma text-[9px] font-bold text-white"
            style={{ background: tokens.accentColor }}
          >
            {openAppIds.length}
          </span>
        )}
      </button>
    </div>
  )
}
