import type { Theme } from './theme.types'

/** Projeto de desenvolvimento */
export interface Project {
  readonly id: string
  readonly name: string
  readonly description: string
  readonly tags: readonly string[]
  readonly url?: string
  readonly year: number
  readonly theme: Theme | 'both'
}

/** Release musical */
export interface Release {
  readonly id: string
  readonly title: string
  readonly type: 'single' | 'ep' | 'album'
  readonly year: number
  readonly spotifyUrl?: string
  readonly coverUrl?: string
  readonly tags: readonly string[]
}

/** Post do blog */
export interface BlogPost {
  readonly id: string
  readonly title: string
  readonly excerpt: string
  readonly date: string
  readonly tags: readonly string[]
  readonly theme: Theme | 'both'
}
