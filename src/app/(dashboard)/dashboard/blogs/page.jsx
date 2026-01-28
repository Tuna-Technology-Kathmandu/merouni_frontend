'use client'
import dynamic from 'next/dynamic'
import { useState, useEffect, useMemo, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { fetchBlogs, fetchTags } from './action'
import { getCategories } from '@/app/action'
import { authFetch } from '@/app/utils/authFetch'
import Loader from '../../../../components/Loading'
import Table from '../../../../components/Table'
import { Edit2, Trash2, Search, Eye } from 'lucide-react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useSelector } from 'react-redux'
import FileUpload from '../addCollege/FileUpload'
import ConfirmationDialog from '../addCollege/ConfirmationDialog'
import useAdminPermission from '@/hooks/useAdminPermission'
import { Modal } from '../../../../components/UserModal'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '../../../../components/ui/button'
import { Input } from '../../../../components/ui/input'
import { Label } from '../../../../components/ui/label'
import { DotenvConfig } from '@/config/env.config'

const CKBlogs = dynamic(() => import('../component/CKBlogs'), {
  ssr: false
})

// Helper component for required label
const RequiredLabel = ({ children, htmlFor }) => (
  <Label htmlFor={htmlFor}>
    {children} <span className='text-red-500'>*</span>
  </Label>
)

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
  const [uploadedFiles, setUploadedFiles] = useState({
    featuredImage: ''
  })
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  })
  const [tags, setTags] = useState([])
  const [selectedTags, setSelectedTags] = useState([])
  const [tagsSearch, setTagsSearch] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [deleteId, setDeleteId] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [tagsLoading, setTagsLoading] = useState(false)
  const searchTimeout = useRef(null)
  const [submitting, setSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [newsSearchTimeout, setNewsSearchTimeout] = useState(null)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [viewNewsData, setViewNewsData] = useState(null)
  const [loadingView, setLoadingView] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      title: '',
      category: '',
      tags: [],
      author: author_id,
      featuredImage: '',
      description: '',
      content: '',
      status: 'draft',
      visibility: 'private'
    }
  })

  const editorRef = useRef(null)
  const hasSetContent = useRef(false)

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
          return (
            <div className='whitespace-nowrap'>{date.toLocaleDateString()}</div>
          )
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
    [tags]
  )

  const fetchTagById = async (tagId) => {
    console.log('I am here')
    const response = await authFetch(
      `${DotenvConfig.NEXT_APP_API_BASE_URL}/tag/${tagId}`
    )
    const data = await response.json()
    console.log('Data of tag id:', data)
    return data.item || data
  }

  useEffect(() => {
    console.log('Tags state updated:', tags)
  }, [tags])

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
    const loadTags = async () => {
      setTagsLoading(true)
      try {
        const tagList = await fetchTags()
        console.log('Fetched tags from API:', tagList) // Debug log
        if (tagList && tagList.items) {
          setTags(tagList.items)
          console.log('Set tags state to:', tagList.items) // Debug log
        } else {
          console.error('Invalid tags data structure:', tagList)
        }
      } catch (error) {
        console.error('Failed to fetch tags:', error)
      } finally {
        setTagsLoading(false)
      }
    }
    loadTags()
  }, [])

  const handleTagsSearch = (e) => {
    const query = e.target.value
    setTagsSearch(query)

    // debounce search calls
    if (searchTimeout.current) clearTimeout(searchTimeout.current)
    if (query.length < 2) {
      setSearchResults([])
      return
    }
    searchTimeout.current = setTimeout(async () => {
      try {
        const response = await authFetch(
          `${DotenvConfig.NEXT_APP_API_BASE_URL}/tag?q=${query}`
        )
        const data = await response.json()
        setSearchResults(data.items || [])
      } catch (error) {
        console.error('Tags Search Error:', error)
        toast.error('Failed to search tags')
      }
    }, 300)
  }
  useEffect(() => {
    setHeading('Blogs Management')
    loadData()
    return () => setHeading(null)
  }, [setHeading])

  // Check for 'add' query parameter and open modal
  useEffect(() => {
    const addParam = searchParams.get('add')
    if (addParam === 'true') {
      setIsOpen(true)
      setEditing(false)
      setEditingId(null)
      reset()
      setSelectedTags([])
      setUploadedFiles({ featuredImage: '' })
      // Remove query parameter from URL
      router.replace('/dashboard/blogs', { scroll: false })
    }
  }, [searchParams, router, reset])

  useEffect(() => {
    return () => {
      if (newsSearchTimeout) {
        clearTimeout(newsSearchTimeout)
      }
    }
  }, [newsSearchTimeout])

  const { requireAdmin } = useAdminPermission()

  // Function to add a tag from search results
  const handleSelectTag = (tag) => {
    if (!selectedTags.some((t) => t.id === tag.id)) {
      const newTags = [...selectedTags, tag]
      setSelectedTags(newTags)
      setValue(
        'tags',
        newTags.map((t) => t.id)
      )
    }
    // Clear search input and results after selection
    setTagsSearch('')
    setSearchResults([])
  }

  const loadData = async (page = 1) => {
    try {
      const response = await fetchBlogs(page)
      setBlogs(response.items)
      setPagination({
        currentPage: response.pagination.currentPage,
        totalPages: response.pagination.totalPages,
        total: response.pagination.totalCount
      })
    } catch (err) {
      toast.error('Failed to load news')
      console.error('Error loading news data:', err)
    } finally {
      setLoading(false)
    }
  }

  const createBlogs = async (data) => {
    try {
      // Send tags directly as an array of numbers
      const formattedData = {
        ...data,
        category: data.category,
        tags: selectedTags.map((tag) => tag.id),
        featuredImage: uploadedFiles.featuredImage
      }

      const response = await authFetch(
        `${DotenvConfig.NEXT_APP_API_BASE_URL}/blogs`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formattedData)
        }
      )
      if (!response.ok) {
        throw new Error('Failed to create news')
      }
      return await response.json()
    } catch (error) {
      console.error('Error creating news:', error)
      throw error
    }
  }

  const updateBlogs = async (data, id) => {
    try {
      // Send tags directly as an array of numbers
      const formattedData = {
        ...data,
        category: data.category,
        tags: selectedTags.map((tag) => tag.id),
        featuredImage: uploadedFiles.featuredImage
      }
      const response = await authFetch(
        `${DotenvConfig.NEXT_APP_API_BASE_URL}/blogs?id=${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formattedData)
        }
      )
      if (!response.ok) {
        throw new Error('Failed to update blog')
      }
      return await response.json()
    } catch (error) {
      console.error('Error updating blog:', error)
      throw error
    }
  }

  const handleEdit = async (blog) => {
    hasSetContent.current = false
    setEditingId(blog.id)
    setEditing(true)
    setIsOpen(true)

    // Attempt to parse blog.tags if it's a string
    let blogTags = blog.tags
    if (typeof blogTags === 'string') {
      try {
        blogTags = JSON.parse(blogTags)
      } catch (error) {
        console.error('Error parsing blog.tags string:', error)
        blogTags = []
      }
    }

    console.log('Parsed blog tags:', blogTags)

    // First fetch any missing tags
    const missingTagIds = blogTags.filter(
      (tagId) => !tags.some((t) => t.id === tagId)
    )

    let allTags = [...tags] // Start with existing tags

    if (missingTagIds.length > 0) {
      const fetchPromises = missingTagIds.map((tagId) => fetchTagById(tagId))
      const fetchedTags = (await Promise.all(fetchPromises)).filter(Boolean)
      allTags = [...tags, ...fetchedTags] // Combine existing and newly fetched tags
      setTags(allTags) // Update tags state
    }

    // Now we have all necessary tags, we can set the existing tags
    let existingTags = []
    if (Array.isArray(blogTags)) {
      if (blogTags.length > 0 && typeof blogTags[0] === 'number') {
        existingTags = blogTags
          .map((tagId) => {
            const found = allTags.find((t) => t.id === tagId) // Use allTags instead of tags
            if (!found) {
              console.warn(`Tag with ID ${tagId} not found in local state`)
            }
            return found
          })
          .filter(Boolean)
      } else if (blogTags.length > 0 && typeof blogTags[0] === 'object') {
        existingTags = blogTags
      }
    } else {
      console.warn('blog.tags is not an array after parsing:', blogTags)
    }

    console.log('Existing tags for editing:', existingTags)

    // Update state and form values
    setSelectedTags(existingTags)
    setValue(
      'tags',
      existingTags.map((tag) => tag.id)
    )
    setValue('content', blog.content)

    // Populate other form fields from blog
    Object.keys(blog).forEach((key) => {
      if (key !== 'tags') {
        setValue(key, blog[key])
      }
    })

    // Handle featured image separately
    setUploadedFiles((prev) => ({
      ...prev,
      featuredImage: blog.featuredImage || ''
    }))
    setValue('featuredImage', blog.featuredImage)
  }

  const handleSearch = async (query) => {
    if (!query) {
      loadData()
      return
    }

    try {
      const response = await authFetch(
        `${DotenvConfig.NEXT_APP_API_BASE_URL}/blogs?q=${query}`
      )
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

  const onSubmit = async (data) => {
    setSubmitting(true)
    try {
      if (editingId) {
        await updateBlogs(data, editingId)
        toast.success('News updated successfully')
      } else {
        await createBlogs(data)
        toast.success('News created successfully')
      }
      reset()
      setEditingId(null)
      setEditing(false)
      setIsOpen(false)
      setSelectedTags([])
      setUploadedFiles({ featuredImage: '' })
      loadData()
      setSubmitting(false)
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Network error occurred'
      toast.error(
        `Failed to ${editingId ? 'update' : 'create'} news: ${errorMsg}`
      )
      console.error('Error saving news:', err)
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
        `${DotenvConfig.NEXT_APP_API_BASE_URL}/blogs?id=${deleteId}`,
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
        `${DotenvConfig.NEXT_APP_API_BASE_URL}/blogs/${slug}`,
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

  if (loading)
    return (
      <div className='mx-auto'>
        <Loader />
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
              className='w-full pl-10 pr-4 py-2 text-sm border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring'
              placeholder='Search news...'
            />
          </div>
          {/* Button */}
          <div className='flex gap-2'>
            <Button
              onClick={() => {
                setIsOpen(true)
                setEditing(false)
                setEditingId(null)
                reset()
                setSelectedTags([])
                setUploadedFiles({ featuredImage: '' })
              }}
            >
              Add Blog
            </Button>
          </div>
        </div>
        <ToastContainer />

        <Modal
          isOpen={isOpen}
          onClose={() => {
            setIsOpen(false)
            setEditing(false)
            setEditingId(null)
            reset()
            setSelectedTags([])
            setUploadedFiles({ featuredImage: '' })
          }}
          title={editing ? 'Edit Blog' : 'Add Blog'}
          className='max-w-5xl'
        >
          <div className='container mx-auto p-1 flex flex-col max-h-[calc(100vh-200px)]'>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className='flex flex-col flex-1 overflow-hidden'
            >
              <div className='flex-1 overflow-y-auto space-y-6 pr-2'>
                {/* Basic Information */}
                <div className='bg-white p-6 rounded-lg shadow-md'>
                  <h2 className='text-xl font-semibold mb-4'>
                    Blog Information
                  </h2>
                  <div className='space-y-4'>
                    <div>
                      <RequiredLabel htmlFor='title'>Blog Title</RequiredLabel>
                      <Input
                        id='title'
                        placeholder='Blog Title'
                        {...register('title', {
                          required: 'Title is required'
                        })}
                        aria-invalid={errors.title ? 'true' : 'false'}
                      />
                      {errors.title && (
                        <p className='text-sm font-medium text-destructive mt-1'>
                          {errors.title.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <RequiredLabel htmlFor='category'>Category</RequiredLabel>
                      <select
                        id='category'
                        {...register('category', {
                          required: 'Category is required'
                        })}
                        className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                      >
                        <option value=''>Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.title}
                          </option>
                        ))}
                      </select>
                      {errors.category && (
                        <p className='text-sm font-medium text-destructive mt-1'>
                          {errors.category.message}
                        </p>
                      )}
                    </div>

                    {/* Tags search input */}
                    <div className='relative'>
                      <Input
                        type='text'
                        placeholder='Search for tags...'
                        value={tagsSearch}
                        onChange={handleTagsSearch}
                      />

                      {/* Display search results in a dropdown */}
                      {searchResults.length > 0 && (
                        <div className='absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto'>
                          {searchResults.map((tag) => (
                            <div
                              key={tag.id}
                              className='p-2 hover:bg-gray-100 cursor-pointer'
                              onClick={() => handleSelectTag(tag)}
                            >
                              {tag.title}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Display selected tags */}
                      <div className='mt-2 flex flex-wrap gap-2'>
                        {selectedTags.map((tag) => (
                          <span
                            key={tag.id}
                            className='bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center gap-1'
                          >
                            {tag.title}
                            <button
                              type='button'
                              onClick={() => {
                                const newTags = selectedTags.filter(
                                  (t) => t.id !== tag.id
                                )
                                setSelectedTags(newTags)
                                setValue(
                                  'tags',
                                  newTags.map((t) => t.id)
                                )
                              }}
                              className='text-blue-600 hover:text-blue-800 ml-1'
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description and Content */}
                <div className='bg-white p-6 rounded-lg shadow-md'>
                  <h2 className='text-xl font-semibold mb-4'>
                    Description & Content
                  </h2>
                  <div className='space-y-4'>
                    <div>
                      <Label htmlFor='description'>Description</Label>
                      <textarea
                        id='description'
                        placeholder='Description'
                        {...register('description')}
                        className='flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                        rows='4'
                      />
                    </div>

                    <div>
                      <label htmlFor='content' className='block mb-2'>
                        Content
                      </label>
                      <CKBlogs
                        initialData={getValues('content')}
                        onChange={(data) => setValue('content', data)}
                        id='editor1'
                      />
                    </div>
                  </div>
                </div>

                {/* Media */}
                <div className='bg-white p-6 rounded-lg shadow-md'>
                  <h2 className='text-xl font-semibold mb-4'>Featured Image </h2>
                  <FileUpload
                    label='Blog Image'
                    onUploadComplete={(url) => {
                      setUploadedFiles((prev) => ({
                        ...prev,
                        featuredImage: url
                      }))
                    }}
                    defaultPreview={uploadedFiles.featuredImage}
                  />
                </div>

                {/* Additional Settings */}
                <div className='bg-white p-6 rounded-lg shadow-md'>
                  <h2 className='text-xl font-semibold mb-4'>
                    Additional Settings
                  </h2>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <Label htmlFor='visibility'>Visibility</Label>
                      <select
                        id='visibility'
                        {...register('visibility')}
                        className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                      >
                        <option value='private'>Private</option>
                        <option value='public'>Public</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor='status'>Status</Label>
                      <select
                        id='status'
                        {...register('status')}
                        className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                      >
                        <option value='draft'>Draft</option>
                        <option value='published'>Published</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button - Sticky Footer */}
              <div className='sticky bottom-0 bg-white border-t pt-4 pb-2 mt-4 flex justify-end'>
                <Button
                  type='submit'
                  className=' text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors disabled:bg-blue-300'
                  disabled={submitting}
                >
                  {submitting
                    ? editing
                      ? 'Updating...'
                      : 'Adding...'
                    : editing
                      ? 'Update Blog'
                      : 'Create Blog'}
                </Button>
              </div>
            </form>
          </div>
        </Modal>

        {/* Table Section */}
        <div className='mt-8'>
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

      {/* View News Details Modal */}
      <Modal
        isOpen={viewModalOpen}
        onClose={handleCloseViewModal}
        title='Blog Details'
        className='max-w-3xl'
      >
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
              <h2 className='text-2xl font-bold text-gray-800'>
                {viewNewsData.title}
              </h2>
              <div className='flex gap-2 mt-2'>
                {viewNewsData.status && (
                  <span
                    className={`px-2 py-0.5 text-xs font-semibold rounded-full ${viewNewsData.status === 'published'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                      }`}
                  >
                    {viewNewsData.status}
                  </span>
                )}
                {viewNewsData.visibility && (
                  <span
                    className={`px-2 py-0.5 text-xs font-semibold rounded-full ${viewNewsData.visibility === 'public'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                      }`}
                  >
                    {viewNewsData.visibility}
                  </span>
                )}
              </div>
            </div>

            {viewNewsData.newsCategory && (
              <div>
                <h3 className='text-lg font-semibold mb-2'>Category</h3>
                <p className='text-gray-700'>
                  {viewNewsData.newsCategory.title}
                </p>
              </div>
            )}

            {viewNewsData.newsAuthor && (
              <div>
                <h3 className='text-lg font-semibold mb-2'>Author</h3>
                <p className='text-gray-700'>
                  {viewNewsData.newsAuthor.firstName}{' '}
                  {viewNewsData.newsAuthor.middleName}{' '}
                  {viewNewsData.newsAuthor.lastName}
                </p>
              </div>
            )}

            {viewNewsData.tags &&
              Array.isArray(viewNewsData.tags) &&
              viewNewsData.tags.length > 0 && (
                <div>
                  <h3 className='text-lg font-semibold mb-2'>Tags</h3>
                  <div className='flex flex-wrap gap-2'>
                    {viewNewsData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className='px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm'
                      >
                        {typeof tag === 'object' ? tag.title || tag.name : tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            {viewNewsData.description && (
              <div>
                <h3 className='text-lg font-semibold mb-2'>Description</h3>
                <div
                  className='text-gray-700 prose max-w-none'
                  dangerouslySetInnerHTML={{
                    __html: viewNewsData.description
                  }}
                />
              </div>
            )}

            {viewNewsData.content && (
              <div>
                <h3 className='text-lg font-semibold mb-2'>Content</h3>
                <div
                  className='text-gray-700 prose max-w-none'
                  dangerouslySetInnerHTML={{
                    __html: viewNewsData.content
                  }}
                />
              </div>
            )}

            {viewNewsData.createdAt && (
              <div className='pt-4 border-t'>
                <p className='text-sm text-gray-500'>
                  Created:{' '}
                  {new Date(viewNewsData.createdAt).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        ) : (
          <p className='text-center text-gray-500'>No blog data available.</p>
        )}
      </Modal>
    </>
  )
}
