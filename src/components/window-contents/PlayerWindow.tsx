'use client'

import { useState } from 'react'
import { useTheme } from '@/hooks/useTheme'

interface Track {
  readonly id: string
  readonly title: string
  readonly role: string
  readonly feat: string
  readonly embedSrc: string
}

const TRACKS: readonly Track[] = [
  {
    id: 'na-noite',
    title: 'Virgulas - Na Noite',
    role: 'prod. 44lain',
    feat: '',
    embedSrc: 'https://open.spotify.com/embed/track/4Jd0hXovtgdpWtBrboRxUJ?utm_source=generator',
  },
  {
    id: 'questoes',
    title: '44lain - questões',
    role: 'feat.',
    feat: 'lavd667',
    embedSrc: 'https://open.spotify.com/embed/album/0vKjaUpvskNJVnl2v5iiEQ?utm_source=generator',
  },
  {
    id: 'suite-44',
    title: '44lain - suite 44',
    role: 'feat.',
    feat: 'TWELVE',
    embedSrc: 'https://open.spotify.com/embed/track/4ZB8SqjqNXHI5hwQ9h9KcV?utm_source=generator',
  },
]

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
  const { tokens } = useTheme()
  const [activeId, setActiveId] = useState<string>(TRACKS[0]!.id)

  const activeTrack = TRACKS.find((t) => t.id === activeId) ?? TRACKS[0]!

  return (
    <div className="flex flex-col gap-2 h-full text-[11px]" style={{ fontFamily: tokens.displayFont }}>

      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <span className="font-bold" style={{ color: tokens.accentColor }}>now playing</span>
        <EqualizerBars />
      </div>

      {/* Tracklist */}
      <div className="flex flex-col gap-px">
        {TRACKS.map((track) => {
          const isActive = track.id === activeId
          return (
            <button
              key={track.id}
              onClick={() => setActiveId(track.id)}
              className="flex items-baseline gap-2 px-2 py-1.5 rounded-sm text-left transition-colors"
              style={isActive ? {
                background: `${tokens.accentColor}25`,
                borderLeft: `2px solid ${tokens.accentColor}`,
              } : {
                borderLeft: '2px solid transparent',
              }}
            >
              <span className={isActive ? 'font-bold text-white/90' : 'text-white/50'}>
                {track.title}
              </span>
              <span className="text-[9px] text-white/30">
                {track.role} {track.feat}
              </span>
            </button>
          )
        })}
      </div>

      {/* Spotify Embed */}
      <div className="flex-1 overflow-hidden rounded-sm" style={{ minHeight: 232 }}>
        <iframe
          key={activeTrack.embedSrc}
          src={activeTrack.embedSrc}
          width="100%"
          height="100%"
          allowFullScreen
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          title={activeTrack.title}
          style={{ border: 'none', display: 'block', minHeight: 232 }}
        />
      </div>

    </div>
  )
}
