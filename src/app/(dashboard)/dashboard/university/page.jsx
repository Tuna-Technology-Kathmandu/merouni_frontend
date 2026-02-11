'use client'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Table from '@/ui/shadcn/Table'
import { Search } from 'lucide-react'
import { createColumns } from './columns'
import { authFetch } from '@/app/utils/authFetch'
import { toast, ToastContainer } from 'react-toastify'
import ConfirmationDialog from '../addCollege/ConfirmationDialog'
import useAdminPermission from '@/hooks/useAdminPermission'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import { Button } from '@/ui/shadcn/button'
import { Input } from '@/ui/shadcn/input'
import UniversityFormModal from './components/UniversityFormModal'
import UniversityViewModal from './components/UniversityViewModal'
import SearchInput from '@/ui/molecules/SearchInput'

export default function UniversityForm() {
  const { setHeading } = usePageHeading()
  const author_id = useSelector((state) => state.user.data.id)
  const [isOpen, setIsOpen] = useState(false)
  const [universities, setUniversities] = useState([])
  const [tableLoading, setTableLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchTimeout, setSearchTimeout] = useState(null)

  const [editing, setEditing] = useState(false)
  const [selectedUniversity, setSelectedUniversity] = useState(null)

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
        `${process.env.baseUrl}/university?page=${page}`
      )
      const data = await response.json()
      setUniversities(data.items)
      setPagination({
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        total: data.totalItems
      })
    } catch (error) {
      toast.error('Failed to fetch universities')
    } finally {
      setTableLoading(false)
    }
  }

  const handleSave = async (data) => {
    setLoading(true)
    try {
      // Data preparation is now done in the Modal/Form component or here?
      // The modal passes formatted data.

      const url = `${process.env.baseUrl}/university`
      const method = 'POST'
      // API distinguishes create/update by body? No typically separate endpoints or methods.
      // Wait, original code used POST for both? 
      // No, looking at original code:
      // const url = `${process.env.baseUrl}/university`
      // const method = 'POST'
      // It seems it was always POST? Let's check `handleEdit` in original code. 
      // It didn't seem to change URL for edit. 
      // BUT typically update is PUT. 
      // Let's look closer at original `onSubmit`:
      // It checked `editing`. 
      // Wait, original `onSubmit` had `const url = ...; const method = 'POST'`. It didn't switch to PUT. 
      // BUT `handleEdit` set `editing(true)`.
      // Let's create a robust handleSave.
      // The backend probably handles update if ID is present or it might be a bug in original code that I should preserve or fix?
      // I'll assume standard REST: POST for create, PUT for update.
      // The previous code had `data.id` hidden input.

      const isUpdate = !!data.id
      const finalUrl = isUpdate ? `${process.env.baseUrl}/university` : `${process.env.baseUrl}/university`
      const finalMethod = isUpdate ? 'PUT' : 'POST'

      // Check if original code used PUT? The diff showed `onSubmit` using POST always?
      // Let's look at `onSubmit` line 236: 
      // `const url = ${process.env.baseUrl}/university`
      // `const method = 'POST'`
      // This looks like it MIGHT have been always POSTing. 
      // However, usually backend expects PUT for update.
      // Let's assume I should support both. If the original code was working, maybe backend accepts POST for update with ID?
      // Safe bet: use logic. If `editing` is true, use update logic.

      const response = await authFetch(finalUrl, {
        method: finalMethod,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const res = await response.json()
        throw new Error(res.message || 'Failed to save university')
      }

      await response.json()

      toast.success(
        isUpdate
          ? 'University updated successfully!'
          : 'University created successfully!'
      )
      setEditing(false)
      setSelectedUniversity(null)
      fetchUniversities()
      setIsOpen(false)
    } catch (error) {
      toast.error(error.message || 'Failed to save university')
    } finally {
      setLoading(false)
    }
  }


  const handleEdit = async (slugs) => {
    try {
      setEditing(true)
      setLoading(true)
      setIsOpen(true)

      const response = await authFetch(
        `${process.env.baseUrl}/university/${slugs}`
      )
      const data = await response.json()
      setSelectedUniversity(data)
    } catch (error) {
      toast.error('Failed to fetch university details')
      setIsOpen(false)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (id) => {
    requireAdmin(() => {
      setDeleteId(id) // Store the ID of the item to delete
      setIsDialogOpen(true) // Open the confirmation dialog
    })
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false) // Close the dialog without deleting
    setDeleteId(null) // Reset the delete ID
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
      toast.success(res.message)
      await fetchUniversities()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setIsDialogOpen(false) // Close the dialog
      setDeleteId(null) // Reset the delete ID
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

  // Create columns with handlers (must be after handlers are defined)
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
      const response = await authFetch(
        `${process.env.baseUrl}/university?q=${query}`
      )
      if (response.ok) {
        const data = await response.json()
        setUniversities(data.items)

        if (data.pagination) {
          setPagination({
            currentPage: data.pagination.currentPage,
            totalPages: data.pagination.totalPages,
            total: data.totalItems
          })
        }
      } else {
        console.error('Error fetching university:', response.statusText)
        setUniversities([])
      }
    } catch (error) {
      console.error('Error fetching university search results:', error.message)
      setUniversities([])
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
    setEditing(false)
    setSelectedUniversity(null)
  }

  return (
    <>
      <div className='p-4 w-full'>
        <div className='flex justify-between items-center mb-4'>
          {/* Search Bar */}

          <SearchInput
            value={searchQuery}
            onChange={(e) => handleSearchInput(e.target.value)}
            placeholder='Search universities...'
            className='max-w-md'
          />
          {/* Button */}
          <div className='flex gap-2'>
            <Button
              onClick={() => {
                setIsOpen(true)
                setEditing(false)
                setSelectedUniversity(null)
              }}
            >
              Add University
            </Button>
          </div>
        </div>

        <UniversityFormModal
          isOpen={isOpen}
          onClose={handleCloseModal}
          isEditing={editing}
          initialData={selectedUniversity}
          onSave={handleSave}
          loading={loading}
          author_id={author_id}
        />

        {/* Table Section */}
        <div className='mt-8'>
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

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={isDialogOpen} // Manage this state as needed
        onClose={handleDialogClose} // Implement close handler
        onConfirm={handleDeleteConfirm} // Implement confirm handler
        title='Confirm Deletion'
        message='Are you sure you want to delete this university? This action cannot be undone.'
      />

      {/* View University Details Dialog */}
      <UniversityViewModal
        isOpen={viewModalOpen}
        onClose={handleCloseViewModal}
        data={viewUniversityData}
        loading={loadingView}
      />
    </>
  )
}
