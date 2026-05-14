import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { StatusIndicator } from './StatusIndicator'

export function Layout() {
  return (
    <div className="flex h-full bg-base overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
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
