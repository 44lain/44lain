interface WindowBodyProps {
  readonly children: React.ReactNode
}

/**
 * Corpo scrollável de uma janela.
 */
export default function WindowBody({ children }: WindowBodyProps) {
  return (
    <div className="flex-1 overflow-auto bg-wired-surface p-3">
      {children}
    </div>
  )
}
