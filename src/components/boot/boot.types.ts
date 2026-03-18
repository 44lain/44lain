import type { Theme } from '@/types/theme.types'

/** Linha de texto do BIOS POST */
export interface BiosLine {
  readonly text: string
  readonly delay: number
  readonly type: 'info' | 'ok' | 'header' | 'blank'
}

/** Props do componente BiosPost */
export interface BiosPostProps {
  readonly onComplete: () => void
}

/** Props do componente BootMenu */
export interface BootMenuProps {
  readonly onSelect: (theme: Theme) => void
}

/** Props do componente BootScreen */
export interface BootScreenProps {
  readonly onBootComplete: (theme: Theme) => void
}
