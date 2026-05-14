import * as React from 'react'
import { cn } from '../../lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'flex h-9 w-full rounded-lg border border-border bg-elevated px-3 py-2',
        'text-sm text-text-primary placeholder:text-text-dim',
        'focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30',
        'transition-colors duration-150 disabled:opacity-50',
        className
      )}
      {...props}
    />
  )
)
Input.displayName = 'Input'
