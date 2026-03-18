import { useTheme } from '@/hooks/useTheme'

interface BadgeProps {
  readonly label: string
}

/** Tag estilizada com cor do tema ativo. Usada em projetos, releases e posts. */
export function Badge({ label }: BadgeProps) {
  const { tokens } = useTheme()

  return (
    <span
      className="inline-block rounded-badge px-2 py-0.5 text-[9px] font-tahoma leading-none whitespace-nowrap"
      style={{
        border: `1px solid ${tokens.accentColor}55`,
        color: tokens.accentColor,
        background: `${tokens.accentColor}18`,
      }}
    >
      {label}
    </span>
  )
}
