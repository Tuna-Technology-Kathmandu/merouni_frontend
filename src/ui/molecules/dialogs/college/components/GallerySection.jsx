import { useRef, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Trash2, Image as ImageIcon, Plus, Loader2, X, AlertCircle } from 'lucide-react'
import { Button } from '@/ui/shadcn/button'
import { cn } from '@/app/lib/utils'

const GallerySection = ({
  control,
  setValue,
  uploadedFiles,
  setUploadedFiles,
  getValues
}) => {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef(null)

  const handleBulkUpload = async (event) => {
    const files = Array.from(event.target.files)
    if (files.length === 0) return

    setIsUploading(true)
    const newImages = []

    try {
      for (const file of files) {
        const formData = new FormData()
        formData.append('title', file.name)
        formData.append('altText', file.name)
        formData.append('description', '')
        formData.append('file', file)
        formData.append('authorId', '1')

        const response = await axios.post(
          `${process.env.mediaUrl}${process.env.version}/media/upload`,
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        )

        if (response.data.success) {
          newImages.push({
            url: response.data.media.url,
            file_type: 'image'
          })
        }
      }

      setUploadedFiles((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...newImages]
      }))

      const currentMedia = getValues('images') || []
      setValue('images', [...currentMedia, ...newImages], { shouldDirty: true })

      toast.success(`Successfully uploaded ${newImages.length} images`)
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload some images. Please try again.')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const removeImage = (imageUrl) => {
    setUploadedFiles((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img.url !== imageUrl)
    }))

    const currentMedia = getValues('images') || []
    setValue(
      'images',
      currentMedia.filter((img) => img.url !== imageUrl),
      { shouldDirty: true }
    )
  }

  const showGallery = uploadedFiles.images || []

  return (
    <div className='space-y-6'>
      <div className='flex justify-end'>
        <Button
          type='button'
          onClick={() => fileInputRef.current.click()}
          disabled={isUploading}
          className='h-11 px-6 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold gap-2 shadow-lg shadow-green-600/10 transition-all active:scale-95 disabled:opacity-50'
        >
          {isUploading ? (
            <Loader2 size={18} className='animate-spin' />
          ) : (
            <Plus size={18} />
          )}
          <span>{isUploading ? 'Uploading...' : 'Add Photos'}</span>
        </Button>

        <input
          type='file'
          ref={fileInputRef}
          onChange={handleBulkUpload}
          accept='image/*'
          multiple
          className='hidden'
          disabled={isUploading}
        />
      </div>

      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {showGallery.map((image, index) => (
          <div key={image.url || index} className='group relative aspect-square'>
            <div className='w-full h-full rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 shadow-sm transition-all duration-300 group-hover:shadow-xl group-hover:shadow-[#387cae]/5 group-hover:-translate-y-1'>
              <img
                src={image.url}
                alt={`Gallery ${index}`}
                className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = 'https://via.placeholder.com/300?text=Error'
                }}
              />

              <div className='absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300' />

              <button
                type='button'
                onClick={() => removeImage(image.url)}
                className='absolute top-2 right-2 w-8 h-8 rounded-lg bg-white/90 backdrop-blur-md text-red-500 shadow-sm border border-red-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white transform scale-90 group-hover:scale-100'
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}

        {showGallery.length === 0 && !isUploading && (
          <div className='col-span-full py-16 border-2 border-dashed border-gray-100 rounded-3xl flex flex-col items-center justify-center gap-4 bg-gray-50/50'>
            <div className='w-16 h-16 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-400'>
              <ImageIcon size={28} />
            </div>
            <div className='text-center'>
              <h4 className='text-sm font-bold text-gray-900'>Your gallery is empty</h4>
              <p className='text-xs text-gray-500 mt-1 max-w-[200px]'>Upload high-quality images of the campus and facilities</p>
            </div>
          </div>
        )}

        {isUploading && (
          <div className='aspect-square rounded-2xl border-2 border-dashed border-[#387cae]/20 bg-[#387cae]/5 flex flex-col items-center justify-center gap-2 animate-pulse'>
            <Loader2 size={24} className='text-[#387cae] animate-spin' />
            <span className='text-[10px] font-bold text-[#387cae] uppercase'>Uploading...</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default GallerySection
