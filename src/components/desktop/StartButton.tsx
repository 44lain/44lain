'use client'

import { useTheme } from '@/hooks/useTheme'

/**
 * Botão Start da taskbar.
 * Label e gradiente mudam de acordo com o tema ativo.
 */
export default function StartButton() {
  const { tokens } = useTheme()

  return (
    <button
      className="flex h-[26px] items-center gap-1.5 rounded-btn-start px-3 font-tahoma text-[11px] font-bold text-white shadow-btn-xp active:brightness-90"
      style={{ background: tokens.startButtonGradient }}
      aria-label="Menu Iniciar"
    >
      {tokens.startLabel}
    </button>
  )
}
