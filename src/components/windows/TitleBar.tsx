'use client'

import { useTheme } from '@/hooks/useTheme'
import TitlebarButton from '@/components/ui/TitlebarButton'

interface TitleBarProps {
  readonly title: string
  readonly icon: string
  readonly isFocused: boolean
  readonly onClose: () => void
  readonly onMinimize: () => void
  readonly onMaximize: () => void
  readonly onPointerDown: (e: React.PointerEvent) => void
  readonly onDoubleClick: () => void
}

/**
 * Barra de título de uma janela.
 * Draggable via pointer events (handler recebido por prop do Window pai).
 */
export default function TitleBar({
  title,
  icon,
  isFocused,
  onClose,
  onMinimize,
  onMaximize,
  onPointerDown,
  onDoubleClick,
}: TitleBarProps) {
  const { tokens } = useTheme()

  return (
    <div
      className="flex h-[26px] select-none items-center rounded-t-window px-1.5"
      style={{
        background: tokens.titlebarGradient,
        opacity: isFocused ? 1 : 0.85,
      }}
      onPointerDown={onPointerDown}
      onDoubleClick={onDoubleClick}
    >
      {/* Ícone + Título */}
      <div className="flex flex-1 items-center gap-1.5 overflow-hidden">
        <span className="text-xs" aria-hidden="true">
          {icon}
        </span>
        <span className="truncate font-tahoma text-[11px] font-bold text-white">
          {title}
        </span>
      </div>

      {/* Botões de controle */}
      <div className="flex items-center gap-[2px]">
        <TitlebarButton variant="minimize" onClick={onMinimize} />
        <TitlebarButton variant="maximize" onClick={onMaximize} />
        <TitlebarButton variant="close" onClick={onClose} />
      </div>
    </div>
  )
}
