import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LayoutDashboard, Play, FolderOpen, Zap } from 'lucide-react'
import { cn } from '../lib/utils'
import { useStore } from '../store'

const NAV = [
  { to: '/',         icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/run/new',  icon: Play,            label: 'New Run'   },
  { to: '/files',    icon: FolderOpen,      label: 'Files'     },
]

export function Sidebar() {
  const runs  = useStore((s) => s.runs)
  const active = Object.values(runs).filter((r) => r.status === 'running' || r.status === 'starting').length

  return (
    <aside className="relative z-10 flex flex-col w-56 bg-surface/80 backdrop-blur-sm border-r border-border h-full shrink-0">
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-border">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent/20 to-violet/20 border border-accent/30">
          <Zap className="h-4 w-4 text-accent" />
        </div>
        <span className="font-display text-sm font-semibold tracking-tight">
          Smith<span className="text-text-dim">_</span><span className="gradient-text">Agentic</span>
        </span>
      </div>

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'}>
            {({ isActive }) => (
              <motion.div
                whileHover={{ x: 2 }}
                transition={{ duration: 0.1 }}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors duration-150 select-none cursor-pointer',
                  isActive
                    ? 'bg-accent/10 text-accent border border-accent/20'
                    : 'text-text-muted hover:bg-elevated hover:text-text-primary'
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{label}</span>
                {label === 'Dashboard' && active > 0 && (
                  <span className="ml-auto flex h-4 w-4 items-center justify-center rounded-full bg-accent/20 text-[10px] font-semibold text-accent">
                    {active}
                  </span>
                )}
              </motion.div>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <p className="eyebrow text-center opacity-40">localhost:8765</p>
      </div>
    </aside>
  )
}
