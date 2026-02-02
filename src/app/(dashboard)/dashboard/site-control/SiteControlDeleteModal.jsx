'use client'
import React, { useState } from 'react'
import { Modal } from '../../../../ui/molecules/Modal'
import { Button } from '@/ui/shadcn/button'
import { deleteSiteConfig } from '../../../actions/siteConfigActions'
import { toast } from 'react-toastify'

export default function SiteControlDeleteModal({ isOpen, onClose, onSuccess, config }) {
    const [deleting, setDeleting] = useState(false)

    const handleDelete = async () => {
        if (!config) return

        setDeleting(true)
        try {
            await deleteSiteConfig(config.type)
            toast.success('Configuration deleted successfully')
            onSuccess && onSuccess()
            onClose()
        } catch (error) {
            toast.error('Failed to delete configuration')
        } finally {
            setDeleting(false)
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title='Delete Configuration'
        >
            <div className="space-y-4">
                <p>Are you sure you want to delete the configuration <strong>{config?.type}</strong>?</p>
                <p className="text-sm text-gray-500">This action cannot be undone.</p>

                <div className='flex justify-end gap-2 mt-4'>
                    <button
                        onClick={onClose}
                        className='px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors'
                        disabled={deleting}
                    >
                        Cancel
                    </button>
                    <Button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="bg-red-600 hover:bg-red-700 text-white"
                    >
                        {deleting ? 'Deleting...' : 'Delete'}
                    </Button>
                </div>
            </div>
        </Modal>
    )
}
