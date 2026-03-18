import { useTheme } from '@/hooks/useTheme'

/** Barras do equalizador animadas via CSS puro */
function EqualizerBars() {
  const { tokens } = useTheme()
  const bars = [
    { delay: '0ms',   duration: '520ms' },
    { delay: '80ms',  duration: '680ms' },
    { delay: '160ms', duration: '440ms' },
    { delay: '40ms',  duration: '600ms' },
    { delay: '120ms', duration: '500ms' },
    { delay: '200ms', duration: '720ms' },
    { delay: '60ms',  duration: '460ms' },
  ]

  return (
    <div className="flex items-end gap-px h-4" aria-hidden="true">
      {bars.map((bar, i) => (
        <div
          key={i}
          className="bar w-[3px] rounded-t-sm opacity-90"
          style={{
            background: tokens.accentColor,
            animationDelay: bar.delay,
            '--duration': bar.duration,
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}

export default function PlayerWindow() {
  const { theme, tokens } = useTheme()

  // TODO: substituir pela URL de embed real do Spotify (playlist ou artista)
  const spotifyEmbedUrl = theme === 'music'
    ? 'https://open.spotify.com/embed/artist/44lain?utm_source=generator&theme=0'
    : 'https://open.spotify.com/embed/artist/44lain?utm_source=generator&theme=0'

  return (
    <div className="flex flex-col gap-3 h-full text-[11px]" style={{ fontFamily: tokens.displayFont }}>

      {/* Cabeçalho com equalizador */}
      <div className="flex items-center justify-between">
        <span className="font-bold" style={{ color: tokens.accentColor }}>now playing</span>
        <EqualizerBars />
      </div>

      {/* Spotify Embed */}
      <div className="flex-1 overflow-hidden rounded-sm" style={{ minHeight: 280 }}>
        <iframe
          src={spotifyEmbedUrl}
          width="100%"
          height="100%"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          title="Spotify Player"
          style={{ border: 'none', display: 'block', minHeight: 280 }}
        />
      </div>

    </div>
  )
}
