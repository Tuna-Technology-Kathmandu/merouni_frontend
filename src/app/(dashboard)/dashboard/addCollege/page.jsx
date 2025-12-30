'use client'
import { useState, useEffect, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { useForm, useFieldArray } from 'react-hook-form'
import {
  createCollege,
  fetchUniversities,
  fetchAllCourse,
  fetchAllUniversity,
  getUniversityBySlug
} from './actions'
import axios from 'axios'
import { useSelector } from 'react-redux'
import FileUpload from './FileUpload'
import Table from '../../../../components/Table'
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
import AdmissionItem from './AdmissionItem'
import ConfirmationDialog from './ConfirmationDialog'
import { Modal } from '../../../../components/CreateUserModal'
import { usePageHeading } from '@/contexts/PageHeadingContext'

const CKUni = dynamic(() => import('../component/CKUni'), {
  ssr: false
})
import { useDebounce } from 'use-debounce'
import GallerySection from './GallerySection'
import VideoSection from './VideoSection'
import useAdminPermission from '@/hooks/useAdminPermission'
import { createColumns } from './columns'

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
        `${process.env.baseUrl}${process.env.version}/media/upload`,
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
          <button
            type='button'
            onClick={handleClear}
            className='bg-red-500 text-white p-2 rounded-md '
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  )
}
export default function CollegeForm() {
  const { setHeading } = usePageHeading()
  //for university search
  const [uniSearch, setUniSearch] = useState('')
  const [debouncedUni] = useDebounce(uniSearch, 300)
  const [universities, setUniversities] = useState([])
  const [loadUni, setLoadUni] = useState(false)
  const [showUniDrop, setShowUniDrop] = useState(false)
  const [hasSelectedUni, setHasSelectedUni] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchTimeout, setSearchTimeout] = useState(null)

  // for programs that is related to selected University
  const [uniSlug, setUniSlug] = useState('')
  const [universityPrograms, setUniversityPrograms] = useState([])

  //show programs only fro selected University;
  const [loadingPrograms, setLoadingPrograms] = useState(false)

  const [allUniversity, setAllUniversity] = useState([])

  //for allcourse
  const [courses, setCourses] = useState([])
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
      description: '',
      content: '',
      website_url: '',
      google_map_url: '',
      college_logo: '',
      featured_img: '',
      is_featured: false,
      pinned: false,
      images: [],
      college_broucher: '',
      facilities: [
        {
          title: '',
          description: '',
          icon: ''
        }
      ],
      address: {
        country: '',
        state: '',
        city: '',
        street: '',
        postal_code: ''
      },
      contacts: ['', ''],
      members: [
        {
          name: '',
          contact_number: '',
          role: '',
          description: ''
        }
      ],
      admissions: [
        {
          course_id: '',
          eligibility_criteria: '',
          admission_process: '',
          fee_details: '',
          description: ''
        }
      ]
    }
  })

  const {
    fields: memberFields,
    append: appendMember,
    remove: removeMember
  } = useFieldArray({ control, name: 'members' })

  const {
    fields: admissionFields,
    append: appendAdmission,
    remove: removeAdmission
  } = useFieldArray({ control, name: 'admissions' })

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

      //   this makes empty [] when all clear is done
      data.admissions = data.admissions.filter((admission) => {
        return Object.values(admission).some((val) => {
          if (typeof val === 'string') return val.trim() !== ''
          return val !== null && val !== undefined
        })
      })
      // Convert boolean values to numbers
      data.is_featured = +data.is_featured
      data.pinned = +data.pinned
      // Convert IDs to numbers
      data.university_id = parseInt(data.university_id)

      // Ensure courses is always an array, even if empty
      data.courses = (data.courses || []).map((course) => parseInt(course))

      data.college_logo = uploadedFiles.logo
      data.featured_img = uploadedFiles.featured

      //before sending the image , we combine all selected images and videos
      data.images = [...uploadedFiles.images, ...uploadedFiles.videos]

      data.college_broucher = data.college_broucher || ''

      //   Filter out empty facilities
      data.facilities = data.facilities.filter(
        (facility) =>
          facility.title.trim() !== '' ||
          facility.description.trim() !== '' ||
          facility.icon.trim() !== ''
      )

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
      setUniSearch('')
      setIsOpen(false)
      loadColleges()
    } catch (error) {
      // Extract error message from different error formats

      console.log('Error response', error['message'])
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
  //for uni in add college
  useEffect(() => {
    if (hasSelectedUni) return

    const getUniversities = async () => {
      setLoadUni(true)
      try {
        const universityList = await fetchUniversities(debouncedUni)
        setUniversities(universityList)
        setShowUniDrop(true)
        setLoadUni(false)
      } catch (error) {
        console.error('Error fetching universities:', error)
      }
    }
    if (debouncedUni !== '') {
      getUniversities()
    } else {
      setShowUniDrop(false)
    }
  }, [debouncedUni])

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

  //for all fetching of university
  useEffect(() => {
    const getUniversities = async () => {
      try {
        const uniList = await fetchAllUniversity()
        setAllUniversity(uniList)
      } catch (error) {
        console.error('Error all university:', error)
      }
    }

    getUniversities()
  }, [])

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
          `${process.env.baseUrl}${process.env.version}/college?limit=10&page=1`
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
        `${process.env.baseUrl}${process.env.version}/college/${deleteId}`,
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
        `${process.env.baseUrl}${process.env.version}/college?limit=10&page=${pagination.currentPage}`
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
        `${process.env.baseUrl}${process.env.version}/users/college-credentials`,
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
          `${process.env.baseUrl}${process.env.version}/college?limit=10&page=${pagination.currentPage}`
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
        `${process.env.baseUrl}${process.env.version}/college/${slug}`,
        { headers: { 'Content-Type': 'application/json' } }
      )

      let collegeData = await response.json()
      collegeData = collegeData.item

      console.log('CData', collegeData)

      // Basic Information
      setValue('id', collegeData.id)
      setValue('name', collegeData.name)
      setValue('institute_type', collegeData.institute_type)
      setValue(
        'institute_level',
        JSON.parse(collegeData.institute_level || '[]')
      )
      setValue('description', collegeData.description)
      setValue('content', collegeData.content)
      setValue('website_url', collegeData.website_url)
      setValue('google_map_url', collegeData.google_map_url)
      setValue('is_featured', collegeData.isFeatured === 1)
      setValue('pinned', collegeData.pinned === 1)

      // Set university_id from university data
      if (collegeData.university) {
        setHasSelectedUni(true)
        setUniSearch(collegeData.university.fullname)
        setUniSlug(collegeData.university.slugs)

        const universityId = allUniversity.find(
          (u) => u.fullname === collegeData.university.fullname
        )?.id

        if (universityId) {
          setValue('university_id', Number(universityId), {
            shouldValidate: true,
            shouldDirty: true
          })
        }
      }

      // Set programs
      const programIds =
        collegeData.collegeCourses
          ?.map((course) => {
            const foundCourse = courses.find(
              (c) => c.title === course.program.title
            )
            return foundCourse?.id
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

      // Admissions
      const admissionData = collegeData.collegeAdmissions?.length
        ? collegeData.collegeAdmissions.map((admission) => {
            const courseId = courses.find(
              (c) => c.title === admission.program.title
            )?.id
            return {
              course_id: courseId || '',
              eligibility_criteria: admission.eligibility_criteria || '',
              admission_process: admission.admission_process || '',
              fee_details: admission.fee_details || '',
              description: admission.description || ''
            }
          })
        : [
            {
              course_id: '',
              eligibility_criteria: '',
              admission_process: '',
              fee_details: '',
              description: ''
            }
          ]
      setValue('admissions', admissionData)
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
        `${process.env.baseUrl}${process.env.version}/college?limit=10&page=${page}`
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
    console.log('q', query)
    if (!query) {
      // getColleges();
      loadColleges()
      return
    }

    try {
      const response = await authFetch(
        `${process.env.baseUrl}${process.env.version}/college?q=${query}`
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

  useEffect(() => {
    console.log('Form data:', formData)
  }, [formData])

  const fetchUniversityDetails = async (slugs) => {
    if (!slugs) {
      setUniversityPrograms([])
      return
    }
    try {
      setLoadingPrograms(true)
      console.log('Fetching university programs for slug:', slugs)
      const universityData = await getUniversityBySlug(slugs)
      console.log('University data received:', universityData)
      // Extract program IDs from university_programs array
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
        `${process.env.baseUrl}${process.env.version}/college/${slug}`,
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
              placeholder='Search colleges...'
            />
          </div>
          {/* Button */}
          <div className='flex gap-2'>
            <button
              className='bg-blue-500 text-white text-sm px-6 py-2 rounded hover:bg-blue-600 transition-colors'
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
            </button>
          </div>
        </div>
        <ToastContainer />

        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title={editing ? 'Edit College' : 'Add College'}
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
                    Basic Information
                  </h2>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <label className='block mb-2'>College Name *</label>
                      <input
                        {...register('name', { required: true })}
                        className='w-full p-2 border rounded'
                      />
                      {errors.name && (
                        <span className='text-red-500'>
                          This field is required
                        </span>
                      )}
                    </div>

                    <div>
                      <label className='block mb-2'>Institute Type *</label>
                      <select
                        {...register('institute_type', { required: true })}
                        className='w-full p-2 border rounded'
                      >
                        <option value='Private'>Private</option>
                        <option value='Public'>Public</option>
                      </select>
                    </div>

                    <div>
                      <label className='block mb-2'>Institute Level</label>
                      <div className='space-y-2'>
                        {['School', 'College'].map((level) => (
                          <label key={level} className='flex items-center'>
                            <input
                              type='checkbox'
                              {...register('institute_level')}
                              value={level}
                              className='mr-2'
                            />
                            {level}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className='relative'>
                      <label className='block mb-2'>University *</label>

                      <input
                        type='text'
                        className='w-full p-2 border rounded'
                        value={uniSearch}
                        onChange={(e) => {
                          setUniSearch(e.target.value)
                          setHasSelectedUni(false)
                        }}
                        placeholder='Search University'
                      />

                      {/* Hidden input for react-hook-form binding */}
                      <input
                        type='hidden'
                        {...register('university_id', { required: true })}
                      />
                      {loadUni ? (
                        <div className='absolute z-10 w-full bg-white border rounded max-h-60 overflow-y-auto shadow-md p-2'>
                          Loading...
                        </div>
                      ) : showUniDrop ? (
                        universities.length > 0 ? (
                          <ul className='absolute z-10 w-full bg-white border rounded max-h-60 overflow-y-auto shadow-md'>
                            {universities.map((uni) => (
                              <li
                                key={uni.id}
                                className='p-2 cursor-pointer hover:bg-gray-100'
                                onClick={() => {
                                  setValue('university_id', Number(uni.id))
                                  setUniSearch(uni.fullname)
                                  setShowUniDrop(false)
                                  setHasSelectedUni(true)
                                  setUniSlug(uni.slugs)
                                }}
                              >
                                {uni.fullname}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className='absolute z-10 w-full bg-white border rounded shadow-md p-2 text-gray-500'>
                            No universities found.
                          </div>
                        )
                      ) : null}
                    </div>

                    <div className='md:col-span-2'>
                      <label className='block mb-2'>Description</label>
                      <textarea
                        {...register('description')}
                        className='w-full p-2 border rounded h-24'
                      />
                    </div>

                    <div className='md:col-span-2'>
                      <label className='block mb-2'>Content</label>

                      <CKUni
                        id='editor-content'
                        initialData={getValues('content')}
                        onChange={(data) => setValue('content', data)}
                      />
                    </div>
                  </div>
                </div>
                {editing ? <input type='hidden' {...register('id')} /> : <></>}
                {/* Courses Section */}

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
                              ).includes(course.id)
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
                                          [...currentCourses, course.id],
                                          {
                                            shouldValidate: true,
                                            shouldDirty: true
                                          }
                                        )
                                      } else {
                                        setValue(
                                          'courses',
                                          currentCourses.filter(
                                            (id) => id !== course.id
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

                {/*author section - Hidden */}
                {/* <div className='bg-white p-6 rounded-lg shadow-md'>
                  <h2 className='text-xl font-semibold mb-4'>
                    Author Information
                  </h2>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <label className='block mb-2'>Author ID *</label>
                      <input
                        {...register('author_id')}
                        className='w-full p-2 border rounded '
                        disabled
                      />
                      {errors.author_id && (
                        <span className='text-red-500'>
                          This field is required
                        </span>
                      )}
                    </div>
                  </div>
                </div> */}

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
                    <button
                      type='button'
                      onClick={() =>
                        appendFacility({
                          title: '',
                          description: '',
                          icon: ''
                        })
                      }
                      className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600'
                    >
                      Add Facility
                    </button>
                  </div>

                  {facilityFields.map((field, index) => (
                    <div
                      key={field.id}
                      className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 border rounded'
                    >
                      <div>
                        <label className='block mb-2'>Title *</label>
                        <input
                          {...register(`facilities.${index}.title`, {
                            required: true
                          })}
                          className='w-full p-2 border rounded'
                        />
                        {errors.facilities?.[index]?.title && (
                          <span className='text-red-500'>
                            This field is required
                          </span>
                        )}
                      </div>
                      <div>
                        <label className='block mb-2'>Description</label>
                        <textarea
                          {...register(`facilities.${index}.description`)}
                          className='w-full p-2 border rounded'
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
                        <button
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
                          className='bg-red-500 text-white px-4 h-[20%] w-full rounded hover:bg-red-600'
                        >
                          {facilityFields.length > 1 ? 'Remove' : 'Clear'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Members Section */}
                <div className='bg-white p-6 rounded-lg shadow-md'>
                  <div className='flex justify-between items-center mb-4'>
                    <h2 className='text-xl font-semibold'>Members</h2>
                    <button
                      type='button'
                      onClick={() =>
                        appendMember({
                          name: '',
                          contact_number: '',
                          role: '',
                          description: ''
                        })
                      }
                      className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600'
                    >
                      Add Member
                    </button>
                  </div>

                  {memberFields.map((field, index) => (
                    <div
                      key={field.id}
                      className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 border rounded'
                    >
                      <div>
                        <label className='block mb-2'>Name</label>
                        <input
                          {...register(`members.${index}.name`)}
                          className='w-full p-2 border rounded'
                        />
                      </div>
                      <div>
                        <label className='block mb-2'>Role</label>
                        <select
                          {...register(`members.${index}.role`)}
                          className='w-full p-2 border rounded'
                        >
                          <option value=''>Select Roles</option>
                          <option value='Principal'>Principal</option>
                          <option value='Professor'>Professor</option>
                          <option value='Lecturer'>Lecturer</option>
                          <option value='Admin'>Admin</option>
                          <option value='Staff'>Staff</option>
                        </select>
                      </div>
                      <div>
                        <label className='block mb-2'>Contact Number</label>
                        <input
                          {...register(`members.${index}.contact_number`)}
                          className='w-full p-2 border rounded'
                        />
                      </div>
                      <div>
                        <label className='block mb-2'>Description</label>
                        <textarea
                          {...register(`members.${index}.description`)}
                          className='w-full p-2 border rounded'
                        />
                      </div>
                      <button
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
                        className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600'
                      >
                        {memberFields.length > 1 ? 'Remove' : 'Clear'}
                      </button>
                    </div>
                  ))}
                </div>

                {/* Admissions Section */}
                <div className='bg-white p-6 rounded-lg shadow-md'>
                  <div className='flex justify-between items-center mb-4'>
                    <h2 className='text-xl font-semibold'>Admissions</h2>
                    <button
                      type='button'
                      onClick={() =>
                        appendAdmission({
                          course_id: '',
                          eligibility_criteria: '',
                          admission_process: '',
                          fee_details: '',
                          description: ''
                        })
                      }
                      className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600'
                    >
                      Add Admission
                    </button>
                  </div>

                  {admissionFields.map((field, index) => {
                    const courseId = getValues(`admissions.${index}.course_id`)
                    const courseTitle =
                      courses.find((c) => c.id === courseId)?.title || ''
                    return (
                      <AdmissionItem
                        key={field.id}
                        index={index}
                        remove={removeAdmission}
                        register={register}
                        setValue={setValue}
                        getValues={getValues}
                        admissionFields={admissionFields}
                        initialCourseTitle={courseTitle}
                      />
                    )
                  })}
                </div>

                {/* Address Section */}
                <div className='bg-white p-6 rounded-lg shadow-md'>
                  <h2 className='text-xl font-semibold mb-4'>Address</h2>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {['country', 'state', 'city', 'street', 'postal_code'].map(
                      (field) => (
                        <div key={field}>
                          <label className='block mb-2 capitalize'>
                            {field !== 'state'
                              ? `${field.replace('_', ' ')} *`
                              : 'District'}
                          </label>
                          <input
                            {...register(`address.${field}`)}
                            className='w-full p-2 border rounded'
                          />
                          {errors.address?.[field] && (
                            <span className='text-red-500'>
                              This field is required
                            </span>
                          )}
                        </div>
                      )
                    )}
                    <div>
                      <label className='block mb-2'>Google Map URL</label>
                      <input
                        {...register('google_map_url')}
                        className='w-full p-2 border rounded'
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
                    <div>
                      <label className='block mb-2'>Website URL</label>
                      <input
                        {...register('website_url')}
                        className='w-full p-2 border rounded'
                      />
                    </div>
                    {[0, 1].map((index) => (
                      <div key={index}>
                        <label className='block mb-2'>
                          Contact {index + 1}
                        </label>
                        <input
                          {...register(`contacts.${index}`)}
                          className='w-full p-2 border rounded'
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Featured and Pinned */}
                <div className='bg-white p-6 rounded-lg shadow-md'>
                  <h2 className='text-xl font-semibold mb-4'>
                    Additional Settings
                  </h2>
                  <div className='space-y-4'>
                    <label className='flex items-center'>
                      <input
                        type='checkbox'
                        {...register('is_featured')}
                        className='mr-2'
                      />
                      Featured College
                    </label>
                    <label className='flex items-center'>
                      <input
                        type='checkbox'
                        {...register('pinned')}
                        className='mr-2'
                      />
                      Pinned
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Button - Sticky Footer */}
              <div className='sticky bottom-0 bg-white border-t pt-4 pb-2 mt-4 flex justify-end'>
                <button
                  type='submit'
                  disabled={submitting}
                  className='bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors disabled:bg-blue-300'
                >
                  {submitting
                    ? editing
                      ? 'Updating...'
                      : 'Creating...'
                    : editing
                      ? 'Update College'
                      : 'Create College'}
                </button>
              </div>
            </form>
          </div>
        </Modal>
        <ConfirmationDialog
          open={isDialogOpen}
          onClose={handleDialogClose}
          onConfirm={handleDeleteConfirm}
          title='Confirm Deletion'
          message='Are you sure you want to delete this College? This action cannot be undone.'
        />

        {/* View College Details Modal */}
        <Modal
          isOpen={viewModalOpen}
          onClose={handleCloseViewModal}
          title='College Details'
          className='max-w-4xl max-h-[90vh] overflow-y-auto'
        >
          {loadingView ? (
            <div className='flex items-center justify-center py-8'>
              <div className='text-gray-500'>Loading...</div>
            </div>
          ) : viewCollegeData ? (
            <div className='space-y-6'>
              {/* Logo and Basic Info */}
              <div className='flex items-start gap-4 border-b pb-4'>
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

              {/* Status Flags */}
              <div className='flex gap-4 pt-4 border-t'>
                <div>
                  <span className='text-sm font-medium text-gray-700'>
                    Featured:{' '}
                  </span>
                  <span className='text-sm text-gray-600'>
                    {viewCollegeData.isFeatured === 1 ? 'Yes' : 'No'}
                  </span>
                </div>
                <div>
                  <span className='text-sm font-medium text-gray-700'>
                    Pinned:{' '}
                  </span>
                  <span className='text-sm text-gray-600'>
                    {viewCollegeData.pinned === 1 ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>
          ) : null}
        </Modal>

        {/*table*/}
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
      <Modal
        isOpen={credentialsModalOpen}
        onClose={handleCloseCredentialsModal}
        title='Create College Credentials'
        className='max-w-md'
      >
        <form onSubmit={handleCreateCredentials} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              First Name
            </label>
            <input
              type='text'
              className='w-full p-2 border rounded'
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

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Last Name
            </label>
            <input
              type='text'
              className='w-full p-2 border rounded'
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

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Email
            </label>
            <div className='flex gap-2'>
              <input
                type='text'
                className='w-1/2 p-2 border rounded'
                value={credentialsForm.emailName}
                onChange={(e) =>
                  setCredentialsForm({
                    ...credentialsForm,
                    emailName: e.target.value
                  })
                }
                placeholder='username'
                required
              />
              <div className='w-1/2 p-2 border rounded bg-gray-50 flex items-center text-gray-600'>
                @merouni.com
              </div>
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Password
            </label>
            <div className='relative'>
              <input
                type={showPassword ? 'text' : 'password'}
                className='w-full p-2 border rounded pr-10'
                value={credentialsForm.password}
                onChange={(e) =>
                  setCredentialsForm({
                    ...credentialsForm,
                    password: e.target.value
                  })
                }
                required
                minLength={6}
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800'
              >
                {showPassword ? (
                  <EyeOff className='w-5 h-5' />
                ) : (
                  <Eye className='w-5 h-5' />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Phone Number
            </label>
            <input
              type='tel'
              className='w-full p-2 border rounded'
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

          <div className='flex justify-end gap-2 pt-2'>
            <button
              type='button'
              onClick={handleCloseCredentialsModal}
              className='px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={creatingCredentials}
              className='px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:opacity-50'
            >
              {creatingCredentials ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  )
}
