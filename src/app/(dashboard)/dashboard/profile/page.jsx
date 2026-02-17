'use client'

import { authFetch } from '@/app/utils/authFetch'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import { Button } from '@/ui/shadcn/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/ui/shadcn/dialog'
import { Input } from '@/ui/shadcn/input'
import { Label } from '@/ui/shadcn/label'
import { useEffect, useState } from 'react'
import {
  FaCamera,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaFilePdf,
  FaLock,
  FaPhone,
  FaUser,
  FaUserTag
} from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import FileUpload from '../addCollege/FileUpload'

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
    phoneNo: userData?.phoneNo || '',
    profileImageUrl: userData?.profileImageUrl || '',
    cvUrl: userData?.cvUrl || ''
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
        phoneNo: userData.phoneNo || '',
        profileImageUrl: userData.profileImageUrl || '',
        cvUrl: userData.cvUrl || ''
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

  const fetchUserProfile = async () => {
    const response = await authFetch(
      `${process.env.baseUrl}/users/profile?id=${userData.id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    console.log(response, "responseresponseresponse")
    if (!response.ok) {
      throw new Error('Failed to fetch profile')
    }
    const data = await response.json()
    setNameForm({
      firstName: data.firstName || '',
      middleName: data.middleName || '',
      lastName: data.lastName || '',
      email: data.email || '',
      phoneNo: data.phoneNo || '',
      profileImageUrl: data.profileImageUrl || '',
      cvUrl: data.cvUrl || ''
    })
  }

  useEffect(() => {
    fetchUserProfile()
  }, [userData?.id])

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
            phoneNo: nameForm.phoneNo,
            profileImageUrl: nameForm.profileImageUrl,
            cvUrl: nameForm.cvUrl
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

  const isStudent = userData?.role
    ? typeof userData.role === 'string'
      ? JSON.parse(userData.role).student
      : userData.role.student
    : false

  const getInitials = () => {
    if (userData?.firstName && userData?.lastName) {
      return `${userData.firstName.charAt(0)}${userData.lastName.charAt(0)}`.toUpperCase()
    }
    return 'U'
  }

  return (
    <div className='p-4 md:p-6 max-w-5xl mx-auto'>
      {/* Profile Header Card */}
      <div className='bg-white rounded-lg border border-gray-200 p-6 mb-4'>
        <div className='flex items-start gap-6'>
          <div className='relative flex-shrink-0'>
            <div className='w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-semibold text-2xl overflow-hidden border-2 border-gray-200'>
              {nameForm.profileImageUrl ? (
                <img
                  src={nameForm.profileImageUrl}
                  alt='Profile'
                  className='w-full h-full object-cover'
                />
              ) : (
                getInitials()
              )}
            </div>
            <button
              onClick={() => setShowNameModal(true)}
              className='absolute -bottom-1 -right-1 p-1.5 bg-white rounded-full border border-gray-300 text-gray-600 hover:text-gray-900 hover:border-gray-400 transition-colors'
              title='Change Photo'
            >
              <FaCamera className='w-3.5 h-3.5' />
            </button>
          </div>
          <div className='flex-1 min-w-0'>
            <h1 className='text-xl font-semibold text-gray-900 mb-1 truncate'>
              {userData?.firstName && userData?.lastName
                ? `${userData.firstName} ${userData.middleName || ''} ${userData.lastName}`.trim()
                : 'User Profile'}
            </h1>
            <p className='text-sm text-gray-600'>{roles}</p>
          </div>
        </div>
      </div>

      {/* User Information Card */}
      <div className='bg-white rounded-lg border border-gray-200 p-6 mb-4'>
        <h2 className='text-base font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-100'>
          Personal Information
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5'>
          <div className='space-y-1.5'>
            <Label className='text-xs font-medium text-gray-500 uppercase tracking-wide'>
              Full Name
            </Label>
            <p className='text-sm text-gray-900'>
              {userData?.firstName} {userData?.middleName || ''}{' '}
              {userData?.lastName}
            </p>
          </div>
          <div className='space-y-1.5'>
            <Label className='text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center gap-1.5'>
              <FaEnvelope className='w-3 h-3' />
              Email Address
            </Label>
            <p className='text-sm text-gray-900'>
              {userData?.email || 'Not provided'}
            </p>
          </div>
          <div className='space-y-1.5'>
            <Label className='text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center gap-1.5'>
              <FaPhone className='w-3 h-3' />
              Phone Number
            </Label>
            <p className='text-sm text-gray-900'>
              {userData?.phoneNo || 'Not provided'}
            </p>
          </div>
          <div className='space-y-1.5'>
            <Label className='text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center gap-1.5'>
              <FaUserTag className='w-3 h-3' />
              Role
            </Label>
            <div className='flex flex-wrap gap-1.5'>
              {roles.split(', ').map((role, idx) => (
                <span
                  key={idx}
                  className='inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200'
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
          {isStudent && (
            <div className='space-y-1.5'>
              <Label className='text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center gap-1.5'>
                <FaFilePdf className='w-3 h-3' />
                Curriculum Vitae
              </Label>
              {nameForm.cvUrl ? (
                <a
                  href={nameForm.cvUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-sm text-gray-900 hover:text-gray-700 underline underline-offset-2 transition-colors inline-block'
                >
                  View CV
                </a>
              ) : (
                <p className='text-sm text-gray-500'>
                  No CV uploaded
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
        <button
          onClick={() => setShowNameModal(true)}
          className='bg-white rounded-lg border border-gray-200 p-5 hover:border-blue-200 hover:bg-blue-50/30 transition-all text-left group'
        >
          <div className='flex items-start gap-3.5'>
            <div className='w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors'>
              <FaUser className='w-4 h-4 text-blue-600' />
            </div>
            <div className='flex-1 min-w-0'>
              <h3 className='text-sm font-semibold text-gray-900 mb-0.5'>
                Update Profile
              </h3>
              <p className='text-xs text-gray-600'>
                Edit your personal information and contact details
              </p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setShowPasswordModal(true)}
          className='bg-white rounded-lg border border-gray-200 p-5 hover:border-blue-200 hover:bg-blue-50/30 transition-all text-left group'
        >
          <div className='flex items-start gap-3.5'>
            <div className='w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors'>
              <FaLock className='w-4 h-4 text-blue-600' />
            </div>
            <div className='flex-1 min-w-0'>
              <h3 className='text-sm font-semibold text-gray-900 mb-0.5'>
                Change Password
              </h3>
              <p className='text-xs text-gray-600'>
                Update your password to keep your account secure
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* Update Profile Dialog */}
      <Dialog isOpen={showNameModal} onClose={() => setShowNameModal(false)}>
        <DialogContent className='max-w-2xl'>
          <DialogClose onClick={() => setShowNameModal(false)} />
          <DialogHeader>
            <DialogTitle className='text-lg'>Update Profile Information</DialogTitle>
            <DialogDescription className='text-sm text-gray-600'>
              Make changes to your profile information and click save.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleNameSubmit} className='mt-4'>
            <div className='space-y-5'>
              {/* Basic Info Grid */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-1.5'>
                  <Label htmlFor='firstName' className='text-sm font-medium text-gray-700'>
                    First Name <span className='text-red-500'>*</span>
                  </Label>
                  <Input
                    id='firstName'
                    type='text'
                    placeholder='Enter first name'
                    value={nameForm.firstName}
                    onChange={(e) =>
                      setNameForm({ ...nameForm, firstName: e.target.value })
                    }
                    className='h-10'
                    required
                  />
                </div>
                <div className='space-y-1.5'>
                  <Label htmlFor='middleName' className='text-sm font-medium text-gray-700'>
                    Middle Name
                  </Label>
                  <Input
                    id='middleName'
                    type='text'
                    placeholder='Enter middle name'
                    value={nameForm.middleName}
                    onChange={(e) =>
                      setNameForm({ ...nameForm, middleName: e.target.value })
                    }
                    className='h-10'
                  />
                </div>
                <div className='space-y-1.5'>
                  <Label htmlFor='lastName' className='text-sm font-medium text-gray-700'>
                    Last Name <span className='text-red-500'>*</span>
                  </Label>
                  <Input
                    id='lastName'
                    type='text'
                    placeholder='Enter last name'
                    value={nameForm.lastName}
                    onChange={(e) =>
                      setNameForm({ ...nameForm, lastName: e.target.value })
                    }
                    className='h-10'
                    required
                  />
                </div>
                <div className='space-y-1.5'>
                  <Label htmlFor='email' className='text-sm font-medium text-gray-700'>
                    Email Address <span className='text-red-500'>*</span>
                  </Label>
                  <Input
                    id='email'
                    type='email'
                    placeholder='Enter email'
                    value={nameForm.email}
                    onChange={(e) =>
                      setNameForm({ ...nameForm, email: e.target.value })
                    }
                    className='h-10'
                    required
                  />
                </div>
                <div className='space-y-1.5 md:col-span-2'>
                  <Label htmlFor='phoneNo' className='text-sm font-medium text-gray-700'>
                    Phone Number <span className='text-red-500'>*</span>
                  </Label>
                  <Input
                    id='phoneNo'
                    type='tel'
                    placeholder='Enter phone number'
                    value={nameForm.phoneNo}
                    onChange={(e) =>
                      setNameForm({ ...nameForm, phoneNo: e.target.value })
                    }
                    className='h-10'
                    required
                  />
                </div>
              </div>

              {/* Uploads Section */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-gray-200'>
                <div className='space-y-2.5'>
                  <div className='flex flex-col'>
                    <span className='text-sm font-medium text-gray-700'>Profile Picture</span>
                    <span className='text-xs text-gray-500'>Square image, max 2MB</span>
                  </div>
                  <FileUpload
                    accept='image/*'
                    defaultPreview={nameForm.profileImageUrl}
                    onUploadComplete={(url) =>
                      setNameForm({ ...nameForm, profileImageUrl: url })
                    }
                  />
                </div>

                {isStudent && (
                  <div className='space-y-2.5'>
                    <div className='flex flex-col'>
                      <span className='text-sm font-medium text-gray-700'>Curriculum Vitae</span>
                      <span className='text-xs text-gray-500'>PDF files only</span>
                    </div>
                    <FileUpload
                      accept='application/pdf'
                      defaultPreview={nameForm.cvUrl}
                      onUploadComplete={(url) =>
                        setNameForm({ ...nameForm, cvUrl: url })
                      }
                    />
                  </div>
                )}
              </div>
            </div>
            <DialogFooter className='mt-6 pt-5 border-t border-gray-200'>
              <Button
                type='button'
                variant='ghost'
                onClick={() => setShowNameModal(false)}
                className='h-10 px-5'
              >
                Cancel
              </Button>
              <Button type='submit' disabled={isLoading} className='h-10 px-6 bg-blue-600 hover:bg-blue-700'>
                {isLoading ? (
                  <div className='flex items-center gap-2'>
                    <span className='h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                    Saving...
                  </div>
                ) : (
                  'Save Changes'
                )}
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
        <DialogContent className='max-w-xl'>
          <DialogClose onClick={() => setShowPasswordModal(false)} />
          <DialogHeader>
            <DialogTitle className='text-lg'>Change Password</DialogTitle>
            <DialogDescription className='text-sm text-gray-600'>
              Enter your new password and make sure it meets the security requirements.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePasswordSubmit} className='mt-4'>
            <div className='space-y-5'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-1.5'>
                  <Label htmlFor='newPassword' className='text-sm font-medium text-gray-700'>
                    New Password <span className='text-red-500'>*</span>
                  </Label>
                  <div className='relative'>
                    <Input
                      id='newPassword'
                      type={showNewPassword ? 'text' : 'password'}
                      placeholder='••••••••'
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          newPassword: e.target.value.trim()
                        })
                      }
                      className='h-10 pr-10'
                      required
                    />
                    <button
                      type='button'
                      className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1 rounded-md transition-colors'
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
                <div className='space-y-1.5'>
                  <Label htmlFor='confirmPassword' className='text-sm font-medium text-gray-700'>
                    Confirm Password <span className='text-red-500'>*</span>
                  </Label>
                  <div className='relative'>
                    <Input
                      id='confirmPassword'
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder='••••••••'
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          confirmPassword: e.target.value.trim()
                        })
                      }
                      className='h-10 pr-10'
                      required
                    />
                    <button
                      type='button'
                      className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1 rounded-md transition-colors'
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
              </div>
              <div className='rounded-lg bg-gray-50 border border-gray-200 p-3.5'>
                <p className='text-xs leading-relaxed text-gray-700'>
                  <span className='font-semibold text-gray-900'>Password requirements:</span> At least 8 characters with uppercase, lowercase, number, and special character (@$!%*?&)
                </p>
              </div>
            </div>
            <DialogFooter className='mt-6 pt-5 border-t border-gray-200'>
              <Button
                type='button'
                variant='ghost'
                onClick={() => setShowPasswordModal(false)}
                className='h-10 px-5'
              >
                Cancel
              </Button>
              <Button type='submit' disabled={isLoading} className='h-10 px-6 bg-blue-600 hover:bg-blue-700'>
                {isLoading ? (
                  <div className='flex items-center gap-2'>
                    <span className='h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                    Updating...
                  </div>
                ) : (
                  'Update Password'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ProfileUpdate
