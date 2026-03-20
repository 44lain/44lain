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

  const { elementRef: dragRef, handlePointerDown: handleDragPointerDown } = useDraggable({
    initialPosition: position,
    onDragEnd: useCallback((pos) => updatePosition(id, pos), [id, updatePosition]),
    enabled: !isMaximized,
  })

  const { elementRef: resizeRef, getResizeHandler } = useResizable({
    initialSize: size,
    initialPosition: position,
    minSize: config?.minSize,
    onResizeEnd: useCallback(
      (s, p) => {
        updateSize(id, s)
        updatePosition(id, p)
      },
      [id, updateSize, updatePosition],
    ),
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
        onPointerDown={handleDragPointerDown}
        onDoubleClick={() => maximizeWindow(id)}
      />

      <WindowBody>{children}</WindowBody>

      {/* Resize handles — 4 edges + 4 corners */}
      {!isMaximized && (
        <>
          {/* Edges */}
          <div className="absolute top-0 left-3 right-3 h-1 cursor-n-resize" onMouseDown={getResizeHandler('n')} />
          <div className="absolute bottom-0 left-3 right-3 h-1 cursor-s-resize" onMouseDown={getResizeHandler('s')} />
          <div className="absolute left-0 top-3 bottom-3 w-1 cursor-w-resize" onMouseDown={getResizeHandler('w')} />
          <div className="absolute right-0 top-3 bottom-3 w-1 cursor-e-resize" onMouseDown={getResizeHandler('e')} />
          {/* Corners */}
          <div className="absolute top-0 left-0 h-3 w-3 cursor-nw-resize" onMouseDown={getResizeHandler('nw')} />
          <div className="absolute top-0 right-0 h-3 w-3 cursor-ne-resize" onMouseDown={getResizeHandler('ne')} />
          <div className="absolute bottom-0 left-0 h-3 w-3 cursor-sw-resize" onMouseDown={getResizeHandler('sw')} />
          <div className="absolute bottom-0 right-0 h-3 w-3 cursor-se-resize" onMouseDown={getResizeHandler('se')} />
        </>
      )}
    </div>
  )
}
