import * as React from 'react'
import { cn } from '@/app/lib/utils'

const Label = React.forwardRef(({ className, required, children, ...props }, ref) => {
  return (
    <label
      ref={ref}
      className={cn(
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className
      )}
      {...props}
    >
      {children}
      {required && <span className='text-red-500 ml-1'>*</span>}
    </label>
  )
})
Label.displayName = 'Label'

export { Label }
