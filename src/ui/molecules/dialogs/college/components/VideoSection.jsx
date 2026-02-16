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
  const [youtubeLink, setYoutubeLink] = useState('')
  const [isValidLink, setIsValidLink] = useState(true)
  const inputRef = useRef(null)

  const extractYouTubeId = (url) => {
    // Regular expressions for different YouTube URL formats
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  const validateYouTubeUrl = (url) => {
    if (!url) return false
    const youtubeId = extractYouTubeId(url)
    return !!youtubeId
  }

  const handleAddYoutubeLink = () => {
    if (!youtubeLink.trim()) {
      toast.error('Please enter a YouTube URL')
      return
    }

    if (!validateYouTubeUrl(youtubeLink)) {
      setIsValidLink(false)
      toast.error('Please enter a valid YouTube URL')
      return
    }

    setIsValidLink(true)
    const youtubeId = extractYouTubeId(youtubeLink)
    const embedUrl = `https://www.youtube.com/embed/${youtubeId}`
    const thumbnailUrl = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`

    const newVideo = {
      url: embedUrl,
      file_type: 'video',
      thumbnail: thumbnailUrl,
      youtubeId: youtubeId
    }

    // Update uploaded files
    setUploadedFiles((prev) => ({
      ...prev,
      videos: [...prev.videos, newVideo]
    }))

    // Update react-hook-form values
    const currentImages = getValues('images') || []
    setValue('images', [...currentImages, newVideo])

    toast.success('YouTube video added successfully!')
    setYoutubeLink('')
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
      </div>

      <div className='mb-6 flex gap-2'>
        <input
          type='text'
          ref={inputRef}
          value={youtubeLink}
          onChange={(e) => setYoutubeLink(e.target.value)}
          placeholder='Enter YouTube URL (e.g., https://www.youtube.com/watch?v=...)'
          className={`flex-1 p-2 border rounded ${!isValidLink ? 'border-red-500' : 'border-gray-300'}`}
        />
        <button
          type='button'
          onClick={handleAddYoutubeLink}
          className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600'
        >
          Add Video
        </button>
      </div>

      <div className='w-full grid grid-cols-3 gap-7'>
        {showVideos.map((video, index) => (
          <div key={index} className='mb-4 group relative'>
            <div className='border-2 border-dashed border-gray-300 rounded-lg p-4 h-48'>
              {video?.url ? (
                <div className='relative w-full h-full'>
                  <iframe
                    src={video.url}
                    title={`YouTube video ${index}`}
                    frameBorder='0'
                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                    allowFullScreen
                    className='w-full h-full rounded'
                  ></iframe>
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
    </div>
  )
}

export default VideoSection
