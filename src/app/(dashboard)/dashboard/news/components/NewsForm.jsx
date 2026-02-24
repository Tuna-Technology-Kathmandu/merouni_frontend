'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogClose } from '@/ui/shadcn/dialog'
import { Button } from '@/ui/shadcn/button'
import { Input } from '@/ui/shadcn/input'
import { Label } from '@/ui/shadcn/label'
import FileUpload from '../../colleges/FileUpload'
import TipTapEditor from '@/ui/shadcn/tiptap-editor'
import SearchSelectCreate from '@/ui/shadcn/search-select-create'
import { authFetch } from '@/app/utils/authFetch'
import { Image as ImageIcon, Info, Layers, Loader2, Settings } from 'lucide-react'

const SectionHeader = ({ icon: Icon, title, subtitle }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="w-10 h-10 rounded-xl bg-[#387cae]/10 flex items-center justify-center text-[#387cae] shadow-sm border border-[#387cae]/20">
      <Icon size={20} />
    </div>
    <div>
      <h3 className="text-lg font-bold text-gray-900 leading-tight">{title}</h3>
      {subtitle && <p className="text-xs text-gray-400 mt-0.5 font-medium">{subtitle}</p>}
    </div>
  </div>
)

export default function NewsForm({
  isOpen,
  onClose,
  editing,
  initialData,
  onSubmit,
  submitting,
  colleges = [],
  categories = [],
  loadingColleges = false,
  loadingCategories = false
}) {
  const [uploadedFiles, setUploadedFiles] = useState({
    featured_image: ''
  })
  const [selectedCollege, setSelectedCollege] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [formErrors, setFormErrors] = useState({})

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      featured_image: '',
      status: 'draft',
      visibility: 'private',
      college_id: '',
      category_id: ''
    }
  })

  const onSearchColleges = async (query) => {
    try {
      const url = query ? `${process.env.baseUrl}/college?q=${query}&limit=1000` : `${process.env.baseUrl}/college?limit=1000`
      const response = await authFetch(url)
      const data = await response.json()
      return data.items || []
    } catch (error) {
      console.error('Colleges Search Error:', error)
      return []
    }
  }

  const onSearchCategories = async (query) => {
    try {
      const url = query ? `${process.env.baseUrl}/category?q=${query}&type=NEWS` : `${process.env.baseUrl}/category?type=NEWS`
      const response = await authFetch(url)
      const data = await response.json()
      return data.items || []
    } catch (error) {
      console.error('Categories Search Error:', error)
      return []
    }
  }

  const handleSelectCollege = (college) => {
    setSelectedCollege(college)
    setValue('college_id', college.id)
  }

  const handleRemoveCollege = () => {
    setSelectedCollege(null)
    setValue('college_id', '')
  }

  const handleSelectCategory = (category) => {
    setSelectedCategory(category)
    setValue('category_id', category.id)
    setFormErrors(prev => ({ ...prev, category_id: '' }))
  }

  const handleRemoveCategory = () => {
    setSelectedCategory(null)
    setValue('category_id', '')
  }



  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      reset({
        title: '',
        description: '',
        featured_image: '',
        status: 'draft',
        college_id: '',
        category_id: ''
      })
      setUploadedFiles({ featured_image: '' })
      setSelectedCollege(null)
      setSelectedCategory(null)
      setFormErrors({})
    }
  }, [isOpen, reset])

  // Populate form when editing
  useEffect(() => {
    if (editing && initialData && isOpen) {
      reset({
        title: initialData.title || '',
        description: initialData.description || '',
        featured_image: initialData.featured_image || '',
        status: initialData.status || 'draft',
        college_id: initialData.college_id || initialData.newsCollege?.id || '',
        category_id: initialData.category_id || initialData.newsCategory?.id || ''
      })
      setUploadedFiles({
        featured_image: initialData.featured_image || ''
      })

      // Initialize Selected College
      if (initialData.newsCollege || initialData.college_id) {
        const coll = initialData.newsCollege || colleges.find(c => c.id === initialData.college_id)
        if (coll) setSelectedCollege(coll)
      }

      // Initialize Selected Category
      if (initialData.newsCategory || initialData.category_id) {
        const cat = initialData.newsCategory || categories.find(c => c.id === initialData.category_id)
        if (cat) setSelectedCategory(cat)
      }
    }
  }, [editing, initialData, isOpen, reset, colleges, categories])

  const handleFormSubmit = (data) => {
    // Manual validation for fields not controlled by react-hook-form register
    const newErrors = {}

    if (!data.category_id) {
      newErrors.category_id = 'Category is required'
    }
    if (!uploadedFiles.featured_image) {
      newErrors.featured_image = 'Featured image is required'
    }
    const descriptionText = (data.description || '').replace(/<[^>]*>/g, '').trim()
    if (!descriptionText) {
      newErrors.description = 'Description is required'
    }

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors)
      return
    }

    setFormErrors({})
    onSubmit(data)
  }

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      className='max-w-6xl'
      closeOnOutsideClick={false}
    >
      <DialogHeader className="bg-white border-b border-gray-100 p-6">
        <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Layers className="text-[#387cae]" size={24} />
          {editing ? 'Edit News' : 'Create New News Post'}
        </DialogTitle>
        <DialogClose onClick={onClose} />
      </DialogHeader>
      <DialogContent className="p-0 bg-gray-50/50">
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className='flex flex-col max-h-[calc(100vh-120px)]'
        >
          <div className='flex-1 p-8'>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-10">
              {/* Left Column - Main Content (8/12) */}
              <div className="lg:col-span-8 space-y-8">
                <div className='bg-white p-8 rounded-2xl shadow-sm border border-gray-100'>
                  <SectionHeader icon={Info} title="News Content" subtitle="Detailed information about the news" />
                  <div className='space-y-6'>
                    <div className='space-y-2'>
                      <Label required htmlFor='title'>News Title</Label>
                      <Input
                        id='title'
                        placeholder='Enter news title...'
                        {...register('title', {
                          required: 'Title is required',
                          minLength: { value: 3, message: 'Title must be at least 3 characters' }
                        })}
                        className={errors.title ? 'border-destructive focus-visible:ring-destructive' : ''}
                      />
                      {errors.title && (
                        <p className='text-xs text-destructive mt-1'>{errors.title.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className='space-y-2'>
                        <Label htmlFor='category_id' required>Category</Label>
                        <SearchSelectCreate
                          onSearch={onSearchCategories}
                          onSelect={handleSelectCategory}
                          onRemove={handleRemoveCategory}
                          selectedItems={selectedCategory}
                          placeholder="Select news category..."
                          displayKey="title"
                          valueKey="id"
                          isMulti={false}
                          allowCreate={false}
                        />
                        {formErrors.category_id && (
                          <p className='text-xs text-destructive mt-1'>{formErrors.category_id}</p>
                        )}
                      </div>

                      <div className='space-y-2'>
                        <Label htmlFor='college_id'>Associated College</Label>
                        <SearchSelectCreate
                          onSearch={onSearchColleges}
                          onSelect={handleSelectCollege}
                          onRemove={handleRemoveCollege}
                          selectedItems={selectedCollege}
                          placeholder="Select associated college..."
                          displayKey="name"
                          valueKey="id"
                          isMulti={false}
                          allowCreate={false}
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <Label required>Description / Body</Label>
                      <div className={formErrors.description ? 'ring-2 ring-red-400/40 rounded-xl mt-2' : 'mt-2'}>
                        <TipTapEditor
                          value={watch('description')}
                          onChange={(data) => {
                            setValue('description', data, { shouldDirty: true, shouldValidate: true })
                            const plain = data.replace(/<[^>]*>/g, '').trim()
                            if (plain) setFormErrors(prev => ({ ...prev, description: '' }))
                          }}
                          placeholder='Write the news content here...'
                        />
                      </div>
                      {formErrors.description && (
                        <p className='text-xs text-destructive mt-2'>{formErrors.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Media & Settings (4/12) */}
              <div className="lg:col-span-4 space-y-8">
                {/* Featured Image Section */}
                <div className={`bg-white p-6 rounded-2xl shadow-sm border ${formErrors.featured_image ? 'border-red-300' : 'border-gray-100'}`}>
                  <SectionHeader icon={ImageIcon} title="Featured Image" subtitle="Required — main image for the news" />
                  <div className={`p-4 bg-gray-50 rounded-xl border border-dashed ${formErrors.featured_image ? 'border-red-300 bg-red-50/30' : 'border-gray-100'}`}>
                    <FileUpload
                      label=''
                      onUploadComplete={(url) => {
                        setUploadedFiles(prev => ({ ...prev, featured_image: url }))
                        setValue('featured_image', url)
                        setFormErrors(prev => ({ ...prev, featured_image: '' }))
                      }}
                      defaultPreview={uploadedFiles.featured_image}
                    />
                  </div>
                  {formErrors.featured_image && (
                    <p className='text-xs text-destructive mt-1'>{formErrors.featured_image}</p>
                  )}
                </div>

                {/* Publishing Options */}
                <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
                  <SectionHeader icon={Settings} title="Publishing" subtitle="Visibility settings" />
                  <div className='space-y-5'>
                    <div className='space-y-2'>
                      <Label htmlFor='status'>Status</Label>
                      <select
                        id='status'
                        {...register('status')}
                        className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#387cae] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                      >
                        <option value='draft'>Draft</option>
                        <option value='published'>Published</option>
                      </select>
                    </div>


                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button - Sticky Footer */}
          <div className='sticky bottom-0 bg-white border-t border-gray-100 p-6 flex justify-end gap-3 z-10'>
            <Button
              type='button'
              onClick={onClose}
              variant='outline'
            >
              Cancel
            </Button>
            <Button
              type='submit'
              disabled={submitting}
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>
                {submitting
                  ? (editing ? 'Syncing...' : 'Submitting...')
                  : (editing ? 'Update News' : 'Create News')}
              </span>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
