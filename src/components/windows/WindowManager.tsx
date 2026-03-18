'use client'

import dynamic from 'next/dynamic'
import { useWindowStore } from '@/stores/windowStore'
import Window from './Window'

/** Lazy-loaded window contents — só carrega quando a janela é aberta */
const windowContents: Record<string, React.ComponentType> = {
  about: dynamic(() => import('@/components/window-contents/AboutWindow')),
  projects: dynamic(() => import('@/components/window-contents/ProjectsWindow')),
  player: dynamic(() => import('@/components/window-contents/PlayerWindow')),
  blog: dynamic(() => import('@/components/window-contents/BlogWindow')),
  contact: dynamic(() => import('@/components/window-contents/ContactWindow')),
}

/**
 * Renderiza todas as janelas abertas.
 * Busca o conteúdo lazy-loaded correspondente a cada janela.
 */
export default function WindowManager() {
  const windows = useWindowStore((s) => s.windows)
  const openWindows = Object.values(windows).filter((w) => w.isOpen)

  return (
    <>
      {openWindows.map((win) => {
        const Content = windowContents[win.id]
        return (
          <Window key={win.id} windowState={win}>
            {Content ? <Content /> : null}
          </Window>
        )
      })}
    </>
  )
}
