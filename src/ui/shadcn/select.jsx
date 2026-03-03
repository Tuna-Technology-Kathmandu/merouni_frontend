import * as React from 'react'
import { cn } from '@/app/lib/utils'

const Select = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <select
      className={cn(
        'flex h-10 w-full rounded-md border border-gray-200 bg-background px-3 py-2 text-sm transition-colors duration-200 focus:outline-none focus:border-[#387cae] disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </select>
  )
})
Select.displayName = 'Select'

export { Select }