'use client'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Table from '@/ui/shadcn/DataTable'
import { createColumns } from './columns'
import { authFetch } from '@/app/utils/authFetch'
import { toast, ToastContainer } from 'react-toastify'
import ConfirmationDialog from '@/ui/molecules/ConfirmationDialog'
import useAdminPermission from '@/hooks/useAdminPermission'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import { Button } from '@/ui/shadcn/button'
import CreateUpdateUniversityModal from '@/ui/molecules/dialogs/university/CreateUpdateUniversityModal'
import UniversityViewModal from './components/UniversityViewModal'
import SearchInput from '@/ui/molecules/SearchInput'

export default function UniversityForm() {
  const { setHeading } = usePageHeading()
  const [isOpen, setIsOpen] = useState(false)
  const [universities, setUniversities] = useState([])
  const [tableLoading, setTableLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchTimeout, setSearchTimeout] = useState(null)

  const [editSlug, setEditSlug] = useState('')
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  })
  const [deleteId, setDeleteId] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // View Modal State
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [viewUniversityData, setViewUniversityData] = useState(null)
  const [loadingView, setLoadingView] = useState(false)

  // Fetch universities on component mount
  useEffect(() => {
    setHeading('University Management')
    fetchUniversities()
    return () => setHeading(null)
  }, [setHeading])

  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout)
      }
    }
  }, [searchTimeout])

  const { requireAdmin } = useAdminPermission()

  const fetchUniversities = async (page = 1) => {
    setTableLoading(true)
    try {
      const response = await authFetch(
        `${process.env.baseUrl}/university?page=${page}&limit=10`
      )
      const data = await response.json()
      setUniversities(data.items || [])
      setPagination({
        currentPage: data.pagination?.currentPage || 1,
        totalPages: data.pagination?.totalPages || 1,
        total: data.pagination?.totalItems || data.totalItems || 0
      })
    } catch (error) {
      toast.error('Failed to fetch universities')
      console.error(error)
    } finally {
      setTableLoading(false)
    }
  }

  const handleEdit = (slugs) => {
    setEditSlug(slugs)
    setIsOpen(true)
  }

  const handleDeleteClick = (id) => {
    requireAdmin(() => {
      setDeleteId(id)
      setIsDialogOpen(true)
    })
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setDeleteId(null)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteId) return

    try {
      const response = await authFetch(
        `${process.env.baseUrl}/university?id=${deleteId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      const res = await response.json()
      if (response.ok) {
        toast.success(res.message || 'University deleted successfully')
        fetchUniversities(pagination.currentPage)
      } else {
        throw new Error(res.message || 'Failed to delete')
      }
    } catch (err) {
      toast.error(err.message)
    } finally {
      setIsDialogOpen(false)
      setDeleteId(null)
    }
  }

  const handleView = async (slug) => {
    try {
      setLoadingView(true)
      setViewModalOpen(true)

      const response = await authFetch(
        `${process.env.baseUrl}/university/${slug}`,
        { headers: { 'Content-Type': 'application/json' } }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch university details')
      }

      const data = await response.json()
      setViewUniversityData(data)
    } catch (err) {
      toast.error(err.message || 'Failed to load university details')
      setViewModalOpen(false)
    } finally {
      setLoadingView(false)
    }
  }

  const handleCloseViewModal = () => {
    setViewModalOpen(false)
    setViewUniversityData(null)
  }

  const columns = createColumns({
    handleView,
    handleEdit,
    handleDeleteClick
  })

  const handleSearch = async (query) => {
    if (!query) {
      fetchUniversities()
      return
    }

    try {
      setTableLoading(true)
      const response = await authFetch(
        `${process.env.baseUrl}/university?q=${query}`
      )
      if (response.ok) {
        const data = await response.json()
        setUniversities(data.items || [])

        if (data.pagination) {
          setPagination({
            currentPage: data.pagination.currentPage,
            totalPages: data.pagination.totalPages,
            total: data.totalItems
          })
        }
      } else {
        setUniversities([])
      }
    } catch (error) {
      console.error('Error fetching university search results:', error.message)
      setUniversities([])
    } finally {
      setTableLoading(false)
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

  const handleCloseModal = () => {
    setIsOpen(false)
    setEditSlug('')
  }

  return (
    <>
      <div className='w-full space-y-4'>
        <div className='flex justify-between items-center px-4 pt-4'>
          <SearchInput
            value={searchQuery}
            onChange={(e) => handleSearchInput(e.target.value)}
            placeholder='Search universities...'
            className='max-w-md'
          />
          <div className='flex gap-2'>
            <Button
              onClick={() => {
                setIsOpen(true)
                setEditSlug('')
              }}
            >
              Add University
            </Button>
          </div>
        </div>

        <CreateUpdateUniversityModal
          isOpen={isOpen}
          handleCloseModal={handleCloseModal}
          editSlug={editSlug}
          onSuccess={() => fetchUniversities(pagination.currentPage)}
        />

        <div className='w-full'>
          <Table
            loading={tableLoading}
            data={universities}
            columns={columns}
            pagination={pagination}
            onPageChange={(newPage) => fetchUniversities(newPage)}
            onSearch={handleSearch}
            showSearch={false}
          />
        </div>
      </div>

      <ConfirmationDialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        onConfirm={handleDeleteConfirm}
        title='Confirm Deletion'
        message='Are you sure you want to delete this university? This action cannot be undone.'
      />

      <UniversityViewModal
        isOpen={viewModalOpen}
        onClose={handleCloseViewModal}
        data={viewUniversityData}
        loading={loadingView}
      />
    </>
  )
}
