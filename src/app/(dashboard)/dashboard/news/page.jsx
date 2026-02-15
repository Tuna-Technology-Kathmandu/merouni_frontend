'use client'

import { authFetch } from '@/app/utils/authFetch'
import { Button } from '@/ui/shadcn/button'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import useAdminPermission from '@/hooks/useAdminPermission'
import { Edit2, Eye, Trash2 } from 'lucide-react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Table from '@/ui/shadcn/DataTable'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/ui/shadcn/dialog'
import ConfirmationDialog from '../addCollege/ConfirmationDialog'
import { fetchCategories } from '../category/action.js'
import {
  createNews,
  deleteNews,
  fetchNews,
  getNewsById,
  updateNews
} from './action'
import NewsForm from './components/NewsForm'
import { FormatDate } from '@/lib/date'
import { formatDate } from '@/utils/date.util'
import SearchInput from '@/ui/molecules/SearchInput'

export default function NewsManager() {
  const { setHeading } = usePageHeading()
  const author_id = useSelector((state) => state.user.data.id)
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editing, setEditing] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [initialData, setInitialData] = useState(null)
  const [pagination, setPagination] = useState({
    currentPage: parseInt(searchParams.get('page')) || 1,
    totalPages: 1,
    total: 0
  })
  const [deleteId, setDeleteId] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [viewNewsData, setViewNewsData] = useState(null)
  const [loadingView, setLoadingView] = useState(false)
  const [colleges, setColleges] = useState([])
  const [categories, setCategories] = useState([])
  const [loadingColleges, setLoadingColleges] = useState(false)
  const [loadingCategories, setLoadingCategories] = useState(false)

  const columns = useMemo(
    () => [
      {
        header: 'Title',
        accessorKey: 'title',
        cell: ({ row }) => {
          const { title, status, visibility, featuredImage } = row.original
          const statusLabel = status || 'draft'
          const visibilityLabel = visibility || 'private'

          const statusClasses =
            statusLabel === 'published'
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'

          const visibilityClasses =
            visibilityLabel === 'public'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-800'

          return (
            <div className='flex items-center gap-3 max-w-xs overflow-hidden'>
              {featuredImage ? (
                <div className='w-20 h-20 rounded shrink-0 overflow-hidden bg-gray-100'>
                  <img
                    src={featuredImage}
                    alt='News'
                    className='w-full h-full object-cover'
                  />
                </div>
              ) : (
                <div className='w-20 h-20 rounded shrink-0 bg-gray-100 border border-dashed flex items-center justify-center text-xs text-gray-400'>
                  No img
                </div>
              )}
              <div className='flex-1 overflow-hidden'>
                <div className='truncate font-medium text-gray-900'>{title}</div>
                <div className='flex flex-wrap gap-2 mt-1'>
                  {status && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusClasses}`}
                    >
                      {statusLabel}
                    </span>
                  )}
                  {visibility && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${visibilityClasses}`}
                    >
                      {visibilityLabel}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        }
      },
      {
        header: 'Description',
        accessorKey: 'description',
        cell: ({ getValue }) => (
          <div className='max-w-xs overflow-hidden'>
            {getValue()?.substring(0, 100)}
            {getValue()?.length > 100 ? '...' : ''}
          </div>
        )
      },
      {
        header: 'Created At',
        accessorKey: 'createdAt',
        cell: ({ getValue }) => {
          const date = new Date(getValue())
          return (
            <div className='whitespace-nowrap'>{date.toLocaleDateString()}</div>
          )
        }
      },
      {
        header: 'Associated College',
        accessorKey: 'newsCollege.name',
        cell: ({ row }) => row.original.newsCollege?.name || 'N/A'
      },
      {
        header: 'Category',
        accessorKey: 'newsCategory.name',
        cell: ({ row }) => row.original.newsCategory?.title || 'N/A'
      },
      {
        header: 'Actions',
        id: 'actions',
        cell: ({ row }) => (
          <div className='flex gap-2'>
            <button
              onClick={() => handleView(row.original.id)}
              className='p-1 text-purple-600 hover:text-purple-800'
              title='View Details'
            >
              <Eye className='w-4 h-4' />
            </button>
            <button
              onClick={() => handleEdit(row.original)}
              className='p-1 text-blue-600 hover:text-blue-800'
            >
              <Edit2 className='w-4 h-4' />
            </button>
            <button
              onClick={() => handleDeleteClick(row.original.id)}
              className='p-1 text-red-600 hover:text-red-800'
            >
              <Trash2 className='w-4 h-4' />
            </button>
          </div>
        )
      }
    ],
    []
  )

  useEffect(() => {
    setHeading('News Management')
    const page = parseInt(searchParams.get('page')) || 1
    loadData(page)
    return () => setHeading(null)
  }, [setHeading, searchParams])

  // Check for 'add' query parameter
  useEffect(() => {
    const addParam = searchParams.get('add')
    if (addParam === 'true') {
      setIsOpen(true)
      setEditing(false)
      setInitialData(null)
      fetchAllColleges()
      fetchAllCategories()
      router.replace('/dashboard/news')
    }
  }, [searchParams, router])

  const { requireAdmin } = useAdminPermission()

  const fetchAllColleges = async (force = false) => {
    if (colleges.length > 0 && !force) return
    try {
      setLoadingColleges(true)
      const response = await authFetch(
        `${process.env.baseUrl}/college?limit=1000`
      )
      if (response.ok) {
        const data = await response.json()
        setColleges(data.items || [])
      }
    } catch (err) {
      console.error('Error loading colleges:', err)
    } finally {
      setLoadingColleges(false)
    }
  }

  const fetchAllCategories = async (force = false) => {
    if (categories.length > 0 && !force) return
    try {
      setLoadingCategories(true)
      const response = await fetchCategories(1, 1000, 'NEWS')
      setCategories(response.items || [])
    } catch (err) {
      console.error('Error loading categories:', err)
    } finally {
      setLoadingCategories(false)
    }
  }

  const loadData = async (page = 1, search = '') => {
    try {
      const params = new URLSearchParams(searchParams.toString())
      params.set('page', page)
      router.push(`${pathname}?${params.toString()}`, { scroll: false })

      setLoading(true)
      const response = await fetchNews(page, search)

      setNews(response.items || [])
      setPagination({
        currentPage: response.pagination?.currentPage || 1,
        totalPages: response.pagination?.totalPages || 1,
        total: response.pagination?.totalCount || 0
      })
    } catch (error) {
      console.error('Error loading news:', error)
      toast.error('Failed to fetch news')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
    loadData(1, query)
  }

  const handleSubmit = async (data) => {
    try {
      setSubmitting(true)

      const newsData = {
        title: data.title,
        description: data.description,
        featuredImage: data.featuredImage,
        status: data.status,
        visibility: data.visibility || 'private',
        author: author_id,
        college_id: data.college_id || null,
        category_id: data.category_id || null
      }

      if (editing && editingId) {
        await updateNews(editingId, newsData)
        toast.success('News updated successfully')
      } else {
        await createNews(newsData)
        toast.success('News created successfully')
      }

      setIsOpen(false)
      setEditing(false)
      setEditingId(null)
      setInitialData(null)
      loadData(pagination.currentPage, searchQuery)
    } catch (error) {
      console.error('Error saving news:', error)
      toast.error(`Failed to ${editing ? 'update' : 'create'} news`)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (newsItem) => {
    setInitialData(newsItem)
    setEditingId(newsItem.id)
    setEditing(true)
    setIsOpen(true)
    fetchAllColleges()
    fetchAllCategories()
  }

  const handleView = async (id) => {
    try {
      setLoadingView(true)
      setViewModalOpen(true)
      const newsData = await getNewsById(id)
      setViewNewsData(newsData)
    } catch (error) {
      console.error('Error fetching news details:', error)
      toast.error('Failed to load news details')
      setViewModalOpen(false)
    } finally {
      setLoadingView(false)
    }
  }

  const handleCloseViewModal = () => {
    setViewModalOpen(false)
    setViewNewsData(null)
  }

  const handleDeleteClick = (id) => {
    requireAdmin(() => {
      setDeleteId(id)
      setIsDialogOpen(true)
    }, 'You do not have permission to delete news.')
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setDeleteId(null)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteId) return

    try {
      await deleteNews(deleteId)
      toast.success('News deleted successfully')
      loadData(pagination.currentPage, searchQuery)
    } catch (error) {
      console.error('Error deleting news:', error)
      toast.error('Failed to delete news')
    } finally {
      handleDialogClose()
    }
  }

  const handleModalClose = () => {
    setIsOpen(false)
    setEditing(false)
    setEditingId(null)
    setInitialData(null)
  }

  return (
    <>
      <div className='w-full space-y-2'>
        <div className='px-4 space-y-4'>
        <div className='flex justify-between items-center pt-4'>
          <SearchInput
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder='Search news...'
            className='max-w-md'
          />
          <Button
            onClick={() => {
              setIsOpen(true)
              setEditing(false)
              setInitialData(null)
              fetchAllColleges()
              fetchAllCategories()
            }}
          >
            Add News
          </Button>
        </div>

        {/* News Form Modal */}
        <NewsForm
          isOpen={isOpen}
          onClose={handleModalClose}
          editing={editing}
          initialData={initialData}
          onSubmit={handleSubmit}
          submitting={submitting}
          colleges={colleges}
          categories={categories}
          loadingColleges={loadingColleges}
          loadingCategories={loadingCategories}
        />

        {/* Table Section */}
        <Table
          data={news}
          columns={columns}
          pagination={pagination}
          onPageChange={(newPage) => loadData(newPage, searchQuery)}
          onSearch={handleSearch}
          showSearch={false}
        />
      </div>
      </div>
      <ToastContainer position='top-right' />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        onConfirm={handleDeleteConfirm}
        title='Confirm Deletion'
        message='Are you sure you want to delete this news? This action cannot be undone.'
      />

      {/* View News Details Modal */}
      <Dialog
        isOpen={viewModalOpen}
        onClose={handleCloseViewModal}
      >
        <DialogContent className='max-w-3xl'>
          <DialogHeader>
            <DialogTitle>News Details</DialogTitle>
          </DialogHeader>
        {loadingView ? (
          <div className='flex justify-center items-center h-48'>
            Loading...
          </div>
        ) : viewNewsData ? (
          <div className='space-y-4 max-h-[70vh] overflow-y-auto p-2'>
            {viewNewsData.featuredImage && (
              <div className='w-full h-64 rounded-lg overflow-hidden'>
                <img
                  src={viewNewsData.featuredImage}
                  alt={viewNewsData.title}
                  className='w-full h-full object-cover'
                />
              </div>
            )}
            <div>
              <h2 className='text-2xl font-bold mb-2'>{viewNewsData.title}</h2>
              <div className='flex gap-2 mb-4'>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${viewNewsData.status === 'published'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                    }`}
                >
                  {viewNewsData.status}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${viewNewsData.visibility === 'public'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                    }`}
                >
                  {viewNewsData.visibility}
                </span>
              </div>
            </div>
            {viewNewsData.description && (
              <div>
                <h3 className='font-semibold mb-2'>Description</h3>
                <p className='text-gray-700'>{viewNewsData.description}</p>
              </div>
            )}
            <div className='grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg'>
              <div>
                <h3 className='text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1'>
                  Associated College
                </h3>
                <p className='text-sm font-medium'>
                  {viewNewsData.newsCollege?.name || 'N/A'}
                </p>
              </div>
              <div>
                <h3 className='text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1'>
                  Category
                </h3>
                <p className='text-sm font-medium'>
                  {viewNewsData.newsCategory?.title || 'N/A'}
                </p>
              </div>
            </div>
            {viewNewsData.createdAt && (
              <div className='text-sm text-gray-500'>
                Created: {formatDate(viewNewsData.createdAt)}
              </div>
            )}
          </div>
        ) : (
          <div className='text-center py-8 text-gray-500'>
            No data available
          </div>
        )}
        </DialogContent>
      </Dialog>
    </>
  )
}
