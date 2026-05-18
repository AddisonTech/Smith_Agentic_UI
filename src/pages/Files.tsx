import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FolderOpen, FileText, Download, RefreshCw, Search, Copy, Check, ChevronRight, Folder } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent } from '../components/ui/card'
import { api, type OutputFile } from '../lib/api'
import { formatBytes } from '../lib/utils'
import { cn } from '../lib/utils'

interface FileGroup {
  dir:   string
  files: OutputFile[]
}

function groupFiles(files: OutputFile[]): FileGroup[] {
  const map = new Map<string, OutputFile[]>()
  for (const f of files) {
    const slash = f.path.indexOf('/')
    const dir   = slash === -1 ? '' : f.path.substring(0, slash)
    if (!map.has(dir)) map.set(dir, [])
    map.get(dir)!.push(f)
  }
  const result: FileGroup[] = []
  if (map.has('')) result.push({ dir: '', files: map.get('')! })
  for (const [dir, fs] of [...map.entries()].filter(([d]) => d !== '').sort()) {
    result.push({ dir, files: fs })
  }
  return result
}

const hasSubdirs = (files: OutputFile[]) => files.some(f => f.path.includes('/'))

export function Files() {
  const [files,          setFiles]          = useState<OutputFile[]>([])
  const [loading,        setLoading]        = useState(true)
  const [query,          setQuery]          = useState('')
  const [selectedPath,   setSelectedPath]   = useState<string | null>(null)
  const [content,        setContent]        = useState('')
  const [contentLoading, setContentLoading] = useState(false)
  const [error,          setError]          = useState('')
  const [copiedPath,     setCopiedPath]     = useState<string | null>(null)
  const [openDirs,       setOpenDirs]       = useState<Set<string>>(new Set())

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await api.listOutputs()
      setFiles(data.files)
      setOpenDirs(new Set(groupFiles(data.files).map(g => g.dir)))
    } catch {
      setError('Could not connect to Smith_Agentic.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const filtered = files.filter((f) =>
    f.path.toLowerCase().includes(query.toLowerCase())
  )

  const groups    = groupFiles(filtered)
  const useGroups = hasSubdirs(filtered)

  const toggleDir = (dir: string) => {
    setOpenDirs(prev => {
      const next = new Set(prev)
      if (next.has(dir)) next.delete(dir)
      else next.add(dir)
      return next
    })
  }

  const copyPath = async (path: string, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(path)
      setCopiedPath(path)
      setTimeout(() => setCopiedPath(null), 2000)
    } catch {}
  }

  const openFile = async (path: string) => {
    setSelectedPath(path)
    setContentLoading(true)
    try {
      const text = await api.readOutput(path)
      setContent(text)
    } catch {
      setContent('Failed to load file.')
    } finally {
      setContentLoading(false)
    }
  }

  const ext    = (path: string) => path.split('.').pop()?.toLowerCase() ?? ''
  const isCode = (path: string) => ['py', 'js', 'ts', 'tsx', 'json', 'yaml', 'yml', 'toml', 'l5x', 'md'].includes(ext(path))

  const FileRow = ({ f, i }: { f: OutputFile; i: number }) => (
    <motion.button
      key={f.path}
      initial={{ opacity: 0, x: -4 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.15, delay: i * 0.02 }}
      onClick={() => openFile(f.path)}
      className={cn(
        'group flex items-center gap-2.5 w-full rounded-lg px-3 py-2 text-left transition-colors duration-150',
        selectedPath === f.path
          ? 'bg-accent/10 border border-accent/20 text-text-primary'
          : 'hover:bg-elevated text-text-muted hover:text-text-primary'
      )}
    >
      <FileText className="h-3.5 w-3.5 shrink-0 text-accent/60" />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-mono truncate">
          {useGroups && f.path.includes('/') ? f.path.split('/').slice(1).join('/') : f.path}
        </p>
        <p className="text-[10px] text-text-dim">{formatBytes(f.size)}</p>
      </div>
      <button
        onClick={(e) => copyPath(f.path, e)}
        className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-text-dim hover:text-text-muted"
        title="Copy path"
      >
        {copiedPath === f.path
          ? <Check className="h-3 w-3 text-success" />
          : <Copy className="h-3 w-3" />
        }
      </button>
    </motion.button>
  )

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Files</h1>
          <p className="text-sm text-text-muted mt-0.5">
            {loading ? 'Loading...' : `${files.length} file${files.length !== 1 ? 's' : ''} in outputs/`}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className={cn('h-3.5 w-3.5', loading && 'animate-spin')} />
          Refresh
        </Button>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-lg border border-error/30 bg-error/5 px-4 py-3 text-sm text-error"
        >
          {error}
        </motion.div>
      )}

      <div className="grid grid-cols-5 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2, delay: 0.05 }}
          className="col-span-2 space-y-3"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-dim" />
            <Input
              placeholder="Search files..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-8"
            />
          </div>

          {loading ? (
            <div className="space-y-1.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-10 rounded-lg bg-elevated animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FolderOpen className="h-8 w-8 text-text-dim mb-3 opacity-50" />
              <p className="text-sm text-text-muted">
                {files.length === 0
                  ? 'No output files yet. Run a crew to generate files.'
                  : 'No files match your search.'}
              </p>
            </div>
          ) : useGroups ? (
            <div className="space-y-1">
              {groups.map((group) => (
                <div key={group.dir}>
                  {group.dir === '' ? (
                    <div className="space-y-0.5">
                      {group.files.map((f, i) => <FileRow key={f.path} f={f} i={i} />)}
                    </div>
                  ) : (
                    <div>
                      <button
                        onClick={() => toggleDir(group.dir)}
                        className="flex items-center gap-2 w-full px-2 py-1.5 text-left rounded-lg hover:bg-elevated transition-colors duration-150"
                      >
                        <ChevronRight className={cn(
                          'h-3 w-3 text-text-dim transition-transform duration-150',
                          openDirs.has(group.dir) && 'rotate-90'
                        )} />
                        <Folder className="h-3.5 w-3.5 text-accent/50 shrink-0" />
                        <span className="text-xs font-mono text-text-muted">{group.dir}</span>
                        <span className="ml-auto text-[10px] font-mono text-text-dim">{group.files.length}</span>
                      </button>
                      <AnimatePresence initial={false}>
                        {openDirs.has(group.dir) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="overflow-hidden pl-4"
                          >
                            <div className="space-y-0.5 border-l border-border pl-2 ml-1.5 py-0.5">
                              {group.files.map((f, i) => <FileRow key={f.path} f={f} i={i} />)}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-0.5">
              {filtered.map((f, i) => <FileRow key={f.path} f={f} i={i} />)}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="col-span-3"
        >
          {selectedPath ? (
            <Card className="h-full">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <p className="text-xs font-mono text-text-muted truncate">{selectedPath}</p>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => copyPath(selectedPath, e as React.MouseEvent)}
                    title="Copy path"
                  >
                    {copiedPath === selectedPath
                      ? <Check className="h-3.5 w-3.5 text-success" />
                      : <Copy className="h-3.5 w-3.5" />
                    }
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(`http://localhost:8765/api/outputs/${selectedPath}`, '_blank')}
                  >
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-4">
                {contentLoading ? (
                  <div className="flex items-center gap-2 text-sm text-text-muted py-8 justify-center">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-accent/30 border-t-accent" />
                    Loading...
                  </div>
                ) : (
                  <pre className={cn(
                    'whitespace-pre-wrap break-all text-text-primary/80 max-h-[520px] overflow-y-auto leading-relaxed',
                    isCode(selectedPath) ? 'terminal-text' : 'text-sm'
                  )}>
                    {content}
                  </pre>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-20 text-center">
              <FileText className="h-10 w-10 text-text-dim mb-3" />
              <p className="text-sm text-text-muted">Select a file to preview</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
