import { useEffect, useState } from 'react'
import { Wifi, WifiOff, Cpu, Terminal, FlaskConical, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { api } from '../lib/api'
import { useStore } from '../store'
import { makeSeedRuns } from '../lib/demo'
import { cn } from '../lib/utils'

const START_CMD = 'cd Smith_Agentic && python ui/server.py'

export function StatusIndicator() {
  const { system, setSystem, upsertRun } = useStore()
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const check = async () => {
      try {
        const [status, models] = await Promise.all([api.status(), api.models()])
        setSystem({ online: true, ollama: status.ollama, models: models.models })
      } catch {
        setSystem({ online: false, ollama: false })
      }
    }
    check()
    const id = setInterval(check, 15000)
    return () => clearInterval(id)
  }, [setSystem])

  const copyCommand = async () => {
    try {
      await navigator.clipboard.writeText(START_CMD)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  const activateDemo = () => {
    const seeds = makeSeedRuns()
    seeds.forEach(r => upsertRun(r))
    setSystem({ demoMode: true })
  }

  const exitDemo = () => setSystem({ demoMode: false })

  return (
    <div className="flex items-center gap-3">
      <AnimatePresence>
        {system.demoMode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-mono font-medium border bg-warning/8 border-warning/20 text-warning"
          >
            <FlaskConical className="h-3 w-3" />
            simulated
            <button
              onClick={exitDemo}
              className="ml-0.5 opacity-60 hover:opacity-100 transition-opacity"
              aria-label="exit demo mode"
            >
              <X className="h-3 w-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={system.online ? 'online' : 'offline'}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.15 }}
          className={cn(
            'flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-mono font-medium border',
            system.online
              ? 'bg-success/8 border-success/20 text-success'
              : 'bg-error/8 border-error/20 text-error'
          )}
        >
          {system.online ? (
            <Wifi className="h-3 w-3" />
          ) : (
            <WifiOff className="h-3 w-3" />
          )}
          {system.online ? 'connected' : 'offline'}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {!system.online && !system.demoMode && (
          <motion.div
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -6 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-2"
          >
            <button
              onClick={copyCommand}
              className={cn(
                'flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-mono font-medium border transition-all duration-150',
                copied
                  ? 'bg-success/10 border-success/30 text-success'
                  : 'bg-accent/10 border-accent/30 text-accent hover:bg-accent/20'
              )}
            >
              <Terminal className="h-3 w-3" />
              {copied ? 'copied!' : 'go online'}
            </button>
            <button
              onClick={activateDemo}
              className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-mono font-medium border bg-violet/10 border-violet/30 text-violet hover:bg-violet/20 transition-all duration-150"
            >
              <FlaskConical className="h-3 w-3" />
              demo mode
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {system.online && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={cn(
            'flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-mono font-medium border',
            system.ollama
              ? 'bg-accent/8 border-accent/20 text-accent'
              : 'bg-warning/8 border-warning/20 text-warning'
          )}
        >
          <Cpu className="h-3 w-3" />
          ollama {system.ollama ? 'ready' : 'offline'}
        </motion.div>
      )}
    </div>
  )
}
