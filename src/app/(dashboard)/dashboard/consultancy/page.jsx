'use client'
import { authFetch } from '@/app/utils/authFetch'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import useAdminPermission from '@/hooks/useAdminPermission'
import ConfirmationDialog from '@/ui/molecules/ConfirmationDialog'
import CreateConsultencyUser from '@/ui/molecules/dialogs/CreateConsultencyUser'
import CreateUpdateConsultancy from '@/ui/molecules/dialogs/CreateUpdateConsultancy'
import ViewConsultancy from '@/ui/molecules/dialogs/ViewConsultancy'
import SearchInput from '@/ui/molecules/SearchInput'
import { Button } from '@/ui/shadcn/button'
import Table from '@/ui/shadcn/DataTable'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { createColumns } from './columns'
import EditConsultancyPage from './EditConsultancyPage'

export default function ConsultancyForm() {
  const { role } = useAdminPermission()

  // If user is consultancy, show the edit page
  if (role.consultancy) {
    return <EditConsultancyPage />
  }

  const { setHeading } = usePageHeading()
  const author_id = useSelector((state) => state.user.data?.id)
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [consultancies, setConsultancies] = useState([])
  const [tableLoading, setTableLoading] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [viewSlug, setViewSlug] = useState(null)
  const [pagination, setPagination] = useState({
    currentPage: parseInt(searchParams.get('page')) || 1,
    totalPages: 1,
    total: 0
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [searchTimeout, setSearchTimeout] = useState(null)

  const [credentialsModalOpen, setCredentialsModalOpen] = useState(false)
  const [selectedConsultancy, setSelectedConsultancy] = useState(null)

  // State for Create/Update Modal
  const [editingConsultancy, setEditingConsultancy] = useState(null)

  useEffect(() => {
    setHeading('Consultancy Management')
    fetchConsultancies()
    return () => setHeading(null)
  }, [setHeading, searchParams])

  // Check for 'add' query parameter and open modal
  useEffect(() => {
    const addParam = searchParams.get('add')
    if (addParam === 'true') {
      setEditingConsultancy(null)
      setIsOpen(true)
      // Remove query parameter from URL
      router.replace('/dashboard/consultancy', { scroll: false })
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

  const fetchConsultancies = async (page = 1) => {
    try {
      const params = new URLSearchParams(searchParams.toString())
      params.set('page', page)
      router.push(`${pathname}?${params.toString()}`, { scroll: false })

      setTableLoading(true)
      const response = await authFetch(
        `${process.env.baseUrl}/consultancy?page=${page}`
      )
      const data = await response.json()
      setConsultancies(data.items)
      setPagination({
        currentPage: data.pagination.currentPage,
        totalPages: data.pagination.totalPages,
        total: data.pagination.totalCount
      })
    } catch (error) {
      toast.error('Failed to fetch consultancies')
    } finally {
      setTableLoading(false)
    }
  }

  const handleEdit = (consultancy) => {
    setEditingConsultancy(consultancy)
    setIsOpen(true)
  }

  const handleDeleteClick = (id) => {
    setDeleteId(id)
    setIsDialogOpen(true)
  }

  function handleDialogClose() {
    setIsDialogOpen(false)
    setDeleteId(null)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteId) return

    try {
      const response = await authFetch(
        `${process.env.baseUrl}/consultancy?id=${deleteId}`,
        {
          method: 'DELETE'
        }
      )
      const res = await response.json()
      toast.success(res.message)
      await fetchConsultancies(pagination.currentPage)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setIsDialogOpen(false)
      setDeleteId(null)
    }
  }

  const handleView = (slug) => {
    setViewSlug(slug)
    setViewModalOpen(true)
  }

  const handleCloseViewModal = () => {
    setViewModalOpen(false)
    setViewSlug(null)
  }

  const handleOpenCredentialsModal = (consultancy) => {
    setSelectedConsultancy(consultancy)
    setCredentialsModalOpen(true)
  }

  const handleCloseCredentialsModal = () => {
    setCredentialsModalOpen(false)
    setSelectedConsultancy(null)
  }

  const handleCredentialsSuccess = () => {
    fetchConsultancies(pagination.currentPage)
  }

  // Create columns with handlers (must be after handlers are defined)
  const columns = createColumns({
    handleView,
    handleEdit,
    handleDeleteClick,
    handleOpenCredentialsModal
  })

  const handleSearch = async (query) => {
    if (!query) {
      fetchConsultancies()
      return
    }

    try {
      const response = await authFetch(
        `${process.env.baseUrl}/consultancy?q=${query}`
      )
      if (response.ok) {
        const data = await response.json()
        setConsultancies(data.items)

        if (data.pagination) {
          setPagination({
            currentPage: data.pagination.currentPage,
            totalPages: data.pagination.totalPages,
            total: data.pagination.totalCount
          })
        }
      } else {
        console.error('Error fetching consultancy:', response.statusText)
        setConsultancies([])
      }
    } catch (error) {
      console.error('Error fetching consutancy search results:', error.message)
      setConsultancies([])
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
  return (
    <>
      <div className='w-full space-y-2'>
        <div className='px-4 space-y-4'>
          <div className='flex justify-between items-center pt-4'>

            <SearchInput
              value={searchQuery}
              onChange={(e) => handleSearchInput(e.target.value)}
              placeholder='Search consultancies...'
              className='max-w-md'
            />
            {/* Button */}
            <div className='flex gap-2'>
              <Button
                onClick={() => {
                  setEditingConsultancy(null)
                  setIsOpen(true)
                }}
              >
                Add Consultancy
              </Button>
            </div>
          </div>

          <CreateUpdateConsultancy
            isOpen={isOpen}
            onClose={() => {
              setIsOpen(false)
              setEditingConsultancy(null)
            }}
            onSuccess={() => {
              fetchConsultancies(pagination.currentPage)
            }}
            initialData={editingConsultancy}
          />

          <Table
            data={consultancies}
            columns={columns}
            pagination={pagination}
            onPageChange={(newPage) => fetchConsultancies(newPage)}
            onSearch={handleSearch}
            showSearch={false}
            loading={tableLoading}
          />
        </div>
      </div>

      <ConfirmationDialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        onConfirm={handleDeleteConfirm}
        title='Confirm Deletion'
        message='Are you sure you want to delete this consultancy? This action cannot be undone.'
      />

      {/* View Consultancy Details Modal */}
      <ViewConsultancy
        isOpen={viewModalOpen}
        onClose={handleCloseViewModal}
        slug={viewSlug}
      />

      {/* Create Credentials Modal */}
      <CreateConsultencyUser
        isOpen={credentialsModalOpen}
        onClose={handleCloseCredentialsModal}
        selectedConsultancy={selectedConsultancy}
        onSuccess={handleCredentialsSuccess}
      />
    </>
  )
}
