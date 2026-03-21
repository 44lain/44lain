'use client'

import { useCallback, useState } from 'react'
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
 */
export default function MobileDesktop() {
  const { tokens } = useTheme()
  const { currentAppId, stack, openApp, goBack, goHome } = useMobileNavigation()
  const [showTabs, setShowTabs] = useState(false)

  const currentConfig = currentAppId ? windowConfigs[currentAppId] : null

  const handleAppOpen = useCallback(
    (id: string) => {
      setShowTabs(false)
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

      {/* Área de conteúdo */}
      <div className="relative flex-1 overflow-hidden">
        <MobileAppGrid
          apps={MOBILE_APPS}
          onAppOpen={handleAppOpen}
          dimmed={currentAppId !== null}
        />
        <MobileAppSheetManager currentAppId={currentAppId} onClose={goBack} />

        {/* Overlay de abas abertas */}
        {showTabs && (
          <div
            className="absolute inset-0 z-30 flex flex-col gap-3 overflow-y-auto p-4 pt-6"
            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
            onClick={() => setShowTabs(false)}
          >
            <p
              className="mb-2 text-center font-tahoma text-[11px] font-bold uppercase tracking-widest"
              style={{ color: tokens.accentColor }}
            >
              Apps abertos
            </p>
            {stack.length === 0 ? (
              <p className="text-center font-tahoma text-[11px] text-white/50">
                Nenhum app aberto
              </p>
            ) : (
              stack.map((id) => {
                const config = windowConfigs[id]
                if (!config) return null
                return (
                  <button
                    key={id}
                    className="flex items-center gap-3 rounded-xl p-3 text-left transition-opacity active:opacity-70"
                    style={{
                      background: `${tokens.accentDimColor}33`,
                      border: `1px solid ${tokens.accentColor}30`,
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowTabs(false)
                      openApp(id)
                    }}
                  >
                    <span className="text-[28px] leading-none">{config.icon}</span>
                    <span className="font-tahoma text-[13px] font-bold text-white">
                      {config.title}
                    </span>
                  </button>
                )
              })
            )}
          </div>
        )}
      </div>

      <MobileBottomBar
        canGoBack={stack.length > 0}
        onHome={() => { setShowTabs(false); goHome() }}
        onBack={goBack}
        openAppIds={stack}
        onTabsToggle={() => setShowTabs((v) => !v)}
      />
    </div>
  )
}
