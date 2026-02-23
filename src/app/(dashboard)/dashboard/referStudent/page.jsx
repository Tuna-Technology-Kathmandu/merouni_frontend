'use client'

import { authFetch } from '@/app/utils/authFetch'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import { Input } from '@/ui/shadcn/input'
import { Label } from '@/ui/shadcn/label'
import { Textarea } from '@/ui/shadcn/textarea'
import { Button } from '@/ui/shadcn/button'
import { Plus, Trash2, X, Check, Building2, ChevronDown, GraduationCap, Send } from 'lucide-react'
import { useEffect, useState, useMemo, useRef } from 'react'
import { toast } from 'react-toastify'
import { cn } from '@/app/lib/utils'
import ConfirmationDialog from '@/ui/molecules/ConfirmationDialog'
import SearchInput from '@/ui/molecules/SearchInput'

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
    setHeading('Refer Students')
    fetchColleges()
    return () => setHeading(null)
  }, [setHeading])

  const fetchColleges = async () => {
    try {
      setFetchingColleges(true)
      const response = await authFetch(`${process.env.baseUrl}/college?limit=1000`)
      const data = await response.json()
      console.log(data,"datadatadata")
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
    return allColleges.filter(c => (c.name || '').toLowerCase().includes(query))
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
      updated[cIdx].students[sIdx] = { ...updated[cIdx].students[sIdx], [field]: value }
      return updated
    })
  }

  const addStudent = (cIdx) => {
    setFormData(prev => {
      const updated = [...prev]
      updated[cIdx].students.push({
        student_name: '',
        student_phone_no: '',
        student_email: '',
        student_description: ''
      })
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
        updated[confirmDelete.cIdx].students.splice(confirmDelete.sIdx, 1)
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
      c.students.forEach((s, sIdx) => {
        if (!s.student_name.trim()) {
          newErrors[`student_name_${cIdx}_${sIdx}`] = true
          isValid = false
        }
        if (!/^\d{10}$/.test(s.student_phone_no)) {
          newErrors[`student_phone_no_${cIdx}_${sIdx}`] = true
          isValid = false
        }
        if (!/^\S+@\S+\.\S+$/.test(s.student_email)) {
          newErrors[`student_email_${cIdx}_${sIdx}`] = true
          isValid = false
        }
        if (!s.student_description.trim()) {
          newErrors[`student_description_${cIdx}_${sIdx}`] = true
          isValid = false
        }
      })
    })

    setErrors(newErrors)
    if (!isValid) toast.error('Please fill all required fields correctly')
    return isValid
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    const payload = formData.map(({ college_name, ...rest }) => rest)

    try {
      const res = await authFetch(`${process.env.baseUrl}/referral/apply-agent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      if (res.ok) {
        toast.success(data.message || 'Applications submitted successfully')
        setFormData([])
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
    <div className='w-full max-w-5xl mx-auto space-y-6 pb-20'>
      {/* Search Bar Container */}
      <div className='bg-white p-6 rounded-xl border shadow-sm sticky top-0 z-40 flex flex-col sm:flex-row gap-4 items-center'>
        <div className='relative flex-1 w-full' ref={dropdownRef}>
          <SearchInput
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setIsDropdownOpen(true)
            }}
            onFocus={() => setIsDropdownOpen(true)}
            placeholder='Search for a college to refer...'
            className='w-full'
            inputClassName="h-11 rounded-lg border-slate-200"
          />
          {isDropdownOpen && (
            <div className='absolute z-50 w-full mt-2 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto custom-scrollbar'>
              {fetchingColleges ? (
                <div className='p-4 text-center text-slate-500 text-sm'>Loading...</div>
              ) : filteredColleges.length > 0 ? (
                filteredColleges.map(c => {
                  const isSelected = formData.some(item => item.college_id === c.id)
                  return (
                    <div
                      key={c.id}
                      onClick={() => toggleCollege(c)}
                      className={cn(
                        'flex items-center justify-between p-3 cursor-pointer hover:bg-slate-50 border-b last:border-0 transition-colors',
                        isSelected && 'bg-blue-50'
                      )}
                    >
                      <div className='flex items-center gap-3'>
                        <div className='w-8 h-8 rounded bg-slate-100 flex items-center justify-center'>
                          <Building2 size={16} className='text-slate-400' />
                        </div>
                        <span className='text-sm font-medium text-slate-700'>{c.name}</span>
                      </div>
                      {isSelected && <Check size={16} className='text-blue-600' />}
                    </div>
                  )
                })
              ) : (
                <div className='p-4 text-center text-slate-400 text-sm'>No colleges found</div>
              )}
            </div>
          )}
        </div>

        {formData.length > 0 && (
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-[#387cae] hover:bg-[#387cae]/90 text-white min-w-[140px] h-11"
          >
            {loading ? 'Submitting...' : <><Send size={16} className="mr-2" /> Submit All</>}
          </Button>
        )}
      </div>

      {/* Selected Items Summary */}
      {formData.length > 0 && (
        <div className='flex flex-wrap gap-2 px-1'>
          {formData.map((c, idx) => (
            <div key={c.college_id} className='inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-xs font-semibold text-blue-700'>
              <Building2 size={12} />
              {c.college_name}
              <button onClick={() => removeCollege(idx)} className='hover:text-red-500 transition-colors'>
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Forms Section */}
      <form onSubmit={handleSubmit} className='space-y-6'>
        {formData.length > 0 ? (
          formData.map((c, cIdx) => (
            <div key={c.college_id} className='bg-white rounded-xl border shadow-sm overflow-hidden'>
              <div className='px-6 py-3 bg-slate-50 border-b flex justify-between items-center'>
                <div className='flex items-center gap-2'>
                  <Building2 size={18} className='text-blue-600' />
                  <h3 className='font-bold text-slate-800 uppercase tracking-tight'>{c.college_name}</h3>
                </div>
                <Button
                  type='button'
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCollege(cIdx)}
                  className='text-slate-400 hover:text-red-500 h-8 w-8 p-0'
                >
                  <Trash2 size={16} />
                </Button>
              </div>

              <div className='p-6 space-y-6'>
                {c.students.map((s, sIdx) => (
                  <div key={sIdx} className='p-5 bg-slate-50/50 border rounded-lg relative space-y-4'>
                    <div className='flex justify-between items-center'>
                      <div className='flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wide'>
                        <GraduationCap size={14} />
                        Student {sIdx + 1}
                      </div>
                      {c.students.length > 1 && (
                        <button type='button' onClick={() => removeStudent(cIdx, sIdx)} className='text-slate-400 hover:text-red-500 transition-colors'>
                          <X size={16} />
                        </button>
                      )}
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                      <div className='space-y-1.5'>
                        <Label className="text-xs font-semibold text-slate-600">Full Name</Label>
                        <Input
                          value={s.student_name}
                          onChange={(e) => handleStudentChange(cIdx, sIdx, 'student_name', e.target.value)}
                          className={cn('h-10 bg-white border-slate-200', errors[`student_name_${cIdx}_${sIdx}`] && 'border-red-300')}
                          placeholder='Full Name'
                        />
                      </div>
                      <div className='space-y-1.5'>
                        <Label className="text-xs font-semibold text-slate-600">Email Address</Label>
                        <Input
                          type='email'
                          value={s.student_email}
                          onChange={(e) => handleStudentChange(cIdx, sIdx, 'student_email', e.target.value)}
                          className={cn('h-10 bg-white border-slate-200', errors[`student_email_${cIdx}_${sIdx}`] && 'border-red-300')}
                          placeholder='Email'
                        />
                      </div>
                      <div className='space-y-1.5'>
                        <Label className="text-xs font-semibold text-slate-600">Phone Number</Label>
                        <Input
                          type='text'
                          value={s.student_phone_no}
                          onChange={(e) => handleStudentChange(cIdx, sIdx, 'student_phone_no', e.target.value)}
                          className={cn('h-10 bg-white border-slate-200', errors[`student_phone_no_${cIdx}_${sIdx}`] && 'border-red-300')}
                          placeholder='10 digits'
                          maxLength={10}
                        />
                      </div>
                      <div className='space-y-1.5 md:col-span-3'>
                        <Label className="text-xs font-semibold text-slate-600">Description / Background</Label>
                        <Textarea
                          value={s.student_description}
                          onChange={(e) => handleStudentChange(cIdx, sIdx, 'student_description', e.target.value)}
                          rows={3}
                          className={cn('bg-white border-slate-200 transition-all resize-none', errors[`student_description_${cIdx}_${sIdx}`] && 'border-red-300')}
                          placeholder='Add some context...'
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  type='button'
                  variant="outline"
                  size="sm"
                  onClick={() => addStudent(cIdx)}
                  className='w-full border-dashed border-2 hover:bg-slate-50 py-6 font-semibold uppercase text-slate-500 text-xs tracking-wider'
                >
                  <Plus size={14} className='mr-2' /> Add Another Student to this college
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className='py-20 text-center bg-white border border-dashed rounded-xl shadow-sm'>
            <Building2 size={40} className='mx-auto text-slate-200 mb-4' />
            <h3 className='text-lg font-semibold text-slate-900'>No Colleges Selected</h3>
            <p className='text-slate-500 text-sm max-w-xs mx-auto mt-1'>Use the search bar above to select a college and start referring students.</p>
          </div>
        )}
      </form>

      <ConfirmationDialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleConfirmDelete}
        title={`Confirm Removal`}
        message={`Are you sure you want to remove ${confirmDelete?.name}?`}
        confirmText='Remove'
        cancelText='Cancel'
      />

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  )
}

export default ReferStudentPage
