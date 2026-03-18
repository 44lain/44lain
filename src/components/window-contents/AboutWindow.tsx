import { useTheme } from '@/hooks/useTheme'
import { Badge } from '@/components/ui/Badge'

const DEV_SKILLS = ['TypeScript', 'Next.js', 'React', 'Node.js', 'Tailwind CSS', 'PostgreSQL', 'Docker']
const MUSIC_SKILLS = ['Ableton Live', 'Synthesis', 'Sound Design', 'Mixing', 'Mastering', 'Composition']

export default function AboutWindow() {
  const { theme, tokens } = useTheme()

  const skills = theme === 'dev' ? DEV_SKILLS : MUSIC_SKILLS

  return (
    <div className="flex flex-col gap-4 text-[11px]" style={{ fontFamily: tokens.displayFont }}>

      {/* whoami */}
      <section>
        <p className="mb-2 font-bold" style={{ color: tokens.accentColor }}>{'>'} whoami</p>
        <p className="pl-3 leading-relaxed text-white/60">
          {/* TODO: preencher com bio */}
          [bio goes here]
        </p>
      </section>

      {/* skills / tools */}
      <section>
        <p className="mb-2 font-bold" style={{ color: tokens.accentColor }}>
          {'>'} {theme === 'dev' ? 'skills' : 'tools'}
        </p>
        <div className="flex flex-wrap gap-1.5 pl-3">
          {skills.map((skill) => (
            <Badge key={skill} label={skill} />
          ))}
        </div>
      </section>

      {/* links */}
      <section>
        <p className="mb-2 font-bold" style={{ color: tokens.accentColor }}>{'>'} links</p>
        <div className="flex flex-col gap-1.5 pl-3">
          <a
            href="https://github.com/44lain"
            target="_blank"
            rel="noopener noreferrer"
            className="w-fit hover:underline"
            style={{ color: tokens.secondaryColor }}
          >
            github.com/44lain
          </a>
          {/* TODO: adicionar outros links (LinkedIn, Spotify, etc.) */}
        </div>
      </section>

    </div>
  )
}
