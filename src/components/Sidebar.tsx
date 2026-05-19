import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LayoutDashboard, Play, FolderOpen, Sparkles } from 'lucide-react'
import { cn } from '../lib/utils'
import { useStore } from '../store'

const NAV = [
  { to: '/',             icon: LayoutDashboard, label: 'Dashboard'  },
  { to: '/run/new',      icon: Play,            label: 'New Run'    },
  { to: '/marketplace',  icon: Sparkles,        label: 'Templates'  },
  { to: '/files',        icon: FolderOpen,      label: 'Files'      },
]

export function Sidebar() {
  const runs  = useStore((s) => s.runs)
  const active = Object.values(runs).filter((r) => r.status === 'running' || r.status === 'starting').length

  return (
    <aside className="relative z-10 flex flex-col w-56 bg-surface/80 backdrop-blur-sm border-r border-border h-full shrink-0">
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-border">
        <svg width="28" height="28" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect width="32" height="32" rx="7" fill="#06060f"/>
          <text x="16" y="22" textAnchor="middle" fontFamily="'Space Grotesk', 'Inter', system-ui, sans-serif" fontSize="14" fontWeight="700" letterSpacing="-0.5" fill="#22d3ee">SA</text>
        </svg>
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
