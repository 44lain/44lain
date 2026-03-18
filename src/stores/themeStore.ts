import { create } from 'zustand'
import type { Theme } from '@/types/theme.types'

interface ThemeStore {
  theme: Theme
  setTheme: (theme: Theme) => void
}

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: 'dev',
  setTheme: (theme) => set({ theme }),
}))
