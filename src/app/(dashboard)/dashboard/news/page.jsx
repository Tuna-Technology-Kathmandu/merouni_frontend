'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { fetchNews, fetchTags } from './action'
import { getCategories } from '@/app/action'
import { authFetch } from '@/app/utils/authFetch'
import Loader from '@/app/components/Loading'
import Table from '../../../components/Table'
import { Edit2, Trash2 } from 'lucide-react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useSelector } from 'react-redux'
import FileUpload from '../addCollege/FileUpload'
import ConfirmationDialog from '../addCollege/ConfirmationDialog'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

export default function NewsManager() {
  const author_id = useSelector((state) => state.user.data.id)

  const [news, setNews] = useState([])
  const [categories, setCategories] = useState([])
  const [authors, setAuthors] = useState([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState(null)
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

  const {
    register,
    handleSubmit,
    reset,
    setValue,
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

  const content = watch('content')

  const columns = useMemo(
    () => [
      {
        header: 'Title',
        accessorKey: 'title',
        cell: ({ getValue }) => (
          <div className='max-w-xs overflow-hidden'>{getValue()}</div>
        )
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
        header: 'Content',
        accessorKey: 'content',
        cell: ({ getValue }) => (
          <div className='max-w-xs overflow-hidden'>
            {getValue()?.substring(0, 100)}
            {getValue()?.length > 100 ? '...' : ''}
          </div>
        )
      },
      {
        header: 'Status',
        accessorKey: 'status',
        cell: ({ getValue }) => (
          <span
            className={`px-2 py-1 rounded-full text-sm ${
              getValue() === 'published'
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {getValue()}
          </span>
        )
      },
      {
        header: 'Visibility',
        accessorKey: 'visibility',
        cell: ({ getValue }) => (
          <span
            className={`px-2 py-1 rounded-full text-sm ${
              getValue() === 'public'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {getValue()}
          </span>
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
      `${process.env.baseUrl}${process.env.version}/tag/${tagId}`
    )
    const data = await response.json()
    console.log('Data of tag id:', data)
    return data.item || data
  }

  useEffect(() => {
    console.log('Tags state updated:', tags)
  }, [tags])

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesList = await getCategories()
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
          `${process.env.baseUrl}${process.env.version}/tag?q=${query}`
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
    loadData()
  }, [])

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
      const response = await fetchNews(page)
      setNews(response.items)
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

  const createNews = async (data) => {
    try {
      // Send tags directly as an array of numbers
      const formattedData = {
        ...data,
        tags: selectedTags.map((tag) => tag.id), // Convert selected tags to array of IDs
        featuredImage: uploadedFiles.featuredImage
      }

      const response = await authFetch(
        `${process.env.baseUrl}${process.env.version}/blogs`,
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

  const updateNews = async (data, id) => {
    try {
      // Send tags directly as an array of numbers
      const formattedData = {
        ...data,
        tags: selectedTags.map((tag) => tag.id), // Convert selected tags to array of IDs
        featuredImage: uploadedFiles.featuredImage
      }

      const response = await authFetch(
        `${process.env.baseUrl}${process.env.version}/blogs?id=${id}`,
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
    setEditingId(blog.id)

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
        `${process.env.baseUrl}${process.env.version}/blogs?q=${query}`
      )
      if (response.ok) {
        const data = await response.json()
        setNews(data.items)

        if (data.pagination) {
          setPagination({
            currentPage: data.pagination.currentPage,
            totalPages: data.pagination.totalPages,
            total: data.pagination.totalCount
          })
        }
      } else {
        console.error('Error fetching results:', response.statusText)
        setNews([])
      }
    } catch (error) {
      console.error('Error fetching news search results:', error.message)
      setNews([])
    }
  }

  const onSubmit = async (data) => {
    try {
      if (editingId) {
        await updateNews(data, editingId)
        toast.success('News updated successfully')
      } else {
        await createNews(data)
        toast.success('News created successfully')
      }
      reset()
      setEditingId(null)
      setSelectedTags([])
      setUploadedFiles({ featuredImage: '' })
      loadData()
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Network error occurred'
      toast.error(
        `Failed to ${editingId ? 'update' : 'create'} news: ${errorMsg}`
      )
      console.error('Error saving news:', err)
    }
  }

  const handleCancel = () => {
    reset()
    setEditingId(null)
    setSelectedTags([])
    setUploadedFiles({ featuredImage: '' })
  }

  const handleDeleteClick = (id) => {
    setDeleteId(id)
    setIsDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteId) return
    try {
      const response = await authFetch(
        `${process.env.baseUrl}${process.env.version}/blogs?id=${deleteId}`,
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

  if (loading)
    return (
      <div className='mx-auto'>
        <Loader />
      </div>
    )

  return (
    <div className='p-4 w-4/5 mx-auto'>
      <h1 className='text-2xl font-bold mb-4'>News Management</h1>

      <form onSubmit={handleSubmit(onSubmit)} className='mb-8'>
        <div className='mb-4'>
          <input
            type='text'
            placeholder='News Title'
            {...register('title', { required: 'Title is required' })}
            className='w-full p-2 border rounded'
          />
          {errors.title && (
            <span className='text-red-500 text-sm'>{errors.title.message}</span>
          )}
        </div>

        <div className='flex mb-4'>
          <div className='w-full'>
            <select
              {...register('category', { required: 'Category is required' })}
              className='w-full p-2 border rounded'
            >
              <option value=''>Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.title}
                </option>
              ))}
            </select>
            {errors.category && (
              <span className='text-red-500 text-sm'>
                {errors.category.message}
              </span>
            )}
          </div>
        </div>

        {/* Tags search input */}
        <div className=' mb-4 relative'>
          <input
            type='text'
            placeholder='Search for tags...'
            value={tagsSearch}
            onChange={handleTagsSearch}
            className='w-full p-2 border rounded'
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
                    const newTags = selectedTags.filter((t) => t.id !== tag.id)
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

        <div className='mb-4'>
          <textarea
            placeholder='Description'
            {...register('description')}
            className='w-full p-2 border rounded'
          />
        </div>

        <div className='mb-4'>
          <label htmlFor='content'>Content</label>
          <CKEditor
            editor={ClassicEditor}
            data=''
            config={{
              licenseKey: process.env.ckeditor
            }}
            onChange={(event, editor) => {
              setValue(editor.getData())
            }}
          />
        </div>

        <div className='bg-white p-6 rounded-lg shadow-md mb-6'>
          <FileUpload
            label={'News Image'}
            onUploadComplete={(url) => {
              setUploadedFiles((prev) => ({ ...prev, featuredImage: url }))
            }}
            defaultPreview={uploadedFiles.featuredImage}
          />
        </div>

        <div className='flex mb-4'>
          <div className='w-1/2 mr-4'>
            <select
              {...register('visibility')}
              className='w-full p-2 border rounded'
            >
              <option value='private'>Private</option>
              <option value='public'>Public</option>
            </select>
          </div>

          <div className='w-1/2'>
            <select
              {...register('status')}
              className='w-full p-2 border rounded'
            >
              <option value='draft'>Draft</option>
              <option value='published'>Published</option>
            </select>
          </div>
        </div>

        <div className='flex gap-4'>
          <button
            type='submit'
            className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
          >
            {editingId ? 'Update News' : 'Add News'}
          </button>
          {editingId && (
            <button
              type='button'
              onClick={handleCancel}
              className='bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600'
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <Table
        data={news}
        columns={columns}
        pagination={pagination}
        onPageChange={(newPage) => loadData(newPage)}
        onSearch={handleSearch}
      />

      <ConfirmationDialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        onConfirm={handleDeleteConfirm}
        title='Confirm Deletion'
        message='Are you sure you want to delete this news? This action cannot be undone.'
      />
    </div>
  )
}
