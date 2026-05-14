import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border',
  {
    variants: {
      variant: {
        starting:  'bg-starting/10 border-starting/30 text-starting',
        running:   'bg-running/10 border-running/30 text-running',
        completed: 'bg-success/10 border-success/30 text-success',
        error:     'bg-error/10 border-error/30 text-error',
        default:   'bg-elevated border-border text-text-muted',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  pulse?: boolean
}

export function Badge({ className, variant, pulse, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {pulse && (
        <span className={cn(
          'h-1.5 w-1.5 rounded-full',
          variant === 'running'   && 'bg-running animate-pulse-slow',
          variant === 'starting'  && 'bg-starting animate-pulse-slow',
          variant === 'completed' && 'bg-success',
          variant === 'error'     && 'bg-error',
        )} />
      )}
      {children}
    </div>
  )
}
