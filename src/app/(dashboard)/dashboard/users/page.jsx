'use client'
import { useEffect, useMemo, useState } from 'react'
import { Eye, EyeOff, Plus, Download } from 'lucide-react'
import {
  createUser,
  deleteUser,
  updateUser
} from '../../../actions/userActions'
import { authFetch } from '@/app/utils/authFetch'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import ExportModal from './ExportModal'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/ui/shadcn/dialog'
import { Button } from '@/ui/shadcn/button'
import { Input } from '@/ui/shadcn/input'
import { Label } from '@/ui/shadcn/label'
import SearchInput from '@/ui/molecules/SearchInput'
import ConfirmationDialog from '@/ui/molecules/ConfirmationDialog'
import { createColumns } from './columns'
import Table from '@/ui/shadcn/DataTable'

const EMPTY_FORM = {
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
}

export default function UsersManager() {
  const { setHeading } = usePageHeading()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUserType, setSelectedUserType] = useState('all')
  const [searchTimeout, setSearchTimeout] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  })
  const [editingId, setEditingId] = useState(null)
  const [formError, setFormError] = useState(null)
  const [showPasswordValue, setShowPasswordValue] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Delete confirmation
  const [deleteId, setDeleteId] = useState(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const userData = useSelector((state) => state.user.data)

  useEffect(() => {
    setHeading('User Management')
    loadUsers()
    return () => setHeading(null)
  }, [setHeading, selectedUserType])

  useEffect(() => {
    return () => {
      if (searchTimeout) clearTimeout(searchTimeout)
    }
  }, [searchTimeout])

  const loadUsers = async (page = 1) => {
    try {
      const token = localStorage.getItem('access_token')
      if (!token) throw new Error('Token not found')
      setLoading(true)

      let url = `${process.env.baseUrl}/users?page=${page}`
      if (selectedUserType !== 'all') {
        url += `&role=${selectedUserType}`
      }

      const response = await authFetch(url, {
        headers: { Authorization: `Bearer ${token}` }
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
      } else {
        throw new Error('Failed to fetch users')
      }
    } catch (err) {
      toast.error('Failed to load users')
      console.error('Error loading users:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (query) => {
    if (!query) { loadUsers(); return }
    try {
      const token = localStorage.getItem('access_token')
      let url = `${process.env.baseUrl}/users?q=${query}`
      if (selectedUserType !== 'all') url += `&role=${selectedUserType}`

      const response = await authFetch(url, {
        headers: { Authorization: `Bearer ${token}` }
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
        setUsers([])
      }
    } catch (error) {
      console.error('Error fetching user search results:', error.message)
      setUsers([])
    }
  }

  const handleSearchInput = (value) => {
    setSearchQuery(value)
    if (searchTimeout) clearTimeout(searchTimeout)
    if (value === '') {
      handleSearch('')
    } else {
      const timeoutId = setTimeout(() => handleSearch(value), 300)
      setSearchTimeout(timeoutId)
    }
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingId(null)
    setShowPasswordValue(false)
    setFormData(EMPTY_FORM)
    setFormError(null)
  }

  const handleAddClick = () => {
    setFormData(EMPTY_FORM)
    setEditingId(null)
    setShowPasswordValue(false)
    setFormError(null)
    setIsFormOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const fullEmail = formData.emailUsername
        ? `${formData.emailUsername}${formData.emailDomain}`
        : formData.email

      const rolesObject = formData.roles || {}
      let rolesString = 'student'
      const roleMap = { admin: 'admin', editor: 'editor', agent: 'agent', student: 'student', institution: 'institution' }
      for (const [key, value] of Object.entries(rolesObject)) {
        if (value === true && roleMap[key]) { rolesString = roleMap[key]; break }
      }

      const submitData = { ...formData, email: fullEmail, roles: rolesString }
      delete submitData.emailUsername
      delete submitData.emailDomain

      if (editingId) {
        const updatedData = { ...submitData, roles: formData.roles }
        if (!submitData.password || submitData.password.trim() === '') {
          delete updatedData.password
        }
        await updateUser(editingId, updatedData)
        toast.success('User updated successfully')
      } else {
        submitData.created_by_admin = 1
        await createUser(submitData)
        toast.success('User created successfully')
      }

      handleCloseForm()
      try { await loadUsers() } catch (err) { console.error(err) }
    } catch (err) {
      setFormError(err.message || `Failed to ${editingId ? 'update' : 'create'} user`)
      toast.error(err.message || `Failed to ${editingId ? 'update' : 'create'} user`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (user) => {
    let parsedRoles = {}
    try {
      parsedRoles = typeof user.roles === 'string' ? JSON.parse(user.roles) : user.roles
    } catch (e) {
      console.error('Failed to parse roles:', e)
    }

    let emailUsername = ''
    let emailDomain = '@merouni.com'
    if (user.email?.includes('@merouni.com')) {
      emailUsername = user.email.replace('@merouni.com', '')
    } else if (user.email) {
      emailUsername = user.email.split('@')[0] || ''
      emailDomain = user.email.includes('@') ? `@${user.email.split('@')[1]}` : '@merouni.com'
    }

    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      emailUsername,
      emailDomain,
      phoneNo: user.phoneNo,
      password: '',
      roles: parsedRoles || {}
    })
    setEditingId(user.id)
    setShowPasswordValue(false)
    setFormError(null)
    setIsFormOpen(true)
  }

  const handleDeleteClick = (id) => {
    setDeleteId(id)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteId) return
    try {
      await deleteUser(deleteId, userData)
      toast.success('User deleted successfully')
      loadUsers()
    } catch (err) {
      toast.error('Failed to delete user')
    } finally {
      setIsDeleteDialogOpen(false)
      setDeleteId(null)
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

  const getSelectedRole = () => {
    const roles = formData.roles || {}
    if (roles.admin) return 'admin'
    if (roles.editor) return 'editor'
    if (roles.agent) return 'agent'
    if (roles.institution) return 'institution'
    return 'student'
  }

  const columns = useMemo(
    () => createColumns({ handleEdit, handleDelete: handleDeleteClick }),
    []
  )

  return (
    <div className='w-full space-y-4 p-4'>

      {/* Sticky Header */}
      <div className='sticky top-0 z-30 bg-[#F7F8FA] py-4'>
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border'>
          <SearchInput
            value={searchQuery}
            onChange={(e) => handleSearchInput(e.target.value)}
            placeholder='Search users...'
            className='max-w-md w-full'
          />
          <div className='flex gap-2 shrink-0'>
            <Button
              variant='outline'
              onClick={() => setIsExportModalOpen(true)}
              className='gap-2 border-gray-200'
            >
              <Download className='w-4 h-4' />
              Export
            </Button>
            <Button
              onClick={handleAddClick}
              className='bg-[#387cae] hover:bg-[#387cae]/90 text-white gap-2'
            >
              <Plus className='w-4 h-4' />
              Add User
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className='bg-white rounded-xl shadow-sm border overflow-hidden'>
        <Table
          loading={loading}
          data={users}
          columns={columns}
          pagination={pagination}
          onPageChange={(newPage) => loadUsers(newPage)}
          onSearch={handleSearch}
          showSearch={false}
        />
      </div>

      {/* Create / Edit Modal */}
      <Dialog isOpen={isFormOpen} onClose={handleCloseForm}>
        <DialogContent className='max-w-xl max-h-[90vh] flex flex-col p-0'>
          <DialogHeader className='px-6 py-4 border-b shrink-0'>
            <DialogTitle className='text-lg font-semibold text-gray-900'>
              {editingId ? 'Edit User' : 'Add New User'}
            </DialogTitle>
            <DialogClose onClick={handleCloseForm} />
          </DialogHeader>

          <div className='flex-1 overflow-y-auto p-6'>
            <form id='user-form' onSubmit={handleSubmit} className='space-y-8'>

              {/* Personal Details */}
              <section className='space-y-5'>
                <h3 className='text-base font-semibold text-slate-800 border-b pb-2'>Personal Details</h3>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                  <div className='space-y-1.5'>
                    <Label required>First Name</Label>
                    <Input
                      placeholder='First Name'
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div className='space-y-1.5'>
                    <Label required>Last Name</Label>
                    <Input
                      placeholder='Last Name'
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className='space-y-1.5'>
                  <Label required>Phone Number</Label>
                  <Input
                    type='tel'
                    placeholder='e.g. 9800000000'
                    value={formData.phoneNo}
                    onChange={(e) => setFormData({ ...formData, phoneNo: e.target.value })}
                    required
                    maxLength={10}
                  />
                </div>
              </section>

              {/* Account Details */}
              <section className='space-y-5'>
                <h3 className='text-base font-semibold text-slate-800 border-b pb-2'>Account Details</h3>

                <div className='space-y-1.5'>
                  <Label required>Email</Label>
                  <div className='flex items-center gap-2'>
                    <Input
                      type='text'
                      placeholder='username'
                      value={formData.emailUsername}
                      onChange={(e) => setFormData({ ...formData, emailUsername: e.target.value })}
                      required
                      className='flex-1'
                    />
                    <span className='shrink-0 text-sm text-gray-500 px-3 py-2 bg-gray-50 border border-gray-200 rounded-md font-medium'>
                      @merouni.com
                    </span>
                  </div>
                </div>

                <div className='space-y-1.5'>
                  <Label required={!editingId}>
                    Password{' '}
                    {editingId && (
                      <span className='text-gray-400 text-xs font-normal'>(leave blank to keep current)</span>
                    )}
                  </Label>
                  <div className='relative'>
                    <Input
                      type={showPasswordValue ? 'text' : 'password'}
                      placeholder={editingId ? 'Leave blank to keep current password' : 'Enter password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required={!editingId}
                      className='pr-10'
                    />
                    <button
                      type='button'
                      className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors'
                      onClick={() => setShowPasswordValue((prev) => !prev)}
                    >
                      {showPasswordValue ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
                    </button>
                  </div>
                </div>

                <div className='space-y-1.5'>
                  <Label required>Role</Label>
                  <select
                    value={getSelectedRole()}
                    onChange={(e) => handleRoleChange(e.target.value)}
                    className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#387cae] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                    required
                  >
                    <option value='student'>Student</option>
                    <option value='editor'>Editor</option>
                    <option value='admin'>Admin</option>
                    <option value='agent'>Partner (Agent)</option>
                    <option value='institution'>Institution</option>
                  </select>
                </div>

                {formError && (
                  <div className='p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600'>
                    {formError}
                  </div>
                )}
              </section>
            </form>
          </div>

          {/* Sticky Footer */}
          <div className='sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end gap-3 shrink-0'>
            <Button type='button' variant='outline' onClick={handleCloseForm} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type='submit'
              form='user-form'
              disabled={isSubmitting}
              className='bg-[#387cae] hover:bg-[#387cae]/90 text-white min-w-[120px]'
            >
              {isSubmitting ? (
                <span className='flex items-center gap-2'>
                  <span className='animate-spin rounded-full h-4 w-4 border-b-2 border-white' />
                  Processing...
                </span>
              ) : editingId ? 'Update User' : 'Create User'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onClose={() => { setIsDeleteDialogOpen(false); setDeleteId(null) }}
        onConfirm={handleDeleteConfirm}
        title='Confirm Deletion'
        message='Are you sure you want to delete this user? This action cannot be undone.'
        confirmText='Delete'
        cancelText='Cancel'
      />

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      >
        <h2 className='text-xl font-bold mb-4'>Export Users</h2>
        <p>This is the modal content. You can add any form or content here.</p>
      </ExportModal>
    </div>
  )
}
