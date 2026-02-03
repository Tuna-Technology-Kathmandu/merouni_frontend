import { useRef, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const GallerySection = ({
  setValue,
  uploadedFiles,
  setUploadedFiles,
  getValues
}) => {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef(null)

  const handleBulkUpload = async (event) => {
    const files = Array.from(event.target.files)
    if (!files.length) return

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
          newImages.push(response.data.media.url)
        }
      }

      // Update uploadedFiles.gallery
      setUploadedFiles((prev) => ({
        ...prev,
        gallery: [...prev.gallery, ...newImages]
      }))

      // Update form values
      const currentGallery = getValues('gallery') || []
      setValue('gallery', [...currentGallery, ...newImages])

      toast.success(`Uploaded ${newImages.length} images successfully!`)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  const removeImage = (url) => {
    setUploadedFiles((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((img) => img.url !== url)
    }))
    const currentGallery = getValues('gallery') || []
    setValue(
      'gallery',
      currentGallery.filter((img) => img.url !== url)
    )
  }

  return (
    <div className='mt-7'>
      <div className='flex justify-between items-center mb-4'>
        <label className='block text-xl font-semibold'>Gallery</label>
        <button
          type='button'
          onClick={() => fileInputRef.current.click()}
          disabled={isUploading}
          className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-green-300'
        >
          {isUploading ? 'Uploading...' : 'Add Images'}
        </button>
        <input
          type='file'
          ref={fileInputRef}
          onChange={handleBulkUpload}
          accept='image/*'
          multiple
          className='hidden'
        />
      </div>

      <div className='w-full grid grid-cols-3 gap-7'>
        {uploadedFiles.gallery.map((img) => (
          <div key={img.url} className='relative'>
            <img
              src={img.url}
              alt='Gallery'
              className='w-full h-32 object-cover rounded shadow'
            />
            <button
              type='button'
              onClick={() => removeImage(img.url)}
              className='absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded'
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default GallerySection
