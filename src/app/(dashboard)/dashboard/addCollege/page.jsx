'use client'
import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { useForm, useFieldArray } from 'react-hook-form'
import {
  createCollege,
  fetchAllCourse,
  fetchAllUniversity,
  getUniversityBySlug,
  fetchAllDegrees
} from './actions'
import axios from 'axios'
import { useSelector } from 'react-redux'
import FileUpload from './FileUpload'
import Table from '@/ui/shadcn/DataTable'
import {
  Edit2,
  Trash2,
  Globe,
  MapPin,
  Upload,
  UserPlus,
  Eye,
  EyeOff,
  Search
} from 'lucide-react'
import { authFetch } from '@/app/utils/authFetch'
import { toast, ToastContainer } from 'react-toastify'

import ConfirmationDialog from './ConfirmationDialog'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/ui/shadcn/dialog'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import { Button } from '../../../../ui/shadcn/button'
import { Input } from '../../../../ui/shadcn/input'
import { Label } from '../../../../ui/shadcn/label'
import { Select } from '../../../../ui/shadcn/select'
import { Textarea } from '@/ui/shadcn/textarea'
import UniversityDropdown from '@/ui/molecules/dropdown/UniversityDropdown'

const CKUni = dynamic(() => import('../component/CKUni'), {
  ssr: false
})
import { useDebounce } from 'use-debounce'
import GallerySection from './GallerySection'
import VideoSection from './VideoSection'
import useAdminPermission from '@/hooks/useAdminPermission'
import { createColumns } from './columns'
import SearchInput from '@/ui/molecules/SearchInput'

