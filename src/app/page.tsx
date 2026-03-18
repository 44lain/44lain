'use client'

import { useBootStore } from '@/stores/bootStore'

/**
 * Entry point do WIRED_OS.
 * Renderiza BootScreen até o boot completar, depois renderiza o Desktop.
 * Os componentes reais serão implementados nos próximos passos.
 */
export default function Home() {
  const boot = useBootStore((state) => state.boot)

  if (boot.phase !== 'done') {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-bios-bg font-vt323 text-bios-text">
        <p className="text-sm">
          WIRED_OS v1.0 — Boot sequence placeholder
          <span className="cursor-blink">_</span>
        </p>
      </div>
    )
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-wired-black font-tahoma text-white">
      <p className="text-sm">Desktop placeholder — boot complete</p>
    </div>
  )
}
