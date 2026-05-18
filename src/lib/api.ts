declare global {
  interface Window { SMITH_AGENTIC_URL?: string }
}

const BASE = (
  (typeof window !== 'undefined' && window.SMITH_AGENTIC_URL) ||
  import.meta.env.VITE_SMITH_AGENTIC_URL ||
  'http://localhost:8765'
).replace(/\/$/, '')

function wsBase(): string {
  return BASE.replace(/^http/, 'ws')
}

export interface SystemStatus {
  status: string
  ollama: boolean
}

export interface RunRequest {
  goal: string
  crew: string
  model?: string
  chain: boolean
  hitl: boolean
}

export interface RunStatus {
  run_id: string
  status: 'starting' | 'running' | 'completed' | 'error' | 'cancelled'
  output: string[]
  files: string[]
}

export interface OutputFile {
  path: string
  size: number
}

export type WsMessage =
  | { type: 'output'; line: string }
  | { type: 'done'; status: string; files: string[] }
  | { type: 'ping' }
  | { type: 'error'; msg: string }

export const CREWS = ['default', 'plc', 'react', 'vision', 'safety', 'ops'] as const
export type CrewName = typeof CREWS[number]

export const CREW_DESCRIPTIONS: Record<CrewName, string> = {
  default: 'General software tasks - specs, code, analysis',
  plc:     'Rockwell/Allen-Bradley Logix PLC programs',
  react:   'Industrial React/MUI HMI components',
  vision:  'Vision_Inspect defect analysis',
  safety:  'QA, security, and deployment validation',
  ops:     'Docs, memory consolidation, and telemetry',
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`)
  return data
}

export const api = {
  status:       ()                 => get<SystemStatus>('/api/status'),
  models:       ()                 => get<{ models: string[] }>('/api/models'),
  crewDefaults: ()                 => get<Record<string, string>>('/api/crew-defaults'),
  startRun:     (r: RunRequest)    => post<{ run_id: string }>('/api/run', r),
  getRun:       (id: string)       => get<RunStatus>(`/api/run/${id}`),
  cancelRun:    (id: string)       => post<{ run_id: string; status: string }>(`/api/run/${id}/cancel`, {}),
  listOutputs:  ()                 => get<{ files: OutputFile[] }>('/api/outputs'),
  readOutput:   (path: string)     => fetch(`${BASE}/api/outputs/${path}`).then(r => r.text()),
  wsUrl:        (id: string)       => `${wsBase()}/ws/${id}`,
}
