'use client'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogClose } from '@/ui/shadcn/dialog'
import { Button } from '@/ui/shadcn/button'
import { Input } from '@/ui/shadcn/input'
import { Label } from '@/ui/shadcn/label'
import { Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { authFetch } from '@/app/utils/authFetch'
import { toast } from 'react-toastify'

export default function CreateConsultencyUser({
    isOpen,
    onClose,
    selectedConsultancy,
    onSuccess
}) {
    const [showPassword, setShowPassword] = React.useState(false)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm({
        defaultValues: {
            firstName: '',
            lastName: '',
            emailName: '',
            password: '',
            phoneNo: ''
        }
    })

    useEffect(() => {
        if (isOpen && selectedConsultancy) {
            let firstName = selectedConsultancy.title || ''
            let lastName = ''
            let phoneNo = ''

            let contacts = []
            try {
                const contactData = selectedConsultancy.contact
                if (typeof contactData === 'string') {
                    contacts = JSON.parse(contactData)
                } else if (Array.isArray(contactData)) {
                    contacts = contactData
                }
            } catch (e) { }

            if (contacts.length > 0) phoneNo = contacts[0] || ''

            const nameParts = firstName.trim().split(' ')
            if (nameParts.length > 1) {
                firstName = nameParts[0]
                lastName = nameParts.slice(1).join(' ')
            }

            reset({
                firstName,
                lastName,
                emailName: '',
                password: '',
                phoneNo
            })
            setShowPassword(false)
        } else {
            reset({
                firstName: '',
                lastName: '',
                emailName: '',
                password: '',
                phoneNo: ''
            })
            setShowPassword(false)
        }
    }, [isOpen, selectedConsultancy, reset])

    const onSubmit = async (data) => {
        if (!selectedConsultancy) return
        try {
            const fullEmail = `${data.emailName.trim()}@merouni.com`
            const payload = {
                firstName: data.firstName.trim(),
                lastName: data.lastName.trim(),
                email: fullEmail,
                password: data.password,
                phoneNo: data.phoneNo.trim(),
                consultancyId: selectedConsultancy.id
            }

            const response = await authFetch(
                `${process.env.baseUrl}/users/consultancy-credentials`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                }
            )

            const responseData = await response.json()
            if (!response.ok) throw new Error(responseData.message || 'Failed to create credentials')

            toast.success('Credentials created successfully!')
            if (onSuccess) onSuccess()
            onClose()
        } catch (err) {
            toast.error(err.message || 'Failed to create credentials')
        }
    }

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            className='max-w-md'
            closeOnOutsideClick={false}
        >
            <DialogContent className='max-w-md flex flex-col p-0'>
                <DialogHeader className='px-6 py-4 border-b bg-gray-50/50'>
                    <div className='flex items-center gap-3'>
                        <div className='p-2 bg-[#387cae]/10 rounded-lg'>
                            <ShieldCheck className='w-5 h-5 text-[#387cae]' />
                        </div>
                        <DialogTitle className="text-lg font-bold text-gray-900 leading-tight">
                            Consultancy Access
                            <span className="block text-xs font-medium text-gray-500 mt-0.5">
                                Create login credentials for{' '}
                                <span className="text-[#387cae] font-semibold">{selectedConsultancy?.title}</span>
                            </span>
                        </DialogTitle>
                    </div>
                    <DialogClose onClick={onClose} />
                </DialogHeader>

                <form id="credentials-form" onSubmit={handleSubmit(onSubmit)}>
                    <div className='p-6 space-y-5'>
                        {/* Name row */}
                        <div className='grid grid-cols-2 gap-4'>
                            <div className='space-y-1.5'>
                                <Label htmlFor="firstName" required>First Name</Label>
                                <Input
                                    id="firstName"
                                    placeholder="e.g. John"
                                    {...register('firstName', {
                                        required: 'First name is required',
                                        minLength: { value: 2, message: 'At least 2 characters' }
                                    })}
                                    className={errors.firstName ? 'border-destructive focus-visible:ring-destructive' : ''}
                                />
                                {errors.firstName && (
                                    <p className="text-xs text-destructive mt-1">{errors.firstName.message}</p>
                                )}
                            </div>
                            <div className='space-y-1.5'>
                                <Label htmlFor="lastName" required>Last Name</Label>
                                <Input
                                    id="lastName"
                                    placeholder="e.g. Doe"
                                    {...register('lastName', {
                                        required: 'Last name is required',
                                        minLength: { value: 2, message: 'At least 2 characters' }
                                    })}
                                    className={errors.lastName ? 'border-destructive focus-visible:ring-destructive' : ''}
                                />
                                {errors.lastName && (
                                    <p className="text-xs text-destructive mt-1">{errors.lastName.message}</p>
                                )}
                            </div>
                        </div>

                        {/* System Email */}
                        <div className='space-y-1.5'>
                            <Label htmlFor="emailName" required>System Email</Label>
                            <div className='flex gap-2'>
                                <Input
                                    id="emailName"
                                    placeholder="username"
                                    {...register('emailName', {
                                        required: 'Username is required',
                                        pattern: {
                                            value: /^[a-zA-Z0-9._-]+$/,
                                            message: 'Only letters, numbers, dots, hyphens allowed'
                                        },
                                        minLength: { value: 3, message: 'At least 3 characters' }
                                    })}
                                    className={`flex-1 ${errors.emailName ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                />
                                <div className='flex-none px-3 py-2 border rounded-md bg-gray-100 flex items-center text-gray-500 text-sm font-medium select-none'>
                                    @merouni.com
                                </div>
                            </div>
                            {errors.emailName && (
                                <p className="text-xs text-destructive mt-1">{errors.emailName.message}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div className='space-y-1.5'>
                            <Label htmlFor="password" required>Password</Label>
                            <div className='relative'>
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder='Minimum 6 characters'
                                    {...register('password', {
                                        required: 'Password is required',
                                        minLength: { value: 6, message: 'Password must be at least 6 characters' }
                                    })}
                                    className={`pr-11 ${errors.password ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                />
                                <button
                                    type='button'
                                    onClick={() => setShowPassword(!showPassword)}
                                    className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors h-8 w-8 flex items-center justify-center rounded'
                                    tabIndex={-1}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-xs text-destructive mt-1">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Phone */}
                        <div className='space-y-1.5'>
                            <Label htmlFor="phoneNo" required>Phone Number</Label>
                            <Input
                                id="phoneNo"
                                type="tel"
                                placeholder='e.g. +977 9800000000'
                                {...register('phoneNo', {
                                    required: 'Phone number is required',
                                    pattern: {
                                        value: /^[+\d][\d\s\-()]{6,19}$/,
                                        message: 'Enter a valid phone number'
                                    }
                                })}
                                className={errors.phoneNo ? 'border-destructive focus-visible:ring-destructive' : ''}
                            />
                            {errors.phoneNo && (
                                <p className="text-xs text-destructive mt-1">{errors.phoneNo.message}</p>
                            )}
                        </div>
                    </div>

                    <div className='px-6 py-4 border-t flex justify-end gap-3 bg-gray-50/30'>
                        <Button
                            type='button'
                            onClick={onClose}
                            variant='outline'
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type='submit'
                            disabled={isSubmitting}
                            className="bg-[#387cae] hover:bg-[#387cae]/90 font-semibold"
                        >
                            {isSubmitting ? 'Creating...' : 'Create Credentials'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
