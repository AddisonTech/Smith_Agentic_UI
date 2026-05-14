import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Play, Trash2, Activity, CheckCircle2, AlertCircle, Clock } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { RunCard } from '../components/RunCard'
import { useStore } from '../store'

export function Dashboard() {
  const navigate  = useNavigate()
  const runs      = useStore((s) => s.runs)
  const clearRuns = useStore((s) => s.clearRuns)

  const runList = Object.values(runs).sort((a, b) => b.startedAt - a.startedAt)
  const active    = runList.filter((r) => r.status === 'running' || r.status === 'starting')
  const completed = runList.filter((r) => r.status === 'completed')
  const errored   = runList.filter((r) => r.status === 'error')

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Dashboard</h1>
          <p className="text-sm text-text-muted mt-0.5">
            {runList.length === 0 ? 'No runs yet' : `${runList.length} total run${runList.length !== 1 ? 's' : ''}`}
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
              <p className="text-xl font-bold text-text-primary">{active.length}</p>
              <p className="text-xs text-text-muted">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/10 border border-success/20">
              <CheckCircle2 className="h-4 w-4 text-success" />
            </div>
            <div>
              <p className="text-xl font-bold text-text-primary">{completed.length}</p>
              <p className="text-xs text-text-muted">Completed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-error/10 border border-error/20">
              <AlertCircle className="h-4 w-4 text-error" />
            </div>
            <div>
              <p className="text-xl font-bold text-text-primary">{errored.length}</p>
              <p className="text-xs text-text-muted">Failed</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {active.length > 0 && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.1 }}
        >
          <h2 className="text-xs font-semibold text-accent uppercase tracking-widest mb-3 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-slow" />
            Active
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
            <h2 className="text-xs font-semibold text-text-muted uppercase tracking-widest flex items-center gap-2">
              <Clock className="h-3 w-3" />
              History
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
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 border border-accent/20 mb-4">
            <Play className="h-6 w-6 text-accent" />
          </div>
          <h3 className="text-base font-semibold text-text-primary mb-1">No runs yet</h3>
          <p className="text-sm text-text-muted mb-5 max-w-xs">
            Launch your first crew run to get started.
          </p>
          <Button onClick={() => navigate('/run/new')}>
            <Play className="h-4 w-4" />
            Start a run
          </Button>
        </motion.div>
      )}
    </div>
  )
}
