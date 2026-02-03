'use client'
import { useState, useEffect } from 'react'
import { Modal } from '@/ui/molecules/Modal'
import { Button } from '@/ui/shadcn/button'
import { Input } from '@/ui/shadcn/input'
import { Label } from '@/ui/shadcn/label'
import { Eye, EyeOff } from 'lucide-react'
import { authFetch } from '@/app/utils/authFetch'
import { toast } from 'react-toastify'

export default function CreateConsultencyUser({
    isOpen,
    onClose,
    selectedConsultancy,
    onSuccess
}) {
    const [credentialsForm, setCredentialsForm] = useState({
        firstName: '',
        lastName: '',
        emailName: '',
        password: '',
        phoneNo: ''
    })
    const [creatingCredentials, setCreatingCredentials] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    useEffect(() => {
        if (isOpen && selectedConsultancy) {
            // Set first name to consultancy name
            let firstName = selectedConsultancy.title || ''
            let lastName = ''
            let emailName = ''
            let phoneNo = ''

            // Parse contact info
            let contacts = []
            if (selectedConsultancy.contact) {
                if (typeof selectedConsultancy.contact === 'string') {
                    try {
                        contacts = JSON.parse(selectedConsultancy.contact)
                    } catch {
                        contacts = [selectedConsultancy.contact]
                    }
                } else if (Array.isArray(selectedConsultancy.contact)) {
                    contacts = selectedConsultancy.contact
                }
            }

            if (contacts.length > 0) {
                phoneNo = contacts[0] || ''
            }

            // Try to split title for first/last name if possible, or just use title as first name
            const nameParts = firstName.trim().split(' ')
            if (nameParts.length > 1) {
                firstName = nameParts[0]
                lastName = nameParts.slice(1).join(' ')
            }

            setCredentialsForm({
                firstName,
                lastName,
                emailName,
                password: '',
                phoneNo
            })
        } else {
            // Reset form on close
            setCredentialsForm({
                firstName: '',
                lastName: '',
                emailName: '',
                password: '',
                phoneNo: ''
            })
            setShowPassword(false)
        }
    }, [isOpen, selectedConsultancy])

    const handleCreateCredentials = async (e) => {
        e.preventDefault()
        if (!selectedConsultancy) return

        try {
            setCreatingCredentials(true)
            // Combine email name with @merouni.com
            const fullEmail = `${credentialsForm.emailName}@merouni.com`
            const payload = {
                ...credentialsForm,
                email: fullEmail,
                consultancyId: selectedConsultancy.id
            }
            delete payload.emailName

            const response = await authFetch(
                `${process.env.baseUrl}/users/consultancy-credentials`,
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
            if (onSuccess) onSuccess()
            onClose()
        } catch (err) {
            toast.error(err.message || 'Failed to create credentials')
        } finally {
            setCreatingCredentials(false)
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title='Create Consultancy Credentials'
            className='max-w-md'
        >
            <form onSubmit={handleCreateCredentials} className='space-y-4'>
                <div className='space-y-2'>
                    <Label htmlFor='first-name'>First Name</Label>
                    <Input
                        id='first-name'
                        type='text'
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
                    <Label htmlFor='last-name'>Last Name</Label>
                    <Input
                        id='last-name'
                        type='text'
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

                <div className='space-y-2'>
                    <Label htmlFor='email'>Email</Label>
                    <div className='flex gap-2'>
                        <Input
                            id='email'
                            type='text'
                            className='flex-1'
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
                        <div className='flex-none px-3 py-2 border border-input rounded-md bg-muted flex items-center text-muted-foreground text-sm'>
                            @merouni.com
                        </div>
                    </div>
                </div>

                <div className='space-y-2'>
                    <Label htmlFor='password'>Password</Label>
                    <div className='relative'>
                        <Input
                            id='password'
                            type={showPassword ? 'text' : 'password'}
                            placeholder='Password (min 6 characters)'
                            value={credentialsForm.password}
                            onChange={(e) =>
                                setCredentialsForm({
                                    ...credentialsForm,
                                    password: e.target.value
                                })
                            }
                            required
                            minLength={6}
                            className='pr-10'
                        />
                        <button
                            type='button'
                            onClick={() => setShowPassword(!showPassword)}
                            className='absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
                        >
                            {showPassword ? (
                                <EyeOff className='w-4 h-4' />
                            ) : (
                                <Eye className='w-4 h-4' />
                            )}
                        </button>
                    </div>
                </div>

                <div className='space-y-2'>
                    <Label htmlFor='cred-phone-number'>Phone Number</Label>
                    <Input
                        id='cred-phone-number'
                        type='text'
                        placeholder='Phone Number'
                        value={credentialsForm.phoneNo || ''}
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
                        onClick={onClose}
                        variant='outline'
                        size='sm'
                    >
                        Cancel
                    </Button>
                    <Button type='submit' disabled={creatingCredentials} size='sm'>
                        {creatingCredentials ? 'Creating...' : 'Create'}
                    </Button>
                </div>
            </form>
        </Modal>
    )
}
