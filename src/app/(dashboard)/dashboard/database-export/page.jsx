'use client'

import { usePageHeading } from '@/contexts/PageHeadingContext'
import ActionCard from '@/ui/molecules/ActionCard'
import { Button } from '@/ui/shadcn/button'
import { Database, Download, ShieldAlert } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import { exportDatabase } from '../../../actions/databaseActions'
import { THEME_BLUE } from '@/constants/constants'

export default function DatabaseExportPage() {
    const { setHeading } = usePageHeading()
    const [isExporting, setIsExporting] = useState(false)

    useEffect(() => {
        setHeading('Database Export')
        return () => setHeading(null)
    }, [setHeading])

    const handleExport = async () => {
        setIsExporting(true)
        try {
            await exportDatabase()
            toast.success('Database export started successfully.')
        } catch (error) {
            console.error(error)
            toast.error(error.message || 'Failed to export database. Please try again.')
        } finally {
            setIsExporting(false)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
            <ToastContainer />
            <ActionCard
                variant="centered"
                icon={<Database className="w-12 h-12" />}
                title="Database Backup & Export"
                description={
                    <div className="space-y-4">
                        <p>
                            Generate a complete export of the system database. This will download a
                            <span className="font-bold"> .sql </span> file containing all current database records.
                        </p>
                        <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg border border-amber-100 text-left">
                            <ShieldAlert className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
                            <div className="text-sm text-amber-800">
                                <p className="font-semibold mb-1">Security Warning</p>
                                <p>Database exports contain sensitive information. Please ensure this file is stored securely and handled only by authorized personnel.</p>
                            </div>
                        </div>
                    </div>
                }
            >
                <Button
                    size="lg"
                    onClick={handleExport}
                    disabled={isExporting}
                    className="w-full sm:w-auto px-8"
                    style={{ backgroundColor: THEME_BLUE }}
                >
                    {isExporting ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Generating Export...
                        </>
                    ) : (
                        <>
                            <Download className="w-5 h-5 mr-2" />
                            Download SQL Dump
                        </>
                    )}
                </Button>
            </ActionCard>

            <div className="mt-12 text-center text-gray-500 text-sm max-w-lg">
                <p>
                    This tool connects to the production database and generates a dump.
                    Depending on the database size, this might take a few moments.
                </p>
            </div>
        </div>
    )
}
