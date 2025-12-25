'use client'
import dynamic from 'next/dynamic'
import { useState, useEffect, useMemo, useCallback } from 'react'
import { useSelector } from 'react-redux'
import {
  getAllScholarships,
  createScholarship,
  updateScholarship,
  deleteScholarship
} from './actions'
import Loading from '../../../../components/Loading'
import Table from '../../../../components/Table'
import { Edit2, Trash2 } from 'lucide-react'
import { authFetch } from '@/app/utils/authFetch'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import useAdminPermission from '@/hooks/useAdminPermission'
const CKEditor = dynamic(() => import('../component/CKStable'), {
  ssr: false
})

export default function ScholarshipManager() {
  const author_id = useSelector((state) => state.user.data.id)
  const [scholarships, setScholarships] = useState([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    eligibilityCriteria: '',
    amount: '',
    applicationDeadline: '',
    renewalCriteria: '',
    contactInfo: ''
  })
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  })
  const columns = useMemo(
    () => [
      {
        header: 'Name',
        accessorKey: 'name'
      },
      {
        header: 'Description',
        accessorKey: 'description'
      },
      {
        header: 'Eligibility',
        accessorKey: 'eligibilityCriteria'
      },
      {
        header: 'Amount (Rs.)',
        accessorKey: 'amount',
        cell: ({ getValue }) => `${getValue().toLocaleString()}`
      },
      {
        header: 'Deadline',
        accessorKey: 'applicationDeadline',
        cell: ({ getValue }) => new Date(getValue()).toLocaleDateString()
      },
      {
        header: 'Renewal Criteria',
        accessorKey: 'renewalCriteria'
      },
      {
        header: 'Contact',
        accessorKey: 'contactInfo'
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
    loadScholarships()
  }, [])

  const { requireAdmin } = useAdminPermission()

  const loadScholarships = async (page = 1) => {
    try {
      const res = await getAllScholarships((page = 1))
      const response = res.scholarships

      const updatedScholarships = response.map((scholarship) => ({
        ...scholarship,
        eligibilityCriteria: JSON.parse(
          scholarship.eligibilityCriteria || '""'
        ),
        renewalCriteria: JSON.parse(scholarship.renewalCriteria || '""'),

        applicationDeadline: new Date(scholarship.applicationDeadline),

        formattedDeadline: new Date(
          scholarship.applicationDeadline
        ).toLocaleDateString()
      }))

      setScholarships(updatedScholarships)

      console.log('Updated scholarships:', updatedScholarships)
      setPagination({
        currentPage: res.pagination.currentPage,
        totalPages: res.pagination.totalPages,
        total: res.pagination.totalCount
      })
    } catch (error) {
      setError('Failed to load scholarships')
      console.error('Error loading scholarships:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setIsSubmitting(true)
      const formattedData = {
        ...formData,
        amount: Number(formData.amount),
        applicationDeadline: formatDate(formData.applicationDeadline),
        author: author_id
      }
      console.log('formatted data', formattedData)
      if (editingId) {
        await updateScholarship(editingId, formattedData)
      } else {
        await createScholarship(formattedData)
      }

      setFormData({
        name: '',
        description: '',
        eligibilityCriteria: '',
        amount: '',
        applicationDeadline: '',
        renewalCriteria: '',
        contactInfo: ''
      })
      setEditingId(null)
      setError(null)
      loadScholarships()
      setIsSubmitting(false)
      toast.success(
        `Successfully ${editingId ? 'updated' : 'created'} scholarship`
      )
    } catch (error) {
      setError(`Failed to ${editingId ? 'update' : 'create'} scholarship`)
      toast.error('Error saving scholarship:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (scholarship) => {
    console.log(scholarship)
    setFormData({
      name: scholarship.name,
      description: scholarship.description,
      eligibilityCriteria: scholarship.eligibilityCriteria,
      amount: scholarship.amount,
      applicationDeadline: formatDateForInput(scholarship.applicationDeadline),
      renewalCriteria: scholarship.renewalCriteria,
      contactInfo: scholarship.contactInfo
    })
    setEditingId(scholarship.id)
    setError(null)
  }

  const handleDelete = async (id) => {
    requireAdmin(async () => {
      console.log('ids0', id)
      if (window.confirm('Are you sure you want to delete this scholarship?')) {
        try {
          await deleteScholarship(id)
          loadScholarships()
          setError(null)
        } catch (error) {
          setError('Failed to delete scholarship')
          console.error('Error deleting scholarship:', error)
        }
      }
    }, 'You do not have permission to delete scholarships.')
  }

  const formatDate = (date) => {
    return date.split('-').join('/')
  }

  const formatDateForInput = (dateString) => {
    return new Date(dateString).toISOString().split('T')[0]
  }

  const handleSearch = async (query) => {
    if (!query) {
      loadScholarships()
      return
    }

    try {
      const response = await authFetch(
        `${process.env.baseUrl}${process.env.version}/scholarship?q=${query}`
      )
      if (response.ok) {
        const data = await response.json()
        setScholarships(data.scholarships)

        if (data.pagination) {
          setPagination({
            currentPage: data.pagination.currentPage,
            totalPages: data.pagination.totalPages,
            total: data.pagination.totalCount
          })
        }
      } else {
        console.error('Error scholarship levels:', response.statusText)
        setScholarships([])
      }
    } catch (error) {
      console.error('Error fetching scholarhsip search results:', error.message)
      setScholarships([])
    }
  }

  const handleEditorChange = useCallback((content) => {
    setFormData((prev) => ({
      ...prev,
      description: content
    }))
  }, [])

  if (loading)
    return (
      <div className='mx-auto'>
        <Loading />
      </div>
    )

  return (
    <div className='p-4 w-4/5 mx-auto'>
      <ToastContainer />
      <h1 className='text-2xl font-bold mb-4'>Scholarship Management</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className='mb-8 space-y-4'>
        <div>
          <input
            type='text'
            placeholder='Scholarship Name'
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className='w-full p-2 border rounded'
            required
          />
        </div>

        <div>
          <CKEditor
            value={formData.description}
            onChange={handleEditorChange}
            id='scholarship-description-editor'
          />
        </div>

        <div>
          <input
            type='text'
            placeholder='Eligibility Criteria'
            value={formData.eligibilityCriteria}
            onChange={(e) =>
              setFormData({ ...formData, eligibilityCriteria: e.target.value })
            }
            className='w-full p-2 border rounded'
            required
          />
        </div>

        <div>
          <input
            type='number'
            placeholder='Amount'
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
            className='w-full p-2 border rounded'
            required
          />
        </div>

        <div>
          <input
            type='date'
            value={formData.applicationDeadline}
            onChange={(e) =>
              setFormData({ ...formData, applicationDeadline: e.target.value })
            }
            className='w-full p-2 border rounded'
            required
          />
        </div>

        <div>
          <input
            type='text'
            placeholder='Renewal Criteria'
            value={formData.renewalCriteria}
            onChange={(e) =>
              setFormData({ ...formData, renewalCriteria: e.target.value })
            }
            className='w-full p-2 border rounded'
            required
          />
        </div>

        <div>
          <input
            type='text'
            placeholder='Contact Information'
            value={formData.contactInfo}
            onChange={(e) =>
              setFormData({ ...formData, contactInfo: e.target.value })
            }
            className='w-full p-2 border rounded'
            required
          />
        </div>

        {error && <div className='text-red-500'>{error}</div>}

        <button
          type='submit'
          disabled={loading}
          className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
        >
          {isSubmitting
            ? 'Processing...'
            : editingId
              ? 'Update Scholarship'
              : 'Add Scholarship'}
        </button>
      </form>

      {/* Table */}
      <Table
        data={scholarships}
        columns={columns}
        pagination={pagination}
        onPageChange={(newPage) => loadScholarships(newPage)}
        onSearch={handleSearch}
      />
    </div>
  )
}
