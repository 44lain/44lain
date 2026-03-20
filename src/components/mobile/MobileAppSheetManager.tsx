'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { windowConfigs } from '@/data/window-configs'
import { MOBILE_SHEET_ANIMATION_MS } from '@/lib/constants'
import MobileAppSheet from './MobileAppSheet'
import type { MobileAppSheetManagerProps } from './mobile.types'

/** Conteúdos lazy-loaded — idêntico ao WindowManager do desktop */
const appContents: Record<string, React.ComponentType> = {
  about: dynamic(() => import('@/components/window-contents/AboutWindow')),
  projects: dynamic(() => import('@/components/window-contents/ProjectsWindow')),
  player: dynamic(() => import('@/components/window-contents/PlayerWindow')),
  blog: dynamic(() => import('@/components/window-contents/BlogWindow')),
  contact: dynamic(() => import('@/components/window-contents/ContactWindow')),
}

/**
 * Gerencia o ciclo de vida do MobileAppSheet:
 * - Mantém o conteúdo montado durante a animação de saída
 * - Lazy-load do conteúdo do app correspondente
 */
export default function MobileAppSheetManager({
  currentAppId,
  onClose,
}: MobileAppSheetManagerProps) {
  // renderedAppId persiste durante a animação de saída (enquanto currentAppId já é null)
  const [renderedAppId, setRenderedAppId] = useState<string | null>(currentAppId)
  const [isVisible, setIsVisible] = useState(currentAppId !== null)

  useEffect(() => {
    if (currentAppId !== null) {
      setRenderedAppId(currentAppId)
      setIsVisible(true)
      return
    }

    setIsVisible(false)
    const timeout = setTimeout(() => setRenderedAppId(null), MOBILE_SHEET_ANIMATION_MS + 50)
    return () => clearTimeout(timeout)
  }, [currentAppId])

  if (!renderedAppId) return null

  const config = windowConfigs[renderedAppId]
  const Content = appContents[renderedAppId]

  return (
    <MobileAppSheet
      title={config?.title ?? renderedAppId}
      icon={config?.icon ?? '📄'}
      isVisible={isVisible}
      onClose={onClose}
    >
      {Content ? <Content /> : null}
    </MobileAppSheet>
  )
}
