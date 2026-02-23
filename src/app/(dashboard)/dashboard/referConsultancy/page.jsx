'use client'

import { authFetch } from '@/app/utils/authFetch'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import { Input } from '@/ui/shadcn/input'
import { Label } from '@/ui/shadcn/label'
import { Textarea } from '@/ui/shadcn/textarea'
import { Button } from '@/ui/shadcn/button'
import { Plus, Trash2, X, Check, Building2, ChevronDown, Briefcase, Send } from 'lucide-react'
import { useEffect, useState, useMemo, useRef } from 'react'
import { toast } from 'react-toastify'
import { cn } from '@/app/lib/utils'
import ConfirmationDialog from '@/ui/molecules/ConfirmationDialog'
import SearchInput from '@/ui/molecules/SearchInput'

const ReferConsultancyPage = () => {
    const { setHeading } = usePageHeading()
    const [selectedConsultancy, setSelectedConsultancy] = useState(null)
    const [students, setStudents] = useState([
        { student_name: '', student_phone_no: '', student_email: '', student_description: '' }
    ])
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [fetchingConsultancies, setFetchingConsultancies] = useState(true)
    const [allConsultancies, setAllConsultancies] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [confirmDelete, setConfirmDelete] = useState(null)
    const dropdownRef = useRef(null)

    useEffect(() => {
        setHeading('Refer Consultancies')
        fetchConsultancies()
        return () => setHeading(null)
    }, [setHeading])

    const fetchConsultancies = async () => {
        try {
            setFetchingConsultancies(true)
            const response = await authFetch(`${process.env.baseUrl}/consultancy?limit=1000`)
            const data = await response.json()
            setAllConsultancies(data.items || [])
        } catch (error) {
            console.error('Error fetching consultancies:', error)
            toast.error('Could not load consultancies')
        } finally {
            setFetchingConsultancies(false)
        }
    }

    const filteredConsultancies = useMemo(() => {
        const query = searchTerm.toLowerCase()
        return allConsultancies.filter(c => {
            const name = (c.consultany_details?.name || c.title || '').toLowerCase()
            return name.includes(query)
        })
    }, [allConsultancies, searchTerm])

    const selectConsultancy = (consultancy) => {
        setSelectedConsultancy({
            id: consultancy.id,
            name: consultancy.consultany_details?.name || consultancy.title
        })
        setSearchTerm('')
        setIsDropdownOpen(false)
    }

    const handleStudentChange = (idx, field, value) => {
        setStudents(prev => {
            const updated = [...prev]
            updated[idx] = { ...updated[idx], [field]: value }
            return updated
        })
    }

    const addStudent = () => {
        setStudents(prev => [
            ...prev,
            { student_name: '', student_phone_no: '', student_email: '', student_description: '' }
        ])
    }

    const removeStudent = (idx) => {
        if (students.length > 1) {
            const updated = [...students]
            updated.splice(idx, 1)
            setStudents(updated)
        }
    }

    const clearSelection = () => {
        setConfirmDelete({ type: 'consultancy', name: selectedConsultancy.name })
    }

    const handleConfirmDelete = () => {
        setSelectedConsultancy(null)
        setStudents([{ student_name: '', student_phone_no: '', student_email: '', student_description: '' }])
        setErrors({})
        setConfirmDelete(null)
    }

    const validate = () => {
        const newErrors = {}
        let isValid = true

        if (!selectedConsultancy) {
            toast.error('Please select a consultancy')
            return false
        }

        students.forEach((s, idx) => {
            if (!s.student_name.trim()) {
                newErrors[`student_name_${idx}`] = true
                isValid = false
            }
            if (!/^\d{10}$/.test(s.student_phone_no)) {
                newErrors[`student_phone_no_${idx}`] = true
                isValid = false
            }
            if (!/^\S+@\S+\.\S+$/.test(s.student_email)) {
                newErrors[`student_email_${idx}`] = true
                isValid = false
            }
            if (!s.student_description.trim()) {
                newErrors[`student_description_${idx}`] = true
                isValid = false
            }
        })

        setErrors(newErrors)
        if (!isValid) toast.error('Please fill all required fields correctly')
        return isValid
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validate()) return

        setLoading(true)
        const payload = [
            {
                consultancy_id: selectedConsultancy.id,
                students: students
            }
        ]

        try {
            const res = await authFetch(`${process.env.baseUrl}/consultancy-application/apply-agent`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            const data = await res.json()
            if (res.ok) {
                toast.success(data.message || 'Application submitted successfully')
                setSelectedConsultancy(null)
                setStudents([{ student_name: '', student_phone_no: '', student_email: '', student_description: '' }])
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
                        placeholder='Search for a consultancy to refer...'
                        className='w-full'
                        inputClassName="h-11 rounded-lg border-slate-200"
                    />
                    {isDropdownOpen && (
                        <div className='absolute z-50 w-full mt-2 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto custom-scrollbar'>
                            {fetchingConsultancies ? (
                                <div className='p-4 text-center text-slate-500 text-sm'>Loading...</div>
                            ) : filteredConsultancies.length > 0 ? (
                                filteredConsultancies.map(c => {
                                    const isSelected = selectedConsultancy?.id === c.id
                                    const cName = c.consultany_details?.name || c.title
                                    return (
                                        <div
                                            key={c.id}
                                            onClick={() => selectConsultancy(c)}
                                            className={cn(
                                                'flex items-center justify-between p-3 cursor-pointer hover:bg-slate-50 border-b last:border-0 transition-colors',
                                                isSelected && 'bg-blue-50'
                                            )}
                                        >
                                            <div className='flex items-center gap-3'>
                                                <div className='w-8 h-8 rounded bg-slate-100 flex items-center justify-center overflow-hidden border'>
                                                    {c.consultany_details?.logo ? (
                                                        <img src={c.consultany_details.logo} className='w-full h-full object-contain' />
                                                    ) : (
                                                        <Building2 size={16} className='text-slate-400' />
                                                    )}
                                                </div>
                                                <span className='text-sm font-medium text-slate-700'>{cName}</span>
                                            </div>
                                            {isSelected && <Check size={16} className='text-blue-600' />}
                                        </div>
                                    )
                                })
                            ) : (
                                <div className='p-4 text-center text-slate-400 text-sm'>No consultancies found</div>
                            )}
                        </div>
                    )}
                </div>

                {selectedConsultancy && (
                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-[#387cae] hover:bg-[#387cae]/90 text-white min-w-[140px] h-11"
                    >
                        {loading ? 'Submitting...' : <><Send size={16} className="mr-2" /> Submit Referral</>}
                    </Button>
                )}
            </div>

            {/* Form Section */}
            {selectedConsultancy ? (
                <div className='bg-white rounded-xl border shadow-sm overflow-hidden'>
                    <div className='px-6 py-3 bg-slate-50 border-b flex justify-between items-center'>
                        <div className='flex items-center gap-2'>
                            <Briefcase size={18} className='text-blue-600' />
                            <h3 className='font-bold text-slate-800 uppercase tracking-tight'>{selectedConsultancy.name}</h3>
                        </div>
                        <Button
                            type='button'
                            variant="ghost"
                            size="sm"
                            onClick={clearSelection}
                            className='text-slate-400 hover:text-red-500 h-8 w-8 p-0'
                        >
                            <Trash2 size={16} />
                        </Button>
                    </div>

                    <div className='p-6 space-y-6'>
                        {students.map((s, idx) => (
                            <div key={idx} className='p-5 bg-slate-50/50 border rounded-lg relative space-y-4'>
                                <div className='flex justify-between items-center'>
                                    <div className='flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wide'>
                                        Student {idx + 1}
                                    </div>
                                    {students.length > 1 && (
                                        <button type='button' onClick={() => removeStudent(idx)} className='text-slate-400 hover:text-red-500 transition-colors'>
                                            <X size={16} />
                                        </button>
                                    )}
                                </div>

                                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                                    <div className='space-y-1.5'>
                                        <Label className="text-xs font-semibold text-slate-600">Full Name</Label>
                                        <Input
                                            value={s.student_name}
                                            onChange={(e) => handleStudentChange(idx, 'student_name', e.target.value)}
                                            className={cn('h-10 bg-white border-slate-200', errors[`student_name_${idx}`] && 'border-red-300')}
                                            placeholder='Full Name'
                                        />
                                    </div>
                                    <div className='space-y-1.5'>
                                        <Label className="text-xs font-semibold text-slate-600">Email Address</Label>
                                        <Input
                                            type='email'
                                            value={s.student_email}
                                            onChange={(e) => handleStudentChange(idx, 'student_email', e.target.value)}
                                            className={cn('h-10 bg-white border-slate-200', errors[`student_email_${idx}`] && 'border-red-300')}
                                            placeholder='Email'
                                        />
                                    </div>
                                    <div className='space-y-1.5'>
                                        <Label className="text-xs font-semibold text-slate-600">Phone Number</Label>
                                        <Input
                                            value={s.student_phone_no}
                                            onChange={(e) => handleStudentChange(idx, 'student_phone_no', e.target.value)}
                                            className={cn('h-10 bg-white border-slate-200', errors[`student_phone_no_${idx}`] && 'border-red-300')}
                                            placeholder='10 digits'
                                            maxLength={10}
                                        />
                                    </div>
                                    <div className='space-y-1.5 md:col-span-3'>
                                        <Label className="text-xs font-semibold text-slate-600">Referral Reason / Background</Label>
                                        <Textarea
                                            value={s.student_description}
                                            onChange={(e) => handleStudentChange(idx, 'student_description', e.target.value)}
                                            rows={3}
                                            className={cn('bg-white border-slate-200 resize-none', errors[`student_description_${idx}`] && 'border-red-300')}
                                            placeholder='Provide some context...'
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}

                        <Button
                            type='button'
                            variant="outline"
                            size="sm"
                            onClick={addStudent}
                            className='w-full border-dashed border-2 hover:bg-slate-50 py-6 font-semibold uppercase text-slate-500 text-xs tracking-wider'
                        >
                            <Plus size={14} className='mr-2' /> Add Another Student
                        </Button>
                    </div>
                </div>
            ) : (
                <div className='py-20 text-center bg-white border border-dashed rounded-xl shadow-sm'>
                    <Briefcase size={40} className='mx-auto text-slate-200 mb-4' />
                    <h3 className='text-lg font-semibold text-slate-900'>No Consultancy Selected</h3>
                    <p className='text-slate-500 text-sm max-w-xs mx-auto mt-1'>Search for a consultancy in the bar above to start your referral.</p>
                </div>
            )}

            <ConfirmationDialog
                open={!!confirmDelete}
                onClose={() => setConfirmDelete(null)}
                onConfirm={handleConfirmDelete}
                title={`Confirm Reset`}
                message={`Are you sure you want to clear this selection? All progress for ${confirmDelete?.name} will be lost.`}
                confirmText='Clear All'
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

export default ReferConsultancyPage
