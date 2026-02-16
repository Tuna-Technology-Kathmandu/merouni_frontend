'use client'
import { authFetch } from '@/app/utils/authFetch'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import { Input } from '@/ui/shadcn/input'
import { Label } from '@/ui/shadcn/label'
import { Textarea } from '@/ui/shadcn/textarea'
import { Plus, Search, Trash2, X, Check, Building2, UserPlus, ChevronDown, Command } from 'lucide-react'
import { useEffect, useState, useMemo, useRef } from 'react'
import { toast } from 'react-toastify'
import { cn } from '@/app/lib/utils'
import ConfirmationDialog from '@/ui/molecules/ConfirmationDialog'

const ReferStudentPage = () => {
  const { setHeading } = usePageHeading()
  const [formData, setFormData] = useState([])
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [fetchingColleges, setFetchingColleges] = useState(true)
  const [allColleges, setAllColleges] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const dropdownRef = useRef(null)

  useEffect(() => {
    setHeading('Refer Student')
    fetchColleges()
    return () => setHeading(null)
  }, [setHeading])

  const fetchColleges = async () => {
    try {
      setFetchingColleges(true)
      const response = await authFetch(`${process.env.baseUrl}/college?limit=200`)
      const data = await response.json()
      setAllColleges(data.items || [])
    } catch (error) {
      console.error('Error fetching colleges:', error)
      toast.error('Could not load colleges')
    } finally {
      setFetchingColleges(false)
    }
  }

  const filteredColleges = useMemo(() => {
    const query = searchTerm.toLowerCase()
    return allColleges.filter(c => {
      const name = (c.name || '').toLowerCase()
      return name.includes(query)
    })
  }, [allColleges, searchTerm])

  const toggleCollege = (college) => {
    const isSelected = formData.some(item => item.college_id === college.id)
    if (isSelected) {
      setFormData(prev => prev.filter(item => item.college_id !== college.id))
    } else {
      setFormData(prev => [
        ...prev,
        {
          college_id: college.id,
          college_name: college.name,
          students: [
            {
              student_name: '',
              student_phone_no: '',
              student_email: '',
              student_description: ''
            }
          ]
        }
      ])
      setSearchTerm('')
      setIsDropdownOpen(false)
    }
  }

  const handleStudentChange = (cIdx, sIdx, field, value) => {
    setFormData(prev => {
      const updated = [...prev]
      const student = { ...updated[cIdx].students[sIdx], [field]: value }
      updated[cIdx].students[sIdx] = student
      return updated
    })
  }

  const addStudent = (cIdx) => {
    setFormData(prev => {
      const updated = [...prev]
      updated[cIdx].students = [
        ...updated[cIdx].students,
        {
          student_name: '',
          student_phone_no: '',
          student_email: '',
          student_description: ''
        }
      ]
      return updated
    })
  }

  const removeStudent = (cIdx, sIdx) => {
    setConfirmDelete({ type: 'student', cIdx, sIdx, name: `Student ${sIdx + 1}` })
  }

  const removeCollege = (cIdx) => {
    setConfirmDelete({ type: 'college', cIdx, name: formData[cIdx].college_name })
  }

  const handleConfirmDelete = () => {
    if (!confirmDelete) return

    setFormData(prev => {
      const updated = [...prev]
      if (confirmDelete.type === 'student') {
        const { cIdx, sIdx } = confirmDelete
        const students = [...updated[cIdx].students]
        students.splice(sIdx, 1)
        updated[cIdx].students = students
      } else {
        updated.splice(confirmDelete.cIdx, 1)
      }
      return updated
    })
    setConfirmDelete(null)
  }

  const validate = () => {
    const newErrors = {}
    let isValid = true

    if (formData.length === 0) {
      toast.error('Please select at least one college')
      return false
    }

    formData.forEach((c, cIdx) => {
      if (c.students.length === 0) {
        toast.error(`Each college must have at least one student (${c.college_name})`)
        isValid = false
      } else {
        c.students.forEach((s, sIdx) => {
          if (!s.student_name.trim()) {
            newErrors[`student_name_${cIdx}_${sIdx}`] = 'Required'
            isValid = false
          }
          if (!/^\d{10}$/.test(s.student_phone_no)) {
            newErrors[`student_phone_no_${cIdx}_${sIdx}`] = 'Invalid phone'
            isValid = false
          }
          if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(s.student_email)) {
            newErrors[`student_email_${cIdx}_${sIdx}`] = 'Invalid email'
            isValid = false
          }
          if (!s.student_description.trim()) {
            newErrors[`student_description_${cIdx}_${sIdx}`] = 'Required'
            isValid = false
          }
        })
      }
    })

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    const payload = formData.map(({ college_name, ...rest }) => rest)

    try {
      const res = await authFetch(`${process.env.baseUrl}/referral/agent-apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      if (res.ok) {
        toast.success(data.message || 'Applications submitted successfully')
        setFormData([])
        setErrors({})
      } else {
        toast.error(data.message || 'Something went wrong')
      }
    } catch (err) {
      toast.error('Connection error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className='p-6 w-full max-w-4xl mx-auto min-h-screen'>
      {/* Header / Search */}
      <div className='mb-12 text-center animate-in fade-in slide-in-from-top-2 duration-700'>
        <h1 className='text-xl font-semibold text-gray-900 mb-1'>Student Referral</h1>
        <p className='text-sm text-gray-500 mb-8'>Select and refer students in a clean batch flow.</p>

        <div className='relative max-w-lg mx-auto' ref={dropdownRef}>
          <div className='relative'>
            <Search className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
            <Input
              type='text'
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setIsDropdownOpen(true)
              }}
              onFocus={() => setIsDropdownOpen(true)}
              className='w-full pl-11 pr-10 py-6 bg-white border-gray-200 rounded-xl shadow-sm focus:ring-1 focus:ring-blue-100 transition-all text-sm'
              placeholder='Search college...'
            />
            <div className='absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2'>
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className='text-gray-300 hover:text-gray-500'>
                  <X className='w-4 h-4' />
                </button>
              )}
              <ChevronDown className={cn('w-4 h-4 text-gray-300 transition-transform', isDropdownOpen && 'rotate-180')} />
            </div>
          </div>

          {isDropdownOpen && (
            <div className='absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-60 overflow-y-auto custom-scrollbar'>
              {fetchingColleges ? (
                <div className='p-6 text-center text-gray-400 text-xs italic'>Loading...</div>
              ) : filteredColleges.length > 0 ? (
                filteredColleges.map(c => {
                  const isSelected = formData.some(item => item.college_id === c.id)
                  return (
                    <div
                      key={c.id}
                      onClick={() => toggleCollege(c)}
                      className={cn(
                        'flex items-center gap-3 p-3 cursor-pointer transition-colors border-b border-gray-50 last:border-0 hover:bg-gray-50',
                        isSelected && 'bg-blue-50/50'
                      )}
                    >
                      <div className='w-8 h-8 rounded bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100'>
                        {c.college_logo ? (
                          <img src={c.college_logo} className='w-5 h-5 object-contain' />
                        ) : (
                          <Building2 className='w-3 h-3 text-gray-400' />
                        )}
                      </div>
                      <div className='flex-1 text-left min-w-0'>
                        <div className='text-sm font-medium text-gray-700 truncate'>
                          {c.name}
                        </div>
                      </div>
                      {isSelected && <Check className='w-4 h-4 text-blue-600' />}
                    </div>
                  )
                })
              ) : (
                <div className='p-6 text-center text-gray-400 text-xs italic'>No results found</div>
              )}
            </div>
          )}
        </div>

        {/* Selection Badges */}
        {formData.length > 0 && (
          <div className='flex flex-wrap justify-center gap-2 mt-6 animate-in fade-in slide-in-from-bottom-2 duration-300'>
            {formData.map((c, idx) => (
              <div key={c.college_id} className='inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700'>
                <span>{c.college_name}</span>
                <button onClick={() => removeCollege(idx)} className='text-gray-400 hover:text-red-500'>
                  <X className='w-3 h-3' />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form Area */}
      <form onSubmit={handleSubmit} className='space-y-6 pb-24'>
        {formData.length > 0 ? (
          formData.map((c, cIdx) => (
            <div key={c.college_id} className='bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in zoom-in-95 duration-500'>
              <div className='px-6 py-4 bg-gray-50/50 border-b border-gray-100 flex justify-between items-center'>
                <div className='flex items-center gap-3'>
                  <div className='w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center'>
                    <Building2 className='w-4 h-4 text-blue-600' />
                  </div>
                  <h3 className='text-sm font-bold text-gray-800'>{c.college_name}</h3>
                </div>
                <button type='button' onClick={() => removeCollege(cIdx)} className='p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors'>
                  <Trash2 className='w-4 h-4' />
                </button>
              </div>

              <div className='p-6 space-y-4'>
                {c.students.map((s, sIdx) => (
                  <div key={sIdx} className='p-6 bg-white border border-gray-100 rounded-xl relative group'>
                    <div className='flex justify-between items-center mb-6'>
                      <h4 className='text-[10px] font-black tracking-widest text-gray-400 uppercase'>Student {sIdx + 1}</h4>
                      {c.students.length > 1 && (
                        <button type='button' onClick={() => removeStudent(cIdx, sIdx)} className='text-gray-300 hover:text-red-500'>
                          <X className='w-4 h-4' />
                        </button>
                      )}
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4'>
                      <div className='space-y-1.5'>
                        <Label className='text-[11px] font-semibold text-gray-500 uppercase ml-0.5'>Full Name</Label>
                        <Input
                          type='text'
                          value={s.student_name}
                          onChange={(e) => handleStudentChange(cIdx, sIdx, 'student_name', e.target.value)}
                          className={cn('bg-white border-gray-200 rounded-lg text-sm transition-all', errors[`student_name_${cIdx}_${sIdx}`] && 'border-red-300 ring-1 ring-red-50')}
                          placeholder='Name'
                        />
                      </div>

                      <div className='space-y-1.5'>
                        <Label className='text-[11px] font-semibold text-gray-500 uppercase ml-0.5'>Email</Label>
                        <Input
                          type='email'
                          value={s.student_email}
                          onChange={(e) => handleStudentChange(cIdx, sIdx, 'student_email', e.target.value)}
                          className={cn('bg-white border-gray-200 rounded-lg text-sm transition-all', errors[`student_email_${cIdx}_${sIdx}`] && 'border-red-300 ring-1 ring-red-50')}
                          placeholder='Email'
                        />
                      </div>

                      <div className='space-y-1.5'>
                        <Label className='text-[11px] font-semibold text-gray-500 uppercase ml-0.5'>Phone</Label>
                        <Input
                          type='text'
                          value={s.student_phone_no}
                          onChange={(e) => handleStudentChange(cIdx, sIdx, 'student_phone_no', e.target.value)}
                          className={cn('bg-white border-gray-200 rounded-lg text-sm transition-all', errors[`student_phone_no_${cIdx}_${sIdx}`] && 'border-red-300 ring-1 ring-red-50')}
                          placeholder='Phone'
                          maxLength={10}
                        />
                      </div>

                      <div className='space-y-1.5'>
                        <Label className='text-[11px] font-semibold text-gray-500 uppercase ml-0.5'>Description</Label>
                        <Textarea
                          value={s.student_description}
                          onChange={(e) => handleStudentChange(cIdx, sIdx, 'student_description', e.target.value)}
                          rows={1}
                          className={cn('bg-white border-gray-200 rounded-lg text-sm transition-all resize-none', errors[`student_description_${cIdx}_${sIdx}`] && 'border-red-300 ring-1 ring-red-50')}
                          placeholder='Notes'
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button type='button' onClick={() => addStudent(cIdx)} className='w-full py-3 border border-dashed border-gray-200 rounded-xl text-gray-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50/50 transition-all flex items-center justify-center gap-2 text-xs font-bold'>
                  <Plus className='w-3 h-3' />
                  <span>ADD STUDENT</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className='py-20 text-center animate-in fade-in duration-700 border-2 border-dashed border-gray-100 rounded-3xl'>
            <Command className='w-10 h-10 text-gray-100 mx-auto mb-4' />
            <h3 className='text-sm font-semibold text-gray-400'>Search a college to begin</h3>
          </div>
        )}

        {formData.length > 0 && (
          <div className='fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-lg px-4 z-50 animate-in slide-in-from-bottom-4 duration-700'>
            <button type='submit' disabled={loading} className='w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/20 font-bold flex items-center justify-center gap-3 disabled:opacity-50'>
              {loading ? <div className='h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin' /> : <span>SUBMIT BATCH</span>}
            </button>
          </div>
        )}
      </form>

      <ConfirmationDialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleConfirmDelete}
        title={`Remove ${confirmDelete?.type === 'student' ? 'Student' : 'College'}`}
        message={`Are you sure you want to remove ${confirmDelete?.name}?`}
        confirmText='Yes, Remove'
        cancelText='Keep it'
      />

      <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #f1f1f1; border-radius: 10px; }
            `}</style>
    </div>
  )
}

export default ReferStudentPage
