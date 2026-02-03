import { useRef, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

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
          `${process.env.baseUrl}/media/upload`,
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

      // Update only images array
      setUploadedFiles((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }))

      // Update react-hook-form values by combining images and videos
      const currentImages = getValues('images') || []
      const currentVideos = getValues('videos') || []
      setValue('images', [...currentImages, ...newImages])
      // If you need to maintain a combined array in form state:
      // setValue('media', [...currentImages, ...currentVideos, ...newImages]);

      toast.success(`Uploaded ${newImages.length} images successfully!`)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  const removeImage = (imageUrl) => {
    // Remove from images array
    setUploadedFiles((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img.url !== imageUrl)
    }))

    // Update form values
    const currentImages = getValues('images') || []
    setValue(
      'images',
      currentImages.filter((img) => img.url !== imageUrl)
    )

    // If you're maintaining a combined media array:
    // const currentMedia = getValues('media') || [];
    // setValue('media', currentMedia.filter(item => item.url !== imageUrl));
  }

  // Now we can directly use uploadedFiles.images instead of filtering
  const showGallery =
    uploadedFiles.images && uploadedFiles.images.length === 1
      ? uploadedFiles.images[0]?.url
        ? uploadedFiles.images
        : []
      : uploadedFiles.images
  return (
    <div className='mt-7'>
      <div className='flex justify-between items-center mb-4'>
        <label className='block text-xl font-semibold'>Images</label>
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
          disabled={isUploading}
        />
      </div>

      <div className='w-full grid grid-cols-3 gap-7'>
        {showGallery.map((image, index) => (
          <div key={image.url} className='mb-4 group relative'>
            <div className='border-2 border-dashed border-gray-300 rounded-lg p-4 h-48'>
              {image?.url ? (
                <img
                  src={image.url}
                  alt={`Uploaded ${index}`}
                  className='w-full h-full object-cover rounded'
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src =
                      'https://via.placeholder.com/300x200?text=Image+Not+Found'
                  }}
                />
              ) : (
                <div className='w-full h-full flex items-center justify-center bg-gray-100 rounded'>
                  <span className='text-gray-500'>No image available</span>
                </div>
              )}
            </div>
            <button
              type='button'
              onClick={() => removeImage(image.url)}
              className='mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full'
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {isUploading && (
        <div className='mt-4 p-4 bg-blue-50 rounded-lg'>
          <p>Uploading {fileInputRef.current?.files?.length} images...</p>
        </div>
      )}
    </div>
  )
}

export default GallerySection