const FileUploadWithPreview = ({
  onUploadComplete,
  label,
  defaultPreview = null,
  accept = 'image/*',
  onClear
}) => {
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState(defaultPreview)

  useEffect(() => {
    setPreview(defaultPreview)
  }, [defaultPreview])

  const handleClear = () => {
    setPreview(null)
    if (onClear) onClear()
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => setPreview(reader.result)
      reader.readAsDataURL(file)
    }

    setIsUploading(true)

    const formData = new FormData()
    formData.append('title', file.name)
    formData.append('altText', file.name)
    formData.append('description', '')
    formData.append('file', file)
    formData.append('authorId', '1')

    try {
      const response = await axios.post(
        `${process.env.mediaUrl}${process.env.version}/media/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      const data = response.data
      if (data.success === false) {
        toast.error(data.message || 'Upload failed.')
        return
      }

      toast.success('File uploaded successfully!')
      onUploadComplete(data.media.url)
    } catch (error) {
      console.error('Upload failed:', error)
      toast.error(error.response?.data?.message || 'Upload failed.')
      setPreview(defaultPreview)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className='space-y-4'>
      <label className='block mb-2'>{label}</label>
      <div className='border-2 border-dashed border-gray-300 rounded-lg p-6'>
        <div className='flex flex-col items-center'>
          {!preview && <Upload className='h-12 w-12 text-gray-400' />}
          <div className='mt-4 text-center'>
            <label className='cursor-pointer'>
              <span className='text-blue-500 hover:text-blue-600'>
                {preview ? 'Change file' : 'Click to upload'}
              </span>
              <input
                type='file'
                className='hidden'
                onChange={handleFileUpload}
                accept={accept}
                disabled={isUploading}
              />
            </label>
          </div>
        </div>
        {isUploading && (
          <div className='mt-4 text-center text-sm text-gray-500'>
            Uploading...
          </div>
        )}
        {preview && (
          <div className='mt-4'>
            {accept === 'image/*' ? (
              <img
                src={preview}
                alt='Preview'
                className='mx-auto max-h-40 rounded-lg'
              />
            ) : (
              <div className='text-center'>
                <p className='text-sm text-gray-600'>PDF File Selected</p>
                <a
                  href={preview}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-500 hover:underline'
                >
                  View File
                </a>
              </div>
            )}
          </div>
        )}
        <div className='flex justify-end'>
          <Button
            type='button'
            onClick={handleClear}
            variant='destructive'
            size='sm'
          >
            Clear
          </Button>
        </div>
      </div>
    </div>
  )
}
export default function CollegeForm() {
  const { setHeading } = usePageHeading()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchTimeout, setSearchTimeout] = useState(null)

  // for programs that is related to selected University
  const [uniSlug, setUniSlug] = useState('')
  const [universityPrograms, setUniversityPrograms] = useState([])

  //show programs only fro selected University;
  const [loadingPrograms, setLoadingPrograms] = useState(false)

  //for allcourse
  const [courses, setCourses] = useState([])
  const [allDegrees, setAllDegrees] = useState([])
  const [submitting, setSubmitting] = useState(false)

  const [uploadedFiles, setUploadedFiles] = useState({
    logo: '',
    featured: '',
    images: [],
    videos: []
  })
  const [isOpen, setIsOpen] = useState(false)
  const [colleges, setColleges] = useState([])
  const [tableloading, setTableLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  })
  const [editing, setEditing] = useState(false)

  const author_id = useSelector((state) => state.user.data.id)

  const { requireAdmin } = useAdminPermission()
  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    getValues,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      author_id: author_id,
      institute_type: 'Private',
      institute_level: [],
      courses: [],
      degrees: [],
      description: '',
      content: '',
      website_url: '',
      google_map_url: '',
      college_logo: '',
      featured_img: '',
      images: [],
      college_broucher: '',
      facilities: [],
      address: {
        country: '',
        state: '',
        city: '',
        street: '',
        postal_code: ''
      },
      contacts: ['', ''],
      members: [],

    }
  })

  const {
    fields: memberFields,
    append: appendMember,
    remove: removeMember
  } = useFieldArray({ control, name: 'members' })



  const {
    fields: facilityFields,
    append: appendFacility,
    remove: removeFacility
  } = useFieldArray({ control, name: 'facilities' })
  const onSubmit = async (data) => {
    // Prevent auto-submission - only allow submission when modal is open
    if (!isOpen) {
      return
    }

    try {
      setSubmitting(true)



      // Filter out empty members
      const filteredMembers = (data.members || []).filter((member) => {
        return Object.values(member).some((val) => {
          if (typeof val === 'string') return val.trim() !== ''
          return val !== null && val !== undefined
        })
      })

      // Only include members in payload if there are non-empty members
      if (filteredMembers.length > 0) {
        data.members = filteredMembers
      } else {
        delete data.members
      }

      // Convert boolean values to numbers
      // Convert IDs to numbers
      data.university_id = parseInt(data.university_id)
      
      // Convert degree IDs to numbers
      data.degrees = (data.degrees || [])
        .map((id) => parseInt(id))
        .filter((id) => !isNaN(id))

      // Only include courses in payload if there are courses
      const coursesArray = (data.courses || [])
        .map((course) => parseInt(course))
        .filter((course) => !isNaN(course) && course > 0)
      if (coursesArray.length > 0) {
        data.courses = coursesArray
      } else {
        delete data.courses
      }

      data.college_logo = uploadedFiles.logo
      data.featured_img = uploadedFiles.featured

      //before sending the image , we combine all selected images and videos
      data.images = [...uploadedFiles.images, ...uploadedFiles.videos]

      data.college_broucher = data.college_broucher || ''

      //   Filter out empty facilities
      const filteredFacilities = (data.facilities || []).filter(
        (facility) =>
          facility.title.trim() !== '' ||
          facility.description.trim() !== '' ||
          facility.icon.trim() !== ''
      )

      // Only include facilities in payload if there are non-empty facilities
      if (filteredFacilities.length > 0) {
        data.facilities = filteredFacilities
      } else {
        delete data.facilities
      }

      //if we have no images after remove button clicked in allimages, we send this empty values
      if (editing && data.images.length === 0) {
        data.images = [
          {
            file_type: '',
            url: ''
          }
        ]
      }

      await createCollege(data)

      // Show success message
      editing
        ? toast.success('College updated successfully!')
        : toast.success('College created successfully!')

      // Reset form and state
      setEditing(false)
      reset()
      setUploadedFiles({
        logo: '',
        featured: '',
        images: [],
        videos: []
      })
      setIsOpen(false)
      loadColleges()
    } catch (error) {
      // Extract error message from different error formats

      let errorMessage = 'Failed to create college'

      if (error.message) {
        // Standard error object (createCollege throws Error with message)
        errorMessage = error.message
      } else if (error.response?.data?.message) {
        // API error response with message (for direct fetch calls)
        errorMessage = error.response.data.message
      } else if (typeof error === 'string') {
        // String error
        errorMessage = error
      }

      console.error('College submission error:', error)
      toast.error(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  //for all fetching of college
  useEffect(() => {
    const getCourses = async () => {
      try {
        const courseList = await fetchAllCourse()
        setCourses(courseList)
      } catch (error) {
        console.error('Error fetching courses:', error)
      }
    }

    getCourses()
  }, [])

  //for all fetching of degrees
  useEffect(() => {
    const getDegrees = async () => {
      try {
        const degreeList = await fetchAllDegrees()
        setAllDegrees(degreeList)
      } catch (error) {
        console.error('Error fetching degrees:', error)
      }
    }

    getDegrees()
  }, [])

  const handleCloseModal = () => {
    setIsOpen(false)
    setEditing(false)
    reset()
    setUploadedFiles({
      logo: '',
      featured: '',
      images: [],
      videos: []
    })
    setUniSlug('')
  }

  // Handle query parameter to open add form
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    if (searchParams.get('add') === 'true') {
      setIsOpen(true)
      setEditing(false)
      reset()
      setUploadedFiles({
        logo: '',
        featured: '',
        images: [],
        videos: []
      })
    }
  }, [reset])

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return

    setHeading('College Management')
    const loadColleges = async () => {
      setLoading(true)
      setTableLoading(true)
      try {
        // Use authFetch directly instead of server action to avoid SSR issues
        const response = await authFetch(
          `${process.env.baseUrl}/college?limit=10&page=1`
        )
        if (response.ok) {
          const data = await response.json()
          if (data && data.items) {
            setColleges(data.items)
            setPagination({
              currentPage: data.pagination?.currentPage || 1,
              totalPages: data.pagination?.totalPages || 1,
              total: data.pagination?.totalCount || 0
            })
          }
        } else {
          throw new Error('Failed to fetch colleges')
        }
      } catch (err) {
        console.error('Error loading colleges:', err)
        // Set empty state on error instead of showing error
        setColleges([])
        setPagination({
          currentPage: 1,
          totalPages: 1,
          total: 0
        })
      } finally {
        setLoading(false)
        setTableLoading(false)
      }
    }
    loadColleges()
    return () => setHeading(null)
  }, [setHeading])

  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout)
      }
    }
  }, [searchTimeout])

  const [deleteId, setDeleteId] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [credentialsModalOpen, setCredentialsModalOpen] = useState(false)
  const [selectedCollege, setSelectedCollege] = useState(null)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [viewCollegeData, setViewCollegeData] = useState(null)
  const [loadingView, setLoadingView] = useState(false)
  const [credentialsForm, setCredentialsForm] = useState({
    firstName: '',
    lastName: '',
    emailName: '',
    password: '',
    phoneNo: ''
  })
  const [creatingCredentials, setCreatingCredentials] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

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
        `${process.env.baseUrl}/college/${deleteId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      const res = await response.json()
      toast.success(res.message)
      // Reload colleges using authFetch
      const reloadResponse = await authFetch(
        `${process.env.baseUrl}/college?limit=10&page=${pagination.currentPage}`
      )
      if (reloadResponse.ok) {
        const reloadData = await reloadResponse.json()
        setColleges(reloadData.items || [])
        setPagination({
          currentPage:
            reloadData.pagination?.currentPage || pagination.currentPage,
          totalPages:
            reloadData.pagination?.totalPages || pagination.totalPages,
          total: reloadData.pagination?.totalCount || pagination.total
        })
      }
      setEditing(false)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setIsDialogOpen(false)
      setDeleteId(null)
    }
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false) // Close the dialog without deleting
    setDeleteId(null) // Reset the delete ID
  }

  const handleOpenCredentialsModal = async (college) => {
    setSelectedCollege(college)

    // Set first name to college name
    let firstName = college.name || ''
    let lastName = ''
    let emailName = ''
    let phoneNo = ''

    // If college has members, use the first member's data for other fields
    if (college.members && college.members.length > 0) {
      const firstMember = college.members[0]
      const nameParts = (firstMember.name || '').split(' ')
      lastName = nameParts.slice(1).join(' ') || nameParts[0] || ''
      phoneNo = firstMember.contact_number || ''
    }

    // If college has contacts, use the first contact as phone
    if (!phoneNo && college.contacts && college.contacts.length > 0) {
      phoneNo = college.contacts[0]?.contact_number || college.contacts[0] || ''
    }

    // Extract email name if email exists (remove @merouni.com or any domain)
    if (college.email) {
      const emailParts = college.email.split('@')
      emailName = emailParts[0] || ''
    }

    setCredentialsForm({
      firstName,
      lastName,
      emailName,
      password: '',
      phoneNo
    })
    setCredentialsModalOpen(true)
  }

  const handleCloseCredentialsModal = () => {
    setCredentialsModalOpen(false)
    setSelectedCollege(null)
    setCredentialsForm({
      firstName: '',
      lastName: '',
      emailName: '',
      password: '',
      phoneNo: ''
    })
    setShowPassword(false)
  }

  const handleCreateCredentials = async (e) => {
    e.preventDefault()
    if (!selectedCollege) return

    try {
      setCreatingCredentials(true)
      // Combine email name with @merouni.com
      const fullEmail = `${credentialsForm.emailName}@merouni.com`
      const payload = {
        ...credentialsForm,
        email: fullEmail,
        collegeId: selectedCollege.id
      }
      delete payload.emailName

      const response = await authFetch(
        `${process.env.baseUrl}/users/college-credentials`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create credentials')
      }

      const data = await response.json()
      toast.success(data.message || 'Credentials created successfully!')
      handleCloseCredentialsModal()

      // Reload colleges to update has_account status
      setTableLoading(true)
      try {
        const response2 = await authFetch(
          `${process.env.baseUrl}/college?limit=10&page=${pagination.currentPage}`
        )
        if (response2.ok) {
          const data = await response2.json()
          setColleges(data.items || [])
          setPagination({
            currentPage: data.pagination?.currentPage || pagination.currentPage,
            totalPages: data.pagination?.totalPages || pagination.totalPages,
            total: data.pagination?.totalCount || pagination.total
          })
        }
      } catch (err) {
        console.error('Error reloading colleges:', err)
      } finally {
        setTableLoading(false)
      }
    } catch (err) {
      toast.error(err.message || 'Failed to create credentials')
    } finally {
      setCreatingCredentials(false)
    }
  }
  const handleEdit = async (slug) => {
    try {
      setEditing(true)
      setLoading(true)
      setIsOpen(true)

      // First reset the form to clear any existing values
      reset()

      const response = await authFetch(
        `${process.env.baseUrl}/college/${slug}`,
        { headers: { 'Content-Type': 'application/json' } }
      )

      let collegeData = await response.json()
      collegeData = collegeData.item

      // Basic Information
      setValue('id', collegeData.id)
      setValue('name', collegeData.name)
      setValue('institute_type', collegeData.institute_type)
      setValue(
        'institute_level',
        typeof collegeData.institute_level === 'string'
          ? JSON.parse(collegeData.institute_level || '[]')
          : collegeData.institute_level || []
      )
      setValue('description', collegeData.description)
      setValue('content', collegeData.content)
      setValue('website_url', collegeData.website_url)
      setValue('google_map_url', collegeData.google_map_url)

      // Set university_id
      if (collegeData.university_id) {
        setValue('university_id', Number(collegeData.university_id), {
          shouldValidate: true,
          shouldDirty: true
        })
      }

      if (collegeData.university) {
        setUniSlug(collegeData.university.slugs)
      }

      // Set degrees
      if (collegeData.degrees && Array.isArray(collegeData.degrees)) {
        const degreeIds = collegeData.degrees.map((degree) => String(degree.id))
        setValue('degrees', degreeIds)
      }

      // Set programs - use program_id from college course data
      const programIds =
        collegeData.collegeCourses
          ?.map((course) => {
            // Use program_id from the college course data
            return course.program_id || course.program?.id
          })
          .filter((id) => id !== undefined) || []

      // Remove duplicates and set values
      const uniqueProgramIds = [...new Set(programIds)]
      setValue('courses', uniqueProgramIds)

      // Address
      if (collegeData.collegeAddress) {
        setValue('address.country', collegeData.collegeAddress.country)
        setValue('address.state', collegeData.collegeAddress.state)
        setValue('address.city', collegeData.collegeAddress.city)
        setValue('address.street', collegeData.collegeAddress.street)
        setValue('address.postal_code', collegeData.collegeAddress.postal_code)
      }

      // Contacts
      const contacts = collegeData.collegeContacts?.map(
        (contact) => contact.contact_number
      ) || ['', '']
      setValue('contacts', contacts)

      // Images
      const galleryItems = collegeData.collegeGallery || []

      const images = galleryItems
        .filter((item) => item.file_type === 'image' && item.file_url)
        .map((img) => ({
          url: img.file_url,
          file_type: 'image'
        }))

      const videos = galleryItems
        .filter((item) => item.file_type === 'video')
        .map((vid) => ({
          url: vid.file_url,
          file_type: 'video'
        }))

      setUploadedFiles({
        logo: collegeData.college_logo || '',
        featured: collegeData.featured_img || '',
        images: images.length === 1 && !images[0].url ? [] : images,
        videos
      })

      setValue('images', [...images, ...videos])

      // Members
      const memberData = collegeData.collegeMembers?.length
        ? collegeData.collegeMembers
        : [
            {
              name: '',
              contact_number: '',
              role: '',
              description: ''
            }
          ]
      setValue('members', memberData)

      //college_broucher
      if (collegeData.college_broucher) {
        setValue('college_broucher', collegeData.college_broucher)
      }

      // Set facilities
      const facilityData = collegeData.collegeFacility?.length
        ? collegeData.collegeFacility.map((facility) => ({
            title: facility.title || '',
            description: facility.description || '',
            icon: facility.icon || ''
          }))
        : [
            {
              title: '',
              description: '',
              icon: ''
            }
          ]
      setValue('facilities', facilityData)


    } catch (error) {
      console.error('Error fetching college data:', error)
      toast.error('Failed to fetch college data')
    } finally {
      setLoading(false)
    }
  }

  const loadColleges = async (page = 1) => {
    try {
      // Use authFetch directly instead of server action to avoid SSR issues
      const response = await authFetch(
        `${process.env.baseUrl}/college?limit=10&page=${page}`
      )

      if (response.ok) {
        const data = await response.json()
        setColleges(data.items || [])
        setPagination({
          currentPage: data.pagination?.currentPage || page,
          totalPages: data.pagination?.totalPages || 1,
          total: data.pagination?.totalCount || 0
        })
      } else {
        throw new Error('Failed to fetch colleges')
      }
    } catch (err) {
      toast.error('Failed to load colleges')
      console.error('Error loading colleges:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (query) => {
    if (!query) {
      // getColleges();
      loadColleges()
      return
    }

    try {
      const response = await authFetch(
        `${process.env.baseUrl}/college?q=${query}`
      )
      if (response.ok) {
        const data = await response.json()
        setColleges(data.items)

        if (data.pagination) {
          setPagination({
            currentPage: data.pagination.currentPage,
            totalPages: data.pagination.totalPages,
            total: data.pagination.totalCount
          })
        }
      } else {
        console.error('Error fetching results:', response.statusText)
        setColleges([])
      }
    } catch (error) {
      console.error('Error fetching college search results:', error.message)
      setColleges([])
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

  //watch form data
  const formData = watch()

  useEffect(() => {}, [formData])

  const fetchUniversityDetails = async (slugs) => {
    if (!slugs) {
      setUniversityPrograms([])
      return
    }
    try {
      setLoadingPrograms(true)
      const universityData = await getUniversityBySlug(slugs)
      const universityPrograms = universityData.university_programs || []

      setUniversityPrograms(universityPrograms)
    } catch (error) {
      console.error('Error fetching university programs:', error)
      setUniversityPrograms([])
    } finally {
      setLoadingPrograms(false)
    }
  }

  useEffect(() => {
    if (uniSlug) {
      fetchUniversityDetails(uniSlug)
    } else {
      setUniversityPrograms([])
      setLoadingPrograms(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uniSlug])

  const handleView = async (slug) => {
    try {
      setLoadingView(true)
      setViewModalOpen(true)

      const response = await authFetch(
        `${process.env.baseUrl}/college/${slug}`,
        { headers: { 'Content-Type': 'application/json' } }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch college details')
      }

      const data = await response.json()
      setViewCollegeData(data.item)
    } catch (err) {
      toast.error(err.message || 'Failed to load college details')
      setViewModalOpen(false)
    } finally {
      setLoadingView(false)
    }
  }

  const handleCloseViewModal = () => {
    setViewModalOpen(false)
    setViewCollegeData(null)
  }

  // Create columns with handlers (must be after handlers are defined)
  const columns = createColumns({
    handleView,
    handleEdit,
    handleOpenCredentialsModal,
    handleDeleteClick
  })


  return (
    <>
      <div className='w-full space-y-2'>
        <div className='flex justify-between items-center px-4 pt-4'>
          {/* Search Bar */}
          <SearchInput
            value={searchQuery}
            onChange={(e) => handleSearchInput(e.target.value)}
            placeholder='Search colleges...'
            className='max-w-md'
          />
          {/* Button */}
          <div className='flex gap-2'>
            <Button
              onClick={() => {
                setIsOpen(true)
                setEditing(false)
                reset()
                setUploadedFiles({
                  logo: '',
                  featured: '',
                  images: [],
                  videos: []
                })
              }}
            >
              Add College
            </Button>
          </div>
        </div>
        <ToastContainer />

        <Dialog isOpen={isOpen} onClose={handleCloseModal} className='max-w-7xl'>
          <DialogContent className='max-h-[90vh] flex flex-col'>
            <DialogHeader>
              <DialogTitle>{editing ? 'Edit College' : 'Add College'}</DialogTitle>
            </DialogHeader>
          <div className='container mx-auto p-1 flex flex-col max-h-[calc(100vh-200px)]'>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className='flex flex-col flex-1 overflow-hidden'
            >
              <div className='flex-1 overflow-y-auto space-y-6 pr-2'>
                {/* Basic Information */}
                <div className='bg-white p-6 rounded-lg shadow-md'>
                  <h2 className='text-xl font-semibold mb-4'>
                    Basic Information
                  </h2>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='name'>
                        College Name <span className='text-red-500'>*</span>
                      </Label>
                      <Input
                        id='name'
                        placeholder='Enter college name'
                        {...register('name', { required: true })}
                        className={errors.name ? 'border-destructive' : ''}
                      />
                      {errors.name && (
                        <span className='text-sm font-medium text-destructive'>
                          This field is required
                        </span>
                      )}
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='institute_type'>
                        Institute Type <span className='text-red-500'>*</span>
                      </Label>
                      <Select
                        className={`w-full ${errors.institute_type ? 'border-destructive' : ''}`}
                        {...register('institute_type', { required: true })}
                        id='institute_type'
                        aria-invalid={errors.institute_type ? 'true' : 'false'}
                      >
                        <option value='Private'>Private</option>
                        <option value='Public'>Public</option>
                      </Select>
                      {errors.institute_type && (
                        <span className='text-sm font-medium text-destructive'>
                          This field is required
                        </span>
                      )}
                    </div>

                    <div className='space-y-2'>
                      <Label>Institute Level</Label>
                      <div className='flex items-center gap-6 pt-2'>
                        {['School', 'College'].map((level) => (
                          <label
                            key={level}
                            className='flex items-center gap-2 cursor-pointer'
                          >
                            <input
                              type='checkbox'
                              {...register('institute_level')}
                              value={level}
                              className='rounded border-input'
                            />
                            <span className='text-sm'>{level}</span>
                          </label>
                        ))}
                      </div>
                    </div>


                    <div className='md:col-span-2 space-y-2'>
                      <Label htmlFor='description'>Description</Label>
                      <Textarea
                        id='description'
                        placeholder='Enter college description'
                        {...register('description')}
                        className='min-h-[100px]'
                      />
                    </div>

                    <div className='md:col-span-2 space-y-2'>
                      <Label htmlFor='content'>Content</Label>

                      <div className='border border-input rounded-md overflow-hidden'>
                        <CKUni
                          id='editor-content'
                          initialData={getValues('content')}
                          onChange={(data) => setValue('content', data)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {editing ? <input type='hidden' {...register('id')} /> : <></>}
                {/* Courses Section */}

                <div className='bg-white p-6 rounded-lg shadow-md mb-6'>
                  <Label className='mb-2 block'>University <span className='text-red-500'>*</span></Label>
                  <UniversityDropdown
                    value={watch('university_id')}
                    onChange={(id, selectedUni) => {
                      if (id) {
                        setValue('university_id', Number(id), {
                          shouldValidate: true,
                          shouldDirty: true
                        })
                        setUniSlug(selectedUni?.slugs || '')
                      } else {
                        setValue('university_id', '', {
                          shouldValidate: true
                        })
                        setUniSlug('')
                      }
                    }}
                    error={errors.university_id ? 'This field is required' : ''}
                  />
                </div>

                {/* Programs Section */}
                {/* Programs Section */}
                <div className='bg-white p-6 rounded-lg shadow-md'>
                  <div className='flex justify-between items-center mb-4'>
                    <h2 className='text-xl font-semibold'>Programs</h2>
                  </div>

                  {!uniSlug ? (
                    <p className='text-gray-500'>
                      Please select a university first to see available programs
                    </p>
                  ) : loadingPrograms ? (
                    <p>Loading programs...</p>
                  ) : (
                    <div>
                      <label className='block mb-2'>
                        Select Programs{' '}
                        {universityPrograms.length > 0 && (
                          <span className='text-gray-500 text-sm font-normal'>
                            ({universityPrograms.length} programs available from
                            selected university)
                          </span>
                        )}
                      </label>
                      <div className='border rounded p-4 max-h-96 overflow-y-auto'>
                        {universityPrograms.length === 0 ? (
                          <p className='text-gray-500'>
                            {!uniSlug
                              ? 'Please select a university first'
                              : universityPrograms.length === 0
                                ? 'No programs available for the selected university'
                                : 'No programs available'}
                          </p>
                        ) : (
                          <div className='space-y-2'>
                            {universityPrograms.map((course) => {
                              const isChecked = (
                                getValues('courses') || []
                              ).includes(course.program_id)
                              return (
                                <div key={course.program_id}>
                                  <input
                                    type='checkbox'
                                    checked={isChecked}
                                    value={course.program_id}
                                    onChange={(e) => {
                                      const currentCourses =
                                        getValues('courses') || []
                                      if (e.target.checked) {
                                        setValue(
                                          'courses',
                                          [
                                            ...currentCourses,
                                            course.program_id
                                          ],
                                          {
                                            shouldValidate: true,
                                            shouldDirty: true
                                          }
                                        )
                                      } else {
                                        setValue(
                                          'courses',
                                          currentCourses.filter(
                                            (id) => id !== course.program_id
                                          ),
                                          {
                                            shouldValidate: true,
                                            shouldDirty: true
                                          }
                                        )
                                      }
                                    }}
                                    className='mr-3 h-4 w-4'
                                  />
                                  <span>{course.program?.title}</span>
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className='bg-white p-6 rounded-lg shadow-md'>
                  <h2 className='text-xl font-semibold mb-4'>Degrees Offered</h2>
                  <div className='grid grid-cols-2 lg:grid-cols-3 gap-2 border rounded p-4 max-h-60 overflow-y-auto'>
                    {allDegrees.map((degree) => (
                      <label 
                        key={degree.id} 
                        className='flex items-center gap-2 cursor-pointer p-1 hover:bg-gray-50 rounded select-none'
                      >
                        <input
                          type='checkbox'
                          {...register('degrees')}
                          value={String(degree.id)}
                          className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                        />
                        <span className='text-sm text-gray-700 font-medium'>
                          {degree.title} {degree.short_name ? `(${degree.short_name})` : ''}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className='bg-white p-6 rounded-lg shadow-md'>
                  <h2 className='text-xl font-semibold mb-4'>Media</h2>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <FileUpload
                        label='College Logo'
                        onUploadComplete={(url) => {
                          setUploadedFiles((prev) => ({ ...prev, logo: url }))
                          setValue('college_logo', url)
                        }}
                        defaultPreview={uploadedFiles.logo}
                      />
                    </div>
                    <div>
                      <FileUpload
                        label='Featured Image'
                        onUploadComplete={(url) => {
                          setUploadedFiles((prev) => ({
                            ...prev,
                            featured: url
                          }))
                          setValue('featured_img', url)
                        }}
                        defaultPreview={uploadedFiles.featured}
                      />
                    </div>
                  </div>

                  {/* for image only */}
                  <GallerySection
                    control={control}
                    setValue={setValue}
                    uploadedFiles={uploadedFiles}
                    setUploadedFiles={setUploadedFiles}
                    getValues={getValues}
                  />

                  {/* for videos only */}

                  <VideoSection
                    control={control}
                    setValue={setValue}
                    uploadedFiles={uploadedFiles}
                    setUploadedFiles={setUploadedFiles}
                    getValues={getValues}
                  />

                  {/* brochure */}
                  <div className='md:col-span-2'>
                    <FileUploadWithPreview
                      label='College Brochure (PDF)'
                      onUploadComplete={(url) => {
                        setValue('college_broucher', url)
                      }}
                      onClear={() => {
                        setValue('college_broucher', '')
                      }}
                      defaultPreview={getValues('college_broucher')}
                      accept='application/pdf'
                    />
                  </div>
                </div>

                <div className='bg-white p-6 rounded-lg shadow-md'>
                  <div className='flex justify-between items-center mb-4'>
                    <h2 className='text-xl font-semibold'>Facilities</h2>
                    <Button
                      type='button'
                      onClick={() =>
                        appendFacility({
                          title: '',
                          description: '',
                          icon: ''
                        })
                      }
                      variant='default'
                      size='sm'
                    >
                      Add Facility
                    </Button>
                  </div>

                  {facilityFields.map((field, index) => (
                    <div
                      key={field.id}
                      className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 border rounded'
                    >
                      <div className='space-y-2'>
                        <Label htmlFor={`facility-title-${index}`}>
                          Title
                        </Label>
                        <Input
                          id={`facility-title-${index}`}
                          placeholder='Facility Title'
                          {...register(`facilities.${index}.title`)}
                          aria-invalid={
                            errors.facilities?.[index]?.title ? 'true' : 'false'
                          }
                          className={
                            errors.facilities?.[index]?.title
                              ? 'border-destructive'
                              : ''
                          }
                        />
                        {errors.facilities?.[index]?.title && (
                          <span className='text-sm font-medium text-destructive'>
                            This field is required
                          </span>
                        )}
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor={`facility-description-${index}`}>
                          Description
                        </Label>
                        <Textarea
                          id={`facility-description-${index}`}
                          placeholder='Facility Description'
                          {...register(`facilities.${index}.description`)}
                          className='min-h-[80px]'
                        />
                      </div>
                      <div>
                        <label className='block mb-2'>Icon Image</label>
                        <FileUploadWithPreview
                          onUploadComplete={(url) => {
                            setValue(`facilities.${index}.icon`, url)
                          }}
                          defaultPreview={getValues(`facilities.${index}.icon`)}
                        />
                      </div>
                      <div className='flex items-end'>
                        <Button
                          type='button'
                          onClick={() => {
                            if (facilityFields.length > 1) {
                              removeFacility(index)
                            } else {
                              setValue(`facilities.${index}`, {
                                title: '',
                                description: '',
                                icon: ''
                              })
                            }
                          }}
                          variant='destructive'
                          size='sm'
                          className='w-full'
                        >
                          {facilityFields.length > 1 ? 'Remove' : 'Clear'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Members Section */}
                <div className='bg-white p-6 rounded-lg shadow-md'>
                  <div className='flex justify-between items-center mb-4'>
                    <h2 className='text-xl font-semibold'>Members</h2>
                    <Button
                      type='button'
                      onClick={() =>
                        appendMember({
                          name: '',
                          contact_number: '',
                          role: '',
                          description: ''
                        })
                      }
                      variant='default'
                      size='sm'
                    >
                      Add Member
                    </Button>
                  </div>

                  {memberFields.map((field, index) => (
                    <div
                      key={field.id}
                      className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 border rounded'
                    >
                      <div className='space-y-2'>
                        <Label htmlFor={`member-name-${index}`}>Name</Label>
                        <Input
                          id={`member-name-${index}`}
                          placeholder='Member Name'
                          {...register(`members.${index}.name`)}
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor={`member-role-${index}`}>Role</Label>
                        <Select
                          className='w-full'
                          id={`member-role-${index}`}
                          {...register(`members.${index}.role`)}
                        >
                          <option value=''>Select Role</option>
                          <option value='Principal'>Principal</option>
                          <option value='Professor'>Professor</option>
                          <option value='Lecturer'>Lecturer</option>
                          <option value='Admin'>Admin</option>
                          <option value='Staff'>Staff</option>
                        </Select>
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor={`member-contact-${index}`}>
                          Contact Number
                        </Label>
                        <Input
                          id={`member-contact-${index}`}
                          placeholder='Contact Number'
                          {...register(`members.${index}.contact_number`)}
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor={`member-description-${index}`}>
                          Description
                        </Label>
                        <textarea
                          id={`member-description-${index}`}
                          placeholder='Member Description'
                          {...register(`members.${index}.description`)}
                          className='w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
                        />
                      </div>
                      <Button
                        type='button'
                        onClick={() => {
                          if (memberFields.length > 1) {
                            removeMember(index)
                          } else {
                            setValue(`members.${index}`, {
                              name: '',
                              contact_number: '',
                              role: '',
                              description: ''
                            })
                          }
                        }}
                        variant='destructive'
                        size='sm'
                        className='w-full'
                      >
                        {memberFields.length > 1 ? 'Remove' : 'Clear'}
                      </Button>
                    </div>
                  ))}
                </div>


                {/* Address Section */}
                <div className='bg-white p-6 rounded-lg shadow-md'>
                  <h2 className='text-xl font-semibold mb-4'>Address</h2>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {['country', 'state', 'city', 'street', 'postal_code'].map(
                      (field) => (
                        <div key={field} className='space-y-2'>
                          <Label htmlFor={field} className='capitalize'>
                            {field !== 'state' ? (
                              <>
                                {field.replace('_', ' ')}{' '}
                                <span className='text-red-500'>*</span>
                              </>
                            ) : (
                              'District'
                            )}
                          </Label>
                          <Input
                            id={field}
                            placeholder={field.replace('_', ' ')}
                            {...register(`address.${field}`)}
                            aria-invalid={
                              errors.address?.[field] ? 'true' : 'false'
                            }
                            className={
                              errors.address?.[field]
                                ? 'border-destructive'
                                : ''
                            }
                          />
                          {errors.address?.[field] && (
                            <p className='text-sm font-medium text-destructive'>
                              This field is required
                            </p>
                          )}
                        </div>
                      )
                    )}
                    <div className='space-y-2'>
                      <Label htmlFor='map-url'>Google Map Iframe Tag</Label>
                      <Input
                        id='map-url'
                        type='text'
                        placeholder='https://maps.google.com/...'
                        {...register('google_map_url')}
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className='bg-white p-6 rounded-lg shadow-md'>
                  <h2 className='text-xl font-semibold mb-4'>
                    Contact Information
                  </h2>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='website-url'>Website URL</Label>
                      <Input
                        id='website-url'
                        type='url'
                        placeholder='https://example.com'
                        {...register('website_url')}
                      />
                    </div>
                    {[0, 1].map((index) => (
                      <div key={index} className='space-y-2'>
                        <Label htmlFor={`contact-${index}`}>
                          Contact {index + 1}
                        </Label>
                        <Input
                          id={`contact-${index}`}
                          placeholder='Phone or Email'
                          {...register(`contact_info[${index}]`)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Submit Button - Sticky Footer */}
              <div className='sticky bottom-0 bg-white border-t pt-4 pb-2 mt-4 flex justify-end gap-2'>
                <Button
                  type='button'
                  onClick={handleCloseModal}
                  variant='outline'
                  size='sm'
                >
                  Cancel
                </Button>
                <Button type='submit' disabled={submitting} size='sm'>
                  {submitting
                    ? editing
                      ? 'Updating...'
                      : 'Creating...'
                    : editing
                      ? 'Update College'
                      : 'Create College'}
                </Button>
              </div>
            </form>
          </div>
          </DialogContent>
        </Dialog>
        <ConfirmationDialog
          open={isDialogOpen}
          onClose={handleDialogClose}
          onConfirm={handleDeleteConfirm}
          title='Confirm Deletion'
          message='Are you sure you want to delete this College? This action cannot be undone.'
        />

        {/* View College Details Modal */}
        <Dialog
          isOpen={viewModalOpen}
          onClose={handleCloseViewModal}
          className='max-w-7xl'
        >
          <DialogContent className='max-h-[90vh] overflow-y-auto'>
            <DialogHeader>
              <DialogTitle>College Details</DialogTitle>
              <DialogClose onClick={handleCloseViewModal} />
            </DialogHeader>
          {loadingView ? (
            <div className='flex items-center justify-center py-8'>
              <div className='text-gray-500'>Loading...</div>
            </div>
          ) : viewCollegeData ? (
            <div className='space-y-6'>
              {/* Logo and Basic Info */}
              <div className='flex items-start gap-4 border-b pb-4 mt-4'>
                {viewCollegeData.college_logo && (
                  <img
                    src={viewCollegeData.college_logo}
                    alt={viewCollegeData.name}
                    className='w-20 h-20 object-contain rounded-lg border'
                  />
                )}
                <div className='flex-1'>
                  <h2 className='text-2xl font-bold text-gray-800'>
                    {viewCollegeData.name}
                  </h2>
                  {viewCollegeData.institute_type && (
                    <span className='inline-block mt-2 px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800'>
                      {viewCollegeData.institute_type}
                    </span>
                  )}
                  {viewCollegeData.website_url && (
                    <div className='mt-2'>
                      <a
                        href={
                          viewCollegeData.website_url.startsWith('http')
                            ? viewCollegeData.website_url
                            : `https://${viewCollegeData.website_url}`
                        }
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-blue-600 hover:underline inline-flex items-center gap-1'
                      >
                        <Globe className='w-4 h-4' />{' '}
                        {viewCollegeData.website_url}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Address */}
              {viewCollegeData.collegeAddress && (
                <div>
                  <h3 className='text-lg font-semibold mb-2'>Address</h3>
                  <div className='text-gray-700 space-y-1'>
                    {viewCollegeData.collegeAddress.street && (
                      <p>{viewCollegeData.collegeAddress.street}</p>
                    )}
                    <p>
                      {[
                        viewCollegeData.collegeAddress.city,
                        viewCollegeData.collegeAddress.state,
                        viewCollegeData.collegeAddress.country
                      ]
                        .filter(Boolean)
                        .join(', ')}
                    </p>
                    {viewCollegeData.collegeAddress.postal_code && (
                      <p>
                        Postal Code:{' '}
                        {viewCollegeData.collegeAddress.postal_code}
                      </p>
                    )}
                    {viewCollegeData.google_map_url && (
                      <a
                        href={viewCollegeData.google_map_url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-blue-600 hover:underline inline-flex items-center gap-1 mt-2'
                      >
                        <MapPin className='w-4 h-4' /> View on Map
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Contacts */}
              {viewCollegeData.collegeContacts &&
                viewCollegeData.collegeContacts.length > 0 && (
                  <div>
                    <h3 className='text-lg font-semibold mb-2'>
                      Contact Numbers
                    </h3>
                    <div className='space-y-1'>
                      {viewCollegeData.collegeContacts.map((contact, index) => (
                        <p key={index} className='text-gray-700'>
                          {contact.contact_number}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

              {/* University */}
              {viewCollegeData.university && (
                <div>
                  <h3 className='text-lg font-semibold mb-2'>University</h3>
                  <p className='text-gray-700'>
                    {viewCollegeData.university.fullname}
                  </p>
                </div>
              )}

              {/* Programs */}
              {viewCollegeData.collegeCourses &&
                viewCollegeData.collegeCourses.length > 0 && (
                  <div>
                    <h3 className='text-lg font-semibold mb-2'>Programs</h3>
                    <div className='flex flex-wrap gap-2'>
                      {viewCollegeData.collegeCourses.map((course, index) => (
                        <span
                          key={index}
                          className='px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm'
                        >
                          {course.program?.title || 'N/A'}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {/* Description */}
              {viewCollegeData.description && (
                <div>
                  <h3 className='text-lg font-semibold mb-2'>Description</h3>
                  <p className='text-gray-700 whitespace-pre-wrap'>
                    {viewCollegeData.description}
                  </p>
                </div>
              )}

            </div>
          ) : null}
          </DialogContent>
        </Dialog>

        {/*table*/}
        <div className='w-full space-y-2'>
          {/* Assuming a search row would go here if showSearch was true */}
          {/* <div className='px-4 pt-4'>
            <Input placeholder='Search colleges...' />
          </div> */}
          <Table
            loading={tableloading}
            data={colleges}
            columns={columns}
            pagination={pagination}
            onPageChange={(newPage) => loadColleges(newPage)}
            onSearch={handleSearch}
            showSearch={false}
          />
        </div>
      {/* Create Credentials Modal */}
      <Dialog
        isOpen={credentialsModalOpen}
        onClose={handleCloseCredentialsModal}
        className='max-w-md'
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create College Credentials</DialogTitle>
            <DialogClose onClick={handleCloseCredentialsModal} />
          </DialogHeader>
          <form onSubmit={handleCreateCredentials} className='space-y-4 pt-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='cred-first-name'>First Name</Label>
                <Input
                  id='cred-first-name'
                  placeholder='First Name'
                  value={credentialsForm.firstName}
                  onChange={(e) =>
                    setCredentialsForm({
                      ...credentialsForm,
                      firstName: e.target.value
                    })
                  }
                  required
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='cred-last-name'>Last Name</Label>
                <Input
                  id='cred-last-name'
                  placeholder='Last Name'
                  value={credentialsForm.lastName}
                  onChange={(e) =>
                    setCredentialsForm({
                      ...credentialsForm,
                      lastName: e.target.value
                    })
                  }
                  required
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='cred-email'>Email Address</Label>
              <div className='flex items-center gap-2'>
                <Input
                  id='cred-email'
                  placeholder='username'
                  value={credentialsForm.emailName}
                  onChange={(e) =>
                    setCredentialsForm({
                      ...credentialsForm,
                      emailName: e.target.value
                    })
                  }
                  required
                />
                <span className='text-muted-foreground'>@merouni.com</span>
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='cred-password'>Password</Label>
              <div className='relative'>
                <Input
                  id='cred-password'
                  type={showPassword ? 'text' : 'password'}
                  placeholder='••••••••'
                  value={credentialsForm.password}
                  onChange={(e) =>
                    setCredentialsForm({
                      ...credentialsForm,
                      password: e.target.value
                    })
                  }
                  required
                />
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className='h-4 w-4' />
                  ) : (
                    <Eye className='h-4 w-4' />
                  )}
                </Button>
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='cred-phone'>Phone Number</Label>
              <Input
                id='cred-phone'
                placeholder='98XXXXXXXX'
                value={credentialsForm.phoneNo}
                onChange={(e) =>
                  setCredentialsForm({
                    ...credentialsForm,
                    phoneNo: e.target.value
                  })
                }
                required
              />
            </div>

            <div className='flex justify-end gap-2 pt-4'>
              <Button
                type='button'
                variant='outline'
                onClick={handleCloseCredentialsModal}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={creatingCredentials}>
                {creatingCredentials ? 'Creating...' : 'Create Credentials'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>


    </div>
    </>
  )
}
