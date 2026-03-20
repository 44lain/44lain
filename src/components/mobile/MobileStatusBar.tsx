'use client'

import { useState, useEffect } from 'react'
import { useTheme } from '@/hooks/useTheme'
import { MOBILE_STATUS_BAR_HEIGHT } from '@/lib/constants'
import type { MobileStatusBarProps } from './mobile.types'

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
}

/**
 * Barra de status superior do mobile OS.
 * Exibe nome do app ativo (ou WIRED_OS na home), relógio e indicadores estilo Y2K.
 */
export default function MobileStatusBar({ appTitle }: MobileStatusBarProps) {
  const { tokens } = useTheme()
  const [time, setTime] = useState('')

  useEffect(() => {
    setTime(formatTime(new Date()))
    const interval = setInterval(() => setTime(formatTime(new Date())), 60_000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className="relative z-10 flex w-full shrink-0 items-center justify-between px-4"
      style={{
        height: MOBILE_STATUS_BAR_HEIGHT,
        background: tokens.taskbarGradient,
        borderBottom: `1px solid rgba(255,255,255,0.08)`,
      }}
      role="banner"
      aria-label="Barra de status"
    >
      {/* Nome do app ou sistema */}
      <span className="font-tahoma text-[11px] font-bold text-white/90 tracking-wide">
        {appTitle ?? 'WIRED_OS'}
      </span>

      {/* Indicadores direita */}
      <div className="flex items-center gap-3">
        <span className="font-vt323 text-[13px] leading-none text-white/60" aria-hidden="true">
          ▲▲▲
        </span>
        <span className="font-vt323 text-[13px] leading-none text-white/60" aria-hidden="true">
          ■■■
        </span>
        <span
          className="font-tahoma text-[10px] text-white/90"
          aria-label={`Current time: ${time}`}
        >
          {time}
        </span>
      </div>
    </div>
  )
}
