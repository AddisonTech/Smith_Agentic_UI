import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../lib/utils'

interface TerminalProps {
  lines:   string[]
  running: boolean
  className?: string
}

export function Terminal({ lines, running, className }: TerminalProps) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const userScrolledRef = useRef(false)

  useEffect(() => {
    if (!userScrolledRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [lines])

  const handleScroll = () => {
    const el = containerRef.current
    if (!el) return
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 40
    userScrolledRef.current = !atBottom
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className={cn(
        'relative overflow-y-auto bg-[#04040c] rounded-xl border border-border',
        'terminal-text text-text-primary',
        'shadow-[0_12px_40px_rgba(0,0,0,0.35)]',
        className
      )}
    >
      <div className="sticky top-0 z-10 flex items-center gap-2 px-4 py-3 border-b border-border bg-[#04040c]/95 backdrop-blur-sm">
        <span className="h-2.5 w-2.5 rounded-full bg-error/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
        <span className="ml-3 eyebrow opacity-50">output</span>
        {running && (
          <span className="ml-auto flex items-center gap-1.5 eyebrow text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-slow" />
            running
          </span>
        )}
      </div>

      <div className="p-4 space-y-0.5 min-h-[200px]">
        {lines.length === 0 && (
          <div className="text-text-dim italic text-xs pt-2">Waiting for output...</div>
        )}
        <AnimatePresence initial={false}>
          {lines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.1 }}
              className={cn(
                'whitespace-pre-wrap break-all leading-relaxed',
                line.includes('ERROR') || line.includes('Error') || line.includes('error')
                  ? 'text-error/80'
                  : line.includes('WARNING') || line.includes('Warning')
                  ? 'text-warning/80'
                  : line.startsWith('[SmithAgentic]') || line.startsWith('[')
                  ? 'text-accent/80'
                  : 'text-text-primary/75'
              )}
            >
              {line}
            </motion.div>
          ))}
        </AnimatePresence>
        {running && (
          <div className="flex items-center gap-1 pt-1">
            <span className="text-accent animate-blink font-bold">_</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
