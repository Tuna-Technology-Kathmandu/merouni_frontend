import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Loader2 } from 'lucide-react'
import {
    Dialog,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from '@/ui/shadcn/dialog'
import { cn } from '@/app/lib/utils'

const ConfirmationDialog = ({
    open,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel'
}) => {
    const [isLoading, setIsLoading] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const handleConfirm = async () => {
        try {
            setIsLoading(true)
            await onConfirm()
        } catch (error) {
            console.error('Confirmation failed:', error)
            setIsLoading(false)
        }
    }

    if (!mounted) return null

    return createPortal(
        <Dialog isOpen={open} onClose={!isLoading ? onClose : undefined} style={{ zIndex: 9999 }}>
            <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>{message}</DialogDescription>
            </DialogHeader>

            <DialogFooter className='px-6 pb-6'>
                <button
                    type='button'
                    onClick={onClose}
                    disabled={isLoading}
                    className={cn(
                        'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
                        'border border-input hover:bg-accent hover:text-accent-foreground',
                        'h-10 py-2 px-4 mt-2 sm:mt-0'
                    )}
                >
                    {cancelText}
                </button>
                <button
                    type='button'
                    onClick={handleConfirm}
                    disabled={isLoading}
                    className={cn(
                        'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
                        'bg-destructive text-destructive-foreground hover:bg-destructive/90',
                        'bg-red-600 text-white hover:bg-red-700', 
                        'h-10 py-2 px-4'
                    )}
                >
                    {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                    {confirmText}
                </button>
            </DialogFooter>
        </Dialog>,
        document.body
    )
}

export default ConfirmationDialog
