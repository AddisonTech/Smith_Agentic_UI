import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Play, Trash2, Activity, CheckCircle2, AlertCircle, Clock, Search, X } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent } from '../components/ui/card'
import { RunCard } from '../components/RunCard'
import { useStore } from '../store'
import { cn } from '../lib/utils'
import type { Run } from '../store'

const STATUS_FILTERS = [
  { key: 'all',       label: 'All'       },
  { key: 'running',   label: 'Running'   },
  { key: 'completed', label: 'Completed' },
  { key: 'error',     label: 'Error'     },
  { key: 'cancelled', label: 'Cancelled' },
] as const

type StatusFilter = typeof STATUS_FILTERS[number]['key']

function matchesStatus(run: Run, filter: StatusFilter): boolean {
  if (filter === 'all') return true
  if (filter === 'running') return run.status === 'running' || run.status === 'starting'
  return run.status === filter
}

export function Dashboard() {
  const navigate  = useNavigate()
  const runs      = useStore((s) => s.runs)
  const clearRuns = useStore((s) => s.clearRuns)

  const [query,        setQuery]        = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  const runList   = Object.values(runs).sort((a, b) => b.startedAt - a.startedAt)
  const active    = runList.filter((r) => r.status === 'running' || r.status === 'starting')
  const completed = runList.filter((r) => r.status === 'completed')
  const errored   = runList.filter((r) => r.status === 'error')

  const isFiltering = query.trim() !== '' || statusFilter !== 'all'

  const filteredRuns = runList.filter((r) => {
    const matchesQuery = !query.trim() || r.goal.toLowerCase().includes(query.toLowerCase())
    return matchesQuery && matchesStatus(r, statusFilter)
  })

  const clearFilters = () => { setQuery(''); setStatusFilter('all') }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="font-display text-xl font-semibold text-text-primary">Dashboard</h1>
          <p className="eyebrow mt-1 opacity-50">
            {runList.length === 0 ? 'no runs yet' : `${runList.length} total run${runList.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <Button onClick={() => navigate('/run/new')} size="md">
          <Play className="h-4 w-4" />
          New Run
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.05 }}
        className="grid grid-cols-3 gap-3"
      >
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 border border-accent/20">
              <Activity className="h-4 w-4 text-accent" />
            </div>
            <div>
              <p className="text-xl font-bold font-display text-text-primary">{active.length}</p>
              <p className="eyebrow opacity-50">active</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/10 border border-success/20">
              <CheckCircle2 className="h-4 w-4 text-success" />
            </div>
            <div>
              <p className="text-xl font-bold font-display text-text-primary">{completed.length}</p>
              <p className="eyebrow opacity-50">completed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-error/10 border border-error/20">
              <AlertCircle className="h-4 w-4 text-error" />
            </div>
            <div>
              <p className="text-xl font-bold font-display text-text-primary">{errored.length}</p>
              <p className="eyebrow opacity-50">failed</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {runList.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.08 }}
          className="flex gap-2 items-center"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-dim pointer-events-none" />
            <Input
              placeholder="Search by goal..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-8 pr-8"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-dim hover:text-text-muted transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <div className="flex gap-1 shrink-0">
            {STATUS_FILTERS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setStatusFilter(key)}
                className={cn(
                  'px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium border transition-all duration-150',
                  statusFilter === key
                    ? 'bg-accent/10 border-accent/20 text-accent'
                    : 'border-border text-text-dim hover:border-border-bright hover:text-text-muted bg-elevated'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {isFiltering ? (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
        >
          {filteredRuns.length > 0 ? (
            <div className="space-y-2">
              {filteredRuns.map((run, i) => (
                <RunCard key={run.run_id} run={run} index={i} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Search className="h-10 w-10 text-text-dim mb-3 opacity-40" />
              <p className="text-sm text-text-muted mb-2">No runs match your filter.</p>
              <button
                onClick={clearFilters}
                className="text-xs font-mono text-accent hover:text-accent-hover transition-colors"
              >
                Clear filters
              </button>
            </div>
          )}
        </motion.section>
      ) : (
        <>
          {active.length > 0 && (
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.1 }}
            >
              <h2 className="eyebrow mb-3 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-slow" />
                // active
              </h2>
              <div className="space-y-2">
                {active.map((run, i) => <RunCard key={run.run_id} run={run} index={i} />)}
              </div>
            </motion.section>
          )}

          {runList.length > 0 && (
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.15 }}
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="eyebrow flex items-center gap-2 opacity-50">
                  <Clock className="h-3 w-3" />
                  // history
                </h2>
                <Button variant="ghost" size="sm" onClick={clearRuns} className="text-text-dim hover:text-error">
                  <Trash2 className="h-3 w-3" />
                  Clear
                </Button>
              </div>
              <div className="space-y-2">
                {runList
                  .filter((r) => r.status !== 'running' && r.status !== 'starting')
                  .map((run, i) => <RunCard key={run.run_id} run={run} index={i} />)}
              </div>
            </motion.section>
          )}

          {runList.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25, delay: 0.1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent/10 to-violet/10 border border-accent/20 mb-4">
                <Play className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-display text-base font-semibold text-text-primary mb-1">No runs yet</h3>
              <p className="text-sm text-text-muted mb-5 max-w-xs">
                Launch your first crew run to get started.
              </p>
              <Button onClick={() => navigate('/run/new')}>
                <Play className="h-4 w-4" />
                Start a run
              </Button>
            </motion.div>
          )}
        </>
      )}
    </div>
  )
}
