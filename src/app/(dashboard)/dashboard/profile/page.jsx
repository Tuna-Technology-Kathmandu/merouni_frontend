'use client'

import { authFetch } from '@/app/utils/authFetch'
import React, { useState } from 'react'
import {
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaPhone,
  FaUserTag
} from 'react-icons/fa'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useSelector } from 'react-redux'
import { Button } from '@/ui/shadcn/button'
import { Input } from '@/ui/shadcn/input'
import { Label } from '@/ui/shadcn/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/ui/shadcn/dialog'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import { useEffect } from 'react'

const ProfileUpdate = () => {
  const { setHeading } = usePageHeading()
  const userData = useSelector((state) => state.user.data)

  useEffect(() => {
    setHeading('Profile Settings')
    return () => setHeading(null)
  }, [setHeading])

  const [showNameModal, setShowNameModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [nameForm, setNameForm] = useState({
    firstName: userData?.firstName || '',
    middleName: userData?.middleName || '',
    lastName: userData?.lastName || '',
    email: userData?.email || '',
    phoneNo: userData?.phoneNo || ''
  })

  const [passwordForm, setPasswordForm] = useState({
    newPassword: '',
    confirmPassword: ''
  })

  // Update form when userData changes
  useEffect(() => {
    if (userData) {
      setNameForm({
        firstName: userData.firstName || '',
        middleName: userData.middleName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        phoneNo: userData.phoneNo || ''
      })
    }
  }, [userData])

  const validateName = (name) => {
    return name.length >= 2 && /^[a-zA-Z\s]*$/.test(name)
  }

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    return passwordRegex.test(password)
  }

  const handleNameSubmit = async (e) => {
    e.preventDefault()
    if (!validateName(nameForm.firstName) || !validateName(nameForm.lastName)) {
      toast.error(
        'Names must be at least 2 characters and contain only letters'
      )
      return
    }

    setIsLoading(true)
    try {
      const response = await authFetch(
        `${process.env.baseUrl}/users/edit-profile?user_id=${userData.id}`,
        {
          method: 'PUT',
          body: JSON.stringify({
            firstName: nameForm.firstName,
            middleName: nameForm.middleName,
            lastName: nameForm.lastName,
            email: nameForm.email,
            phoneNo: nameForm.phoneNo
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      toast.success('Profile updated successfully')
      setShowNameModal(false)
    } catch (error) {
      console.error('Update error:', error)
      toast.error(error.message || 'Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()

    if (!validatePassword(passwordForm.newPassword)) {
      toast.error("Password doesn't meet requirements")
      return
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Passwords don't match")
      return
    }

    setIsLoading(true)
    try {
      const response = await authFetch(
        `${process.env.baseUrl}/users/edit-profile?user_id=${userData.id}`,
        {
          method: 'PUT',
          body: JSON.stringify({
            password: passwordForm.newPassword
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update password')
      }

      toast.success('Password updated successfully')
      setShowPasswordModal(false)
      setPasswordForm({
        newPassword: '',
        confirmPassword: ''
      })
    } catch (error) {
      console.error('Password update error:', error)
      toast.error(error.message || 'Failed to update password')
    } finally {
      setIsLoading(false)
    }
  }

  const roles = userData?.role
    ? Object.entries(
        typeof userData.role === 'string'
          ? JSON.parse(userData.role)
          : userData.role
      )
        .filter(([_, value]) => value)
        .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1))
        .join(', ')
    : 'No Role Assigned'

  const getInitials = () => {
    if (userData?.firstName && userData?.lastName) {
      return `${userData.firstName.charAt(0)}${userData.lastName.charAt(0)}`.toUpperCase()
    }
    return 'U'
  }

  return (
    <div className='p-6 max-w-4xl mx-auto'>
      {/* Profile Header Card */}
      <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6'>
        <div className='flex items-center gap-6'>
          <div className='w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg'>
            {getInitials()}
          </div>
          <div className='flex-1'>
            <h1 className='text-2xl font-bold text-gray-900 mb-1'>
              {userData?.firstName && userData?.lastName
                ? `${userData.firstName} ${userData.middleName || ''} ${userData.lastName}`.trim()
                : 'User Profile'}
            </h1>
            <p className='text-sm text-gray-500'>{roles}</p>
          </div>
        </div>
      </div>

      {/* User Information Card */}
      <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6'>
        <h2 className='text-lg font-semibold text-gray-900 mb-6'>
          Personal Information
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='space-y-1'>
            <Label className='text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Full Name
            </Label>
            <p className='text-sm font-medium text-gray-900'>
              {userData?.firstName} {userData?.middleName || ''}{' '}
              {userData?.lastName}
            </p>
          </div>
          <div className='space-y-1'>
            <Label className='text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-2'>
              <FaEnvelope className='w-3 h-3' />
              Email Address
            </Label>
            <p className='text-sm font-medium text-gray-900'>
              {userData?.email || 'Not provided'}
            </p>
          </div>
          <div className='space-y-1'>
            <Label className='text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-2'>
              <FaPhone className='w-3 h-3' />
              Phone Number
            </Label>
            <p className='text-sm font-medium text-gray-900'>
              {userData?.phoneNo || 'Not provided'}
            </p>
          </div>
          <div className='space-y-1'>
            <Label className='text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-2'>
              <FaUserTag className='w-3 h-3' />
              Role
            </Label>
            <div className='flex flex-wrap gap-2'>
              {roles.split(', ').map((role, idx) => (
                <span
                  key={idx}
                  className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800'
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <button
          onClick={() => setShowNameModal(true)}
          className='group bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-indigo-200 transition-all duration-200 text-left'
        >
          <div className='flex items-start gap-4'>
            <div className='w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors'>
              <FaUser className='w-6 h-6 text-blue-600' />
            </div>
            <div className='flex-1'>
              <h3 className='text-base font-semibold text-gray-900 mb-1'>
                Update Profile
              </h3>
              <p className='text-sm text-gray-500'>
                Edit your personal information and contact details
              </p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setShowPasswordModal(true)}
          className='group bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-green-200 transition-all duration-200 text-left'
        >
          <div className='flex items-start gap-4'>
            <div className='w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors'>
              <FaLock className='w-6 h-6 text-green-600' />
            </div>
            <div className='flex-1'>
              <h3 className='text-base font-semibold text-gray-900 mb-1'>
                Change Password
              </h3>
              <p className='text-sm text-gray-500'>
                Update your password to keep your account secure
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* Update Profile Dialog */}
      <Dialog isOpen={showNameModal} onClose={() => setShowNameModal(false)}>
        <DialogContent className='max-w-md'>
          <DialogClose onClick={() => setShowNameModal(false)} />
          <DialogHeader>
            <DialogTitle>Update Profile Information</DialogTitle>
            <DialogDescription>
              Make changes to your profile information here. Click save when
              you're done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleNameSubmit}>
            <div className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='firstName'>
                  First Name <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id='firstName'
                  type='text'
                  value={nameForm.firstName}
                  onChange={(e) =>
                    setNameForm({ ...nameForm, firstName: e.target.value })
                  }
                  required
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='middleName'>Middle Name</Label>
                <Input
                  id='middleName'
                  type='text'
                  value={nameForm.middleName}
                  onChange={(e) =>
                    setNameForm({ ...nameForm, middleName: e.target.value })
                  }
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='lastName'>
                  Last Name <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id='lastName'
                  type='text'
                  value={nameForm.lastName}
                  onChange={(e) =>
                    setNameForm({ ...nameForm, lastName: e.target.value })
                  }
                  required
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='email'>
                  Email <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id='email'
                  type='email'
                  value={nameForm.email}
                  onChange={(e) =>
                    setNameForm({ ...nameForm, email: e.target.value })
                  }
                  required
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='phoneNo'>
                  Phone Number <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id='phoneNo'
                  type='tel'
                  value={nameForm.phoneNo}
                  onChange={(e) =>
                    setNameForm({ ...nameForm, phoneNo: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => setShowNameModal(false)}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Update Password Dialog */}
      <Dialog
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      >
        <DialogContent className='max-w-md'>
          <DialogClose onClick={() => setShowPasswordModal(false)} />
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your new password. Make sure it meets the security
              requirements.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePasswordSubmit}>
            <div className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='newPassword'>
                  New Password <span className='text-red-500'>*</span>
                </Label>
                <div className='relative'>
                  <Input
                    id='newPassword'
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        newPassword: e.target.value.trim()
                      })
                    }
                    className='pr-10'
                    required
                  />
                  <button
                    type='button'
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <FaEyeSlash className='h-4 w-4' />
                    ) : (
                      <FaEye className='h-4 w-4' />
                    )}
                  </button>
                </div>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='confirmPassword'>
                  Confirm Password <span className='text-red-500'>*</span>
                </Label>
                <div className='relative'>
                  <Input
                    id='confirmPassword'
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        confirmPassword: e.target.value.trim()
                      })
                    }
                    className='pr-10'
                    required
                  />
                  <button
                    type='button'
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash className='h-4 w-4' />
                    ) : (
                      <FaEye className='h-4 w-4' />
                    )}
                  </button>
                </div>
              </div>
              <div className='rounded-lg bg-blue-50 border border-blue-200 p-3'>
                <p className='text-xs text-blue-800'>
                  <strong>Password Requirements:</strong> At least 8 characters,
                  including uppercase, lowercase, number, and special character
                  (@$!%*?&)
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => setShowPasswordModal(false)}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={isLoading} variant='default'>
                {isLoading ? 'Updating...' : 'Update Password'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ProfileUpdate
