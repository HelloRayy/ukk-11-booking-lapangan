import * as React from 'react'
import { cn } from '../../lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'emerald'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const variantStyles = {
      default: 'bg-white text-black hover:bg-[#ededed] shadow-xs font-semibold',
      destructive: 'bg-[#e5484d] text-white hover:bg-[#e5484d]/90 shadow-xs font-semibold',
      outline: 'border border-[#22242a] bg-[#131417] hover:bg-[#1a1b20] text-[#ededed] hover:text-white',
      secondary: 'bg-[#22242a] text-[#ededed] hover:bg-[#2a2d34]',
      ghost: 'hover:bg-[#1e2025] text-[#8a8f98] hover:text-[#ededed]',
      link: 'text-[#3b82f6] underline-offset-4 hover:underline',
      emerald: 'bg-[#1d3527] text-[#38c793] border border-[#2b593f] hover:bg-[#234632]',
    }

    const sizeStyles = {
      default: 'h-8 px-3.5 py-1.5 text-xs',
      sm: 'h-7 rounded-md px-2.5 text-[11px]',
      lg: 'h-10 rounded-md px-6 text-sm',
      icon: 'h-6 w-6 rounded-md p-0 flex items-center justify-center',
    }

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
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
