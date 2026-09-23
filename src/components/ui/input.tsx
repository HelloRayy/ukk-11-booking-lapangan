import * as React from 'react'
import { cn } from '../../lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-8 w-full rounded-md border border-[oklch(0.2593_0.0033_230.84)] bg-[oklch(0.16_0.002_230.81)] px-3 py-1 text-xs text-[oklch(0.9235_0.001733_230.685)] shadow-xs transition-colors file:border-0 file:bg-transparent file:text-xs file:font-medium placeholder:text-[oklch(0.55_0.002_230.81)] focus:outline-none focus:border-[oklch(0.35_0.0033_230.84)] disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
