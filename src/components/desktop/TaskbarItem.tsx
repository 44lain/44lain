'use client'

import type { TaskbarItemProps } from './desktop.types'

/**
 * Item individual na taskbar representando uma janela aberta.
 * Clique foca/restaura a janela.
 */
export default function TaskbarItem({
  title,
  icon,
  isFocused,
  onClick,
}: TaskbarItemProps) {
  return (
    <button
      onClick={onClick}
      className={`flex h-[22px] min-w-[120px] max-w-[160px] items-center gap-1.5 truncate rounded-btn px-2 font-tahoma text-[10px] text-white transition-colors duration-75 ${
        isFocused
          ? 'bg-white/20 shadow-inner'
          : 'bg-white/5 hover:bg-white/10'
      }`}
    >
      <span className="text-xs" aria-hidden="true">
        {icon}
      </span>
      <span className="truncate">{title}</span>
    </button>
  )
}
