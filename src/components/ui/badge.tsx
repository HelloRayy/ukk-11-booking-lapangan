import * as React from 'react'
import { cn } from '../../lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variantStyles = {
    default: 'border-transparent bg-white text-black hover:bg-white/80',
    secondary: 'border-transparent bg-[#22242a] text-[#ededed] hover:bg-[#22242a]/80',
    destructive: 'border-[#e5484d]/30 bg-[#e5484d]/10 text-[#e5484d]',
    outline: 'border-[#22242a] text-[#8a8f98]',
    success: 'border-[#2b593f] bg-[#1d3527]/50 text-[#38c793]',
    warning: 'border-[#f1a83b]/30 bg-[#f1a83b]/10 text-[#f1a83b]',
  }

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-ring',
        variantStyles[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
