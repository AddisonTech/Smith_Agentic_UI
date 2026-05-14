import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-all duration-150 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40 select-none',
  {
    variants: {
      variant: {
        default:  'bg-gradient-to-r from-accent to-violet text-base border-transparent shadow-[0_4px_14px_rgba(34,211,238,0.22)] hover:brightness-110 hover:shadow-[0_6px_20px_rgba(34,211,238,0.32)]',
        outline:  'border border-border-bright bg-transparent hover:bg-elevated hover:border-accent/30 text-text-primary',
        ghost:    'bg-transparent hover:bg-elevated text-text-muted hover:text-text-primary',
        danger:   'bg-error/10 hover:bg-error/20 border border-error/30 text-error',
        success:  'bg-success/10 hover:bg-success/20 border border-success/30 text-success',
      },
      size: {
        sm:   'h-7 px-3 text-xs',
        md:   'h-9 px-4',
        lg:   'h-11 px-6 text-base',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size:    'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
)
Button.displayName = 'Button'
