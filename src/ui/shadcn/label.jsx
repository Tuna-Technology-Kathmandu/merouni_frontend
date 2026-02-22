import * as React from 'react'
import { cn } from '@/app/lib/utils'

const Label = React.forwardRef(({ className, required, children, ...props }, ref) => {
  return (
    <label
      ref={ref}
      className={cn(
        'text-[13px] font-bold text-slate-800 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block transition-colors',
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
