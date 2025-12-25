'use client'
import { useState, useEffect, useMemo } from 'react'
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser
} from '../../../actions/userActions'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

import Loading from '../../../../components/Loading'
import Table from '../../../../components/Table'
import { Edit2, Trash2, Search } from 'lucide-react'
// import { getToken } from '@/app/action'
// import { jwtDecode } from 'jwt-decode'
import { authFetch } from '@/app/utils/authFetch'
import ExportModal from './ExportModal'
import { Modal } from '../../../../components/CreateUserModal'
import { useSelector } from 'react-redux'
import { usePageHeading } from '@/contexts/PageHeadingContext'

export default function UsersManager() {
  const { setHeading } = usePageHeading()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchTimeout, setSearchTimeout] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNo: '',
    roles: {
      student: false,
      editor: false,
      admin: false
    }
  })
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  })

  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState(null)
  const [showPasswordField, setShowPasswordField] = useState(false)
  const [showPasswordValue, setShowPasswordValue] = useState(false)

  const userData = useSelector((state) => state.user.data)
  const columns = useMemo(
    () => [
      {
        header: 'First Name',
        accessorKey: 'firstName'
      },
      {
        header: 'Last Name',
        accessorKey: 'lastName'
      },
      {
        header: 'Email',
        accessorKey: 'email'
      },

      {
        header: 'Roles',
        accessorKey: 'roles',
        cell: ({ row }) => {
          const roles = JSON.parse(row.original.roles || '{}') // Parse the string to an object
          return (
            <div className='flex gap-1'>
              {Object.entries(roles)
                .filter(([_, value]) => value) // keep only true roles
                .map(([role]) => (
                  <span
                    key={role}
                    className='px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800'
                  >
                    {role}
                  </span>
                ))}
            </div>
          )
        }
      },
      {
        header: 'Created At',
        accessorKey: 'createdAt',
        cell: ({ getValue }) => new Date(getValue()).toLocaleDateString()
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
    setHeading('User Management')
    loadUsers()
    return () => setHeading(null)
  }, [setHeading])

  const loadUsers = async (page = 1) => {
    try {
      const token = localStorage.getItem('access_token')
      // const tokenObj = await getToken()
      // console.log('TOKEN OBJ:', tokenObj)
      // const token = tokenObj
      console.log('TOKEN:', token)
      // const decodedToken = jwtDecode(tokenObj?.value)
      // console.log('DECODED TOKEN:', decodedToken)
      // const roleObject = JSON.parse(decodedToken?.data?.item?.role)
      // console.log('ROLE OBJECT:', roleObject)
      const refreshToken = localStorage.getItem('refreshToken')
      console.log('refresh TOKEN:', refreshToken)
      // Extract the role name based on the condition
      // const roleName = Object.keys(roleObject).filter(
      //   (key) => roleObject[key] === true
      // )
      // console.log('ROLE NAME:', roleName)
      if (!token) {
        throw new Error('Token not found')
      }
      setLoading(true)
      const response = await getUsers(page, token)
      console.log('Response of users:', response)
      setUsers(response.items)
      setPagination({
        currentPage: response.pagination.currentPage,
        totalPages: response.pagination.totalPages,
        total: response.pagination.totalCount
      })
      setError(null)
    } catch (err) {
      setError('Failed to load users')
      console.error('Error loading users:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    console.log('USERS:', users)
    console.log('PAGINATION:', pagination)
  }, [users, pagination])

  const handleSearch = async (query) => {
    if (!query) {
      loadUsers()
      return
    }
    try {
      const token = localStorage.getItem('access_token')
      console.log('Query:', query)

      const response = await authFetch(
        `${process.env.baseUrl}${process.env.version}/users?q=${query}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (response.ok) {
        const data = await response.json()
        console.log('REsponse of serach:', data)

        setUsers(data.items)

        if (data.pagination) {
          setPagination({
            currentPage: data.pagination.currentPage,
            totalPages: data.pagination.totalPages,
            total: data.pagination.totalCount
          })
        }
      } else {
        console.error('Error fetching results:', response.statusText)
        setUsers([])
      }
    } catch (error) {
      console.error('Error fetching user search results:', error.message)
      setUsers([])
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

  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout)
      }
    }
  }, [searchTimeout])

  useEffect(() => {
    console.log('USErs searching:', users)
  }, [users])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        const updatedData = { ...formData }

        // Only send password if it’s shown and not empty
        if (!showPasswordField || !formData.password) {
          delete updatedData.password
        }
        await updateUser(editingId, updatedData)
      } else {
        console.log('Form Data:', formData)
        await createUser(formData)
      }
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phoneNo: '',
        roles: {
          student: false,
          teacher: false,
          admin: false
        }
      })
      setEditingId(null)
      setShowPasswordField(false)
      setShowPasswordValue(false)
      setError(null)
      setIsFormOpen(false)
      loadUsers()
    } catch (err) {
      setError(`Failed to ${editingId ? 'update' : 'create'} user`)
      console.error('Error saving user:', err)
    }
  }

  const handleEdit = (user) => {
    let parsedRoles = {}
    try {
      parsedRoles =
        typeof user.roles === 'string' ? JSON.parse(user.roles) : user.roles
    } catch (e) {
      console.error('Failed to parse roles:', e)
    }

    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNo: user.phoneNo,
      password: '',
      roles: parsedRoles || {}
    })
    setEditingId(user.id)
    setShowPasswordField(false)
    setShowPasswordValue(false)
    setIsFormOpen(true)
    setError(null)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        console.log('selectedDelete', id)
        await deleteUser(id, userData)
        loadUsers()
        setError(null)
      } catch (err) {
        setError('Failed to delete user')
        console.error('Error deleting user:', err)
      }
    }
  }

  const handleRoleToggle = (role) => {
    setFormData({
      ...formData,
      roles: {
        ...formData.roles,
        [role]: !formData.roles[role]
      }
    })
  }

  if (loading)
    return (
      <div className='mx-auto'>
        <Loading />
      </div>
    )

  return (
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
            className='w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            placeholder='Search users...'
          />
        </div>
        {/* Buttons */}
        <div className='flex gap-2'>
          <button
            onClick={() => {
              setIsFormOpen(true)
              setEditingId(null)
              setShowPasswordField(false)
              setShowPasswordValue(false)
              setFormData({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                phoneNo: '',
                roles: {
                  student: false,
                  editor: false,
                  admin: false
                }
              })
            }}
            className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
          >
            Add User
          </button>
          <button
            onClick={() => setIsExportModalOpen(true)}
            className='bg-gray-100 text-gray-800 px-4 py-2 rounded hover:bg-gray-200 border'
          >
            Export Users
          </button>
        </div>
      </div>

      <Modal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setEditingId(null)
          setShowPasswordField(false)
          setShowPasswordValue(false)
          setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phoneNo: '',
            password: '',
            roles: { student: false, editor: false, admin: false }
          })
        }}
        title={editingId ? 'Edit User' : 'Add User'}
        className='max-w-xl'
      >
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <input
              type='text'
              placeholder='First Name'
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              className='w-full p-2 border rounded'
              required
            />
          </div>

          <div>
            <input
              type='text'
              placeholder='Last Name'
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              className='w-full p-2 border rounded'
              required
            />
          </div>

          <div>
            <input
              type='email'
              placeholder='Email'
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className='w-full p-2 border rounded'
              required
            />
          </div>

          <div>
            <input
              type='tel'
              name='phoneNo'
              placeholder='Phone Number'
              value={formData.phoneNo}
              onChange={(e) =>
                setFormData({ ...formData, phoneNo: e.target.value })
              }
              className='w-full p-2 border rounded'
              required
              maxLength={10}
            />
          </div>

          <div>
            <button
              type='button'
              className='text-sm text-blue-600 underline mb-1'
              onClick={() => {
                setShowPasswordField((prev) => !prev)
                if (!showPasswordField) {
                  setFormData((prev) => ({ ...prev, password: '' }))
                }
              }}
            >
              {showPasswordField ? 'Hide Password Field' : 'Edit Password'}
            </button>

            {showPasswordField && (
              <div className='relative'>
                <input
                  type={showPasswordValue ? 'text' : 'password'}
                  placeholder='New Password'
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className='w-full p-2 border rounded pr-10'
                />
                <span
                  className='absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600 cursor-pointer'
                  onClick={() => setShowPasswordValue((prev) => !prev)}
                >
                  {showPasswordValue ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            )}
          </div>

          <div className='flex gap-4'>
            {['student', 'editor', 'admin'].map((role) => (
              <label key={role} className='flex items-center space-x-2'>
                <input
                  type='checkbox'
                  checked={formData.roles[role]}
                  onChange={() => handleRoleToggle(role)}
                  className='rounded'
                />
                <span className='capitalize'>{role}</span>
              </label>
            ))}
          </div>

          {error && <div className='text-red-500'>{error}</div>}

          <div className='flex justify-end gap-2 pt-2'>
            <button
              type='button'
              onClick={() => {
                setIsFormOpen(false)
                setEditingId(null)
                setShowPasswordField(false)
                setShowPasswordValue(false)
                setFormData({
                  firstName: '',
                  lastName: '',
                  email: '',
                  phoneNo: '',
                  password: '',
                  roles: { student: false, editor: false, admin: false }
                })
              }}
              className='bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
            >
              {editingId ? 'Update User' : 'Create User'}
            </button>
          </div>
        </form>
      </Modal>

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      >
        <h2 className='text-xl font-bold mb-4'>Export Users</h2>
        <p>This is the modal content. You can add any form or content here.</p>
      </ExportModal>

      {/* Table */}
      <Table
        data={users}
        columns={columns}
        pagination={pagination}
        onPageChange={(newPage) => loadUsers(newPage)}
        onSearch={handleSearch}
        showSearch={false}
      />
    </div>
  )
}
