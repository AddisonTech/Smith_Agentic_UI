import type { Run } from '../store'

interface DemoStep   { agent: string; text: string }
interface DemoScript {
  crew:        string
  goal:        string
  steps:       DemoStep[]
  outputAgent: string
  output:      string
  files:       string[]
}

const PLC: DemoScript = {
  crew: 'plc',
  goal: 'Generate a PLC ladder logic routine for a conveyor start sequence.',
  steps: [
    { agent: 'Orchestrator',        text: 'Task received. Breaking into sub-goals: (1) define I/O tags, (2) author ladder rungs, (3) verify safety interlocks. Routing to Controls Researcher.' },
    { agent: 'Controls Researcher', text: 'Querying vector store. Found: ControlLogix tag naming conventions, NFPA 79 E-stop requirements, and a prior conveyor routine in /outputs/2025-08. Passing context to PLC Builder.' },
    { agent: 'PLC Builder',         text: 'Writing Conveyor_Start routine. Defined tags: Conveyor.Run, Motor.Enable, EStop.OK, Sensor.Proximity, Motor.OL. Authoring 4 rungs with safety chain. Draft ready for review.' },
    { agent: 'Safety Critic',       text: 'Review flagged two issues: Motor.OL contact missing from rung 2, and E-stop circuit lacks dual-channel confirmation per NFPA 79 §9.2.5. Returning to PLC Builder for revisions.' },
    { agent: 'PLC Builder',         text: 'Revisions applied. Added Motor.OL contact to rung 2. Added dual-channel safety confirmation rung. Both changes verified against NFPA 79 §9.2.5.' },
    { agent: 'Safety Critic',       text: 'Final review passed. All interlocks verified. Dual-channel E-stop compliant with NFPA 79. Routine approved for delivery.' },
  ],
  outputAgent: 'PLC Builder',
  output:
    'Routine: Conveyor_Start\n' +
    '  Rung 0: XIC EStop.OK     XIC Motor.OL    OTE Conveyor.Enable\n' +
    '  Rung 1: XIC Conveyor.Run XIC Sensor.Prox OTE Motor.Enable\n' +
    '  Rung 2: XIC Safety.Ch1   XIC Safety.Ch2  OTE Safety.OK\n' +
    '  Rung 3: XIO Conveyor.Run                 RES Motor.Enable\n' +
    '\n' +
    'Verdict: APPROVED\n' +
    'Saved: /outputs/conveyor_start.l5x',
  files: ['conveyor_start.l5x'],
}

const REACT: DemoScript = {
  crew: 'react',
  goal: 'Build a React component for a sortable data table.',
  steps: [
    { agent: 'Orchestrator',        text: 'Decomposing task: schema typing, sort state, row rendering, accessibility. Sending to Frontend Researcher first.' },
    { agent: 'Frontend Researcher', text: 'Reviewed /components. TanStack Table v8 is the right fit for sort and filter. Pulled WCAG 1.3.1 ARIA sort attribute requirements. Passing context to React Builder.' },
    { agent: 'React Builder',       text: 'Scaffolding SortableTable<T> component. Implementing useReducer sort state, column header click handlers, and ARIA aria-sort attributes per WCAG 1.3.1. TypeScript generics added for column config. Draft ready.' },
    { agent: 'QA Sentinel',         text: 'Review found three issues: missing key prop on row map, no empty-state handling, sort comparator only handles string columns. Returning to React Builder.' },
    { agent: 'React Builder',       text: 'All three fixed: stable key props added, EmptyState component added, sort comparator extended to handle numbers and ISO dates. Types tightened.' },
    { agent: 'QA Sentinel',         text: 'Second pass clear. All issues resolved. Accessibility verified. Component is production-ready.' },
  ],
  outputAgent: 'React Builder',
  output:
    '// SortableTable.tsx\n' +
    'export function SortableTable<T>({ columns, data }: Props<T>) {\n' +
    '  const [sort, dispatch] = useReducer(sortReducer, null);\n' +
    '  const rows = useSortedRows(data, sort);\n' +
    '  if (!rows.length) return <EmptyState />;\n' +
    '  return (\n' +
    '    <table role="grid">\n' +
    '      <thead>\n' +
    '        {columns.map(col => (\n' +
    '          <th key={col.key}\n' +
    '              aria-sort={ariaSort(sort, col)}\n' +
    '              onClick={() => dispatch({ col })}>\n' +
    '            {col.label}\n' +
    '          </th>\n' +
    '        ))}\n' +
    '      </thead>\n' +
    '      <tbody>\n' +
    '        {rows.map(row => (\n' +
    '          <tr key={row.id}>{/* cells */}</tr>\n' +
    '        ))}\n' +
    '      </tbody>\n' +
    '    </table>\n' +
    '  );\n' +
    '}\n' +
    '\n' +
    '// Verdict: APPROVED',
  files: ['SortableTable.tsx'],
}

