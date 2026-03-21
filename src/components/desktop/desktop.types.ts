/** Configuração de ícone no desktop */
export interface DesktopIconConfig {
  readonly id: string
  readonly label: string
  readonly emoji: string
  /** Caminho de imagem PNG (sobrepõe emoji quando presente) */
  readonly iconSrc?: string
  readonly windowId: string
}

/** Props do componente DesktopIcon */
export interface DesktopIconProps {
  readonly emoji: string
  readonly iconSrc?: string
  readonly label: string
  readonly selected: boolean
  readonly onClick: (e: React.MouseEvent) => void
  readonly onPointerDown?: (e: React.PointerEvent) => void
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
