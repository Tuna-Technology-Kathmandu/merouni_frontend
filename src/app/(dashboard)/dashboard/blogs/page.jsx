'use client'
import { getCategories } from '@/app/action'
import { authFetch } from '@/app/utils/authFetch'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import useAdminPermission from '@/hooks/useAdminPermission'
import ConfirmationDialog from '@/ui/molecules/ConfirmationDialog'
import ImageLightbox from '@/ui/molecules/image-lightbox'
import SearchInput from '@/ui/molecules/SearchInput'
import { Button } from '@/ui/shadcn/button'
import Table from '@/ui/shadcn/DataTable'
import { Select } from '@/ui/shadcn/select'
import { formatDate } from '@/utils/date.util'
import { Edit2, Eye, Plus, Trash2 } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { fetchBlogs } from './action'
import BlogFormModal from './components/BlogFormModal'
import BlogViewModal from './components/BlogViewModal'

export default function BlogsManager() {
  const { setHeading } = usePageHeading()
  const author_id = useSelector((state) => state.user.data?.id)
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const [blogs, setBlogs] = useState([])
  const [categories, setCategories] = useState([])
  const [authors, setAuthors] = useState([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editing, setEditing] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedBlog, setSelectedBlog] = useState(null) // To pass to Modal

  const [pagination, setPagination] = useState({
    currentPage: parseInt(searchParams.get('page')) || 1,
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
  const abortControllerRef = useRef(null)

  // View Modal State
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [viewNewsData, setViewNewsData] = useState(null)
  const [loadingView, setLoadingView] = useState(false)

  // Lightbox State
  const [lightbox, setLightbox] = useState({
    isOpen: false,
    imageUrl: '',
    altText: ''
  })

  const handleImageClick = (imageUrl, altText) => {
    setLightbox({
      isOpen: true,
      imageUrl,
      altText: altText || 'Blog Image'
    })
  }

  const columns = useMemo(
    () => [
      {
        header: 'S.N.',
        accessorKey: 'id',
        cell: ({ row }) => (
          <span className="text-gray-500 font-medium">
            {(pagination.currentPage - 1) * 10 + row.index + 1}
          </span>
        )
      },
      {
        header: 'Title',
        accessorKey: 'title',
        cell: ({ row }) => {
          const { title, status, visibility, featured_image } = row.original
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
              {featured_image ? (
                <div
                  className='w-14 h-14 rounded shrink-0 overflow-hidden bg-gray-100 cursor-pointer hover:opacity-80 transition-opacity'
                  onClick={() => handleImageClick(featured_image, title)}
                >
                  <img
                    src={featured_image}
                    alt='Blog'
                    className='w-full h-full object-cover'
                  />
                </div>
              ) : (
                <div className='w-14 h-14 rounded shrink-0 bg-gray-100 border border-dashed flex items-center justify-center text-xs text-gray-400'>
                  No img
                </div>
              )}
              <div className='flex-1 overflow-hidden'>
                <div className='truncate font-semibold text-slate-900'>{title}</div>
                <div className='flex flex-wrap gap-2 mt-1'>
                  {status && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusClasses}`}
                    >
                      {statusLabel}
                    </span>
                  )}
                  {visibility && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${visibilityClasses}`}
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
        header: 'Created At',
        accessorKey: 'createdAt',
        cell: ({ getValue }) => {
          const date = new Date(getValue())
          return <div className='whitespace-nowrap text-sm text-slate-600'>{formatDate(date)}</div>
        }
      },
      {
        header: 'Actions',
        id: 'actions',
        cell: ({ row }) => (
          <div className='flex gap-1'>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleView(row.original.slug)}
              className='hover:bg-purple-50 text-purple-600'
              title='View Details'
            >
              <Eye className='w-4 h-4' />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEdit(row.original)}
              className='hover:bg-blue-50 text-blue-600'
              disabled={tagsLoading}
              title='Edit'
            >
              <Edit2 className='w-4 h-4' />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDeleteClick(row.original.id)}
              className='hover:bg-red-50 text-red-600'
              title='Delete'
            >
              <Trash2 className='w-4 h-4' />
            </Button>
          </div>
        )
      }
    ],
    [tags, tagsLoading, pagination]
  )

  useEffect(() => {
    const limit = 1000
    const loadCategories = async () => {
      try {
        const categoriesList = await getCategories({ limit, type: 'BLOG' })
        setCategories(categoriesList.items)
      } catch (error) {
        console.error('Failed to fetch categories')
      }
    }
    loadCategories()
  }, [])


  useEffect(() => {
    setHeading('Blogs Management')
    return () => {
      setHeading(null)
      if (abortControllerRef.current) {
        abortControllerRef.current.abort('Component unmounted')
      }
    }
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
      setLoading(true)
      if (abortControllerRef.current) {
        try {
          abortControllerRef.current.abort('New request started')
        } catch (e) {
          // Ignore abort errors
        }
      }
      abortControllerRef.current = new AbortController()

      const params = new URLSearchParams(searchParams.toString())
      const currentPage = params.get('page') || '1'

      if (currentPage !== String(page)) {
        params.set('page', page)
        router.push(`${pathname}?${params.toString()}`, { scroll: false })
      }

      const response = await fetchBlogs(page, 10, status, {
        signal: abortControllerRef.current.signal
      })
      setBlogs(response.items)
      setPagination({
        currentPage: response.pagination.currentPage,
        totalPages: response.pagination.totalPages,
        total: response.pagination.totalCount
      })
    } catch (err) {
      console.error('Error loading blogs data:', err)
    } finally {
      if (abortControllerRef.current?.signal?.aborted === false) {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    const page = parseInt(searchParams.get('page')) || 1
    loadData(page, statusFilter)
  }, [statusFilter, searchParams])


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
      let url = `${process.env.baseUrl}/blogs?q=${query}&sortBy=createdAt&order=DESC`
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


  return (
    <div className='w-full'>
      <ToastContainer />
      {/* Sticky Header */}
      <div className='sticky mb-3 top-0 z-30 bg-[#F7F8FA] py-4'>
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-md shadow-sm border'>
          <SearchInput
            value={searchQuery}
            onChange={(e) => handleSearchInput(e.target.value)}
            placeholder='Search blogs...'
            className='max-w-md w-full'
          />
          {/* Filters & Button */}
          <div className='flex gap-4 items-center w-full sm:w-auto'>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className='min-w-[150px] h-11'
            >
              <option value='all'>All Status</option>
              <option value='published'>Published</option>
              <option value='draft'>Draft</option>
              <option value='archived'>Archived</option>
            </Select>
            <Button
              onClick={handleAddBlog}
              className="bg-[#387cae] hover:bg-[#387cae]/90 text-white gap-2 h-11 px-6 shadow-md shadow-[#387cae]/20 transition-all active:scale-95 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Add Blog
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-md shadow-sm border overflow-hidden">
        {/* Table Section */}
        <Table
          data={blogs}
          columns={columns}
          pagination={pagination}
          onPageChange={(newPage) => loadData(newPage)}
          onSearch={handleSearch}
          showSearch={false}
          loading={loading}
          emptyContent={searchQuery ? "No blogs found matching your search." : "No blogs available."}
        />
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

      <ImageLightbox
        isOpen={lightbox.isOpen}
        onClose={() => setLightbox({ ...lightbox, isOpen: false })}
        imageUrl={lightbox.imageUrl}
        altText={lightbox.altText}
      />
    </div>
  )
}
