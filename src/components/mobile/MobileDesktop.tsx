'use client'

import { useCallback } from 'react'
import { windowConfigs } from '@/data/window-configs'
import { useTheme } from '@/hooks/useTheme'
import { useMobileNavigation } from '@/hooks/useMobileNavigation'
import MobileStatusBar from './MobileStatusBar'
import MobileAppGrid from './MobileAppGrid'
import MobileAppSheetManager from './MobileAppSheetManager'
import MobileBottomBar from './MobileBottomBar'
import type { MobileAppConfig } from './mobile.types'

/** Mapeia configs de janelas para apps mobile */
const MOBILE_APPS: MobileAppConfig[] = Object.values(windowConfigs).map((config) => ({
  id: config.id,
  title: config.title,
  icon: config.icon,
}))

/**
 * Container principal do mobile OS.
 * Bifurcação de page.tsx quando useIsMobile() === true.
 *
 * Layout:
 * ┌─────────────────┐
 * │  MobileStatusBar│  h-10, fixo no topo
 * ├─────────────────┤
 * │  content area   │  flex-1, relative — sheets deslizam aqui
 * │  ┌───────────┐  │
 * │  │ AppGrid   │  │
 * │  │ (dimmed)  │  │
 * │  └───────────┘  │
 * │  ┌───────────┐  │
 * │  │ AppSheet  │  │ ← sobrepõe o grid via absolute inset-0
 * │  └───────────┘  │
 * ├─────────────────┤
 * │  MobileBottomBar│  h-14, fixo no rodapé
 * └─────────────────┘
 */
export default function MobileDesktop() {
  const { tokens } = useTheme()
  const { currentAppId, stack, openApp, goBack, goHome } = useMobileNavigation()

  const currentConfig = currentAppId ? windowConfigs[currentAppId] : null

  const handleAppOpen = useCallback(
    (id: string) => {
      openApp(id)
    },
    [openApp]
  )

  return (
    <div
      className="flex h-screen w-screen flex-col overflow-hidden"
      style={{
        background: `radial-gradient(ellipse at 30% 50%, ${tokens.accentDimColor}22 0%, ${tokens.taskbarColor}11 50%, #0a0a0f 100%)`,
      }}
    >
      <MobileStatusBar appTitle={currentConfig?.title ?? null} />

      {/* Área de conteúdo — sheet sobrepõe o grid aqui */}
      <div className="relative flex-1 overflow-hidden">
        <MobileAppGrid
          apps={MOBILE_APPS}
          onAppOpen={handleAppOpen}
          dimmed={currentAppId !== null}
        />
        <MobileAppSheetManager currentAppId={currentAppId} onClose={goBack} />
      </div>

      <MobileBottomBar
        canGoBack={stack.length > 0}
        onHome={goHome}
        onBack={goBack}
      />
    </div>
  )
}