const VISION: DemoScript = {
  crew: 'vision',
  goal: 'Analyze this manufacturing image for defects.',
  steps: [
    { agent: 'Orchestrator',      text: 'Frame loaded from capture buffer. Part #A1-2204 in position. Routing to VLM Analyzer.' },
    { agent: 'VLM Analyzer',      text: 'Running Qwen2.5-VL prompt against 640x480 frame. Checking surface texture, edge geometry, and finish uniformity. Analysis complete - response passed to Defect Classifier.' },
    { agent: 'Defect Classifier', text: 'VLM response parsed. Two anomalies identified: (1) edge chipping, lower-left quadrant, ~3mm. (2) surface oxidation, upper face, ~12mm. Scoring severity against tolerance database.' },
    { agent: 'Report Generator',  text: 'Compiling inspection report. Defects logged with pixel coordinates. Confidence scores: edge chip 0.91, oxidation 0.74. Generating structured JSON output.' },
    { agent: 'Defect Classifier', text: 'Tolerance check done. Edge chip: within spec for Part Class B (threshold 5mm). Oxidation: confidence 0.74 is below the 0.78 floor. Flagging for supervisor review.' },
    { agent: 'Report Generator',  text: 'Report finalized. Status: CONDITIONAL PASS. Writing verdict to PLC register. Supervisor review queued for oxidation flag.' },
  ],
  outputAgent: 'Report Generator',
  output:
    '{\n' +
    '  "part_id": "A1-2204",\n' +
    '  "status": "CONDITIONAL_PASS",\n' +
    '  "defects": [\n' +
    '    {\n' +
    '      "type": "edge_chip",\n' +
    '      "severity": "minor",\n' +
    '      "confidence": 0.91,\n' +
    '      "within_tolerance": true\n' +
    '    },\n' +
    '    {\n' +
    '      "type": "surface_oxidation",\n' +
    '      "severity": "marginal",\n' +
    '      "confidence": 0.74,\n' +
    '      "requires_review": true\n' +
    '    }\n' +
    '  ],\n' +
    '  "plc_verdict": 2\n' +
    '}',
  files: ['inspection_A1-2204.json'],
}

const SCRIPTS: Record<string, DemoScript> = { plc: PLC, react: REACT, vision: VISION }

export const DEMO_PRESETS = [
  { crew: 'plc',    label: 'PLC',    goal: PLC.goal,    description: 'Conveyor start routine with NFPA 79 safety interlocks' },
  { crew: 'react',  label: 'React',  goal: REACT.goal,  description: 'Sortable table component with TypeScript generics'     },
  { crew: 'vision', label: 'Vision', goal: VISION.goal, description: 'Manufacturing defect analysis from capture frame'      },
]

export function isDemoRun(run_id: string): boolean {
  return run_id.startsWith('demo-')
}

export function generateDemoRunId(crew: string): string {
  return `demo-${crew}-${Date.now()}`
}

export interface SimCallbacks {
  appendOutput:     (run_id: string, line: string) => void
  updateLastOutput: (run_id: string, line: string) => void
  upsertRun:        (run: { run_id: string; status: Run['status'] }) => void
  finalizeRun:      (run_id: string, status: string, files: string[]) => void
  isCancelled:      () => boolean
}

function sleep(ms: number): Promise<void> {
  return new Promise(res => setTimeout(res, ms))
}

async function typeStep(
  run_id: string,
  agent:  string,
  text:   string,
  cb:     SimCallbacks,
): Promise<void> {
  const prefix = `[${agent}] `
  cb.appendOutput(run_id, prefix)
  await sleep(700)
  if (cb.isCancelled()) return
  let current = prefix
  for (const ch of text) {
    if (cb.isCancelled()) return
    current += ch
    cb.updateLastOutput(run_id, current)
    await sleep(18)
  }
}

export async function runDemoSimulation(
  run_id: string,
  crew:   string,
  cb:     SimCallbacks,
): Promise<void> {
  const script = SCRIPTS[crew]
  if (!script) return

  cb.upsertRun({ run_id, status: 'running' })

  for (const step of script.steps) {
    if (cb.isCancelled()) return
    await typeStep(run_id, step.agent, step.text, cb)
    if (cb.isCancelled()) return
    await sleep(500)
  }

  if (cb.isCancelled()) return
  await sleep(600)

  cb.appendOutput(run_id, '')
  cb.appendOutput(run_id, `[${script.outputAgent}] run complete`)
  await sleep(300)

  for (const line of script.output.split('\n')) {
    if (cb.isCancelled()) return
    cb.appendOutput(run_id, line)
    await sleep(60)
  }

  await sleep(300)
  if (!cb.isCancelled()) {
    cb.finalizeRun(run_id, 'completed', script.files)
  }
}

function buildOutput(script: DemoScript): string[] {
  return [
    ...script.steps.map(s => `[${s.agent}] ${s.text}`),
    '',
    `[${script.outputAgent}] run complete`,
    ...script.output.split('\n'),
  ]
}

export function makeSeedRuns(): Array<Partial<Run> & { run_id: string }> {
  const now = Date.now()
  return [
    {
      run_id:    'demo-plc-seed',
      crew:      'plc',
      goal:      PLC.goal,
      status:    'completed',
      output:    buildOutput(PLC),
      files:     PLC.files,
      startedAt: now - 4 * 60_000,
      endedAt:   now - 3 * 60_000 - 12_000,
    },
    {
      run_id:    'demo-react-seed',
      crew:      'react',
      goal:      REACT.goal,
      status:    'completed',
      output:    buildOutput(REACT),
      files:     REACT.files,
      startedAt: now - 12 * 60_000,
      endedAt:   now - 11 * 60_000 - 8_000,
    },
  ]
}
