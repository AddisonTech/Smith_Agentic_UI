import * as React from 'react'
import { cn } from '../../lib/utils'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'flex w-full rounded-lg border border-border bg-elevated px-3 py-2.5',
        'text-sm text-text-primary placeholder:text-text-dim',
        'focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30',
        'transition-colors duration-150 resize-none disabled:opacity-50',
        className
      )}
      {...props}
    />
  )
)
Textarea.displayName = 'Textarea'
