/** Temas disponíveis no sistema */
export type Theme = 'dev' | 'music'

/** Tokens visuais resolvidos por tema */
export interface ThemeTokens {
  readonly theme: Theme
  readonly titlebarGradient: string
  readonly taskbarGradient: string
  readonly startButtonGradient: string
  readonly accentColor: string
  readonly accentDimColor: string
  readonly secondaryColor: string
  readonly taskbarColor: string
  readonly titleDarkColor: string
  readonly titleLightColor: string
  readonly displayFont: string
  readonly startLabel: string
}
