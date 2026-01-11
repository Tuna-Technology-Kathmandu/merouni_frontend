import * as React from 'react'
import { X } from 'lucide-react'
import { cn } from '@/app/lib/utils'

const Dialog = React.forwardRef(
  ({ isOpen, onClose, children, className, ...props }, ref) => {
    if (!isOpen) return null

    return (
      <div
        className='fixed inset-0 z-50 flex items-center justify-center'
        {...props}
      >
        <div className='fixed inset-0 bg-black/50' onClick={onClose} />
        <div
          ref={ref}
          className={cn(
            'relative z-50 w-full max-w-lg rounded-lg border bg-background p-6 shadow-lg',
            className
          )}
        >
          {children}
        </div>
      </div>
    )
  }
)
Dialog.displayName = 'Dialog'

const DialogHeader = ({ className, ...props }) => (
  <div
    className={cn(
      'flex flex-col space-y-1.5 text-center sm:text-left mb-4',
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = 'DialogHeader'

const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      'text-lg font-semibold leading-none tracking-tight',
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = 'DialogTitle'

const DialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))
DialogDescription.displayName = 'DialogDescription'

const DialogContent = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('', className)} {...props}>
      {children}
    </div>
  )
)
DialogContent.displayName = 'DialogContent'

const DialogFooter = ({ className, ...props }) => (
  <div
    className={cn(
      'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4',
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = 'DialogFooter'

const DialogClose = React.forwardRef(
  ({ className, onClick, ...props }, ref) => (
    <button
      ref={ref}
      type='button'
      className={cn(
        'absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        className
      )}
      onClick={onClick}
      {...props}
    >
      <X className='h-4 w-4' />
      <span className='sr-only'>Close</span>
    </button>
  )
)
DialogClose.displayName = 'DialogClose'

export {
  Dialog,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogContent,
  DialogClose
}
