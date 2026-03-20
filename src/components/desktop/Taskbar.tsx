'use client'

import { useTheme } from '@/hooks/useTheme'
import { useWindowStore } from '@/stores/windowStore'
import { windowConfigs } from '@/data/window-configs'
import { TASKBAR_HEIGHT } from '@/lib/constants'
import StartButton from './StartButton'
import TaskbarClock from './TaskbarClock'
import TaskbarItem from './TaskbarItem'

/**
 * Barra de tarefas fixa no rodapé.
 * Contém: StartButton, itens de janelas abertas, relógio.
 */
export default function Taskbar() {
  const { tokens } = useTheme()
  const windows = useWindowStore((s) => s.windows)
  const focusWindow = useWindowStore((s) => s.focusWindow)

  const openWindows = Object.values(windows).filter((w) => w.isOpen)

  return (
    <div
      className="absolute inset-x-0 bottom-0 z-40 flex items-center gap-1 px-1"
      style={{
        height: TASKBAR_HEIGHT,
        background: tokens.taskbarGradient,
      }}
      role="toolbar"
      aria-label="Barra de tarefas"
    >
      <StartButton />

      {/* Separador */}
      <div className="mx-1 h-4/5 w-px bg-white/15" />

      {/* Janelas abertas */}
      <div className="flex flex-1 items-center gap-1 overflow-hidden">
        {openWindows.map((win) => {
          const config = windowConfigs[win.id]
          return (
            <TaskbarItem
              key={win.id}
              id={win.id}
              title={config?.title ?? win.id}
              icon={config?.icon ?? '📄'}
              isFocused={win.isFocused}
              isMinimized={win.isMinimized}
              onClick={() => focusWindow(win.id)}
            />
          )
        })}
      </div>

      {/* Relógio */}
      <TaskbarClock />
    </div>
  )
}
