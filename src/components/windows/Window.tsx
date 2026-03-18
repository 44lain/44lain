'use client'

import { useCallback, useRef } from 'react'
import { useWindowStore } from '@/stores/windowStore'
import { windowConfigs } from '@/data/window-configs'
import { useDraggable } from '@/hooks/useDraggable'
import { useResizable } from '@/hooks/useResizable'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { TASKBAR_HEIGHT } from '@/lib/constants'
import TitleBar from './TitleBar'
import WindowBody from './WindowBody'
import type { WindowState } from '@/types/window.types'

interface WindowProps {
  readonly windowState: WindowState
  readonly children: React.ReactNode
}

/**
 * Componente base de janela.
 * Gerencia drag, resize, focus trap e estados visuais.
 */
export default function Window({ windowState, children }: WindowProps) {
  const { id, isOpen, isMinimized, isMaximized, isFocused, position, size, zIndex } = windowState
  const config = windowConfigs[id]

  const closeWindow = useWindowStore((s) => s.closeWindow)
  const minimizeWindow = useWindowStore((s) => s.minimizeWindow)
  const maximizeWindow = useWindowStore((s) => s.maximizeWindow)
  const focusWindow = useWindowStore((s) => s.focusWindow)
  const updatePosition = useWindowStore((s) => s.updatePosition)
  const updateSize = useWindowStore((s) => s.updateSize)

  const windowRef = useRef<HTMLDivElement | null>(null)

  const { elementRef: dragRef, handleMouseDown: handleDragDown } = useDraggable({
    initialPosition: position,
    onDragEnd: useCallback((pos) => updatePosition(id, pos), [id, updatePosition]),
    enabled: !isMaximized,
  })

  const { elementRef: resizeRef, handleResizeMouseDown } = useResizable({
    initialSize: size,
    minSize: config?.minSize,
    onResizeEnd: useCallback((s) => updateSize(id, s), [id, updateSize]),
    enabled: !isMaximized,
  })

  useFocusTrap(windowRef, isFocused)

  // Callback ref que sincroniza drag, resize e focus trap para o mesmo nó DOM
  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      windowRef.current = node
      ;(dragRef as { current: HTMLDivElement | null }).current = node
      ;(resizeRef as { current: HTMLDivElement | null }).current = node
    },
    [dragRef, resizeRef]
  )

  if (!isOpen) return null

  const isHidden = isMinimized

  return (
    <div
      ref={setRefs}
      role="dialog"
      aria-labelledby={`window-title-${id}`}
      className={`absolute flex flex-col rounded-window border border-wired-border ${
        isFocused ? 'shadow-window-focus' : 'shadow-window'
      }`}
      style={
        isMaximized
          ? {
              left: 0,
              top: 0,
              width: '100%',
              height: `calc(100% - ${TASKBAR_HEIGHT}px)`,
              zIndex,
              display: isHidden ? 'none' : 'flex',
            }
          : {
              left: position.x,
              top: position.y,
              width: size.width,
              height: size.height,
              zIndex,
              display: isHidden ? 'none' : 'flex',
            }
      }
      onPointerDown={() => {
        if (!isFocused) focusWindow(id)
      }}
    >
      <TitleBar
        title={config?.title ?? id}
        icon={config?.icon ?? '📄'}
        isFocused={isFocused}
        onClose={() => closeWindow(id)}
        onMinimize={() => minimizeWindow(id)}
        onMaximize={() => maximizeWindow(id)}
        onPointerDown={handleDragDown}
      />

      <WindowBody>{children}</WindowBody>

      {/* Resize handle */}
      {!isMaximized && (
        <div
          className="absolute bottom-0 right-0 h-3 w-3 cursor-se-resize"
          onMouseDown={handleResizeMouseDown}
        />
      )}
    </div>
  )
}
