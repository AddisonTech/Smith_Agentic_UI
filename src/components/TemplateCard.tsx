import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Play, Tag } from 'lucide-react'
import { type Template, CATEGORY_LABELS, CATEGORY_COLORS } from '../data/templates'
import { cn } from '../lib/utils'

interface Props {
  template: Template
  index: number
}

export function TemplateCard({ template, index }: Props) {
  const navigate = useNavigate()

  const launch = () => {
    navigate('/run/new', {
      state: { goal: template.prompt, crew: template.crew },
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      className="group relative flex flex-col bg-surface/80 backdrop-blur-sm border border-border rounded-xl overflow-hidden hover:border-accent/25 transition-all duration-200 hover:shadow-[0_0_20px_rgba(34,211,238,0.07)]"
    >
      {/* gradient top line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-accent/30 via-violet/20 to-transparent" />

      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* category badge */}
        <div className="flex items-center justify-between gap-2">
          <span className={cn(
            'inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-mono font-semibold uppercase tracking-wider',
            CATEGORY_COLORS[template.category]
          )}>
            {CATEGORY_LABELS[template.category]}
          </span>
          <span className="eyebrow opacity-30 text-[10px]">{template.crew}</span>
        </div>

        {/* title + description */}
        <div className="flex-1">
          <h3 className="font-display text-sm font-semibold text-text-primary leading-snug mb-1.5">
            {template.title}
          </h3>
          <p className="text-xs text-text-muted leading-relaxed line-clamp-2">
            {template.description}
          </p>
        </div>

        {/* tags */}
        {template.tags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <Tag className="h-2.5 w-2.5 text-text-dim shrink-0" />
            {template.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-[10px] font-mono text-text-dim">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* launch button */}
      <div className="px-4 pb-4">
        <button
          type="button"
          onClick={launch}
          className="w-full flex items-center justify-center gap-2 h-8 rounded-lg bg-accent/10 border border-accent/20 text-accent text-xs font-semibold font-mono transition-all duration-150 hover:bg-accent/18 hover:border-accent/40 hover:shadow-[0_0_12px_rgba(34,211,238,0.15)] active:scale-[0.98]"
        >
          <Play className="h-3 w-3" />
          Use Template
        </button>
      </div>
    </motion.div>
  )
}
