/** Configuração de ícone no desktop */
export interface DesktopIconConfig {
  readonly id: string
  readonly label: string
  readonly emoji: string
  readonly windowId: string
}

/** Props do componente DesktopIcon */
export interface DesktopIconProps {
  readonly emoji: string
  readonly label: string
  readonly onDoubleClick: () => void
}

/** Props do componente DesktopIconGrid */
export interface DesktopIconGridProps {
  readonly icons: readonly DesktopIconConfig[]
  readonly onIconOpen: (windowId: string) => void
}

/** Props do componente TaskbarItem */
export interface TaskbarItemProps {
  readonly id: string
  readonly title: string
  readonly icon: string
  readonly isFocused: boolean
  readonly isMinimized: boolean
  readonly onClick: () => void
}
