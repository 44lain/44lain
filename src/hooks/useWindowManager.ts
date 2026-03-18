'use client'

import { useCallback } from 'react'
import { useWindowStore } from '@/stores/windowStore'
import type { WindowState } from '@/types/window.types'

interface UseWindowManagerReturn {
  readonly windows: Record<string, WindowState>
  readonly openWindow: (id: string) => void
  readonly closeWindow: (id: string) => void
  readonly minimizeWindow: (id: string) => void
  readonly maximizeWindow: (id: string) => void
  readonly focusWindow: (id: string) => void
}

/** Hook para gerenciar janelas — abstrai o windowStore */
export function useWindowManager(): UseWindowManagerReturn {
  const windows = useWindowStore((state) => state.windows)
  const openWindow = useWindowStore((state) => state.openWindow)
  const closeWindow = useWindowStore((state) => state.closeWindow)
  const minimizeWindow = useWindowStore((state) => state.minimizeWindow)
  const maximizeWindow = useWindowStore((state) => state.maximizeWindow)
  const focusWindow = useWindowStore((state) => state.focusWindow)

  return {
    windows,
    openWindow: useCallback((id: string) => openWindow(id), [openWindow]),
    closeWindow: useCallback((id: string) => closeWindow(id), [closeWindow]),
    minimizeWindow: useCallback((id: string) => minimizeWindow(id), [minimizeWindow]),
    maximizeWindow: useCallback((id: string) => maximizeWindow(id), [maximizeWindow]),
    focusWindow: useCallback((id: string) => focusWindow(id), [focusWindow]),
  }
}
