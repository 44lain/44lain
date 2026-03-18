import { create } from 'zustand'

/** Fases do boot — discriminated union para estado claro */
type BootPhase =
  | { phase: 'bios'; progress: number }
  | { phase: 'menu'; selected: 'dev' | 'music' }
  | { phase: 'loading'; theme: 'dev' | 'music' }
  | { phase: 'done' }

interface BootStore {
  boot: BootPhase
  setBiosProgress: (progress: number) => void
  goToMenu: () => void
  selectTheme: (theme: 'dev' | 'music') => void
  startLoading: (theme: 'dev' | 'music') => void
  finishBoot: () => void
}

export const useBootStore = create<BootStore>((set) => ({
  boot: { phase: 'bios', progress: 0 },

  setBiosProgress: (progress) =>
    set({ boot: { phase: 'bios', progress } }),

  goToMenu: () =>
    set({ boot: { phase: 'menu', selected: 'dev' } }),

  selectTheme: (theme) =>
    set({ boot: { phase: 'menu', selected: theme } }),

  startLoading: (theme) =>
    set({ boot: { phase: 'loading', theme } }),

  finishBoot: () =>
    set({ boot: { phase: 'done' } }),
}))
