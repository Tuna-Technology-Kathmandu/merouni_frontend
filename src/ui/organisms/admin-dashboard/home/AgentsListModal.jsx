import React, { useEffect, useState } from 'react'
import Table from '@/ui/shadcn/DataTable'
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogClose } from '@/ui/shadcn/dialog'
import { authFetch } from '@/app/utils/authFetch'

const AgentsListModal = ({ isOpen, onClose }) => {
    const [agents, setAgents] = useState([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const pageSize = 10

    useEffect(() => {
        if (isOpen) {
            loadAgents()
        }
    }, [isOpen])

    const loadAgents = async () => {
        setLoading(true)
        try {
            const res = await authFetch(
                `${process.env.baseUrl}/referral/top-agents?limit=100`,
                { cache: 'no-store' }
            )
            if (res.ok) {
                const json = await res.json()
                setAgents(json.data?.topAgents || [])
                setCurrentPage(1)
            }
        } catch (error) {
            console.error('Error loading top agents:', error)
        } finally {
            setLoading(false)
        }
    }

    const paginatedAgents = React.useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize
        return agents.slice(startIndex, startIndex + pageSize)
    }, [agents, currentPage])

    const totalPages = Math.ceil(agents.length / pageSize)

    const columns = [
        {
            header: 'Rank',
            accessorKey: 'rank',
            cell: ({ row }) => (
                <span className='inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-semibold text-sm'>
                    {(currentPage - 1) * pageSize + row.index + 1}
                </span>
            )
        },
        {
            header: 'Agent Name',
            accessorKey: 'agent.fullName',
            cell: ({ row }) => (
                <div className="font-medium text-gray-900">
                    {row.original.agent?.fullName || 'Unknown Agent'}
                </div>
            )
        },
        {
            header: 'Email',
            accessorKey: 'agent.email',
            cell: ({ row }) => row.original.agent?.email || '-'
        },
        {
            header: 'Referrals',
            accessorKey: 'referralCount',
            cell: ({ row }) => <div className="text-right">{row.original.referralCount}</div>
        },
        {
            header: 'Total Score',
            accessorKey: 'totalScore',
            cell: ({ row }) => (
                <div className="text-right">
                    <span className='inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800'>
                        {row.original.totalScore} pts
                    </span>
                </div>
            )
        }
    ]

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            className="max-w-4xl"
        >
            <DialogHeader>
                <DialogTitle>Top Performing Agents</DialogTitle>
                <DialogClose onClick={onClose} />
            </DialogHeader>
            <DialogContent>
                <div className="mt-4">
                    <Table
                        data={paginatedAgents}
                        columns={columns}
                        loading={loading}
                        pagination={{
                            currentPage: currentPage,
                            totalPages: totalPages,
                            total: agents.length
                        }}
                        onPageChange={(page) => setCurrentPage(page)}
                        showSearch={false}
                        emptyContent="No agents found."
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default AgentsListModal
