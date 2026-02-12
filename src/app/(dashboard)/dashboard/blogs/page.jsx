'use client'
import { useState, useEffect, useMemo, useRef } from 'react'
import { fetchBlogs, fetchTags } from './action'
import { getCategories } from '@/app/action'
import { authFetch } from '@/app/utils/authFetch'
import Loader from '@/ui/molecules/Loading'
import Table from '@/ui/shadcn/DataTable'
import { Select } from '@/ui/shadcn/select'
import { Edit2, Trash2, Eye } from 'lucide-react'
import SearchInput from '@/ui/molecules/SearchInput'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useSelector } from 'react-redux'
import ConfirmationDialog from '../addCollege/ConfirmationDialog'
import useAdminPermission from '@/hooks/useAdminPermission'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/ui/shadcn/button'
import { formatDate } from '@/utils/date.util'
import BlogFormModal from './components/BlogFormModal'
import BlogViewModal from './components/BlogViewModal'

export default function BlogsManager() {
  const { setHeading } = usePageHeading()
  const author_id = useSelector((state) => state.user.data.id)
  const searchParams = useSearchParams()
  const router = useRouter()

  const [blogs, setBlogs] = useState([])
  const [categories, setCategories] = useState([])
  const [authors, setAuthors] = useState([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editing, setEditing] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedBlog, setSelectedBlog] = useState(null) // To pass to Modal

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  })
  const [tags, setTags] = useState([])
  const [deleteId, setDeleteId] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [tagsLoading, setTagsLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [newsSearchTimeout, setNewsSearchTimeout] = useState(null)

  // View Modal State
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [viewNewsData, setViewNewsData] = useState(null)
  const [loadingView, setLoadingView] = useState(false)

  const columns = useMemo(
    () => [
      {
        header: 'Title',
        accessorKey: 'title',
        cell: ({ row }) => {
          const { title, status, visibility } = row.original
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
            <div className='max-w-xs overflow-hidden'>
              <div className='truncate'>{title}</div>
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
          return <div className='whitespace-nowrap'>{formatDate(date)}</div>
        }
      },
      {
        header: 'Actions',
        id: 'actions',
        cell: ({ row }) => (
          <div className='flex gap-2'>
            <button
              onClick={() => handleView(row.original.slug)}
              className='p-1 text-purple-600 hover:text-purple-800'
              title='View Details'
            >
              <Eye className='w-4 h-4' />
            </button>
            <button
              onClick={() => handleEdit(row.original)}
              className='p-1 text-blue-600 hover:text-blue-800'
              disabled={tagsLoading}
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
    [tags, tagsLoading]
  )

  useEffect(() => {
    const limit = 1000
    const loadCategories = async () => {
      try {
        const categoriesList = await getCategories({ limit })
        setCategories(categoriesList.items)
      } catch (error) {
        console.error('Failed to fetch categories')
      }
    }
    loadCategories()
  }, [])


  useEffect(() => {
    setHeading('Blogs Management')
    loadData()
    return () => setHeading(null)
  }, [setHeading])

  // Check for 'add' query parameter and open modal
  useEffect(() => {
    const addParam = searchParams.get('add')
    if (addParam === 'true') {
      handleAddBlog()
      router.replace('/dashboard/blogs', { scroll: false })
    }
  }, [searchParams, router])

  useEffect(() => {
    return () => {
      if (newsSearchTimeout) {
        clearTimeout(newsSearchTimeout)
      }
    }
  }, [newsSearchTimeout])

  const { requireAdmin } = useAdminPermission()

  const [statusFilter, setStatusFilter] = useState('all')

  const loadData = async (page = 1, status = statusFilter) => {
    try {
      const response = await fetchBlogs(page, 10, status)
      setBlogs(response.items)
      setPagination({
        currentPage: response.pagination.currentPage,
        totalPages: response.pagination.totalPages,
        total: response.pagination.totalCount
      })
    } catch (err) {
      toast.error('Failed to load blogs')
      console.error('Error loading blogs data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData(1, statusFilter)
  }, [statusFilter])


  const createBlogs = async (data) => {
    try {
      // Ensure tags are mapped if they came back as objects [ {id, title} ]
      const formattedData = {
        ...data,
        tags: data.tags.map(t => typeof t === 'object' ? t.id : t),
        author: author_id // Ensure author is set
      }

      const response = await authFetch(
        `${process.env.baseUrl}/blogs`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formattedData)
        }
      )
      if (!response.ok) {
        const res = await response.json()
        throw new Error(res.message || 'Failed to create news')
      }
      return await response.json()
    } catch (error) {
      console.error('Error creating news:', error)
      throw error
    }
  }

  const updateBlogs = async (data, id) => {
    try {
      const formattedData = {
        ...data,
        tags: data.tags.map(t => typeof t === 'object' ? t.id : t)
      }
      const response = await authFetch(
        `${process.env.baseUrl}/blogs?id=${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formattedData)
        }
      )
      if (!response.ok) {
        const res = await response.json()
        throw new Error(res.message || 'Failed to update blog')
      }
      return await response.json()
    } catch (error) {
      console.error('Error updating blog:', error)
      throw error
    }
  }

  const handleEdit = (blog) => {
    setEditingId(blog.id)
    setEditing(true)
    setSelectedBlog(blog)
    setIsOpen(true)
  }

  const handleAddBlog = () => {
    setEditingId(null)
    setEditing(false)
    setSelectedBlog(null)
    setIsOpen(true)
  }

  const handleSearch = async (query) => {
    if (!query) {
      loadData()
      return
    }

    try {
      let url = `${process.env.baseUrl}/blogs?q=${query}`
      if (statusFilter && statusFilter !== 'all') {
        url += `&status=${statusFilter}`
      }
      const response = await authFetch(url)
      if (response.ok) {
        const data = await response.json()
        setBlogs(data.items)

        if (data.pagination) {
          setPagination({
            currentPage: data.pagination.currentPage,
            totalPages: data.pagination.totalPages,
            total: data.pagination.totalCount
          })
        }
      } else {
        console.error('Error fetching results:', response.statusText)
        setBlogs([])
      }
    } catch (error) {
      console.error('Error fetching news search results:', error.message)
      setBlogs([])
    }
  }

  const handleSearchInput = (value) => {
    setSearchQuery(value)

    if (newsSearchTimeout) {
      clearTimeout(newsSearchTimeout)
    }

    if (value === '') {
      handleSearch('')
    } else {
      const timeoutId = setTimeout(() => {
        handleSearch(value)
      }, 300)
      setNewsSearchTimeout(timeoutId)
    }
  }

  const handleSave = async (data) => {
    setSubmitting(true)
    try {
      if (editingId) {
        await updateBlogs(data, editingId)
        toast.success('News updated successfully')
      } else {
        await createBlogs(data)
        toast.success('News created successfully')
      }
      setIsOpen(false)
      setEditingId(null)
      setEditing(false)
      setSelectedBlog(null)
      loadData()
    } catch (err) {
      const errorMsg = err.message || 'Network error occurred'
      toast.error(
        `Failed to ${editingId ? 'update' : 'create'} news: ${errorMsg}`
      )
    } finally {
      setSubmitting(false)
    }
  }

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
        `${process.env.baseUrl}/blogs?id=${deleteId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      const res = await response.json()
      toast.success(res.message)
      loadData()
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

  const handleView = async (slug) => {
    try {
      setLoadingView(true)
      setViewModalOpen(true)
      const response = await authFetch(
        `${process.env.baseUrl}/blogs/${slug}`,
        { headers: { 'Content-Type': 'application/json' } }
      )
      if (!response.ok) {
        throw new Error('Failed to fetch news details')
      }
      const data = await response.json()
      setViewNewsData(data.blog)
    } catch (err) {
      toast.error(err.message || 'Failed to load news details')
      setViewModalOpen(false)
    } finally {
      setLoadingView(false)
    }
  }

  const handleCloseViewModal = () => {
    setViewModalOpen(false)
    setViewNewsData(null)
  }

  const handleCloseModal = () => {
    setIsOpen(false)
    setEditing(false)
    setEditingId(null)
    setSelectedBlog(null)
  }

  if (loading)
    return (
      <div className='mx-auto'>
        <Loader />
      </div>
    )

  return (
    <>
      <div className='w-full space-y-2'>
        <div className='px-4 space-y-4'>
        <div className='flex justify-between items-center pt-4'>
          {/* Search Bar */}
          <SearchInput
            value={searchQuery}
            onChange={(e) => handleSearchInput(e.target.value)}
            placeholder='Search blogs...'
            className='max-w-md'
          />
          {/* Filters & Button */}
          <div className='flex gap-4 items-center'>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className='min-w-[150px]'
            >
              <option value='all'>All Status</option>
              <option value='published'>Published</option>
              <option value='draft'>Draft</option>
              <option value='archived'>Archived</option>
            </Select>
            <Button onClick={handleAddBlog}>
              Add Blog
            </Button>
          </div>
        </div>

        <BlogFormModal
          isOpen={isOpen}
          onClose={handleCloseModal}
          isEditing={editing}
          initialData={selectedBlog}
          categories={categories}
          onSave={handleSave}
          submitting={submitting}
        />

        {/* Table Section */}
        <Table
          data={blogs}
          columns={columns}
          pagination={pagination}
          onPageChange={(newPage) => loadData(newPage)}
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
        message='Are you sure you want to delete this blog? This action cannot be undone.'
      />

      <BlogViewModal
        isOpen={viewModalOpen}
        onClose={handleCloseViewModal}
        data={viewNewsData}
        loading={loadingView}
      />
    </>
  )
}
