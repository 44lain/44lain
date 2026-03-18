'use client'

import { useState, useEffect, useRef } from 'react'
import type { BiosPostProps, BiosLine } from './boot.types'

/**
 * Fase 1 do boot: BIOS POST.
 * Exibe linhas de texto progressivamente, simulando a inicialização de um PC.
 *
 * Exemplo de uso:
 * <BiosPost onComplete={() => goToMenu()} />
 */

const BIOS_LINES: BiosLine[] = [
  { text: 'WIRED_OS BIOS v4.4', delay: 0, type: 'header' },
  { text: 'Copyright (C) 2026 44lain.', delay: 80, type: 'info' },
  { text: '', delay: 200, type: 'blank' },
  { text: 'CPU: Neural Processing Unit @ 4.4 GHz ............ OK', delay: 300, type: 'ok' },
  { text: 'RAM: 12844 MB DDR4 ................................ OK', delay: 180, type: 'ok' },
  { text: 'GPU: Holographic Render Engine v4.16 .............. OK', delay: 200, type: 'ok' },
  { text: 'STORAGE: Quantum SSD 2TB ......................... OK', delay: 160, type: 'ok' },
  { text: 'NETWORK: Neural Link Adapter ..................... OK', delay: 220, type: 'ok' },
  { text: '', delay: 150, type: 'blank' },
  { text: 'Initializing WIRED_OS kernel...', delay: 400, type: 'info' },
  { text: 'Loading device drivers...', delay: 300, type: 'info' },
  { text: 'Mounting virtual filesystem...', delay: 250, type: 'info' },
  { text: '', delay: 100, type: 'blank' },
  { text: 'System ready. Press any key to continue...', delay: 600, type: 'header' },
]

export default function BiosPost({ onComplete }: BiosPostProps) {
  const [visibleLines, setVisibleLines] = useState(0)
  const [waitingForKey, setWaitingForKey] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Exibe linhas progressivamente
  useEffect(() => {
    if (visibleLines >= BIOS_LINES.length) {
      setWaitingForKey(true)
      return
    }

    const nextLine = BIOS_LINES[visibleLines]
    if (!nextLine) return

    const timer = setTimeout(() => {
      setVisibleLines((prev) => prev + 1)
    }, nextLine.delay)

    return () => clearTimeout(timer)
  }, [visibleLines])

  // Auto-scroll para baixo conforme linhas aparecem
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [visibleLines])

  // Aguarda qualquer tecla para completar
  useEffect(() => {
    if (!waitingForKey) return

    function handleKeyDown() {
      onComplete()
    }

    function handleClick() {
      onComplete()
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('click', handleClick)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('click', handleClick)
    }
  }, [waitingForKey, onComplete])

  function getLineColor(type: BiosLine['type']): string {
    switch (type) {
      case 'header':
        return 'text-bios-white'
      case 'ok':
        return 'text-bios-text'
      case 'info':
        return 'text-bios-text'
      case 'blank':
        return ''
    }
  }

  return (
    <div
      ref={containerRef}
      className="h-screen w-screen overflow-hidden bg-bios-bg p-6 font-vt323 text-[14px] leading-relaxed"
      role="status"
      aria-label="System booting"
    >
      {BIOS_LINES.slice(0, visibleLines).map((line, index) => (
        <div
          key={index}
          className={`${getLineColor(line.type)} whitespace-pre`}
        >
          {line.type === 'blank' ? '\u00A0' : line.text}
        </div>
      ))}

      {/* Cursor piscante */}
      {!waitingForKey && visibleLines < BIOS_LINES.length && (
        <span className="cursor-blink text-bios-white">_</span>
      )}

      {/* Prompt piscante quando aguardando input */}
      {waitingForKey && (
        <span className="cursor-blink text-bios-white">_</span>
      )}
    </div>
  )
}
