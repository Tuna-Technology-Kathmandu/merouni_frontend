'use client'
import { useState, useEffect, useMemo } from 'react'
import {
  getAllFaculty,
  createFaculty,
  updateFaculty,
  deleteFaculty
} from './action'
// import dynamic from 'next/dynamic'
import { useSelector } from 'react-redux'
import Loader from '@/app/components/Loading'
import Table from '../../../components/Table' // Adjust the import path as needed
import { Edit2, Trash2 } from 'lucide-react' // For action icons
import { authFetch } from '@/app/utils/authFetch'
import { toast } from 'react-toastify'

// const CKEditor4 = dynamic(() => import('../component/CKEditor4'), {
//   ssr: false
// })

export default function FacultyManager() {
  const [faculties, setFaculties] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  })
  const [editingId, setEditingId] = useState(null)
  const author_id = useSelector((state) => state.user.data.id)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  })
  // Define columns with actionsSchool",
  const columns = useMemo(
    () => [
      {
        header: 'Title',
        accessorKey: 'title'
      },
      {
        header: 'Description',
        accessorKey: 'description'
      },
      {
        header: 'Author',
        accessorFn: (row) =>
          `${row.authorDetails.firstName} ${row.authorDetails.lastName}`
      },
      {
        header: 'Created At',
        accessorKey: 'createdAt',
        cell: ({ getValue }) => {
          return new Date(getValue()).toLocaleDateString()
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
            >
              <Edit2 className='w-4 h-4' />
            </button>
            <button
              onClick={() => handleDelete(row.original.id)}
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
    loadFaculties()
  }, [])

  const loadFaculties = async (page = 2) => {
    try {
      const response = await getAllFaculty(page)
      console.log
      response.items
      setFaculties(response.items)
      setPagination({
        currentPage: response.pagination.currentPage,
        totalPages: response.pagination.totalPages,
        total: response.pagination.totalCount
      })
      console.log(' resss', response.items)
    } catch (error) {
      console.error('Error loading faculties:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSubmitting(true)
      const requestData = { ...formData, author: author_id }

      if (editingId) {
        await updateFaculty(editingId, requestData)
      } else {
        await createFaculty(requestData)
      }

      setFormData({ title: '', description: '' })
      setEditingId(null)
      loadFaculties()
      setSubmitting(false)
      toast.success('Successfully completed')
    } catch (error) {
      toast.error(error.message || 'Failed to create college')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (faculty) => {
    setFormData({
      title: faculty.title,
      description: faculty.description
    })
    setEditingId(faculty.id)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this faculty?')) {
      try {
        await deleteFaculty(id)
        loadFaculties()
      } catch (error) {
        console.error('Error deleting faculty:', error)
      }
    }
  }
  const handleSearch = async (query) => {
    if (!query) {
      loadFaculties()
      return
    }
    try {
      const response = await authFetch(
        `${process.env.baseUrl}${process.env.version}/faculty?q=${query}`
      )
      if (response.ok) {
        const data = await response.json()
        setFaculties(data.items)

        if (data.pagination) {
          setPagination({
            currentPage: data.pagination.currentPage,
            totalPages: data.pagination.totalPages,
            total: data.pagination.totalCount
          })
        }
      } else {
        console.error('Error fetching results:', response.statusText)
        setFaculties([])
      }
    } catch (error) {
      console.error('Error fetching faculty search results:', error.message)
      setFaculties([])
    }
  }

  // const MemoizedCKEditor4 = useMemo(() => (
  //   <CKEditor4
  //     id="editor-content"
  //     initialData={formData.description}
  //     onChange={(data) =>
  //       setFormData((prevData) => ({ ...prevData, description: data }))
  //     }
  //   />
  // ), [])
  if (loading)
    return (
      <div className='mx-auto'>
        <Loader />
      </div>
    )

  return (
    <div className='p-4 w-4/5 mx-auto'>
      <h1 className='text-2xl font-bold mb-4'>Faculty Management</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className='mb-8'>
        <div className='mb-4'>
          <input
            type='text'
            placeholder='Faculty Title'
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className='w-full p-2 border rounded'
            required
          />
        </div>
        <div className='mb-4'>
          {/* {MemoizedCKEditor4} */}

          <textarea
            placeholder='Faculty Description'
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className='w-full p-2 border rounded min-h-[150px]'
            rows={6}
          />
        </div>
        <button
          type='submit'
          className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
        >
          {submitting
            ? editingId
              ? 'Updating...'
              : 'Adding...'
            : editingId
              ? 'Update'
              : 'Add Faculty'}
        </button>
      </form>

      {/* Table */}
      <Table
        data={faculties}
        columns={columns}
        pagination={pagination}
        onPageChange={(newPage) => loadFaculties(newPage)}
        onSearch={handleSearch}
      />
    </div>
  )
}
