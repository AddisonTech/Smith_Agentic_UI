import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Run {
  run_id:    string
  crew:      string
  goal:      string
  status:    'starting' | 'running' | 'completed' | 'error' | 'cancelled'
  output:    string[]
  files:     string[]
  startedAt: number
  endedAt?:  number
}

interface SystemState {
  online:       boolean
  ollama:       boolean
  models:       string[]
  crewDefaults: Record<string, string>
  lastChecked:  number
}

interface Store {
  system: SystemState
  runs:   Record<string, Run>

  setSystem:     (s: Partial<SystemState>) => void
  upsertRun:     (run: Partial<Run> & { run_id: string }) => void
  appendOutput:  (run_id: string, line: string) => void
  finalizeRun:   (run_id: string, status: string, files: string[]) => void
  clearRuns:     () => void
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      system: {
        online:       false,
        ollama:       false,
        models:       [],
        crewDefaults: {},
        lastChecked:  0,
      },
      runs: {},

      setSystem: (s) =>
        set((state) => ({ system: { ...state.system, ...s, lastChecked: Date.now() } })),

      upsertRun: (run) =>
        set((state) => {
          const existing = state.runs[run.run_id]
          const merged: Run = {
            run_id:    run.run_id,
            crew:      run.crew      ?? existing?.crew      ?? '',
            goal:      run.goal      ?? existing?.goal      ?? '',
            status:    run.status    ?? existing?.status    ?? 'starting',
            output:    run.output    ?? existing?.output    ?? [],
            files:     run.files     ?? existing?.files     ?? [],
            startedAt: run.startedAt ?? existing?.startedAt ?? Date.now(),
            endedAt:   run.endedAt   ?? existing?.endedAt,
          }
          return { runs: { ...state.runs, [run.run_id]: merged } }
        }),

      appendOutput: (run_id, line) =>
        set((state) => {
          const existing = state.runs[run_id]
          if (!existing) return state
          return {
            runs: {
              ...state.runs,
              [run_id]: { ...existing, output: [...existing.output, line] },
            },
          }
        }),

      finalizeRun: (run_id, status, files) =>
        set((state) => {
          const existing = state.runs[run_id]
          if (!existing) return state
          return {
            runs: {
              ...state.runs,
              [run_id]: {
                ...existing,
                status: status as Run['status'],
                files,
                endedAt: Date.now(),
              },
            },
          }
        }),

      clearRuns: () => set({ runs: {} }),
    }),
    {
      name: 'smith-agentic-store',
      partialize: (state) => ({ runs: state.runs }),
    }
  )
)
