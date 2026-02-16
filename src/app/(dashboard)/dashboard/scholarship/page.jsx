'use client'
import { getCategories } from '@/app/action'
import { authFetch } from '@/app/utils/authFetch'
import { Button } from '@/ui/shadcn/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/ui/shadcn/dialog'
import { Label } from '@/ui/shadcn/label'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import { Edit2, Eye, Search, Trash2, Users } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { toast, ToastContainer } from 'react-toastify'
import Loading from '../../../../ui/molecules/Loading'
import Table from '@/ui/shadcn/DataTable'
import ConfirmationDialog from '@/ui/molecules/ConfirmationDialog'
import ScholarshipFormDialog from '@/ui/organisms/admin-dashboard/ScholarshipFormDialog'
import {
  createScholarship,
  deleteScholarship,
  getAllScholarships,
  updateScholarship,
  getScholarshipApplications
} from './actions'
import SearchInput from '@/ui/molecules/SearchInput'
import { formatDate } from '@/utils/date.util'
import ScholarshipViewModal from './ScholarshipViewModal'

export default function ScholarshipManager() {
  const { setHeading } = usePageHeading()
  const author_id = useSelector((state) => state.user.data.id)
  const searchParams = useSearchParams()
  const router = useRouter()
  const [scholarships, setScholarships] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [tableLoading, setTableLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [editingScholarship, setEditingScholarship] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [viewData, setViewData] = useState(null)
  const [isApplicationsOpen, setIsApplicationsOpen] = useState(false)
  const [applicationsData, setApplicationsData] = useState([])
  const [applicationsLoading, setApplicationsLoading] = useState(false)
  const [selectedScholarshipId, setSelectedScholarshipId] = useState(null)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchTimeout, setSearchTimeout] = useState(null)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  })
  const handleViewApplications = async (scholarshipId) => {
    setSelectedScholarshipId(scholarshipId)
    setIsApplicationsOpen(true)
    setApplicationsLoading(true)
    setApplicationsData([])

    try {
      const data = await getScholarshipApplications(scholarshipId)
      setApplicationsData(data.applications || [])
    } catch (err) {
      toast.error('Failed to load applications')
      console.error('Error loading applications:', err)
    } finally {
      setApplicationsLoading(false)
    }
  }

  const columns = useMemo(
    () => [
      {
        header: 'Name',
        accessorKey: 'name'
      },
      {
        header: 'Eligibility',
        accessorKey: 'eligibilityCriteria'
      },
      {
        header: 'Amount (Rs.)',
        accessorKey: 'amount',
        cell: ({ getValue }) => `${getValue().toLocaleString()}`
      },
      {
        header: 'Deadline',
        accessorKey: 'applicationDeadline',
        cell: ({ getValue }) => formatDate(getValue())
      },

      {
        header: 'Actions',
        id: 'actions',
        cell: ({ row }) => (
          <div className='flex gap-2'>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => {
                setViewData(row.original)
                setIsViewOpen(true)
              }}
              className='text-green-600 hover:text-green-800 hover:bg-green-50'
              title='View Details'
            >
              <Eye className='w-4 h-4' />
            </Button>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => handleViewApplications(row.original.id)}
              className='text-purple-600 hover:text-purple-800 hover:bg-purple-50'
              title='View Applications'
            >
              <Users className='w-4 h-4' />
            </Button>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => handleEdit(row.original)}
              className='text-blue-600 hover:text-blue-800 hover:bg-blue-50'
              title='Edit'
            >
              <Edit2 className='w-4 h-4' />
            </Button>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => handleDeleteClick(row.original.id)}
              className='text-red-600 hover:text-red-800 hover:bg-red-50'
              title='Delete'
            >
              <Trash2 className='w-4 h-4' />
            </Button>
          </div>
        )
      }
    ],
    []
  )

  useEffect(() => {
    setHeading('Scholarship Management')
    loadScholarships()
    loadCategories()
    return () => setHeading(null)
  }, [setHeading])

  const loadCategories = async () => {
    try {
      const response = await getCategories()
      setCategories(response.items || [])
    } catch (error) {
      console.error('Error loading categories:', error)
      toast.error('Failed to load categories')
    }
  }

  useEffect(() => {
    const addParam = searchParams.get('add')
    if (addParam === 'true') {
      setIsOpen(true)
      setEditingScholarship(null)
      setError(null)
      router.replace('/dashboard/scholarship', { scroll: false })
    }
  }, [searchParams, router])

  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout)
      }
    }
  }, [searchTimeout])

  const loadScholarships = async (page = 1) => {
    setTableLoading(true)
    try {
      const res = await getAllScholarships(page)
      const response = res.scholarships

      const updatedScholarships = response.map((scholarship) => {
        // Safe JSON parse helper
        const safeJsonParse = (value) => {
          if (!value) return ''
          if (typeof value === 'object') return value
          try {
            return JSON.parse(value)
          } catch (e) {
            console.warn('Failed to parse JSON:', value)
            return ''
          }
        }

        return {
          ...scholarship,
          categoryId: scholarship?.scholarshipCategory?.id,
          eligibilityCriteria: safeJsonParse(scholarship.eligibilityCriteria),
          renewalCriteria: safeJsonParse(scholarship.renewalCriteria),
          applicationDeadline: new Date(scholarship.applicationDeadline),
          formattedDeadline: new Date(
            scholarship.applicationDeadline
          ).toLocaleDateString()
        }
      })

      setScholarships(updatedScholarships)

      setPagination({
        currentPage: res.pagination.currentPage,
        totalPages: res.pagination.totalPages,
        total: res.pagination.totalCount
      })
    } catch (error) {
      setError('Failed to load scholarships')
      console.error('Error loading scholarships:', error)
      toast.error('Failed to fetch scholarships')
    } finally {
      setTableLoading(false)
      setLoading(false)
    }
  }

  const handleSubmit = async (formattedData, editingId) => {
    try {
      setIsSubmitting(true)
      if (editingId) {
        await updateScholarship(editingId, formattedData)
      } else {
        await createScholarship(formattedData)
      }

      setEditingScholarship(null)
      setError(null)
      setIsOpen(false)
      loadScholarships()
      setIsSubmitting(false)
      toast.success(
        `Scholarship ${editingId ? 'updated' : 'created'} successfully`
      )
    } catch (error) {
      setIsSubmitting(false)
      throw error // Re-throw to let the component handle it
    }
  }

  const handleEdit = (scholarship) => {
    setEditingScholarship(scholarship)
    setError(null)
    setIsOpen(true)
  }

  const handleModalClose = () => {
    setIsOpen(false)
    setEditingScholarship(null)
    setError(null)
  }

  const handleDeleteClick = (id) => {
    // requireAdmin(() => {
    setDeleteId(id)
    setIsDialogOpen(true)
    // }, 'You do not have permission to delete scholarships.')
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setDeleteId(null)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteId) return

    try {
      await deleteScholarship(deleteId)
      toast.success('Scholarship deleted successfully!')
      await loadScholarships()
      setError(null)
    } catch (error) {
      toast.error('Failed to delete scholarship')
      setError('Failed to delete scholarship')
      console.error('Error deleting scholarship:', error)
    } finally {
      setIsDialogOpen(false)
      setDeleteId(null)
    }
  }

  const handleSearchInput = (value) => {
    setSearchQuery(value)

    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }

    if (value === '') {
      handleSearch('')
    } else {
      const timeoutId = setTimeout(() => {
        handleSearch(value)
      }, 300)
      setSearchTimeout(timeoutId)
    }
  }

  const handleSearch = async (query) => {
    if (!query) {
      loadScholarships()
      return
    }

    try {
      const response = await authFetch(
        `${process.env.baseUrl}/scholarship?q=${query}`
      )
      if (response.ok) {
        const data = await response.json()
        setScholarships(data.scholarships)

        if (data.pagination) {
          setPagination({
            currentPage: data.pagination.currentPage,
            totalPages: data.pagination.totalPages,
            total: data.pagination.totalCount
          })
        }
      } else {
        console.error('Error scholarship levels:', response.statusText)
        setScholarships([])
      }
    } catch (error) {
      console.error('Error fetching scholarhsip search results:', error.message)
      setScholarships([])
    }
  }

  if (loading)
    return (
      <div className='mx-auto'>
        <Loading />
      </div>
    )

  return (
    <>
      <div className='w-full space-y-2'>
        <div className='flex justify-between items-center px-4 pt-4'>
          {/* Search Bar */}

          <SearchInput
            value={searchQuery}
            onChange={(e) => handleSearchInput(e.target.value)}
            placeholder='Search scholarships...'
            className='max-w-md'
          />
          {/* Button */}
          <div className='flex gap-2'>
            <Button
              onClick={() => {
                setIsOpen(true)
                setEditingScholarship(null)
                setError(null)
              }}
            >
              Add Scholarship
            </Button>
          </div>
        </div>
        <ToastContainer />

        {/* Table */}
        <Table
          loading={tableLoading}
          data={scholarships}
          columns={columns}
          pagination={pagination}
          onPageChange={(newPage) => loadScholarships(newPage)}
          onSearch={handleSearch}
          showSearch={false}
        />
      </div>

      {/* Form Dialog */}
      <ScholarshipFormDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        onSubmit={handleSubmit}
        editingScholarship={editingScholarship}
        categories={categories}
        authorId={author_id}
        isLoading={isSubmitting}
      />

      <ConfirmationDialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        onConfirm={handleDeleteConfirm}
        title='Confirm Deletion'
        message='Are you sure you want to delete this scholarship? This action cannot be undone.'
      />

      {/* View Scholarship Dialog */}
      <ScholarshipViewModal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        scholarship={viewData}
      />

      {/* Applications Dialog */}
      <Dialog
        isOpen={isApplicationsOpen}
        onClose={() => setIsApplicationsOpen(false)}
        className='max-w-4xl'
      >
        <DialogContent className='max-h-[80vh] flex flex-col overflow-hidden'>
          <DialogHeader>
            <DialogTitle>Scholarship Applications</DialogTitle>
          </DialogHeader>
          {applicationsLoading ? (
            <div className='flex items-center justify-center py-12'>
              <Loading />
            </div>
          ) : applicationsData.length === 0 ? (
            <div className='py-12 text-center text-gray-500'>
              <Users className='w-12 h-12 mx-auto mb-4 text-gray-400' />
              <p>No applications found for this scholarship</p>
            </div>
          ) : (
            <div className='overflow-y-auto flex-1 pr-2'>
              <div className='space-y-4'>
                {applicationsData.map((application) => (
                  <div
                    key={application.id}
                    className='border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors'
                  >
                    <div className='flex items-start justify-between'>
                      <div className='flex-1'>
                        <div className='flex items-center gap-3 mb-2'>
                          <div className='w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold'>
                            {application.student?.firstName?.charAt(0).toUpperCase()}
                            {application.student?.lastName?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className='font-semibold text-gray-900'>
                              {application.student?.firstName}{' '}
                              {application.student?.middleName || ''}{' '}
                              {application.student?.lastName}
                            </h3>
                            <p className='text-sm text-gray-500'>
                              {application.student?.email}
                            </p>
                            {application.student?.phoneNo && (
                              <p className='text-sm text-gray-500'>
                                {application.student.phoneNo}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className='mt-3 flex items-center gap-4 text-sm'>
                          <span className='text-gray-500'>
                            Applied:{' '}
                            {new Date(application.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {application.remarks && (
                          <div className='mt-2 text-sm text-gray-600'>
                            <span className='font-medium'>Remarks: </span>
                            {application.remarks}
                          </div>
                        )}
                      </div>
                      <div className='ml-4'>
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${application.status === 'APPROVED'
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : application.status === 'REJECTED'
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                            }`}
                        >
                          {application.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant='outline' onClick={() => setIsApplicationsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
