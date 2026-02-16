import * as React from 'react'
import { X } from 'lucide-react'
import { cn } from '@/app/lib/utils'

const Dialog = React.forwardRef(
  ({ isOpen, onClose, children, className, ...props }, ref) => {
    React.useEffect(() => {
      const originalStyle = window.getComputedStyle(document.body).overflow
      const originalPaddingRight = document.body.style.paddingRight

      if (isOpen) {
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
        document.body.style.paddingRight = `${scrollbarWidth}px`
        document.body.style.overflow = 'hidden'
      }

      return () => {
        document.body.style.overflow = originalStyle
        document.body.style.paddingRight = originalPaddingRight
      }
    }, [isOpen])

    if (!isOpen) return null

    return (
      <div
        className='fixed inset-0 z-50 flex items-center justify-center p-4'
        {...props}
      >
        <div className='fixed inset-0 bg-black/50' onClick={onClose} />
        <div
          ref={ref}
          className={cn(
            'relative z-50 w-full max-w-lg rounded-lg border bg-background shadow-lg max-h-[90vh] flex flex-col',
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
      'flex flex-col space-y-1.5 text-center sm:text-left px-6 pt-6 pb-4 border-b border-gray-100',
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
    <div
      ref={ref}
      className={cn(
        'overflow-y-auto px-6 py-4',
        'scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent',
        'hover:scrollbar-thumb-gray-400',
        '[&::-webkit-scrollbar]:w-2',
        '[&::-webkit-scrollbar-track]:bg-transparent',
        '[&::-webkit-scrollbar-thumb]:bg-gray-300',
        '[&::-webkit-scrollbar-thumb]:rounded-full',
        '[&::-webkit-scrollbar-thumb]:opacity-0',
        'hover:[&::-webkit-scrollbar-thumb]:opacity-100',
        '[&::-webkit-scrollbar-thumb]:transition-opacity',
        className
      )}
      {...props}
    >
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
        'absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-[#387cae] focus:ring-offset-2',
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
