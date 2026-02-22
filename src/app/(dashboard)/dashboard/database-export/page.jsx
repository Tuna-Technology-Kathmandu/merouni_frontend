'use client'

import { usePageHeading } from '@/contexts/PageHeadingContext'
import { Button } from '@/ui/shadcn/button'
import {
    Database,
    Download,
    Clock,
    FileText,
    Search,
    RefreshCw,
    Activity,
    Server,
    HardDrive,
    Calendar
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import { exportDatabase } from '../../../actions/databaseActions'
import { THEME_BLUE } from '@/constants/constants'
import { authFetch } from '@/app/utils/authFetch'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export default function DatabaseExportPage() {
    const { setHeading } = usePageHeading()
    const [isExporting, setIsExporting] = useState(false)
    const [history, setHistory] = useState([])
    const [isLoadingHistory, setIsLoadingHistory] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [dbStatus, setDbStatus] = useState(null)
    const [isStatusLoading, setIsStatusLoading] = useState(true)

    useEffect(() => {
        setHeading('Database Export')
        fetchDownloadHistory()
        fetchDbStatus()
        return () => setHeading(null)
    }, [setHeading])

    const fetchDbStatus = async () => {
        setIsStatusLoading(true)
        try {
            const response = await authFetch(`${process.env.baseUrl}/database/status`)
            const data = await response.json()
            setDbStatus(data.data || data)
        } catch (error) {
            console.error('Error fetching DB status:', error)
        } finally {
            setIsStatusLoading(false)
        }
    }

    const fetchDownloadHistory = async () => {
        if (!isLoadingHistory) setIsLoadingHistory(true)
        try {
            const response = await authFetch(`${process.env.baseUrl}/database/downloads`)
            const data = await response.json()
            setHistory(Array.isArray(data.data) ? data.data : [])
        } catch (error) {
            console.error('Error fetching history:', error)
        } finally {
            setIsLoadingHistory(false)
        }
    }

    const handleExport = async () => {
        setIsExporting(true)
        try {
            await exportDatabase()
            toast.success('Backup generated and downloaded')
            setTimeout(fetchDownloadHistory, 1500)
        } catch (error) {
            toast.error(error.message || "Export failed")
        } finally {
            setIsExporting(false)
        }
    }

    const filteredHistory = history.filter(item =>
        item.fileName?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="p-6 w-full space-y-8 max-w-[1400px] mx-auto">
            <ToastContainer />

            {/* Top Action Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-white p-7 rounded-2xl border border-gray-100 shadow-sm">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-3">
                        <Database className="text-blue-600" size={24} />
                        Database Export
                    </h2>
                    <p className="text-sm text-gray-500 mt-1.5 font-medium leading-relaxed">
                        Create and download a full SQL snapshot of your production data for local backup or system recovery.
                    </p>
                </div>
                <Button
                    onClick={handleExport}
                    disabled={isExporting}
                    className="flex items-center gap-2.5 px-6 h-12 text-sm font-semibold transition-all active:scale-95"
                >
                    {isExporting ? (
                        <RefreshCw className="animate-spin h-4 w-4" />
                    ) : (
                        <Download size={18} />
                    )}
                    {isExporting ? 'Generating Backup...' : 'Export Database'}
                </Button>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                    { label: 'System Status', value: dbStatus?.status, icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Database Name', value: dbStatus?.name, icon: Server, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Used Storage', value: dbStatus?.size, icon: HardDrive, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                    { label: 'Total Uptime', value: dbStatus?.uptime || '99.9%', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 transition-hover hover:border-blue-100">
                        <div className={`w-11 h-11 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color}`}>
                            <stat.icon size={22} />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-400 mb-0.5">{stat.label}</p>
                            <p className="text-base font-semibold text-gray-900">
                                {isStatusLoading ? <span className="inline-block w-16 h-4 bg-gray-50 animate-pulse rounded"></span> : (stat.value || '---')}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Content Section */}
            <div className="space-y-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <h3 className="text-lg font-semibold text-gray-900 tracking-tight">Recent Exports History</h3>
                    <div className="relative w-full sm:w-72">
                    </div>
                </div>

                <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[#FBFCFE] border-b border-gray-100">
                                <tr>
                                    <th className="px-7 py-4.5 text-[13px] font-semibold text-gray-600">File Name</th>
                                    <th className="px-7 py-4.5 text-[13px] font-semibold text-gray-600">Relative Time</th>
                                    <th className="px-7 py-4.5 text-[13px] font-semibold text-gray-600 text-right">Exact Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {isLoadingHistory ? (
                                    [...Array(3)].map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td className="px-7 py-5"><div className="h-5 bg-gray-50 rounded w-64 mb-2"></div><div className="h-3 bg-gray-50 rounded w-20"></div></td>
                                            <td className="px-7 py-5"><div className="h-4 bg-gray-50 rounded w-28"></div></td>
                                            <td className="px-7 py-5"><div className="h-4 bg-gray-50 rounded w-24 ml-auto"></div></td>
                                        </tr>
                                    ))
                                ) : filteredHistory.length > 0 ? (
                                    filteredHistory.map((item, index) => (
                                        <tr key={index} className="hover:bg-[#F8FAFF] transition-colors group">
                                            <td className="px-7 py-5">
                                                <div className="flex gap-4">
                                                    <div className="shrink-0 w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-100 transition-all">
                                                        <FileText size={18} />
                                                    </div>
                                                    <div className="flex flex-col justify-center">
                                                        <p className="text-[14px] font-semibold text-gray-900 mb-0.5 line-clamp-1 max-w-[300px]" title={item.fileName}>
                                                            {item.fileName}
                                                        </p>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-tight bg-blue-50 px-1.5 py-0.5 rounded leading-none border border-blue-100/50">
                                                                {item.downloadType || 'SQL'}
                                                            </span>
                                                            <span className="text-[11px] font-medium text-gray-400">Production Backup</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-7 py-5">
                                                <div className="flex items-center gap-2 text-gray-600 text-[13px] font-medium">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 opacity-60"></div>
                                                    {dayjs(item.createdAt).fromNow()}
                                                </div>
                                            </td>
                                            <td className="px-7 py-5 text-right">
                                                <div className="flex flex-col items-end">
                                                    <p className="text-[13px] font-semibold text-gray-800 flex items-center gap-1.5">
                                                        <Calendar size={13} className="text-gray-400" />
                                                        {dayjs(item.createdAt).format('MMM D, YYYY')}
                                                    </p>
                                                    <p className="text-[12px] text-gray-400 font-medium tabular-nums mt-0.5">
                                                        {dayjs(item.createdAt).format('hh:mm:ss A')}
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="px-7 py-16 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                                                    <Database size={24} />
                                                </div>
                                                <p className="text-sm font-medium text-gray-500">No export history logs available.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
