export type TemplateCategory = 'code' | 'plc' | 'hmi' | 'vision' | 'safety' | 'ops'

export interface Template {
  id: string
  title: string
  description: string
  category: TemplateCategory
  crew: string
  prompt: string
  tags: string[]
}

export const CATEGORY_LABELS: Record<TemplateCategory, string> = {
  code:   'Code',
  plc:    'PLC',
  hmi:    'HMI',
  vision: 'Vision',
  safety: 'Safety',
  ops:    'Ops',
}

export const CATEGORY_COLORS: Record<TemplateCategory, string> = {
  code:   'text-accent border-accent/30 bg-accent/8',
  plc:    'text-violet border-violet/30 bg-violet/8',
  hmi:    'text-cyan-300 border-cyan-300/30 bg-cyan-300/8',
  vision: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/8',
  safety: 'text-amber-400 border-amber-400/30 bg-amber-400/8',
  ops:    'text-rose-400 border-rose-400/30 bg-rose-400/8',
}

export const TEMPLATES: Template[] = [
  // Code -- default crew
  {
    id: 'code-review',
    title: 'Full Code Review',
    description: 'Deep review of a codebase for bugs, style issues, dead code, and improvement opportunities.',
    category: 'code',
    crew: 'default',
    prompt: 'Perform a thorough code review of the project in the current working directory. Identify bugs, logic errors, unused variables, inconsistent naming, and any code smells. For each issue found, provide the file path, line number, a description of the problem, and a suggested fix. Summarize the overall health of the codebase at the end.',
    tags: ['review', 'bugs', 'quality'],
  },
  {
    id: 'code-refactor',
    title: 'Refactor to Clean Architecture',
    description: 'Analyze structure and produce a refactored version with clear separation of concerns.',
    category: 'code',
    crew: 'default',
    prompt: 'Analyze the architecture of the project in the current working directory. Identify tightly coupled modules, God objects, missing abstractions, and violated SOLID principles. Produce a refactored version of the most critical files with clear separation of concerns, well-named functions, and minimal dependencies. Include a brief explanation of each structural change made.',
    tags: ['refactor', 'architecture', 'SOLID'],
  },
  {
    id: 'code-tests',
    title: 'Generate Unit Test Suite',
    description: 'Write comprehensive unit tests for the core modules with edge case coverage.',
    category: 'code',
    crew: 'default',
    prompt: 'Write a comprehensive unit test suite for the core modules in the current working directory. Identify the most critical functions and classes. For each, write tests covering the happy path, boundary conditions, and failure cases. Use the existing test framework if one is present, otherwise choose the standard framework for the detected language. Aim for at least 80% branch coverage on the primary business logic.',
    tags: ['tests', 'unit tests', 'coverage'],
  },

  // PLC -- plc crew
  {
    id: 'plc-motor-starter',
    title: 'Motor Starter Sequence',
    description: 'Rockwell Logix5000 structured text for a 3-phase motor starter with interlocks and fault handling.',
    category: 'plc',
    crew: 'plc',
    prompt: 'Write a Rockwell Allen-Bradley Logix5000 structured text (ST) program for a 3-phase motor starter control sequence. Include: permissive interlocks (e-stop, thermal overload, door interlock), a timed start sequence with pre-run horn (5 seconds), running feedback verification (within 3 seconds of start command), and a latching fault routine with fault code register. Export as a complete AOI (Add-On Instruction) with documented tags.',
    tags: ['motor', 'starter', 'Logix5000', 'ST'],
  },
  {
    id: 'plc-fault-diag',
    title: 'Fault Diagnostic Routine',
    description: 'PLC routine that logs fault codes, timestamps, and operator-readable messages to a fault buffer.',
    category: 'plc',
    crew: 'plc',
    prompt: 'Design a Rockwell Logix5000 fault diagnostic routine for an industrial machine. The routine should: detect up to 32 distinct fault conditions via discrete input bits, log each fault with a timestamp (using GSV SystemTime) and a 40-character operator message string, maintain a circular fault buffer of the last 20 faults, and expose a FaultReset input that clears the active fault after the condition is resolved. Provide the full structured text and a tag declaration table.',
    tags: ['faults', 'diagnostics', 'logging'],
  },
  {
    id: 'plc-pid-loop',
    title: 'PID Control Loop',
    description: 'Configures a PIDE instruction for process temperature control with setpoint ramping.',
    category: 'plc',
    crew: 'plc',
    prompt: 'Write a Rockwell Logix5000 structured text program that implements a PIDE (Enhanced PID) instruction for process temperature control. Include: analog input scaling from 4-20mA to engineering units (0-500°F), setpoint ramping at a configurable rate (°F/min), output clamping and manual/auto mode switching, and a simple self-tuning trigger based on step response. Provide all PIDE configuration parameters and explain the tuning rationale.',
    tags: ['PID', 'PIDE', 'temperature', 'control'],
  },

  // HMI -- react crew
  {
    id: 'hmi-process-dashboard',
    title: 'Process Overview Dashboard',
    description: 'React/MUI HMI component displaying live process values, status indicators, and alarm counts.',
    category: 'hmi',
    crew: 'react',
    prompt: 'Build a React component using Material UI (MUI) for an industrial process overview dashboard. The component should display: a grid of live analog value cards (value, unit, high/low alarm state), a status strip with discrete I/O indicators, a running alarm count badge, and a last-updated timestamp. Use a dark industrial theme (dark background, white/green/red/amber status colors). The component accepts a `processData` prop that is refreshed externally every second.',
    tags: ['dashboard', 'MUI', 'live values'],
  },
  {
    id: 'hmi-alarm-banner',
    title: 'Alarm Management Banner',
    description: 'Persistent alarm banner with acknowledge, silence, and priority-sorted alarm list.',
    category: 'hmi',
    crew: 'react',
    prompt: 'Create a React/MUI alarm management banner component for an industrial HMI. Requirements: persistent banner at the top of the screen showing active alarm count and highest priority level, expandable alarm list sorted by priority (critical, high, medium, low) then by time, individual acknowledge and silence actions per alarm, a global acknowledge-all button, and color coding (red/orange/yellow/blue by priority). Component accepts an `alarms` array prop and `onAcknowledge` / `onSilence` callbacks.',
    tags: ['alarms', 'MUI', 'acknowledge'],
  },
  {
    id: 'hmi-trend-chart',
    title: 'Real-Time Trend Chart',
    description: 'Recharts-based live trend widget with zoom, pan, and configurable time window.',
    category: 'hmi',
    crew: 'react',
    prompt: 'Develop a real-time trend chart React component for an industrial HMI using Recharts. The component must: display 1 to 4 process variables simultaneously with distinct colors, support configurable time windows (1 min, 5 min, 15 min, 1 hr), show high/low limit reference lines as dashed horizontal lines, support zoom and pan via brush selector, and render smoothly when data is updated at 1-second intervals. Accepts a `series` prop (array of {name, unit, color, data: [{ts, value}]}). Dark theme, no external chart library dependencies beyond Recharts.',
    tags: ['trends', 'Recharts', 'real-time'],
  },

  // Vision -- vision crew
  {
    id: 'vision-defect-report',
    title: 'Defect Classification Report',
    description: 'Analyze Vision_Inspect output and produce a structured defect classification summary.',
    category: 'vision',
    crew: 'vision',
    prompt: 'Analyze the Vision_Inspect output files in the current working directory. Classify all detected defects by type (scratch, dent, contamination, dimensional, color), calculate defect rates per shift and per product SKU, identify the top 3 defect types by frequency and by severity score, and flag any inspection results that show anomalous detection rate trends. Produce a structured markdown report with tables, summary statistics, and recommended threshold adjustments.',
    tags: ['defects', 'classification', 'report'],
  },
  {
    id: 'vision-threshold-tuning',
    title: 'Inspection Threshold Tuning',
    description: 'Review detection thresholds and recommend adjustments to reduce false positives and escapes.',
    category: 'vision',
    crew: 'vision',
    prompt: 'Review the Vision_Inspect configuration and recent inspection logs in the current working directory. Analyze the false positive rate and escape rate for each inspection station. For any station with false positives above 2% or escapes above 0.1%, recommend specific threshold adjustments with supporting data from the logs. Output a tuning recommendation table with: station name, current threshold, recommended threshold, expected false positive reduction, and risk assessment.',
    tags: ['thresholds', 'tuning', 'false positives'],
  },
  {
    id: 'vision-system-status',
    title: 'Vision System Health Report',
    description: 'Comprehensive status report covering camera health, lighting, and throughput metrics.',
    category: 'vision',
    crew: 'vision',
    prompt: 'Generate a comprehensive health and status report for the Vision_Inspect system. Review logs and configuration files in the current working directory. Include: camera uptime and error counts per station, lighting stability metrics, inspection throughput vs. rated throughput, model inference latency distribution, any failed calibration events in the last 30 days, and a prioritized maintenance action list. Format as a structured markdown report suitable for a weekly review meeting.',
    tags: ['health', 'status', 'maintenance'],
  },

  // Safety -- safety crew
  {
    id: 'safety-security-audit',
    title: 'Pre-Deployment Security Audit',
    description: 'Full security and QA review before deploying a service to production.',
    category: 'safety',
    crew: 'safety',
    prompt: 'Perform a pre-deployment security audit on the codebase in the current working directory. Check for: hardcoded secrets or credentials, insecure dependencies (known CVEs), SQL injection and XSS vulnerabilities, authentication and authorization gaps, insecure default configurations, and missing input validation at API boundaries. Produce a risk-ranked findings report with severity (critical/high/medium/low), affected file and line, and a remediation recommendation for each finding.',
    tags: ['security', 'audit', 'CVE'],
  },
  {
    id: 'safety-owasp-scan',
    title: 'OWASP Top 10 Vulnerability Scan',
    description: 'Scan source code for all OWASP Top 10 vulnerability categories.',
    category: 'safety',
    crew: 'safety',
    prompt: 'Scan the source code in the current working directory for vulnerabilities in each OWASP Top 10 category: Broken Access Control, Cryptographic Failures, Injection, Insecure Design, Security Misconfiguration, Vulnerable Components, Authentication Failures, Data Integrity Failures, Logging Failures, and SSRF. For each category, report whether the codebase is affected, the specific location of any issues found, and a concrete remediation step.',
    tags: ['OWASP', 'vulnerabilities', 'scan'],
  },
  {
    id: 'safety-deployment-checklist',
    title: 'Deployment Validation Checklist',
    description: 'Generate a go/no-go deployment checklist tailored to the current project.',
    category: 'safety',
    crew: 'safety',
    prompt: 'Analyze the project in the current working directory and generate a deployment validation checklist. The checklist should cover: environment variable and secret verification, database migration status, dependency version pinning, health check endpoint validation, rollback plan, monitoring and alerting setup, load test results review, and post-deploy smoke test steps. For each item, provide a pass/fail criteria and an owner role (dev, ops, QA). Format as a markdown checklist.',
    tags: ['deployment', 'checklist', 'go/no-go'],
  },

  // Ops -- ops crew
  {
    id: 'ops-api-docs',
    title: 'Generate API Documentation',
    description: 'Write comprehensive API reference documentation from source code and route definitions.',
    category: 'ops',
    crew: 'ops',
    prompt: 'Generate comprehensive API documentation for the project in the current working directory. Discover all API routes and endpoints from the source code. For each endpoint, document: HTTP method and path, request parameters and body schema, response schema and status codes, authentication requirements, and a usage example with curl. Format the output as a structured markdown API reference, with a summary table of all endpoints at the top.',
    tags: ['docs', 'API', 'reference'],
  },
  {
    id: 'ops-memory-consolidation',
    title: 'Memory Consolidation',
    description: 'Review and consolidate agent memory logs into a clean, structured knowledge base.',
    category: 'ops',
    crew: 'ops',
    prompt: 'Review all agent memory files and run logs in the current working directory. Identify duplicate entries, outdated facts, and contradictory information. Consolidate into a clean, structured knowledge base organized by topic (architecture decisions, API contracts, configuration, known issues, lessons learned). Remove ephemeral or task-specific content. Output the consolidated memory as a set of well-organized markdown files, one per topic area.',
    tags: ['memory', 'consolidation', 'knowledge base'],
  },
  {
    id: 'ops-telemetry-report',
    title: 'Telemetry & Performance Report',
    description: 'Analyze run logs and output files to produce a performance and telemetry summary.',
    category: 'ops',
    crew: 'ops',
    prompt: 'Analyze the agent run logs and telemetry output files in the current working directory. Compute: average task completion time per crew type, token usage trends over the last 20 runs, most common error types and their frequency, output file size distribution, and any runs that exceeded 2x the average completion time. Produce a performance report with charts described in markdown table format, a summary of key findings, and three specific recommendations for improving agent throughput.',
    tags: ['telemetry', 'performance', 'analytics'],
  },
]
