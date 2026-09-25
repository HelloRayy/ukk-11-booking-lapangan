import * as React from 'react'
import { cn } from '../../lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'gold'
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variantStyles = {
    default: 'border-transparent bg-emerald-600 text-white',
    secondary: 'border-transparent bg-[#262626] text-white',
    destructive: 'border-rose-500/20 bg-rose-500/10 text-rose-400',
    outline: 'border-[#262626] bg-white/5 text-[#fafafa]',
    success: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400',
    warning: 'border-amber-500/20 bg-amber-500/10 text-amber-300',
    gold: 'border-[#f2d953]/20 bg-[#f2d953]/10 text-[#f2d953]',
  }

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-medium transition-colors',
        variantStyles[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
