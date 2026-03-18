import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type { WindowStore, WindowState, Position, Size } from '@/types/window.types'
import { windowConfigs } from '@/data/window-configs'
import { INITIAL_Z_INDEX } from '@/lib/constants'

/** Cria o estado inicial de uma janela a partir da config */
function createInitialWindowState(id: string): WindowState {
  const config = windowConfigs[id]
  return {
    id,
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    isFocused: false,
    position: config?.initialPosition ?? { x: 100, y: 80 },
    size: config?.initialSize ?? { width: 400, height: 300 },
    zIndex: INITIAL_Z_INDEX,
  }
}

export const useWindowStore = create<WindowStore>()(
  immer((set) => ({
    windows: {},
    topZ: INITIAL_Z_INDEX,

    openWindow: (id: string) =>
      set((state) => {
        if (!state.windows[id]) {
          state.windows[id] = createInitialWindowState(id)
        }
        const win = state.windows[id]
        if (win) {
          win.isOpen = true
          win.isMinimized = false
          win.isFocused = true
          state.topZ++
          win.zIndex = state.topZ
        }
        // Desfoca as outras janelas
        for (const key of Object.keys(state.windows)) {
          if (key !== id && state.windows[key]) {
            state.windows[key]!.isFocused = false
          }
        }
      }),

    closeWindow: (id: string) =>
      set((state) => {
        const win = state.windows[id]
        if (!win) return
        win.isOpen = false
        win.isFocused = false
      }),

    minimizeWindow: (id: string) =>
      set((state) => {
        const win = state.windows[id]
        if (!win) return
        win.isMinimized = true
        win.isFocused = false
      }),

    maximizeWindow: (id: string) =>
      set((state) => {
        const win = state.windows[id]
        if (!win) return
        win.isMaximized = !win.isMaximized
      }),

    focusWindow: (id: string) =>
      set((state) => {
        const win = state.windows[id]
        if (!win) return
        win.isFocused = true
        win.isMinimized = false
        state.topZ++
        win.zIndex = state.topZ
        // Desfoca as outras
        for (const key of Object.keys(state.windows)) {
          if (key !== id && state.windows[key]) {
            state.windows[key]!.isFocused = false
          }
        }
      }),

    updatePosition: (id: string, pos: Position) =>
      set((state) => {
        const win = state.windows[id]
        if (!win) return
        win.position = pos
      }),

    updateSize: (id: string, size: Size) =>
      set((state) => {
        const win = state.windows[id]
        if (!win) return
        win.size = size
      }),
  }))
)
