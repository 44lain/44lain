'use client'

import { useCallback } from 'react'
import { useTheme } from '@/hooks/useTheme'
import { useWindowStore } from '@/stores/windowStore'
import { useNotificationStore } from '@/stores/notificationStore'
import { windowConfigs } from '@/data/window-configs'
import { TASKBAR_HEIGHT } from '@/lib/constants'
import StartButton from './StartButton'
import TaskbarClock from './TaskbarClock'
import TaskbarItem from './TaskbarItem'

/**
 * Barra de tarefas fixa no rodapé.
 * Contém: StartButton, itens de janelas abertas, relógio, notificações.
 */
export default function Taskbar() {
  const { tokens } = useTheme()
  const windows = useWindowStore((s) => s.windows)
  const focusWindow = useWindowStore((s) => s.focusWindow)
  const hasMsnNotification = useNotificationStore((s) => s.hasMsnNotification)
  const setHasMsnNotification = useNotificationStore((s) => s.setHasMsnNotification)

  const openWindows = Object.values(windows).filter((w) => w.isOpen)

  const handleNotificationClick = useCallback(() => {
    setHasMsnNotification(false)
    // Dispara re-exibição do popup via evento custom (lido em page.tsx)
    window.dispatchEvent(new CustomEvent('msn:reopen'))
  }, [setHasMsnNotification])

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

      {/* System tray */}
      <div className="flex items-center gap-1 pr-1">
        {hasMsnNotification && (
          <button
            onClick={handleNotificationClick}
            className="flex h-[22px] w-[22px] items-center justify-center rounded text-[14px] transition-opacity hover:opacity-80 active:opacity-60"
            style={{
              background: `${tokens.accentDimColor}55`,
              border: `1px solid ${tokens.accentColor}50`,
            }}
            title="Nova mensagem MSN"
            aria-label="Nova mensagem MSN — clique para ver"
          >
            💬
          </button>
        )}
        <TaskbarClock />
      </div>
    </div>
  )
}
