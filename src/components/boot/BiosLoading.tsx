'use client'

import { useState, useEffect, useRef } from 'react'
import type { BiosLoadingProps } from './boot.types'

/**
 * Fase 3 do boot: loading específico do OS selecionado.
 * DEV: mensagens de kernel Linux estilizadas, barra de progresso verde.
 * MUSIC: inicialização de DSP/áudio, barra de progresso roxa.
 *
 * Auto-completa após todas as linhas serem exibidas.
 */

interface LoadLine {
  readonly text: string
  readonly delay: number
  readonly dim?: boolean
}

const DEV_LINES: LoadLine[] = [
  { text: 'WIRED_OS — 44lain.exe  [kernel v6.6.0-wired]', delay: 0 },
  { text: '', delay: 80 },
  { text: '[    0.000000] Iniciando kernel WIRED_OS 6.6.0-wired...', delay: 60 },
  { text: '[    0.001337] Inicializando subsistema de memória neural', delay: 55 },
  { text: '[    0.023400] ACPI: Interface de camada Wired detectada', delay: 50 },
  { text: '[    0.087312] PCI: Verificando arquitetura do barramento neural', delay: 55 },
  { text: '[    0.123456] Montando /dev/cognitive em /mnt/wired  [OK]', delay: 70 },
  { text: '[    0.234567] NET: Protocolo TCP/WIRED v2 registrado', delay: 55 },
  { text: '[    0.312890] Carregando módulo cybersec do kernel...  [OK]', delay: 65 },
  { text: '[    0.401234] Iniciando servidor de vídeo [wired-display]...  [OK]', delay: 70 },
  { text: '[    0.456789] Iniciando gerenciador de janelas [wired-wm]...  [OK]', delay: 65 },
  { text: '[    0.512345] Montando sistema de arquivos virtual...  [OK]', delay: 60 },
  { text: '[    0.567890] Todos os serviços ativos. Entrando no nível 5.', delay: 90 },
  { text: '', delay: 80 },
  { text: 'WIRED_OS v1.0 — bem-vindo de volta, 44lain.', delay: 120 },
]

const MUSIC_LINES: LoadLine[] = [
  { text: 'WIRED_OS — 44lain  [motor de áudio v4.4]', delay: 0 },
  { text: '', delay: 80 },
  { text: '  ♪  Inicializando núcleo DSP  [44.1 kHz / 32-bit float]', delay: 70 },
  { text: '  ♪  Carregando biblioteca de samples  [44 patches encontrados]', delay: 80 },
  { text: '  ♪  Calibrando osciladores  [desvio: 0.00 Hz]', delay: 75 },
  { text: '  ♪  Sincronizando clock MIDI  [120.0 BPM travado]', delay: 70 },
  { text: '  ♩  Montando sistema de áudio  [/dev/soundscape]', delay: 80 },
  { text: '  ♪  Carregando motor de reverb  [cauda: 4.44 s]', delay: 75 },
  { text: '  ♪  Inicializando buffer de saída  [latência: 4 ms]', delay: 70 },
  { text: '  ♪  Aquecendo módulo de saturação analógica...', delay: 85 },
  { text: '  ♪  Calibrando ganho de saída...  [-0.3 dBFS]', delay: 75 },
  { text: '  ♫  Todos os canais nominais.', delay: 90 },
  { text: '', delay: 80 },
  { text: 'WIRED_OS v1.0 — deixe o som te levar.', delay: 120 },
]

const BAR_WIDTH = 28
const COMPLETE_PAUSE_MS = 500

export default function BiosLoading({ theme, onComplete }: BiosLoadingProps) {
  const [visibleLines, setVisibleLines] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const lines = theme === 'dev' ? DEV_LINES : MUSIC_LINES
  const totalLines = lines.length

  const isDevTheme = theme === 'dev'
  const accentColor = isDevTheme ? '#80ff44' : '#cc88ff'
  const dimColor = isDevTheme ? '#44aa22' : '#7744aa'
  const headerColor = isDevTheme ? '#ffffff' : '#ffffff'
  const barChar = isDevTheme ? '█' : '▪'
  const emptyChar = isDevTheme ? '░' : '·'

  // Revela linhas progressivamente
  useEffect(() => {
    if (visibleLines >= totalLines) {
      const timer = setTimeout(onComplete, COMPLETE_PAUSE_MS)
      return () => clearTimeout(timer)
    }

    const nextLine = lines[visibleLines]
    if (!nextLine) return

    const timer = setTimeout(() => {
      setVisibleLines((prev) => prev + 1)
    }, nextLine.delay)

    return () => clearTimeout(timer)
  }, [visibleLines, totalLines, lines, onComplete])

  // Auto-scroll
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [visibleLines])

  const progress = totalLines > 0 ? visibleLines / totalLines : 0
  const filled = Math.round(progress * BAR_WIDTH)
  const pct = Math.round(progress * 100)
  const isComplete = visibleLines >= totalLines

  function getLineColor(line: LoadLine): string {
    if (!line.text) return ''
    // Header lines: first and last non-empty
    const firstNonEmpty = lines.findIndex((l) => l.text !== '')
    const lastNonEmpty = [...lines].reverse().findIndex((l) => l.text !== '')
    const lastIdx = lines.length - 1 - lastNonEmpty
    const lineIdx = lines.indexOf(line)
    if (lineIdx === firstNonEmpty || lineIdx === lastIdx) return headerColor
    return line.dim ? dimColor : accentColor
  }

  return (
    <div
      ref={containerRef}
      className="h-screen w-screen overflow-hidden bg-bios-bg p-6 font-vt323 text-[14px] leading-relaxed"
      role="status"
      aria-label="Operating system loading"
    >
      {lines.slice(0, visibleLines).map((line, index) => (
        <div
          key={index}
          className="whitespace-pre"
          style={{ color: line.text ? getLineColor(line) : undefined }}
        >
          {line.text || '\u00A0'}
        </div>
      ))}

      {/* Cursor piscante enquanto carrega */}
      {!isComplete && visibleLines < totalLines && (
        <span className="cursor-blink" style={{ color: accentColor }}>
          _
        </span>
      )}

      {/* Barra de progresso */}
      <div
        className="mt-4 font-vt323 text-[15px] whitespace-pre"
        style={{ color: accentColor }}
      >
        {isDevTheme ? (
          <>
            {'Loading  ['}
            <span style={{ color: accentColor }}>{barChar.repeat(filled)}</span>
            <span style={{ color: dimColor }}>{emptyChar.repeat(BAR_WIDTH - filled)}</span>
            {`]  ${String(pct).padStart(3, ' ')}%`}
          </>
        ) : (
          <>
            {'◄ '}
            <span style={{ color: accentColor }}>{barChar.repeat(filled)}</span>
            <span style={{ color: dimColor }}>{emptyChar.repeat(BAR_WIDTH - filled)}</span>
            {` ►  ${String(pct).padStart(3, ' ')}%`}
          </>
        )}
      </div>
    </div>
  )
}
