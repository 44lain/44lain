'use client'

import { useEffect, useCallback } from 'react'
import { useNotificationStore } from '@/stores/notificationStore'

interface MsnPopupProps {
  readonly onClose: () => void
}

/**
 * Pop-up de boas-vindas estilo MSN Messenger (Windows XP era).
 * Aparece ao iniciar qualquer OS, reproduz o som característico do MSN.
 * Auto-dismiss após 4 segundos → ativa notificação na taskbar.
 */
export default function MsnPopup({ onClose }: MsnPopupProps) {
  const setHasMsnNotification = useNotificationStore((s) => s.setHasMsnNotification)

  // Reproduz som do MSN ao montar
  useEffect(() => {
    const audio = new Audio('/sounds/msn-message.wav')
    audio.play().catch(() => undefined)
  }, [])

  // Auto-dismiss após 8s → deixa notificação na taskbar
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasMsnNotification(true)
      onClose()
    }, 8000)
    return () => clearTimeout(timer)
  }, [onClose, setHasMsnNotification])

  const handleClose = useCallback(() => {
    // Fechar manualmente não deixa notificação
    onClose()
  }, [onClose])

  return (
    <div
      className="fixed bottom-12 right-4 z-[200] w-[300px] shadow-2xl msn-slide-up"
      role="dialog"
      aria-modal="false"
      aria-label="Mensagem instantânea"
    >
      {/* Titlebar MSN — gradiente laranja característico */}
      <div
        className="flex items-center justify-between px-3 py-1.5 select-none"
        style={{
          background: 'linear-gradient(135deg, #4fa3f7 0%, #79c2ff 50%, #d6ecff 100%)',
          borderRadius: '4px 4px 0 0',
          borderBottom: '1px solid #8b2e00',
        }}
      >
        <div className="flex items-center gap-2">
          <span className="text-[16px] leading-none" aria-hidden="true">💬</span>
          <span className="font-tahoma text-[11px] font-bold text-white drop-shadow">
            (1) Nova mensagem
          </span>
        </div>
        <button
          className="flex h-[18px] w-[18px] items-center justify-center rounded-sm font-bold text-white/90 transition-opacity active:opacity-60 hover:bg-white/20"
          style={{ fontSize: 14 }}
          onClick={handleClose}
          aria-label="Fechar"
        >
          ×
        </button>
      </div>

      {/* Corpo */}
      <div
        className="flex gap-3 p-3"
        style={{
          background: 'linear-gradient(180deg, #ffffff 0%, #f4f4f8 100%)',
          borderRadius: '0 0 4px 4px',
          border: '1px solid #b0b0b0',
          borderTop: 'none',
        }}
      >
        {/* Avatar */}
        <div
          className="shrink-0 flex h-[40px] w-[40px] items-center justify-center rounded-sm"
          style={{
            background: 'linear-gradient(135deg, #4a90e2 0%, #1240a0 100%)',
            border: '1px solid #8888cc',
          }}
          aria-hidden="true"
        >
          <span className="text-[22px] leading-none">👾</span>
        </div>

        {/* Conteúdo */}
        <div className="flex flex-1 flex-col gap-2.5">
          <span
            className="font-tahoma text-[11px] font-bold"
            style={{ color: '#1a40a0' }}
          >
            44lain
          </span>
          <p className="font-tahoma text-[11px] leading-relaxed text-gray-700">
            oi! passando só para desejar boas-vindas. fique à vontade para
            conhecer um pouco do meu trabalho :p
          </p>

          <div className="flex justify-end">
            <button
              onClick={handleClose}
              className="font-tahoma text-[11px] px-4 py-1 transition-opacity active:opacity-70"
              style={{
                background: 'linear-gradient(180deg, #f8f8f8 0%, #dcdcdc 100%)',
                border: '1px solid #999',
                borderRadius: 3,
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9)',
                color: '#222',
              }}
            >
              fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
