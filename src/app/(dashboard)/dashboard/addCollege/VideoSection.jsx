import { useRef, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const VideoSection = ({
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

    // Filter only video files
    const videoFiles = files.filter((file) => file.type.includes('video'))
    if (videoFiles.length === 0) {
      toast.error('Please select video files only')
      return
    }

    setIsUploading(true)
    const newVideos = []

    try {
      for (const file of videoFiles) {
        const formData = new FormData()
        formData.append('title', file.name)
        formData.append('altText', file.name)
        formData.append('description', '')
        formData.append('file', file)
        formData.append('authorId', '1')

        const response = await axios.post(
          'https://uploads.merouni.com/api/v1/media/upload',
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        )

        if (response.data.success) {
          newVideos.push({
            url: response.data.media.url,
            file_type: 'video',
            thumbnail: response.data.media.thumbnail || null // Add thumbnail if available
          })
        }
      }

      // Update all uploaded files at once
      setUploadedFiles((prev) => ({
        ...prev,
        videos: [...prev.videos, ...newVideos]
      }))

      // Update react-hook-form values
      const currentImages = getValues('images') || []
      setValue('images', [...currentImages, ...newVideos])

      toast.success(`Uploaded ${newVideos.length} videos successfully!`)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed')
    } finally {
      setIsUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const removeVideo = (videoUrl) => {
    setUploadedFiles((prev) => ({
      ...prev,
      videos: prev.videos.filter((vid) => vid.url !== videoUrl)
    }))

    const currentImages = getValues('images') || []
    setValue(
      'images',
      currentImages.filter((img) => img.url !== videoUrl)
    )
  }

  const showVideos = uploadedFiles.videos
  return (
    <div className='mt-7'>
      <div className='flex justify-between items-center mb-4'>
        <label className='block text-xl font-semibold'>Videos</label>
        <button
          type='button'
          onClick={() => fileInputRef.current.click()}
          disabled={isUploading}
          className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-green-300'
        >
          {isUploading ? 'Uploading...' : 'Add Videos'}
        </button>
        <input
          type='file'
          ref={fileInputRef}
          onChange={handleBulkUpload}
          accept='video/*'
          multiple
          className='hidden'
          disabled={isUploading}
        />
      </div>

      <div className='w-full grid grid-cols-3 gap-7'>
        {showVideos.map((video, index) => (
          <div key={index} className='mb-4 group relative'>
            <div className='border-2 border-dashed border-gray-300 rounded-lg p-4 h-48'>
              {video?.url ? (
                <div className='relative w-full h-full'>
                  <video
                    controls
                    className='w-full h-full object-cover rounded'
                  >
                    <source
                      src={video.url}
                      type={`video/${video.url.split('.').pop()}`}
                    />
                    Your browser does not support the video tag.
                  </video>
                  {video.thumbnail && (
                    <div className='absolute inset-0 flex items-center justify-center'>
                      <img
                        src={video.thumbnail}
                        alt='Video thumbnail'
                        className='w-full h-full object-cover rounded'
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className='w-full h-full flex items-center justify-center bg-gray-100 rounded'>
                  <span className='text-gray-500'>No video available</span>
                </div>
              )}
            </div>
            <button
              type='button'
              onClick={() => removeVideo(video.url)}
              className='mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full'
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {isUploading && (
        <div className='mt-4 p-4 bg-blue-50 rounded-lg'>
          <p>Uploading {fileInputRef.current?.files?.length} videos...</p>
          <progress
            className='w-full mt-2'
            max='100'
            value={isUploading ? '50' : '0'}
          />
        </div>
      )}
    </div>
  )
}

export default VideoSection
