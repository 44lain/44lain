import { useTheme } from '@/hooks/useTheme'

export default function AboutWindow() {
  const { theme } = useTheme()

  return (
    <div className="font-tahoma text-[11px] text-white/90" style={{ fontFamily: theme === 'music' ? 'Electrolize, monospace' : undefined }}>
      <h2 className="mb-2 text-sm font-bold">whoami</h2>
      <p className="text-white/60">About content coming soon...</p>
    </div>
  )
}
