import { useTheme } from '@/hooks/useTheme'
import { Badge } from '@/components/ui/Badge'
import { projects } from '@/data/projects'
import { releases } from '@/data/releases'

export default function ProjectsWindow() {
  const { theme, tokens } = useTheme()

  if (theme === 'music') {
    return (
      <div className="flex flex-col gap-3 text-[11px]" style={{ fontFamily: tokens.displayFont }}>
        <p className="font-bold" style={{ color: tokens.accentColor }}>releases</p>
        {releases.length === 0 ? (
          <p className="text-white/30 italic">— nenhum release ainda —</p>
        ) : (
          releases.map((release) => (
            <div key={release.id} className="flex flex-col gap-1.5 border-b border-white/10 pb-3 last:border-0">
              <div className="flex items-baseline justify-between">
                <span className="font-bold text-white/90">{release.title}</span>
                <span className="text-white/40 text-[9px]">{release.year}</span>
              </div>
              <span className="capitalize text-white/50 text-[10px]">{release.type}</span>
              <div className="flex flex-wrap gap-1">
                {release.tags.map((tag) => <Badge key={tag} label={tag} />)}
              </div>
              {release.spotifyUrl !== undefined && (
                <a
                  href={release.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] hover:underline"
                  style={{ color: tokens.secondaryColor }}
                >
                  abrir no Spotify ↗
                </a>
              )}
            </div>
          ))
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 text-[11px]" style={{ fontFamily: tokens.displayFont }}>
      <p className="font-bold" style={{ color: tokens.accentColor }}>projetos</p>
      {projects.map((project) => (
        <div key={project.id} className="flex flex-col gap-1.5 border-b border-white/10 pb-3 last:border-0">
          <div className="flex items-baseline justify-between">
            <span className="font-bold text-white/90">{project.name}</span>
            <span className="text-white/40 text-[9px]">{project.year}</span>
          </div>
          <p className="leading-relaxed text-white/60">{project.description}</p>
          <div className="flex flex-wrap gap-1 mt-0.5">
            {project.tags.map((tag) => <Badge key={tag} label={tag} />)}
          </div>
          {project.url !== undefined && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] hover:underline mt-0.5"
              style={{ color: tokens.secondaryColor }}
            >
              {project.url.replace('https://', '')} ↗
            </a>
          )}
        </div>
      ))}
    </div>
  )
}
