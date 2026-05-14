import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight, Clock, FileText } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import type { Run } from '../store'
import { timeAgo, duration } from '../lib/utils'
import { cn } from '../lib/utils'

interface RunCardProps {
  run:   Run
  index: number
}

const STATUS_VARIANT = {
  starting:  'starting',
  running:   'running',
  completed: 'completed',
  error:     'error',
} as const

const CREW_COLORS: Record<string, string> = {
  default: 'text-accent',
  plc:     'text-violet',
  react:   'text-sky-400',
  vision:  'text-pink-400',
  safety:  'text-success',
  ops:     'text-warning',
}

export function RunCard({ run, index }: RunCardProps) {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.04 }}
    >
      <Card
        className={cn(
          'cursor-pointer hover:border-border-bright transition-all duration-200',
          run.status === 'running' && 'border-accent/30 glow-running',
          run.status === 'error'   && 'border-error/30',
        )}
        onClick={() => navigate(`/run/${run.run_id}`)}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <span className={cn('eyebrow', CREW_COLORS[run.crew] ?? 'text-text-muted')}>
                  {run.crew}
                </span>
                <Badge variant={STATUS_VARIANT[run.status]} pulse={run.status === 'running' || run.status === 'starting'}>
                  {run.status}
                </Badge>
              </div>
              <p className="text-sm text-text-primary line-clamp-2 leading-snug">
                {run.goal}
              </p>
              <div className="flex items-center gap-3 mt-2 text-xs text-text-muted font-mono">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {timeAgo(run.startedAt)}
                </span>
                {run.endedAt && (
                  <span className="flex items-center gap-1">
                    {duration(run.startedAt, run.endedAt)}
                  </span>
                )}
                {run.files.length > 0 && (
                  <span className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    {run.files.length} file{run.files.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-text-dim flex-shrink-0 mt-1" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
