'use client'

import { formatDate } from '@/utils/date.util'
import { Eye, Trash2, SquarePen } from 'lucide-react'

export const createColumns = ({ handleView, handleDelete, handleStatusUpdate }) => [
    {
        header: 'Full Name',
        accessorKey: 'fullname',
        cell: ({ row }) => <span className="font-medium">{row.original.fullname || row.original.fullName}</span>
    },
    {
        header: 'Email',
        accessorKey: 'email',
    },
    {
        header: 'Subject',
        accessorKey: 'subject',
        cell: ({ getValue }) => (
            <span className="truncate max-w-[200px] block" title={getValue()}>
                {getValue()}
            </span>
        )
    },
    {
        header: 'Date',
        accessorKey: 'createdAt',
        cell: ({ getValue }) => getValue() ? formatDate(getValue()) : '-'
    },
    {
        header: 'Status',
        accessorKey: 'status',
        cell: ({ getValue }) => {
            const status = getValue() || 'new'
            const colors = {
                new: 'bg-blue-100 text-blue-800',
                in_progress: 'bg-yellow-100 text-yellow-800',
                resolved: 'bg-green-100 text-green-800'
            }
            return (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase ${colors[status] || 'bg-gray-100'}`}>
                    {status.replace('_', ' ')}
                </span>
            )
        }
    },
    {
        header: 'Actions',
        id: 'actions',
        cell: ({ row }) => (
            <div className='flex gap-2 justify-end'>
                <button
                    onClick={() => handleStatusUpdate(row.original)}
                    className='p-1 hover:bg-blue-50 rounded-md text-blue-600 transition-colors'
                    title='Update Status'
                >
                    <SquarePen size={18} />
                </button>
                <button
                    onClick={() => handleView(row.original)}
                    className='p-1 hover:bg-gray-100 rounded-md text-gray-600 transition-colors'
                    title='View Details'
                >
                    <Eye size={18} />
                </button>
                <button
                    onClick={() => handleDelete(row.original.id)}
                    className='p-1 hover:bg-red-50 rounded-md text-red-500 transition-colors'
                    title='Delete Message'
                >
                    <Trash2 size={18} />
                </button>
            </div>
        )
    }
]
