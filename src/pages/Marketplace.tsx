import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, Sparkles } from 'lucide-react'
import { TEMPLATES, CATEGORY_LABELS, CATEGORY_COLORS, type TemplateCategory } from '../data/templates'
import { TemplateCard } from '../components/TemplateCard'
import { cn } from '../lib/utils'

const ALL_CATEGORIES = Object.keys(CATEGORY_LABELS) as TemplateCategory[]

export function Marketplace() {
  const [search, setSearch]     = useState('')
  const [active, setActive]     = useState<TemplateCategory | 'all'>('all')

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return TEMPLATES.filter((t) => {
      const matchCat  = active === 'all' || t.category === active
      const matchText = !q || t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.tags.some((tag) => tag.toLowerCase().includes(q))
      return matchCat && matchText
    })
  }, [search, active])

  return (
    <div className="space-y-6">
      {/* header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex flex-col gap-1"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-accent" />
          <h1 className="font-display text-xl font-semibold text-text-primary">Template Library</h1>
        </div>
        <p className="eyebrow opacity-50 ml-6">ready-to-launch crew task templates</p>
      </motion.div>

      {/* search + filter bar */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.05 }}
        className="flex flex-col gap-3 sm:flex-row sm:items-center"
      >
        {/* search */}
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-dim pointer-events-none" />
          <input
            type="text"
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-elevated text-sm text-text-primary placeholder:text-text-dim focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/20 transition-colors duration-150"
          />
        </div>

        {/* category pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setActive('all')}
            className={cn(
              'px-3 py-1 rounded-full border text-xs font-mono font-semibold transition-all duration-150',
              active === 'all'
                ? 'border-accent/40 bg-accent/10 text-accent'
                : 'border-border bg-surface text-text-muted hover:border-border-bright hover:text-text-primary'
            )}
          >
            All
          </button>
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActive(cat)}
              className={cn(
                'px-3 py-1 rounded-full border text-xs font-mono font-semibold transition-all duration-150',
                active === cat
                  ? CATEGORY_COLORS[cat]
                  : 'border-border bg-surface text-text-muted hover:border-border-bright hover:text-text-primary'
              )}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      </motion.div>

      {/* results count */}
      <motion.p
        key={filtered.length}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
        className="eyebrow opacity-30 -mt-2"
      >
        {filtered.length} template{filtered.length !== 1 ? 's' : ''}
      </motion.p>

      {/* grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((t, i) => (
            <TemplateCard key={t.id} template={t} index={i} />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <p className="font-mono text-sm text-text-dim">no templates match your search</p>
          <button
            type="button"
            onClick={() => { setSearch(''); setActive('all') }}
            className="mt-3 text-xs text-accent font-mono hover:underline"
          >
            clear filters
          </button>
        </motion.div>
      )}
    </div>
  )
}
