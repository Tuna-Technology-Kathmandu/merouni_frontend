'use client'
import { useEffect, useMemo, useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import {
  createUser,
  deleteUser,
  updateUser
} from '../../../actions/userActions'

import { authFetch } from '@/app/utils/authFetch'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import { Search } from 'lucide-react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import ExportModal from './ExportModal'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/ui/shadcn/dialog'
import { Button } from '@/ui/shadcn/button'
import SearchInput from '@/ui/molecules/SearchInput'

export default function UsersManager() {
  const { setHeading } = usePageHeading()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUserType, setSelectedUserType] = useState('all')
  const [searchTimeout, setSearchTimeout] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    emailUsername: '',
    emailDomain: '@merouni.com',
    password: '',
    phoneNo: '',
    roles: {
      student: true,
      editor: false,
      admin: false,
      agent: false,
      institution: false
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

  useEffect(() => {
    setHeading('User Management')
    loadUsers()
    return () => setHeading(null)
  }, [setHeading, selectedUserType])

  const loadUsers = async (page = 1) => {
    try {
      const token = localStorage.getItem('access_token')

      if (!token) {
        throw new Error('Token not found')
      }
      setLoading(true)

      // Build URL with role filter if not 'all'
      let url = `${process.env.baseUrl}/users?page=${page}`
      if (selectedUserType !== 'all') {
        url += `&role=${selectedUserType}`
      }

      const response = await authFetch(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUsers(data.items || [])

        if (data.pagination) {
          setPagination({
            currentPage: data.pagination.currentPage,
            totalPages: data.pagination.totalPages,
            total: data.pagination.totalCount
          })
        }
        setError(null)
      } else {
        throw new Error('Failed to fetch users')
      }
    } catch (err) {
      setError('Failed to load users')
      console.error('Error loading users:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
  }, [users, pagination])

  const handleSearch = async (query) => {
    if (!query) {
      loadUsers()
      return
    }
    try {
      const token = localStorage.getItem('access_token')

      // Build URL with search query and role filter
      let url = `${process.env.baseUrl}/users?q=${query}`
      if (selectedUserType !== 'all') {
        url += `&role=${selectedUserType}`
      }

      const response = await authFetch(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()

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


  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Combine emailUsername and emailDomain to form full email
      const fullEmail = formData.emailUsername
        ? `${formData.emailUsername}${formData.emailDomain}`
        : formData.email

      // Convert roles object to string (find the first role that is true)
      const rolesObject = formData.roles || {}
      let rolesString = 'student' // default
      const roleMap = {
        admin: 'admin',
        editor: 'editor',
        agent: 'agent',
        student: 'student',
        institution: 'institution'
      }

      // Find the first role that is true
      for (const [key, value] of Object.entries(rolesObject)) {
        if (value === true && roleMap[key]) {
          rolesString = roleMap[key]
          break
        }
      }

      const submitData = {
        ...formData,
        email: fullEmail,
        roles: rolesString // Convert to string for registration
      }

      // Remove emailUsername and emailDomain from submit data
      delete submitData.emailUsername
      delete submitData.emailDomain

      if (editingId) {
        const updatedData = { ...submitData }
        // For updates, send roles as object (based on updateUser validator)
        updatedData.roles = formData.roles

        // Only send password if it's provided (not empty)
        if (!submitData.password || submitData.password.trim() === '') {
          delete updatedData.password
        }
        await updateUser(editingId, updatedData)
        toast.success('User updated successfully')
      } else {
        // Add created_by_admin flag for new user creation
        submitData.created_by_admin = 1
        await createUser(submitData)
        toast.success('User created successfully')
      }

      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        emailUsername: '',
        emailDomain: '@merouni.com',
        password: '',
        phoneNo: '',
        roles: {
          student: false,
          editor: false,
          admin: false,
          agent: false,
          institution: false
        }
      })
      setEditingId(null)
      setShowPasswordField(false)
      setShowPasswordValue(false)
      setError(null)
      setIsFormOpen(false)

      // Reload users in background, don't let errors prevent dialog from closing
      try {
        await loadUsers()
      } catch (err) {
        console.error('Error reloading users:', err)
        // Error is already handled in loadUsers, just log it
      }
    } catch (err) {
      setError(
        err.message || `Failed to ${editingId ? 'update' : 'create'} user`
      )
      toast.error(
        err.message || `Failed to ${editingId ? 'update' : 'create'} user`
      )
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

    // Extract username from email if it contains @merouni.com
    let emailUsername = ''
    let emailDomain = '@merouni.com'
    if (user.email && user.email.includes('@merouni.com')) {
      emailUsername = user.email.replace('@merouni.com', '')
    } else if (user.email) {
      // If email doesn't have @merouni.com, use full email as username
      emailUsername = user.email.split('@')[0] || ''
      emailDomain = user.email.includes('@')
        ? `@${user.email.split('@')[1]}`
        : '@merouni.com'
    }

    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      emailUsername: emailUsername,
      emailDomain: emailDomain,
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
        await deleteUser(id, userData)
        loadUsers()
        setError(null)
      } catch (err) {
        setError('Failed to delete user')
      }
    }
  }

  const handleRoleChange = (selectedRole) => {
    setFormData({
      ...formData,
      roles: {
        student: selectedRole === 'student',
        editor: selectedRole === 'editor',
        admin: selectedRole === 'admin',
        agent: selectedRole === 'agent',
        institution: selectedRole === 'institution'
      }
    })
  }

  // Get current selected role from object
  const getSelectedRole = () => {
    const roles = formData.roles || {}
    if (roles.admin) return 'admin'
    if (roles.editor) return 'editor'
    if (roles.agent) return 'agent'
    if (roles.institution) return 'institution'
    return 'student'
  }

  // Create columns with handlers (must be after handlers are defined)
  const columns = useMemo(
    () =>
      createColumns({
        handleEdit,
        handleDelete
      }),
    [handleEdit, handleDelete]
  )

  if (loading)
    return (
      <div className='mx-auto'>
        <Loading />
      </div>
    )

  return (
    <div className='p-4 w-full'>
      <div className='flex justify-between items-center mb-4 gap-4'>
        {/* Search Bar and Filter */}
        
                     <SearchInput
                    value={searchQuery}
                    onChange={(e) => handleSearchInput(e.target.value)}
                    placeholder='Search users...'
                    className='max-w-md'
                  />
        {/* Buttons */}
        <div className='flex gap-2'>
          <Button
            onClick={() => {
              setIsFormOpen(true)
              setEditingId(null)
              setShowPasswordField(false)
              setShowPasswordValue(false)
              setFormData({
                firstName: '',
                lastName: '',
                email: '',
                emailUsername: '',
                emailDomain: '@merouni.com',
                password: '',
                phoneNo: '',
                roles: {
                  student: true,
                  editor: false,
                  admin: false,
                  agent: false,
                  institution: false
                }
              })
            }}
          >
            Add User
          </Button>
          <button
            onClick={() => setIsExportModalOpen(true)}
            className='bg-gray-100 text-gray-800 px-4 py-2 rounded hover:bg-gray-200 border'
          >
            Export Users
          </button>
        </div>
      </div>

      <Dialog
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
            emailUsername: '',
            emailDomain: '@merouni.com',
            phoneNo: '',
            password: '',
            roles: {
              student: false,
              editor: false,
              admin: false,
              agent: false,
              institution: false
            }
          })
        }}
      >
        <DialogContent className='max-w-xl'>
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit User' : 'Add User'}</DialogTitle>
          </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                First Name <span className='text-red-500'>*</span>
              </label>
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
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Last Name <span className='text-red-500'>*</span>
              </label>
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
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Email <span className='text-red-500'>*</span>
            </label>
            <div className='flex items-center gap-2'>
              <input
                type='text'
                placeholder='username'
                value={formData.emailUsername}
                onChange={(e) =>
                  setFormData({ ...formData, emailUsername: e.target.value })
                }
                className='flex-1 p-2 border rounded'
                required
              />
              <span className='text-gray-600 px-2 py-2 border rounded bg-gray-50'>
                @merouni.com
              </span>
            </div>
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

          <div className='relative'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Password {!editingId && <span className='text-red-500'>*</span>}
            </label>
            <input
              type={showPasswordValue ? 'text' : 'password'}
              placeholder={
                editingId ? 'Leave blank to keep current password' : 'Password'
              }
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className='w-full p-2 border rounded pr-10'
              required={!editingId}
            />
            <span
              className='absolute right-3 top-9 cursor-pointer text-gray-500'
              onClick={() => setShowPasswordValue((prev) => !prev)}
            >
              {showPasswordValue ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Select Role <span className='text-red-500'>*</span>
            </label>
            <select
              value={getSelectedRole()}
              onChange={(e) => handleRoleChange(e.target.value)}
              className='w-full p-2 border rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500'
              required
            >
              <option value='student'>Student</option>
              <option value='editor'>Editor</option>
              <option value='admin'>Admin</option>
              <option value='agent'>Partner (Agent)</option>
            </select>
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
                  emailUsername: '',
                  emailDomain: '@merouni.com',
                  phoneNo: '',
                  password: '',
                  roles: {
                    student: true,
                    editor: false,
                    admin: false,
                    agent: false,
                    institution: false
                  }
                })
              }}
            >
              Cancel
            </button>
            <Button
              type='submit'
            >
              {editingId ? 'Update User' : 'Create User'}
            </Button>
          </div>
        </form>
        </DialogContent>
      </Dialog>

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
