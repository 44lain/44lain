import { useTheme } from '@/hooks/useTheme'
import { Badge } from '@/components/ui/Badge'
import { blogPosts } from '@/data/blog-posts'

export default function BlogWindow() {
  const { theme, tokens } = useTheme()

  const filtered = blogPosts.filter(
    (post) => post.theme === theme || post.theme === 'both'
  )

  return (
    <div className="flex flex-col gap-3 text-[11px]" style={{ fontFamily: tokens.displayFont }}>
      <p className="font-bold" style={{ color: tokens.accentColor }}>posts</p>

      {filtered.length === 0 ? (
        <p className="text-white/30 italic">— no posts yet —</p>
      ) : (
        filtered.map((post) => (
          <div key={post.id} className="flex flex-col gap-1.5 border-b border-white/10 pb-3 last:border-0">
            <div className="flex items-baseline justify-between">
              <span className="font-bold text-white/90">{post.title}</span>
              <span className="text-white/40 text-[9px]">{post.date}</span>
            </div>
            <p className="leading-relaxed text-white/60">{post.excerpt}</p>
            <div className="flex flex-wrap gap-1 mt-0.5">
              {post.tags.map((tag) => <Badge key={tag} label={tag} />)}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
