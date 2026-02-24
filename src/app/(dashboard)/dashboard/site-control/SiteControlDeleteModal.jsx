'use client'
import React, { useState } from 'react'
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogClose } from '@/ui/shadcn/dialog'
import { Button } from '@/ui/shadcn/button'
import { deleteSiteConfig } from '../../../actions/siteConfigActions'
import { toast } from 'react-toastify'
import { AlertCircle } from 'lucide-react'
import { CONFIG_TYPES } from './siteControlConstants'

export default function SiteControlDeleteModal({ isOpen, onClose, onSuccess, config }) {
    const [deleting, setDeleting] = useState(false)

    const handleDelete = async () => {
        if (!config) return

        setDeleting(true)
        try {
            await deleteSiteConfig(config.type)
            const label = CONFIG_TYPES.find(ct => ct.value === config.type)?.label || config.type
            toast.success(`Configuration for "${label}" deleted successfully`)
            onSuccess && onSuccess()
            onClose()
        } catch (error) {
            toast.error('Failed to delete configuration')
        } finally {
            setDeleting(false)
        }
    }

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            className='max-w-md'
        >
            <DialogContent className='max-w-md p-0 overflow-hidden'>
                <DialogHeader className='px-6 py-4 border-b bg-red-50/50'>
                    <DialogTitle className="text-lg font-semibold text-red-900 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        Delete Configuration
                    </DialogTitle>
                    <DialogClose onClick={onClose} />
                </DialogHeader>

                <div className='p-6'>
                    <div className="space-y-3">
                        <p className="text-slate-700">
                            Are you sure you want to delete the configuration <span className="font-bold underline decoration-red-200">{config?.type}</span>?
                        </p>
                        <p className="text-sm text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
                            This action is permanent and cannot be undone. This may affect site functionality.
                        </p>
                    </div>
                </div>

                <div className='bg-slate-50 px-6 py-4 flex justify-end gap-3 border-t'>
                    <Button
                        type='button'
                        variant='outline'
                        onClick={onClose}
                        disabled={deleting}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="bg-red-600 hover:bg-red-700 text-white min-w-[100px]"
                    >
                        {deleting ? 'Deleting...' : 'Delete Permanently'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

