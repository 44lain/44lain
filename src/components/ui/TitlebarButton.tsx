'use client'

interface TitlebarButtonProps {
  readonly variant: 'close' | 'minimize' | 'maximize'
  readonly onClick: () => void
}

const GRADIENTS = {
  close: {
    default: 'linear-gradient(180deg, #ff8080 0%, #e02020 100%)',
    hover: 'linear-gradient(180deg, #ffaaaa 0%, #ff3030 100%)',
  },
  minimize: {
    default: 'linear-gradient(180deg, #ffe080 0%, #e0a020 100%)',
    hover: 'linear-gradient(180deg, #fff0a0 0%, #ffb030 100%)',
  },
  maximize: {
    default: 'linear-gradient(180deg, #80ff80 0%, #20c020 100%)',
    hover: 'linear-gradient(180deg, #a0ffa0 0%, #30e030 100%)',
  },
} as const

const ARIA_LABELS = {
  close: 'Close window',
  minimize: 'Minimize window',
  maximize: 'Maximize window',
} as const

const SYMBOLS = {
  close: '×',
  minimize: '−',
  maximize: '□',
} as const

/**
 * Botão da titlebar (fechar, minimizar, maximizar).
 * Gradientes exatos conforme design-system.md.
 */
export default function TitlebarButton({ variant, onClick }: TitlebarButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label={ARIA_LABELS[variant]}
      className="group flex h-[14px] w-[16px] items-center justify-center rounded-titlebar-btn text-[10px] font-bold leading-none text-white/90 shadow-btn-xp"
      style={{ background: GRADIENTS[variant].default }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = GRADIENTS[variant].hover
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = GRADIENTS[variant].default
      }}
    >
      {SYMBOLS[variant]}
    </button>
  )
}
