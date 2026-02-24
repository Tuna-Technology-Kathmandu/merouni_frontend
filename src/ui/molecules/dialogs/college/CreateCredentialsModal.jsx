import { Button } from "@/ui/shadcn/button"
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/ui/shadcn/dialog"
import { Input } from "@/ui/shadcn/input"
import { Label } from "@/ui/shadcn/label"
import { Eye, EyeOff } from "lucide-react"
import { useEffect, useState } from "react"
import { authFetch } from '@/app/utils/authFetch'
import { toast } from 'react-toastify'

import { useForm } from 'react-hook-form'

const CreateCredentialsModal = ({
    setCredentialsModalOpen,
    credentialsModalOpen,
    selectedCollege,
    setSelectedCollege,
    setTableLoading,
    pagination,
    setPagination,
    setColleges
}) => {
    const [showPassword, setShowPassword] = useState(false)
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting: creatingCredentials },
        setValue
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
        if (selectedCollege && credentialsModalOpen) {
            let firstName = selectedCollege.name || ''
            let lastName = ''
            let emailName = ''
            let phoneNo = ''

            // If college has members, use the first member's data for other fields
            if (selectedCollege.members && selectedCollege.members.length > 0) {
                const firstMember = selectedCollege.members[0]
                const nameParts = (firstMember.name || '').split(' ')
                lastName = nameParts.slice(1).join(' ') || nameParts[0] || ''
                phoneNo = firstMember.contact_number || ''
            }

            // If college has contacts, use the first contact as phone
            if (!phoneNo && selectedCollege.contacts && selectedCollege.contacts.length > 0) {
                phoneNo = selectedCollege.contacts[0]?.contact_number || selectedCollege.contacts[0] || ''
            }

            // Extract email name if email exists (remove any domain)
            if (selectedCollege.email) {
                const emailParts = selectedCollege.email.split('@')
                emailName = emailParts[0] || ''
            }

            setValue('firstName', firstName)
            setValue('lastName', lastName)
            setValue('emailName', emailName)
            setValue('phoneNo', phoneNo.slice(0, 10))
        }
    }, [selectedCollege, credentialsModalOpen, setValue])

    const handleCloseCredentialsModal = () => {
        setCredentialsModalOpen(false)
        setSelectedCollege(null)
        reset()
        setShowPassword(false)
    }

    const onSubmit = async (data) => {
        if (!selectedCollege) return

        try {
            const fullEmail = `${data.emailName}@merouni.com`
            const payload = {
                firstName: data.firstName,
                lastName: data.lastName,
                email: fullEmail,
                password: data.password,
                phoneNo: data.phoneNo,
                collegeId: selectedCollege.id
            }

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

            const resData = await response.json()
            toast.success(resData.message || 'Credentials created successfully!')
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
        }
    }
    return (
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
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 pt-4'>
                    <div className='grid grid-cols-2 gap-4'>
                        <div className='space-y-2'>
                            <Label htmlFor='cred-first-name' required>First Name</Label>
                            <Input
                                id='cred-first-name'
                                placeholder='First Name'
                                {...register('firstName', { required: 'First name is required' })}
                            />
                            {errors.firstName && (
                                <p className='text-xs text-red-500'>{errors.firstName.message}</p>
                            )}
                        </div>
                        <div className='space-y-2'>
                            <Label htmlFor='cred-last-name' required>Last Name</Label>
                            <Input
                                id='cred-last-name'
                                placeholder='Last Name'
                                {...register('lastName', { required: 'Last name is required' })}
                            />
                            {errors.lastName && (
                                <p className='text-xs text-red-500'>{errors.lastName.message}</p>
                            )}
                        </div>
                    </div>

                    <div className='space-y-2'>
                        <Label htmlFor='cred-email' required>Email Address</Label>
                        <div className='flex items-center gap-2'>
                            <Input
                                id='cred-email'
                                placeholder='username'
                                {...register('emailName', {
                                    required: 'Username is required',
                                    pattern: {
                                        value: /^[a-zA-Z0-9._-]+$/,
                                        message: 'Invalid username format'
                                    }
                                })}
                            />
                            <span className='text-muted-foreground'>@merouni.com</span>
                        </div>
                        {errors.emailName && (
                            <p className='text-xs text-red-500'>{errors.emailName.message}</p>
                        )}
                    </div>

                    <div className='space-y-2'>
                        <Label htmlFor='cred-password' required>Password</Label>
                        <div className='relative'>
                            <Input
                                id='cred-password'
                                type={showPassword ? 'text' : 'password'}
                                placeholder='••••••••'
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: { value: 6, message: 'Minimum 6 characters' }
                                })}
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
                        {errors.password && (
                            <p className='text-xs text-red-500'>{errors.password.message}</p>
                        )}
                    </div>

                    <div className='space-y-2'>
                        <Label htmlFor='cred-phone' required>Phone Number</Label>
                        <Input
                            id='cred-phone'
                            placeholder='98XXXXXXXX'
                            maxLength={10}
                            {...register('phoneNo', {
                                required: 'Phone number is required',
                                pattern: {
                                    value: /^(98|97)\d{8}$/,
                                    message: 'Must be 10 digits and start with 98 or 97'
                                },
                                onChange: (e) => {
                                    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10)
                                }
                            })}
                        />
                        {errors.phoneNo && (
                            <p className='text-xs text-red-500'>{errors.phoneNo.message}</p>
                        )}
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
    )
}

export default CreateCredentialsModal