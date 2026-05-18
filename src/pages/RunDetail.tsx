import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, FileText, Download, RefreshCw, Square } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Terminal } from '../components/Terminal'
import { useStore } from '../store'
import { api, type WsMessage } from '../lib/api'
import { duration } from '../lib/utils'
import { cn } from '../lib/utils'

const STATUS_VARIANT = {
  starting:  'starting',
  running:   'running',
  completed: 'completed',
  error:     'error',
  cancelled: 'error',
} as const

const MAX_RECONNECTS = 5
const RECONNECT_DELAY_MS = 2000

export function RunDetail() {
  const { id }     = useParams<{ id: string }>()
  const navigate   = useNavigate()
  const runs       = useStore((s) => s.runs)
  const upsertRun  = useStore((s) => s.upsertRun)
  const appendOutput = useStore((s) => s.appendOutput)
  const finalizeRun  = useStore((s) => s.finalizeRun)

  const run = id ? runs[id] : undefined
  const [wsError, setWsError]       = useState('')
  const [cancelling, setCancelling] = useState(false)
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [fileContent, setFileContent]   = useState<string>('')
  const [fileLoading, setFileLoading]   = useState(false)

  const wsRef          = useRef<WebSocket | null>(null)
  const attemptRef     = useRef(0)
  const retryTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null)
  const unmountedRef   = useRef(false)

  const isActive = run?.status === 'running' || run?.status === 'starting'

  const connectWs = useCallback(() => {
    if (!id || unmountedRef.current) return

    const ws = new WebSocket(api.wsUrl(id))
    wsRef.current = ws

    ws.onopen = () => {
      attemptRef.current = 0
      setWsError('')
    }

    ws.onmessage = (e) => {
      try {
        const msg: WsMessage = JSON.parse(e.data)
        if (msg.type === 'output') {
          appendOutput(id, msg.line)
          upsertRun({ run_id: id, status: 'running' })
        } else if (msg.type === 'done') {
          finalizeRun(id, msg.status, msg.files)
        } else if (msg.type === 'error') {
          setWsError(msg.msg)
        }
      } catch {}
    }

    ws.onclose = () => {
      if (unmountedRef.current) return
      const currentRun = useStore.getState().runs[id]
      if (currentRun?.status === 'running' || currentRun?.status === 'starting') {
        if (attemptRef.current < MAX_RECONNECTS) {
          attemptRef.current += 1
          retryTimerRef.current = setTimeout(connectWs, RECONNECT_DELAY_MS)
        } else {
          setWsError(`Connection lost after ${MAX_RECONNECTS} retries.`)
        }
      }
    }

    ws.onerror = () => {
      ws.close()
    }
  }, [id, appendOutput, upsertRun, finalizeRun])

  useEffect(() => {
    unmountedRef.current = false
    if (!id) return

    if (!run) {
      api.getRun(id)
        .then((data) => upsertRun(data))
        .catch(() => {})
    }

    const storedRun = runs[id]
    if (!storedRun || storedRun.status === 'starting' || storedRun.status === 'running') {
      connectWs()
    }

    return () => {
      unmountedRef.current = true
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current)
      wsRef.current?.close()
    }
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleCancel = async () => {
    if (!id) return
    setCancelling(true)
    try {
      await api.cancelRun(id)
    } catch (e: unknown) {
      setWsError(e instanceof Error ? e.message : 'Failed to cancel run.')
    } finally {
      setCancelling(false)
    }
  }

  const loadFile = async (path: string) => {
    setSelectedFile(path)
    setFileLoading(true)
    try {
      const text = await api.readOutput(path)
      setFileContent(text)
    } catch {
      setFileContent('Failed to load file.')
    } finally {
      setFileLoading(false)
    }
  }

  const downloadFile = (path: string) => {
    window.open(`${api.wsUrl('').replace('ws', 'http').replace('/ws/', '')}/api/outputs/${path}`, '_blank')
  }

  if (!run) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-text-muted">
        <p className="mb-4">Run not found.</p>
        <Button variant="outline" onClick={() => navigate('/')}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-start gap-4"
      >
        <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="eyebrow text-accent">{run.crew}</span>
            <Badge variant={STATUS_VARIANT[run.status]} pulse={isActive}>
              {run.status}
            </Badge>
            {run.endedAt && (
              <span className="text-xs font-mono text-text-muted">
                {duration(run.startedAt, run.endedAt)}
              </span>
            )}
            {isActive && (
              <span className="text-xs font-mono text-text-muted">
                {duration(run.startedAt)} elapsed
              </span>
            )}
          </div>
          <p className="text-sm text-text-primary mt-1 leading-snug">{run.goal}</p>
          <p className="eyebrow mt-0.5 opacity-30">{run.run_id}</p>
        </div>

        {isActive && (
          <Button
            variant="danger"
            size="sm"
            onClick={handleCancel}
            disabled={cancelling}
          >
            <Square className="h-3.5 w-3.5" />
            {cancelling ? 'Cancelling...' : 'Cancel'}
          </Button>
        )}
      </motion.div>

      {wsError && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-lg border border-error/30 bg-error/5 px-4 py-2.5 text-sm text-error flex items-center gap-2"
        >
          <RefreshCw
            className="h-3.5 w-3.5 cursor-pointer hover:text-error/70 shrink-0"
            onClick={() => { setWsError(''); attemptRef.current = 0; connectWs() }}
          />
          {wsError}
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.05 }}
      >
        <Terminal
          lines={run.output}
          running={isActive}
          className="h-[420px]"
        />
      </motion.div>

      {run.files.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-accent" />
                Output Files
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-1">
                {run.files.map((f) => (
                  <button
                    key={f}
                    onClick={() => loadFile(f)}
                    className={cn(
                      'flex items-center justify-between w-full rounded-lg px-3 py-2 text-sm transition-colors duration-150',
                      selectedFile === f
                        ? 'bg-accent/10 border border-accent/20 text-accent'
                        : 'hover:bg-elevated text-text-muted hover:text-text-primary'
                    )}
                  >
                    <span className="font-mono text-xs">{f}</span>
                    <Download
                      className="h-3.5 w-3.5 shrink-0 opacity-50 hover:opacity-100"
                      onClick={(e) => { e.stopPropagation(); downloadFile(f) }}
                    />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {selectedFile && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="font-mono text-xs text-text-muted font-normal">{selectedFile}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {fileLoading ? (
                <div className="flex items-center gap-2 text-sm text-text-muted py-4">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-accent/30 border-t-accent" />
                  Loading...
                </div>
              ) : (
                <pre className="terminal-text text-text-primary/80 whitespace-pre-wrap break-all max-h-96 overflow-y-auto leading-relaxed">
                  {fileContent}
                </pre>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
