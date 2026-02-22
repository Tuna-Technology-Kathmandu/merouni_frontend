'use client'
import { authFetch } from '@/app/utils/authFetch'
import Table from '@/ui/shadcn/DataTable'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { toast, ToastContainer } from 'react-toastify'
import {
  fetchAllDegrees
} from './actions'

import ConfirmationDialog from '@/ui/molecules/ConfirmationDialog'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import useAdminPermission from '@/hooks/useAdminPermission'
import SearchInput from '@/ui/molecules/SearchInput'
import CreateCredentialsModal from '@/ui/molecules/dialogs/college/CreateCredentialsModal'
import CreateUpdateCollegeModal from '@/ui/molecules/dialogs/college/CreateUpdateCollegeModal'
import ViewCollegeModal from '@/ui/molecules/dialogs/college/ViewCollegeModal'
import { Button } from '../../../../ui/shadcn/button'
import { createColumns } from './columns'



export default function CollegeForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { setHeading } = usePageHeading()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchTimeout, setSearchTimeout] = useState(null)

  const [colleges, setColleges] = useState([])
  const [tableloading, setTableLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editSlug, setEditSlug] = useState('')
  const [pagination, setPagination] = useState({
    currentPage: parseInt(searchParams.get('page')) || 1,
    totalPages: 1,
    total: 0
  })
  const [isOpen, setIsOpen] = useState(false)
  const [allDegrees, setAllDegrees] = useState([])

  const [deleteId, setDeleteId] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [credentialsModalOpen, setCredentialsModalOpen] = useState(false)
  const [selectedCollege, setSelectedCollege] = useState(null)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [viewCollegeData, setViewCollegeData] = useState(null)
  const [loadingView, setLoadingView] = useState(false)


  const author_id = useSelector((state) => state.user.data?.id)

  const { requireAdmin } = useAdminPermission()


  //for all fetching of degrees
  useEffect(() => {
    const getDegrees = async () => {
      try {
        const degreeList = await fetchAllDegrees()
        setAllDegrees(degreeList)
      } catch (error) {
        console.error('Error fetching degrees:', error)
      }
    }

    getDegrees()
  }, [])

  const handleCloseModal = () => {
    setIsOpen(false)
    setEditSlug('')
  }

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    if (searchParams.get('add') === 'true') {
      setIsOpen(true)
      setEditSlug('')
    }
  }, [])

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return

    setHeading('College Management')
    const loadInitialColleges = async () => {
      const page = parseInt(searchParams.get('page')) || 1
      setLoading(true)
      setTableLoading(true)
      try {

        const response = await authFetch(
          `${process.env.baseUrl}/college?limit=10&page=${page}`
        )
        if (response.ok) {
          const data = await response.json()
          if (data && data.items) {
            setColleges(data.items)
            setPagination({
              currentPage: data.pagination?.currentPage || 1,
              totalPages: data.pagination?.totalPages || 1,
              total: data.pagination?.totalCount || 0
            })
          }
        } else {
          throw new Error('Failed to fetch colleges')
        }
      } catch (err) {
        console.error('Error loading colleges:', err)
        setColleges([])
        setPagination({
          currentPage: 1,
          totalPages: 1,
          total: 0
        })
      } finally {
        setLoading(false)
        setTableLoading(false)
      }
    }
    loadInitialColleges()
    return () => setHeading(null)
  }, [setHeading, searchParams])

  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout)
      }
    }
  }, [searchTimeout])


  const handleDeleteClick = (id) => {
    requireAdmin(() => {
      setDeleteId(id)
      setIsDialogOpen(true)
    })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteId) return

    try {
      const response = await authFetch(
        `${process.env.baseUrl}/college/${deleteId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      const res = await response.json()
      toast.success(res.message)
      // Reload colleges using authFetch
      const reloadResponse = await authFetch(
        `${process.env.baseUrl}/college?limit=10&page=${pagination.currentPage}`
      )
      if (reloadResponse.ok) {
        const reloadData = await reloadResponse.json()
        setColleges(reloadData.items || [])
        setPagination({
          currentPage:
            reloadData.pagination?.currentPage || pagination.currentPage,
          totalPages:
            reloadData.pagination?.totalPages || pagination.totalPages,
          total: reloadData.pagination?.totalCount || pagination.total
        })
      }
      setEditSlug('')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setIsDialogOpen(false)
      setDeleteId(null)
    }
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setDeleteId(null)
  }

  const handleOpenCredentialsModal = async (college) => {
    setSelectedCollege(college)
    setCredentialsModalOpen(true)
  }



  const handleEdit = (slug) => {
    setEditSlug(slug)
    setIsOpen(true)
  }

  const loadColleges = async (page = 1) => {
    try {
      const params = new URLSearchParams(searchParams.toString())
      params.set('page', page)
      router.push(`${pathname}?${params.toString()}`, { scroll: false })

      const response = await authFetch(
        `${process.env.baseUrl}/college?limit=10&page=${page}`
      )

      if (response.ok) {
        const data = await response.json()
        setColleges(data.items || [])
        setPagination({
          currentPage: data.pagination?.currentPage || page,
          totalPages: data.pagination?.totalPages || 1,
          total: data.pagination?.totalCount || 0
        })
      } else {
        throw new Error('Failed to fetch colleges')
      }
    } catch (err) {
      toast.error('Failed to load colleges')
      console.error('Error loading colleges:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (query) => {
    if (!query) {
      loadColleges()
      return
    }

    try {
      const response = await authFetch(
        `${process.env.baseUrl}/college?q=${query}`
      )
      if (response.ok) {
        const data = await response.json()
        setColleges(data.items)

        if (data.pagination) {
          setPagination({
            currentPage: data.pagination.currentPage,
            totalPages: data.pagination.totalPages,
            total: data.pagination.totalCount
          })
        }
      } else {
        console.error('Error fetching results:', response.statusText)
        setColleges([])
      }
    } catch (error) {
      console.error('Error fetching college search results:', error.message)
      setColleges([])
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

  const handleView = async (slug) => {
    try {
      setLoadingView(true)
      setViewModalOpen(true)

      const response = await authFetch(
        `${process.env.baseUrl}/college/${slug}`,
        { headers: { 'Content-Type': 'application/json' } }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch college details')
      }

      const data = await response.json()
      setViewCollegeData(data.item)
    } catch (err) {
      toast.error(err.message || 'Failed to load college details')
      setViewModalOpen(false)
    } finally {
      setLoadingView(false)
    }
  }

  const handleCloseViewModal = () => {
    setViewModalOpen(false)
    setViewCollegeData(null)
  }

  const columns = createColumns({
    handleView,
    handleEdit,
    handleOpenCredentialsModal,
    handleDeleteClick
  })


  return (
    <>
      <div className='w-full space-y-2'>
        <div className='flex justify-between items-center px-4 pt-4'>
          {/* Search Bar */}
          <SearchInput
            value={searchQuery}
            onChange={(e) => handleSearchInput(e.target.value)}
            placeholder='Search colleges...'
            className='max-w-md'
          />
          {/* Button */}
          <div className='flex gap-2'>
            <Button
              onClick={() => {
                setIsOpen(true)
                setEditSlug('')
              }}
            >
              Add College
            </Button>
          </div>
        </div>
        <ToastContainer />

        <CreateUpdateCollegeModal
          isOpen={isOpen}
          handleCloseModal={handleCloseModal}
          editSlug={editSlug}
          onSuccess={() => loadColleges(pagination.currentPage)}
          allDegrees={allDegrees}
        />
        <ConfirmationDialog
          open={isDialogOpen}
          onClose={handleDialogClose}
          onConfirm={handleDeleteConfirm}
          title='Confirm Deletion'
          message='Are you sure you want to delete this College? This action cannot be undone.'
        />

        {/* View College Details Modal */}
        <ViewCollegeModal
          viewModalOpen={viewModalOpen}
          handleCloseViewModal={handleCloseViewModal}
          loadingView={loadingView}
          viewCollegeData={viewCollegeData}
        />

        {/*table*/}
        <div className='w-full space-y-2'>
          <Table
            loading={tableloading}
            data={colleges}
            columns={columns}
            pagination={pagination}
            onPageChange={(newPage) => loadColleges(newPage)}
            onSearch={handleSearch}
            showSearch={false}
          />
        </div>
        {/* Create Credentials Modal */}
        <CreateCredentialsModal
          setCredentialsModalOpen={setCredentialsModalOpen}
          credentialsModalOpen={credentialsModalOpen}
          selectedCollege={selectedCollege}
          setSelectedCollege={setSelectedCollege}
          setTableLoading={setTableLoading}
          pagination={pagination}
          setPagination={setPagination}
          setColleges={setColleges}
        />


      </div>
    </>
  )
}
