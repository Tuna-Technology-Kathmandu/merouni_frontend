'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { toast } from 'react-toastify'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/ui/shadcn/dialog'
import { Input } from '@/ui/shadcn/input'
import { Label } from '@/ui/shadcn/label'
import { Textarea } from '@/ui/shadcn/textarea'
import { Button } from '@/ui/shadcn/button'
import FileUpload from '@/app/(dashboard)/dashboard/colleges/FileUpload'
import { useSelector } from 'react-redux'
import { authFetch } from '@/app/utils/authFetch'

const schema = yup.object({
    resume: yup.string().trim().required('Resume is required'),
    cover_letter: yup.string().trim().nullable(),
}).required()

export default function ApplyCareerModal({ isOpen, onClose, careerId, careerTitle }) {
    const [loading, setLoading] = useState(false)



    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            resume: '',
            cover_letter: '',
        }
    })

    const onSubmit = async (data) => {
        try {
            setLoading(true)
            const payload = {
                careerId,
                ...data
            }

            const response = await authFetch(`${process.env.NEXT_PUBLIC_API_URL || process.env.baseUrl || ''}/career/apply/${careerId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}))
                throw new Error(errData.message || 'Failed to submit application')
            }

            toast.success('Your application has been submitted successfully!')
            reset()
            onClose()
        } catch (error) {
            toast.error(error.message || 'Error parsing application.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog isOpen={isOpen} onClose={onClose} className="max-w-2xl">
            <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0">
                <DialogHeader className="px-6 py-4 border-b">
                    <DialogTitle>Apply for {careerTitle}</DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto p-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">


                        <div className="space-y-2">
                            <FileUpload
                                label="Resume (PDF/DOC)"
                                required
                                accept=".pdf,.doc,.docx"
                                autoUpload={true}
                                onUploadComplete={(url) => {
                                    setValue('resume', url, { shouldValidate: true })
                                }}
                            />
                            {errors.resume && <span className="text-red-500 text-xs">{errors.resume.message}</span>}
                        </div>

                        <div className="space-y-2">
                            <Label>Cover Letter</Label>
                            <Textarea
                                placeholder="Tell us why you are a great fit for this role..."
                                rows={6}
                                className="min-h-[160px] resize-y"
                                {...register('cover_letter')}
                            />
                        </div>

                        <div className="flex justify-end pt-4 border-t">
                            <Button type="button" variant="outline" className="mr-3" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading} className="bg-[#0A6FA7] hover:bg-[#0A6FA7]/90 text-white">
                                {loading ? 'Submitting...' : 'Submit Application'}
                            </Button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}
