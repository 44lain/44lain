'use client'

import MobileAppIcon from './MobileAppIcon'
import type { MobileAppGridProps } from './mobile.types'

/**
 * Grid de ícones do launcher mobile.
 * Centralizado na tela, transiciona para dimmed quando um app está aberto.
 */
export default function MobileAppGrid({ apps, onAppOpen, dimmed }: MobileAppGridProps) {
  return (
    <div
      className="absolute inset-0 flex flex-wrap content-start justify-center gap-x-4 gap-y-6 overflow-y-auto px-4 py-8"
      style={{
        filter: dimmed ? 'brightness(0.4) blur(2px)' : 'none',
        transition: 'filter 300ms ease',
        pointerEvents: dimmed ? 'none' : 'auto',
      }}
      role="list"
      aria-label="Aplicativos"
    >
      {apps.map((app) => (
        <div key={app.id} role="listitem">
          <MobileAppIcon app={app} onOpen={onAppOpen} />
        </div>
      ))}
    </div>
  )
}
