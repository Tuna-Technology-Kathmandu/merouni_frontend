'use client'
import dynamic from 'next/dynamic'
import { useState, useEffect, useMemo, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  getAllScholarships,
  createScholarship,
  updateScholarship,
  deleteScholarship
} from './actions'
import Loading from '../../../../components/Loading'
import Table from '../../../../components/Table'
import { Edit2, Trash2, Search, Eye } from 'lucide-react'
import { authFetch } from '@/app/utils/authFetch'
import { toast, ToastContainer } from 'react-toastify'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import 'react-toastify/dist/ReactToastify.css'
import useAdminPermission from '@/hooks/useAdminPermission'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import ConfirmationDialog from '../addCollege/ConfirmationDialog'
const CKEditor = dynamic(() => import('../component/CKStable'), {
  ssr: false
})

export default function ScholarshipManager() {
  const { setHeading } = usePageHeading()
  const author_id = useSelector((state) => state.user.data.id)
  const searchParams = useSearchParams()
  const router = useRouter()
  const [scholarships, setScholarships] = useState([])
  const [loading, setLoading] = useState(true)
  const [tableLoading, setTableLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    eligibilityCriteria: '',
    amount: '',
    applicationDeadline: '',
    renewalCriteria: '',
    contactInfo: ''
  })
  const [editingId, setEditingId] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [viewData, setViewData] = useState(null)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchTimeout, setSearchTimeout] = useState(null)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  })
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
        cell: ({ getValue }) => new Date(getValue()).toLocaleDateString()
      },
      {
        header: 'Renewal Criteria',
        accessorKey: 'renewalCriteria'
      },
      {
        header: 'Contact',
        accessorKey: 'contactInfo'
      },
      {
        header: 'Actions',
        id: 'actions',
        cell: ({ row }) => (
          <div className='flex gap-2'>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => {
                setViewData(row.original)
                setIsViewOpen(true)
              }}
              className='p-1 text-green-600 hover:text-green-800'
            >
              <Eye className='w-4 h-4' />
            </Button>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => handleEdit(row.original)}
              className='p-1 text-blue-600 hover:text-blue-800'
            >
              <Edit2 className='w-4 h-4' />
            </Button>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => handleDeleteClick(row.original.id)}
              className='p-1 text-red-600 hover:text-red-800'
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
    return () => setHeading(null)
  }, [setHeading])

  // Check for 'add' query parameter and open modal
  useEffect(() => {
    const addParam = searchParams.get('add')
    if (addParam === 'true') {
      setIsOpen(true)
      setEditingId(null)
      setFormData({
        name: '',
        description: '',
        eligibilityCriteria: '',
        amount: '',
        applicationDeadline: '',
        renewalCriteria: '',
        contactInfo: ''
      })
      setError(null)
      // Remove query parameter from URL
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

  const { requireAdmin } = useAdminPermission()

  const loadScholarships = async (page = 1) => {
    setTableLoading(true)
    try {
      const res = await getAllScholarships(page)
      const response = res.scholarships

      const updatedScholarships = response.map((scholarship) => ({
        ...scholarship,
        eligibilityCriteria: JSON.parse(
          scholarship.eligibilityCriteria || '""'
        ),
        renewalCriteria: JSON.parse(scholarship.renewalCriteria || '""'),

        applicationDeadline: new Date(scholarship.applicationDeadline),

        formattedDeadline: new Date(
          scholarship.applicationDeadline
        ).toLocaleDateString()
      }))

      setScholarships(updatedScholarships)

      console.log('Updated scholarships:', updatedScholarships)
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setIsSubmitting(true)
      const formattedData = {
        ...formData,
        amount: Number(formData.amount),
        applicationDeadline: formatDate(formData.applicationDeadline),
        author: author_id
      }
      console.log('formatted data', formattedData)
      if (editingId) {
        await updateScholarship(editingId, formattedData)
      } else {
        await createScholarship(formattedData)
      }

      setFormData({
        name: '',
        description: '',
        eligibilityCriteria: '',
        amount: '',
        applicationDeadline: '',
        renewalCriteria: '',
        contactInfo: ''
      })
      setEditingId(null)
      setError(null)
      setIsOpen(false)
      loadScholarships()
      setIsSubmitting(false)
      toast.success(
        `Successfully ${editingId ? 'updated' : 'created'} scholarship`
      )
    } catch (error) {
      setError(`Failed to ${editingId ? 'update' : 'create'} scholarship`)
      toast.error('Error saving scholarship:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (scholarship) => {
    console.log(scholarship)
    setFormData({
      name: scholarship.name,
      description: scholarship.description,
      eligibilityCriteria: scholarship.eligibilityCriteria,
      amount: scholarship.amount,
      applicationDeadline: formatDateForInput(scholarship.applicationDeadline),
      renewalCriteria: scholarship.renewalCriteria,
      contactInfo: scholarship.contactInfo
    })
    setEditingId(scholarship.id)
    setError(null)
    setIsOpen(true)
  }

  const handleModalClose = () => {
    setIsOpen(false)
    setEditingId(null)
    setError(null)
    setFormData({
      name: '',
      description: '',
      eligibilityCriteria: '',
      amount: '',
      applicationDeadline: '',
      renewalCriteria: '',
      contactInfo: ''
    })
  }

  const handleDeleteClick = (id) => {
    requireAdmin(() => {
      setDeleteId(id)
      setIsDialogOpen(true)
    }, 'You do not have permission to delete scholarships.')
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

  const formatDate = (date) => {
    return date.split('-').join('/')
  }

  const formatDateForInput = (dateString) => {
    return new Date(dateString).toISOString().split('T')[0]
  }

  const handleSearch = async (query) => {
    if (!query) {
      loadScholarships()
      return
    }

    try {
      const response = await authFetch(
        `${process.env.baseUrl}${process.env.version}/scholarship?q=${query}`
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

  const handleEditorChange = useCallback((content) => {
    setFormData((prev) => ({
      ...prev,
      description: content
    }))
  }, [])

  if (loading)
    return (
      <div className='mx-auto'>
        <Loading />
      </div>
    )

  return (
    <>
      <div className='p-4 w-full'>
        <div className='flex justify-between items-center mb-4'>
          {/* Search Bar */}
          <div className='relative w-full max-w-md'>
            <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
              <Search className='w-4 h-4 text-gray-500' />
            </div>
            <input
              type='text'
              value={searchQuery}
              onChange={(e) => handleSearchInput(e.target.value)}
              className='w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='Search scholarships...'
            />
          </div>
          {/* Button */}
          <div className='flex gap-2'>
            <Button
              className='bg-blue-500 text-white text-sm px-6 py-2 rounded hover:bg-blue-600 transition-colors'
              onClick={() => {
                setIsOpen(true)
                setEditingId(null)
                setError(null)
                setFormData({
                  name: '',
                  description: '',
                  eligibilityCriteria: '',
                  amount: '',
                  applicationDeadline: '',
                  renewalCriteria: '',
                  contactInfo: ''
                })
              }}
            >
              Add Scholarship
            </Button>
          </div>
        </div>
        <ToastContainer />

        {/* Table */}
        <div className='mt-8'>
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
      </div>

      {/* Form Dialog */}
      <Dialog isOpen={isOpen} onClose={handleModalClose} className='max-w-4xl'>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingId ? 'Edit Scholarship' : 'Add Scholarship'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2 col-span-2'>
                <Label htmlFor='name'>Scholarship Name</Label>
                <Input
                  id='name'
                  placeholder='Scholarship Name'
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className='space-y-2 col-span-2'>
                <Label>Description</Label>
                <CKEditor
                  value={formData.description}
                  onChange={handleEditorChange}
                  id='scholarship-description-editor'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='eligibilityCriteria'>
                  Eligibility Criteria
                </Label>
                <Input
                  id='eligibilityCriteria'
                  placeholder='Eligibility Criteria'
                  value={formData.eligibilityCriteria}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      eligibilityCriteria: e.target.value
                    })
                  }
                  required
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='amount'>Amount (Rs.)</Label>
                <Input
                  id='amount'
                  type='number'
                  placeholder='Amount'
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  required
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='applicationDeadline'>
                  Application Deadline
                </Label>
                <Input
                  id='applicationDeadline'
                  type='date'
                  value={formData.applicationDeadline}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      applicationDeadline: e.target.value
                    })
                  }
                  required
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='renewalCriteria'>Renewal Criteria</Label>
                <Input
                  id='renewalCriteria'
                  placeholder='Renewal Criteria'
                  value={formData.renewalCriteria}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      renewalCriteria: e.target.value
                    })
                  }
                  required
                />
              </div>

              <div className='space-y-2 col-span-2'>
                <Label htmlFor='contactInfo'>Contact Information</Label>
                <Input
                  id='contactInfo'
                  placeholder='Contact Information'
                  value={formData.contactInfo}
                  onChange={(e) =>
                    setFormData({ ...formData, contactInfo: e.target.value })
                  }
                  required
                />
              </div>

              {error && (
                <div className='text-red-500 text-sm col-span-2'>{error}</div>
              )}
            </div>

            <DialogFooter className='gap-2 pt-4 border-t'>
              <Button
                type='button'
                variant='outline'
                onClick={handleModalClose}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting
                  ? 'Processing...'
                  : editingId
                    ? 'Update Scholarship'
                    : 'Create Scholarship'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        onConfirm={handleDeleteConfirm}
        title='Confirm Deletion'
        message='Are you sure you want to delete this scholarship? This action cannot be undone.'
      />

      {/* View Scholarship Dialog */}
      <Dialog
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        className='max-w-4xl'
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Scholarship Details</DialogTitle>
          </DialogHeader>
          {viewData && (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 py-4'>
              <div className='space-y-1 col-span-2'>
                <Label className='text-muted-foreground'>
                  Scholarship Name
                </Label>
                <div className='text-lg font-medium'>{viewData.name}</div>
              </div>

              <div className='space-y-1 col-span-2'>
                <Label className='text-muted-foreground'>Description</Label>
                <div
                  className='prose prose-sm max-w-none dark:prose-invert border rounded-md p-4 bg-muted/20'
                  dangerouslySetInnerHTML={{ __html: viewData.description }}
                />
              </div>

              <div className='space-y-1'>
                <Label className='text-muted-foreground'>
                  Eligibility Criteria
                </Label>
                <div className='font-medium'>
                  {viewData.eligibilityCriteria}
                </div>
              </div>

              <div className='space-y-1'>
                <Label className='text-muted-foreground'>Amount (Rs.)</Label>
                <div className='font-medium'>
                  {viewData.amount.toLocaleString()}
                </div>
              </div>

              <div className='space-y-1'>
                <Label className='text-muted-foreground'>
                  Application Deadline
                </Label>
                <div className='font-medium'>
                  {new Date(viewData.applicationDeadline).toLocaleDateString()}
                </div>
              </div>

              <div className='space-y-1'>
                <Label className='text-muted-foreground'>
                  Renewal Criteria
                </Label>
                <div className='font-medium'>{viewData.renewalCriteria}</div>
              </div>

              <div className='space-y-1 col-span-2'>
                <Label className='text-muted-foreground'>
                  Contact Information
                </Label>
                <div className='font-medium'>{viewData.contactInfo}</div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant='outline' onClick={() => setIsViewOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
