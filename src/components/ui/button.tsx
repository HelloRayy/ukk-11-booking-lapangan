import * as React from 'react'
import { cn } from '../../lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'emerald' | 'gold'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const variantStyles = {
      default: 'bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-xs active:scale-95',
      destructive: 'bg-rose-600 hover:bg-rose-500 text-white font-semibold shadow-xs active:scale-95',
      outline: 'border border-[oklch(0.2593_0.0033_230.84)] bg-[oklch(0.1932_0.002_230.81)] hover:bg-white/10 text-[oklch(0.9235_0.001733_230.685)]',
      secondary: 'bg-[oklch(0.2593_0.0033_230.84)] text-white hover:bg-white/20',
      ghost: 'hover:bg-white/10 text-[oklch(0.65_0.002_230.81)] hover:text-white',
      link: 'text-emerald-400 underline-offset-4 hover:underline',
      emerald: 'bg-emerald-600 hover:bg-emerald-500 text-white font-semibold active:scale-95',
      gold: 'bg-[#f2d953] hover:bg-[#e2ca48] text-black font-semibold active:scale-95',
    }

    const sizeStyles = {
      default: 'h-8 px-3 py-1.5 text-xs rounded-md',
      sm: 'h-7 rounded-md px-2.5 text-[11px]',
      lg: 'h-10 rounded-md px-6 text-sm',
      icon: 'h-7 w-7 rounded-md p-0 flex items-center justify-center',
    }

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-1.5 whitespace-nowrap font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button }
