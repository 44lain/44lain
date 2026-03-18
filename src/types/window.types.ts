/** Posição de um elemento no desktop */
export interface Position {
  readonly x: number
  readonly y: number
}

/** Dimensão de um elemento */
export interface Size {
  readonly width: number
  readonly height: number
}

/** Limites do desktop para clamping */
export interface Bounds {
  readonly minX: number
  readonly minY: number
  readonly maxX: number
  readonly maxY: number
}

/** Estado individual de uma janela */
export interface WindowState {
  readonly id: string
  readonly isOpen: boolean
  readonly isMinimized: boolean
  readonly isMaximized: boolean
  readonly isFocused: boolean
  readonly position: Position
  readonly size: Size
  readonly zIndex: number
}

/** Configuração estática de uma janela (dados em data/window-configs.ts) */
export interface WindowConfig {
  readonly id: string
  readonly title: string
  readonly icon: string
  readonly initialPosition: Position
  readonly initialSize: Size
  readonly minSize: Size
  readonly menuItems?: readonly string[]
}

/** Interface do store de janelas */
export interface WindowStore {
  windows: Record<string, WindowState>
  topZ: number
  openWindow: (id: string) => void
  closeWindow: (id: string) => void
  minimizeWindow: (id: string) => void
  maximizeWindow: (id: string) => void
  focusWindow: (id: string) => void
  updatePosition: (id: string, pos: Position) => void
  updateSize: (id: string, size: Size) => void
}
