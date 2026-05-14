import { useEffect } from 'react'
import { Wifi, WifiOff, Cpu } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { api } from '../lib/api'
import { useStore } from '../store'
import { cn } from '../lib/utils'

export function StatusIndicator() {
  const { system, setSystem } = useStore()

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

  return (
    <div className="flex items-center gap-3">
      <AnimatePresence mode="wait">
        <motion.div
          key={system.online ? 'online' : 'offline'}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.15 }}
          className={cn(
            'flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border',
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
          {system.online ? 'Connected' : 'Offline'}
        </motion.div>
      </AnimatePresence>

      {system.online && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={cn(
            'flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border',
            system.ollama
              ? 'bg-running/8 border-running/20 text-running'
              : 'bg-warning/8 border-warning/20 text-warning'
          )}
        >
          <Cpu className="h-3 w-3" />
          Ollama {system.ollama ? 'ready' : 'offline'}
        </motion.div>
      )}
    </div>
  )
}
