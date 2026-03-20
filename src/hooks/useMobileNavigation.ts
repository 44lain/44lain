'use client'

import { useState, useCallback } from 'react'

export interface MobileNavigationState {
  readonly stack: readonly string[]
  readonly currentAppId: string | null
  readonly openApp: (id: string) => void
  readonly goBack: () => void
  readonly goHome: () => void
}

/**
 * Hook de navegação para o mobile OS.
 * Mantém uma pilha de apps abertos — o topo é o app visível.
 * goBack remove o topo; goHome limpa toda a pilha.
 */
export function useMobileNavigation(): MobileNavigationState {
  const [stack, setStack] = useState<readonly string[]>([])

  const currentAppId = stack.length > 0 ? (stack[stack.length - 1] ?? null) : null

  const openApp = useCallback((id: string) => {
    setStack((prev) => [...prev, id])
  }, [])

  const goBack = useCallback(() => {
    setStack((prev) => prev.slice(0, -1))
  }, [])

  const goHome = useCallback(() => {
    setStack([])
  }, [])

  return { stack, currentAppId, openApp, goBack, goHome }
}
