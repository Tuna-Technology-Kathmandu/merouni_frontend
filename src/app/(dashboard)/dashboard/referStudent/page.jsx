'use client'
import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { authFetch } from '@/app/utils/authFetch'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import { Search, Plus, Trash2, X, UserPlus, Building2 } from 'lucide-react'

const page = () => {
  const { setHeading } = usePageHeading()
  const [formData, setFormData] = useState([])
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [collegeSearch, setCollegeSearch] = useState('')
  const [searchResults, setSearchResults] = useState([])

  useEffect(() => {
    setHeading('Refer Student')
    return () => setHeading(null)
  }, [setHeading])
  const searchCollege = async (e) => {
    const query = e.target.value
    setCollegeSearch(query)
    if (query.length < 2) return

    try {
      const response = await fetch(
        `${process.env.baseUrl}/college?q=${query}`
      )
      const data = await response.json()
      setSearchResults(data.items || [])
    } catch (error) {
      console.error('College Search Error:', error)
    }
  }

  const addCollege = (college) => {
    setFormData((prev) => [
      ...prev,
      {
        college_id: college.id,
        students: [],
        college_name: college.name
      }
    ])
    setCollegeSearch('')
    setSearchResults([])
  }

  const handleStudentChange = (collegeIndex, studentIndex, field, value) => {
    setFormData((prev) => {
      const updated = [...prev]
      updated[collegeIndex].students[studentIndex][field] = value
      return updated
    })
  }

  const addStudent = (collegeIndex) => {
    setFormData((prev) => {
      const updated = [...prev]
      updated[collegeIndex] = {
        ...updated[collegeIndex],
        students: [
          ...updated[collegeIndex].students,
          {
            student_name: '',
            student_phone_no: '',
            student_email: '',
            student_description: ''
          }
        ]
      }
      return updated
    })
  }

  const deleteStudent = (collegeIndex, studentIndex) => {
    setFormData((prev) => {
      const updated = [...prev]
      updated[collegeIndex].students.splice(studentIndex, 1)
      return updated
    })
  }

  const deleteCollege = (collegeIndex) => {
    setFormData((prev) => prev.filter((_, index) => index !== collegeIndex))
  }

  // Validate Form Data
  const validateForm = () => {
    if (formData.length === 0) {
      toast.error('Please add at least one college')
      return false
    }

    for (const college of formData) {
      if (!college.students || college.students.length === 0) {
        toast.error('Each college must have at least one student')
        return false
      }
    }

    const newErrors = {}
    formData.forEach((college, collegeIndex) => {
      college.students.forEach((student, studentIndex) => {
        if (!student.student_name.trim()) {
          newErrors[`student_name_${collegeIndex}_${studentIndex}`] =
            'Student name is required'
        }
        if (
          !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(
            student.student_email
          )
        ) {
          newErrors[`student_email_${collegeIndex}_${studentIndex}`] =
            'Invalid email format'
        }
        if (!/^\d{10}$/.test(student.student_phone_no)) {
          newErrors[`student_phone_no_${collegeIndex}_${studentIndex}`] =
            'Phone number must be exactly 10 digits'
        }
        if (!student.student_description.trim()) {
          newErrors[`student_description_${collegeIndex}_${studentIndex}`] =
            'Description is required'
        }
      })
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Submit the Form
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    const cleanedFormData = formData.map(({ college_name, ...rest }) => rest)

    try {
      const response = await authFetch(
        `${process.env.baseUrl}/referral/agent-apply`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(cleanedFormData) // API expects multiple colleges
        }
      )


      const data = await response.json()
      if (response.ok) {
        toast.success(data.message || 'Application Submitted Successfully')
        setFormData([]) // Reset form
      } else {
        toast.error(data?.message || 'Something went wrong. Please try again.')
      }
    } catch (error) {
      toast.error('Connection error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='p-4 w-full'>
      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* College Search Section */}
        <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
          <label className='block text-sm font-semibold text-gray-700 mb-3'>
            Search and Add College
          </label>
          <div className='relative'>
            <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
              <Search className='w-5 h-5 text-gray-400' />
            </div>
            <input
              type='text'
              value={collegeSearch}
              onChange={searchCollege}
              className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all'
              placeholder='Type college name to search...'
            />
            {searchResults.length > 0 && (
              <ul className='absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto'>
                {searchResults.map((college) => {
                  const address = college.address || {}
                  const location = [
                    address.city,
                    address.state,
                    address.country
                  ]
                    .filter(Boolean)
                    .join(', ')
                  return (
                    <li
                      key={college.id}
                      className='px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors border-b last:border-b-0 flex items-center gap-3'
                      onClick={() => addCollege(college)}
                    >
                      {/* College Logo */}
                      <div className='flex-shrink-0'>
                        {college.college_logo ? (
                          <img
                            src={college.college_logo}
                            alt={college.name}
                            className='w-10 h-10 object-contain rounded'
                          />
                        ) : (
                          <div className='w-10 h-10 bg-gray-100 rounded flex items-center justify-center'>
                            <Building2 className='w-5 h-5 text-gray-400' />
                          </div>
                        )}
                      </div>
                      {/* College Name and Location */}
                      <div className='flex-1 min-w-0'>
                        <div className='text-gray-700 font-medium truncate'>
                          {college.name}
                        </div>
                        {location && (
                          <div className='text-sm text-gray-500 truncate'>
                            {location}
                          </div>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>

        {/* Colleges & Students */}
        {formData.map((college, collegeIndex) => (
          <div
            key={collegeIndex}
            className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'
          >
            {/* College Header */}
            <div className='flex justify-between items-center mb-6 pb-4 border-b border-gray-200'>
              <div className='flex items-center gap-3'>
                <Building2 className='w-5 h-5 text-blue-600' />
                <h3 className='text-lg font-semibold text-gray-800'>
                  {college.college_name}
                </h3>
              </div>
              <button
                type='button'
                onClick={() => deleteCollege(collegeIndex)}
                className='px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium'
              >
                <Trash2 className='w-4 h-4' />
                <span>Remove College</span>
              </button>
            </div>

            {/* Students List */}
            <div className='space-y-4'>
              {college.students.map((student, studentIndex) => (
                <div
                  key={studentIndex}
                  className='p-5 bg-gray-50 rounded-lg border border-gray-200'
                >
                  <div className='flex justify-between items-center mb-4'>
                    <h4 className='text-sm font-semibold text-gray-700 flex items-center gap-2'>
                      <UserPlus className='w-4 h-4' />
                      Student {studentIndex + 1}
                    </h4>
                    <button
                      type='button'
                      onClick={() => deleteStudent(collegeIndex, studentIndex)}
                      className='p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors'
                      title='Remove Student'
                    >
                      <X className='w-4 h-4' />
                    </button>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Student Name <span className='text-red-500'>*</span>
                      </label>
                      <input
                        type='text'
                        value={student.student_name}
                        onChange={(e) =>
                          handleStudentChange(
                            collegeIndex,
                            studentIndex,
                            'student_name',
                            e.target.value
                          )
                        }
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${errors[`student_name_${collegeIndex}_${studentIndex}`]
                            ? 'border-red-300'
                            : 'border-gray-300'
                          }`}
                        placeholder='Enter student name'
                      />
                      {errors[
                        `student_name_${collegeIndex}_${studentIndex}`
                      ] && (
                          <p className='mt-1 text-sm text-red-600'>
                            {
                              errors[
                              `student_name_${collegeIndex}_${studentIndex}`
                              ]
                            }
                          </p>
                        )}
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Email Address <span className='text-red-500'>*</span>
                      </label>
                      <input
                        type='email'
                        value={student.student_email}
                        onChange={(e) =>
                          handleStudentChange(
                            collegeIndex,
                            studentIndex,
                            'student_email',
                            e.target.value
                          )
                        }
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${errors[
                            `student_email_${collegeIndex}_${studentIndex}`
                          ]
                            ? 'border-red-300'
                            : 'border-gray-300'
                          }`}
                        placeholder='student@example.com'
                      />
                      {errors[
                        `student_email_${collegeIndex}_${studentIndex}`
                      ] && (
                          <p className='mt-1 text-sm text-red-600'>
                            {
                              errors[
                              `student_email_${collegeIndex}_${studentIndex}`
                              ]
                            }
                          </p>
                        )}
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Phone Number <span className='text-red-500'>*</span>
                      </label>
                      <input
                        type='text'
                        value={student.student_phone_no}
                        onChange={(e) =>
                          handleStudentChange(
                            collegeIndex,
                            studentIndex,
                            'student_phone_no',
                            e.target.value
                          )
                        }
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${errors[
                            `student_phone_no_${collegeIndex}_${studentIndex}`
                          ]
                            ? 'border-red-300'
                            : 'border-gray-300'
                          }`}
                        placeholder='10-digit phone number'
                        maxLength={10}
                      />
                      {errors[
                        `student_phone_no_${collegeIndex}_${studentIndex}`
                      ] && (
                          <p className='mt-1 text-sm text-red-600'>
                            {
                              errors[
                              `student_phone_no_${collegeIndex}_${studentIndex}`
                              ]
                            }
                          </p>
                        )}
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Description <span className='text-red-500'>*</span>
                      </label>
                      <textarea
                        value={student.student_description}
                        onChange={(e) =>
                          handleStudentChange(
                            collegeIndex,
                            studentIndex,
                            'student_description',
                            e.target.value
                          )
                        }
                        rows={3}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none ${errors[
                            `student_description_${collegeIndex}_${studentIndex}`
                          ]
                            ? 'border-red-300'
                            : 'border-gray-300'
                          }`}
                        placeholder='Enter student description or notes...'
                      />
                      {errors[
                        `student_description_${collegeIndex}_${studentIndex}`
                      ] && (
                          <p className='mt-1 text-sm text-red-600'>
                            {
                              errors[
                              `student_description_${collegeIndex}_${studentIndex}`
                              ]
                            }
                          </p>
                        )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type='button'
              className='mt-4 w-full md:w-auto px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium text-sm border border-blue-200'
              onClick={() => addStudent(collegeIndex)}
            >
              <Plus className='w-4 h-4' />
              <span>Add Student</span>
            </button>
          </div>
        ))}

        {/* Empty State */}
        {formData.length === 0 && (
          <div className='bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center'>
            <Building2 className='w-12 h-12 text-gray-400 mx-auto mb-4' />
            <p className='text-gray-600 font-medium mb-2'>
              No colleges added yet
            </p>
            <p className='text-sm text-gray-500'>
              Search and add a college above to get started
            </p>
          </div>
        )}

        {/* Submit Button */}
        {formData.length > 0 && (
          <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
            <button
              type='submit'
              disabled={loading || formData.length === 0}
              className='w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2'
            >
              {loading ? (
                <>
                  <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white'></div>
                  <span>Processing...</span>
                </>
              ) : (
                <span>Submit Application</span>
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  )
}

export default page
