import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { StatusIndicator } from './StatusIndicator'

export function Layout() {
  return (
    <div className="relative flex h-full bg-base overflow-hidden">
      {/* Animated background */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-[-180px] right-[-100px] h-[520px] w-[520px] rounded-full bg-accent opacity-[0.10] blur-[100px] animate-float-slow" />
        <div className="absolute bottom-[-160px] left-[-120px] h-[460px] w-[460px] rounded-full bg-violet opacity-[0.10] blur-[100px] animate-float-slow-r" />
        <div className="absolute inset-0 grid-pattern" />
      </div>

      <Sidebar />

      <div className="relative z-10 flex flex-col flex-1 min-w-0 overflow-hidden">
        <header className="flex items-center justify-end gap-3 px-6 py-3.5 border-b border-border bg-surface/50 backdrop-blur-sm shrink-0">
          <StatusIndicator />
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
