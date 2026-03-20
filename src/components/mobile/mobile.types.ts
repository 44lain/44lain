/** App disponível no launcher mobile */
export interface MobileAppConfig {
  readonly id: string
  readonly title: string
  readonly icon: string
}

export interface MobileAppIconProps {
  readonly app: MobileAppConfig
  readonly onOpen: (id: string) => void
}

export interface MobileAppGridProps {
  readonly apps: readonly MobileAppConfig[]
  readonly onAppOpen: (id: string) => void
  readonly dimmed: boolean
}

export interface MobileStatusBarProps {
  readonly appTitle: string | null
}

export interface MobileBottomBarProps {
  readonly canGoBack: boolean
  readonly onHome: () => void
  readonly onBack: () => void
}

export interface MobileAppSheetProps {
  readonly title: string
  readonly icon: string
  readonly isVisible: boolean
  readonly onClose: () => void
  readonly children?: React.ReactNode
}

export interface MobileAppSheetManagerProps {
  readonly currentAppId: string | null
  readonly onClose: () => void
}
