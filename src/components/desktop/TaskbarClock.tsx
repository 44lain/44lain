'use client'

import { useState, useEffect } from 'react'

/**
 * Relógio da taskbar. Atualiza a cada minuto.
 */
export default function TaskbarClock() {
  const [time, setTime] = useState<string>('')

  useEffect(() => {
    function updateTime() {
      const now = new Date()
      setTime(
        now.toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        })
      )
    }

    updateTime()
    const interval = setInterval(updateTime, 60_000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex h-full items-center border-l border-white/10 px-3 font-tahoma text-[10px] text-white/80">
      {time}
    </div>
  )
}
