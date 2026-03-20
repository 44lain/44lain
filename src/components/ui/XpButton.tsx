'use client'

import { useState } from 'react'
import { useTheme } from '@/hooks/useTheme'

interface XpButtonProps {
  readonly children: React.ReactNode
  readonly onClick?: () => void
  readonly type?: 'button' | 'submit' | 'reset'
  readonly disabled?: boolean
  readonly fullWidth?: boolean
}

/**
 * Botão genérico estilo WinXP Luna.
 * Bevel 3D, gradiente cinza/branco, borda temática.
 */
export default function XpButton({
  children,
  onClick,
  type = 'button',
  disabled = false,
  fullWidth = false,
}: XpButtonProps) {
  const { tokens } = useTheme()
  const [isPressed, setIsPressed] = useState(false)

  const baseBg = 'linear-gradient(180deg, #ffffff 0%, #ece9d8 40%, #d4d0c8 100%)'
  const hoverBg = 'linear-gradient(180deg, #ffffff 0%, #e8f0ff 40%, #c8d8f0 100%)'
  const pressedBg = 'linear-gradient(180deg, #c8d0e0 0%, #d4dce8 100%)'

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      className={`select-none font-tahoma text-[11px] text-[#1a1a1a] px-4 py-1 
        border focus:outline-none 
        disabled:opacity-50 disabled:cursor-not-allowed
        ${fullWidth ? 'w-full' : ''}
      `}
      style={{
        background: isPressed ? pressedBg : baseBg,
        borderColor: `${tokens.accentColor}80`,
        borderTopColor: isPressed ? `${tokens.accentColor}60` : 'rgba(255,255,255,0.9)',
        borderLeftColor: isPressed ? `${tokens.accentColor}60` : 'rgba(255,255,255,0.9)',
        borderBottomColor: isPressed ? 'rgba(255,255,255,0.5)' : `${tokens.accentColor}90`,
        borderRightColor: isPressed ? 'rgba(255,255,255,0.5)' : `${tokens.accentColor}90`,
        boxShadow: isPressed
          ? 'inset 1px 1px 2px rgba(0,0,0,0.15)'
          : 'inset 0 1px 0 rgba(255,255,255,0.8), 1px 1px 2px rgba(0,0,0,0.25)',
        borderRadius: '2px',
      }}
    >
      {children}
    </button>
  )
}
