'use client'

import { useState, useEffect, useCallback } from 'react'
import type { BootMenuProps } from './boot.types'
import type { Theme } from '@/types/theme.types'

/**
 * Fase 2 do boot: Menu de seleção dual-boot.
 * Caixa centralizada com opções DEV/MUSIC, navegável por teclado (↑↓ + Enter).
 *
 * Exemplo de uso:
 * <BootMenu onSelect={(theme) => startLoading(theme)} />
 */

interface BootOption {
  readonly theme: Theme
  readonly label: string
  readonly description: string
}

const BOOT_OPTIONS: BootOption[] = [
  {
    theme: 'dev',
    label: 'WIRED_OS — 44lain.exe',
    description: 'full-stack - cybersec',
  },
  {
    theme: 'music',
    label: 'WIRED_OS — 44lain',
    description: 'artist - producer - actor',
  },
]

export default function BootMenu({ onSelect }: BootMenuProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const handleSelect = useCallback(() => {
    const option = BOOT_OPTIONS[selectedIndex]
    if (option) {
      onSelect(option.theme)
    }
  }, [selectedIndex, onSelect])

  // Navegação por teclado
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case 'ArrowUp':
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex((prev) =>
            prev === 0 ? BOOT_OPTIONS.length - 1 : prev - 1
          )
          break
        case 'Enter':
          e.preventDefault()
          handleSelect()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleSelect])

  return (
    <div
      className="flex h-screen w-screen items-center justify-center bg-bios-bg font-vt323"
      role="listbox"
      aria-label="Boot menu — select operating system"
    >
      <div className="w-full max-w-[560px] border border-bios-text/30">
        {/* Header */}
        <div className="bg-bios-blue px-4 py-2 text-center text-[14px] text-bios-white">
          WIRED_OS Boot Manager
        </div>

        {/* Instruções */}
        <div className="border-b border-bios-text/20 px-4 py-3 text-[13px] text-bios-text">
          Choose an operating system to start:
        </div>

        {/* Opções */}
        <div className="px-4 py-3">
          {BOOT_OPTIONS.map((option, index) => {
            const isSelected = index === selectedIndex
            return (
              <button
                key={option.theme}
                role="option"
                aria-selected={isSelected}
                className={`mb-1 block w-full px-3 py-2 text-left text-[14px] transition-colors duration-75 ${
                  isSelected
                    ? 'bg-bios-blue text-bios-white'
                    : 'text-bios-text hover:bg-bios-text/10'
                }`}
                onClick={() => {
                  setSelectedIndex(index)
                  onSelect(option.theme)
                }}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div>{option.label}</div>
                <div
                  className={`mt-0.5 text-[12px] ${
                    isSelected ? 'text-bios-text/80' : 'text-bios-text/50'
                  }`}
                >
                  {option.description}
                </div>
              </button>
            )
          })}
        </div>

        {/* Footer */}
        <div className="border-t border-bios-text/20 px-4 py-2 text-[12px] text-bios-text/60">
          <span>Use ↑↓ to select, Enter to boot</span>
          <span className="float-right">WIRED_OS v1.0</span>
        </div>
      </div>
    </div>
  )
}
