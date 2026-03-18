'use client'

import { useThemeStore } from '@/stores/themeStore'
import { getThemeTokens } from '@/lib/theme-tokens'
import type { ThemeTokens, Theme } from '@/types/theme.types'

interface UseThemeReturn {
  readonly theme: Theme
  readonly tokens: ThemeTokens
  readonly setTheme: (theme: Theme) => void
}

/** Hook central para acessar tema e tokens — nunca use prop drilling */
export function useTheme(): UseThemeReturn {
  const theme = useThemeStore((state) => state.theme)
  const setTheme = useThemeStore((state) => state.setTheme)
  const tokens = getThemeTokens(theme)

  return { theme, tokens, setTheme }
}
