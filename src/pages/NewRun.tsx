import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Play, ChevronRight, Cpu } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { Select } from '../components/ui/select'
import { Card, CardContent } from '../components/ui/card'
import { cn } from '../lib/utils'
import { api, CREWS, CREW_DESCRIPTIONS, type CrewName } from '../lib/api'
import { useStore } from '../store'

const CREW_ICONS: Record<CrewName, string> = {
  default: '⚙',
  plc:     '🔌',
  react:   '⚛',
  vision:  '👁',
  safety:  '🛡',
  ops:     '📊',
}

export function NewRun() {
  const navigate    = useNavigate()
  const { system, setSystem, upsertRun } = useStore()

  const [goal,     setGoal]     = useState('')
  const [crew,     setCrew]     = useState<CrewName>('default')
  const [model,    setModel]    = useState('')
  const [chain,    setChain]    = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const [models, defaults] = await Promise.all([api.models(), api.crewDefaults()])
        setSystem({ models: models.models, crewDefaults: defaults })
      } catch {}
    }
    load()
  }, [setSystem])

  const submit = async () => {
    if (!goal.trim()) { setError('Goal is required.'); return }
    setError('')
    setLoading(true)
    try {
      const { run_id } = await api.startRun({
        goal: goal.trim(),
        crew,
        model: model || undefined,
        chain,
        hitl:  false,
      })
      upsertRun({ run_id, crew, goal: goal.trim(), status: 'starting', output: [], files: [], startedAt: Date.now() })
      navigate(`/run/${run_id}`)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to start run.')
    } finally {
      setLoading(false)
    }
  }

  const defaultModel = system.crewDefaults[crew] ?? ''

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <h1 className="font-display text-xl font-semibold text-text-primary">New Run</h1>
        <p className="eyebrow mt-1 opacity-50">configure and launch a crew run</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.05 }}
        className="space-y-5"
      >
        <div className="space-y-2">
          <Label htmlFor="goal">Goal</Label>
          <Textarea
            id="goal"
            rows={4}
            placeholder="Describe what you want the crew to accomplish..."
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="resize-y min-h-[100px]"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) submit()
            }}
          />
          <p className="eyebrow opacity-40">ctrl+enter to launch</p>
        </div>

        <div className="space-y-2">
          <Label>Crew</Label>
          <div className="grid grid-cols-3 gap-2">
            {CREWS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCrew(c)}
                className={cn(
                  'flex flex-col gap-1 p-3 rounded-xl border text-left transition-all duration-150',
                  crew === c
                    ? 'border-accent/40 bg-accent/8 text-text-primary shadow-[0_0_12px_rgba(34,211,238,0.12)]'
                    : 'border-border bg-surface/50 hover:border-border-bright hover:bg-elevated text-text-muted'
                )}
              >
                <span className="text-base">{CREW_ICONS[c]}</span>
                <span className="text-xs font-semibold font-mono capitalize">{c}</span>
                <span className="text-[10px] leading-snug opacity-70 line-clamp-2">{CREW_DESCRIPTIONS[c]}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="model">
              <Cpu className="inline h-3 w-3 mr-1" />
              Model override
            </Label>
            <Select
              id="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            >
              <option value="">Default ({defaultModel || '...'})</option>
              {system.models.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Chain</Label>
            <button
              type="button"
              onClick={() => setChain(!chain)}
              className={cn(
                'flex h-9 w-full items-center justify-between rounded-lg border px-3 text-sm transition-all duration-150',
                chain
                  ? 'border-accent/40 bg-accent/8 text-accent'
                  : 'border-border bg-elevated text-text-muted hover:border-border-bright hover:text-text-primary'
              )}
            >
              <span>Auto-chain safety + ops</span>
              <div className={cn(
                'flex h-5 w-9 items-center rounded-full border transition-all duration-200 px-0.5',
                chain ? 'bg-accent border-accent justify-end' : 'bg-elevated border-border justify-start'
              )}>
                <div className={cn(
                  'h-3.5 w-3.5 rounded-full transition-all duration-200',
                  chain ? 'bg-base' : 'bg-text-dim'
                )} />
              </div>
            </button>
          </div>
        </div>

        {chain && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="border-accent/20 bg-accent/5">
              <CardContent className="py-3 px-4">
                <div className="flex items-center gap-2 text-xs font-mono text-text-muted">
                  <span className="text-accent font-medium">{crew}</span>
                  <ChevronRight className="h-3 w-3 text-text-dim" />
                  <span>safety</span>
                  <ChevronRight className="h-3 w-3 text-text-dim" />
                  <span>ops</span>
                </div>
                <p className="text-[11px] text-text-dim mt-1">
                  QA, security, deployment review, docs, memory, and telemetry will run automatically.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-error"
          >
            {error}
          </motion.p>
        )}

        <div className="flex gap-3 pt-1">
          <Button
            onClick={submit}
            disabled={loading || !goal.trim()}
            size="lg"
            className="flex-1"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-base/30 border-t-base" />
                Launching...
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Launch run
              </>
            )}
          </Button>
          <Button variant="outline" size="lg" onClick={() => navigate('/')}>
            Cancel
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
