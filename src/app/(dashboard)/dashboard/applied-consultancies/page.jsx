'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import { fetchStudentConsultancyApplications } from './actions'
import {
  Handshake,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  ExternalLink
} from 'lucide-react'
import Loading from '@/ui/molecules/Loading'
import EmptyState from '@/ui/shadcn/EmptyState'
import Table from '@/ui/molecules/Table'
import { Button } from '@/ui/shadcn/button'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { destr } from 'destr'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const AppliedConsultanciesPage = () => {
  const { setHeading, setSubheading } = usePageHeading()
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  })

  const rawRole = useSelector((state) => state.user?.data?.roles || state.user?.data?.role)
  const role =
    typeof rawRole === 'string' ? destr(rawRole) || {} : rawRole || {}

  const isStudentOnly = role?.student && !role?.admin && !role?.editor

  useEffect(() => {
    setHeading({
      heading: 'Applied Consultancies',
      subheading: 'View and track your expert consultation requests'
    })
    return () => {
      setHeading(null)
      setSubheading(null)
    }
  }, [setHeading, setSubheading])

  const loadApplications = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchStudentConsultancyApplications()
      const apps = Array.isArray(data) ? data : []
      setApplications(apps)
      setPagination({
        currentPage: 1,
        totalPages: Math.ceil(apps.length / 10) || 1,
        total: apps.length
      })
    } catch (err) {
      setError(err.message || 'Failed to load applications')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadApplications()
  }, [])

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }))
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ACCEPTED':
        return <CheckCircle className='w-4 h-4 text-green-600' />
      case 'REJECTED':
        return <XCircle className='w-4 h-4 text-red-600' />
      case 'IN_PROGRESS':
      default:
        return <Clock className='w-4 h-4 text-yellow-600' />
    }
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'ACCEPTED':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'REJECTED':
        return 'bg-red-50 text-red-700 border-red-200'
      case 'IN_PROGRESS':
      default:
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch (e) {
      return dateString
    }
  }

  const renderAddress = (address) => {
    if (!address) return 'N/A'
    
    let addrObj = address
    if (typeof address === 'string') {
      try {
        addrObj = destr(address)
      } catch (e) {
        return address
      }
    }

    if (typeof addrObj === 'object' && addrObj !== null) {
      return (
        <div className='flex flex-wrap gap-1 mt-1'>
          {addrObj.street && (
            <span className='px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] border border-blue-100'>
              {addrObj.street}
            </span>
          )}
          {addrObj.city && (
            <span className='px-2 py-0.5 bg-green-50 text-green-700 rounded text-[10px] border border-green-100'>
              {addrObj.city}
            </span>
          )}
          {addrObj.state && (
            <span className='px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-[10px] border border-purple-100'>
              {addrObj.state}
            </span>
          )}
        </div>
      )
    }

    return String(address)
  }

  const columns = useMemo(
    () => {
      const baseColumns = [
        {
          header: 'Consultancy',
          accessorKey: 'consultancy',
          cell: ({ row }) => {
            const consultancy = row.original.consultancy
            return (
              <div className='flex items-center gap-3'>
                {consultancy?.logo ? (
                  <img
                    src={consultancy.logo}
                    alt={consultancy.title}
                    className='w-10 h-10 object-contain rounded border border-gray-100'
                  />
                ) : (
                  <div className='w-10 h-10 bg-gray-50 rounded flex items-center justify-center border border-gray-100'>
                    <Handshake className='w-5 h-5 text-gray-400' />
                  </div>
                )}
                <div>
                  <p className='font-medium text-gray-900'>{consultancy?.title || 'N/A'}</p>
                  <div className='flex items-start gap-1'>
                    <MapPin className='w-3 h-3 mt-1 text-gray-400 flex-shrink-0' />
                    {renderAddress(consultancy?.address)}
                  </div>
                </div>
              </div>
            )
          }
        },
        {
          header: 'Status',
          accessorKey: 'status',
          cell: ({ getValue }) => {
            const status = getValue()
            return (
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeClass(status)}`}
              >
                {getStatusIcon(status)}
                {status}
              </span>
            )
          }
        },
        {
          header: 'Applied Date',
          accessorKey: 'createdAt',
          cell: ({ getValue }) => (
            <div className='flex items-center gap-2 text-gray-600'>
              <Calendar className='w-4 h-4 text-gray-400' />
              {formatDate(getValue())}
            </div>
          )
        },
        {
          header: 'Message',
          accessorKey: 'student_description',
          cell: ({ getValue }) => {
            const msg = getValue()
            return (
              <p className='text-sm text-gray-600 max-w-xs truncate' title={msg}>
                {msg || '-'}
              </p>
            )
          }
        }
      ]

      if (isStudentOnly) {
        return baseColumns
      }

      return [
        ...baseColumns,
        {
          header: 'Actions',
          id: 'actions',
          cell: ({ row }) => (
            <div className='flex items-center justify-center'>
              <Link href={`/consultancy/${row.original.consultancy?.slugs || '#'}`}>
                <Button
                  variant='ghost'
                  size='sm'
                  className='p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 flex items-center gap-1'
                  title='View consultancy'
                >
                  <ExternalLink className='w-4 h-4' />
                  <span className='sr-only'>View</span>
                </Button>
              </Link>
            </div>
          )
        }
      ]
    },
    [isStudentOnly]
  )

  if (loading && applications.length === 0) {
    return (
      <div className='p-4'>
        <Loading />
      </div>
    )
  }

  return (
    <div className='p-4 w-full'>
      {error && (
        <div className='bg-red-50 border border-red-200 rounded-lg p-4 mb-6'>
          <p className='text-sm text-red-600'>Error: {error}</p>
        </div>
      )}

      {applications.length === 0 && !loading ? (
        <div className='bg-white rounded-lg border border-gray-200 p-12'>
          <EmptyState
            icon={Handshake}
            title='No Applications Found'
            description="You haven't applied for any consultations yet."
          />
          <div className='mt-6 text-center'>
            <Link href='/consultancy'>
              <Button className='bg-[#0A6FA7] hover:bg-[#085e8a]'>
                Explore Consultancies
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className='bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm'>
          <Table
            loading={loading}
            data={applications}
            columns={columns}
            pagination={pagination}
            onPageChange={handlePageChange}
            showSearch={false}
          />
        </div>
      )}

      <ToastContainer position='top-right' autoClose={3000} />
    </div>
  )
}

export default AppliedConsultanciesPage
