import { useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { Plus, Trash2, Video, Play, ExternalLink, Link as LinkIcon, AlertCircle } from 'lucide-react'
import { Input } from '@/ui/shadcn/input'
import { Button } from '@/ui/shadcn/button'
import { cn } from '@/app/lib/utils'

const VideoSection = ({
  control,
  setValue,
  uploadedFiles,
  setUploadedFiles,
  getValues
}) => {
  const [youtubeLink, setYoutubeLink] = useState('')
  const [isValidLink, setIsValidLink] = useState(true)
  const [isHovered, setIsHovered] = useState(null)

  const extractYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
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
    const thumbnailUrl = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`

    const newVideo = {
      url: embedUrl,
      file_type: 'video',
      thumbnail: thumbnailUrl,
      youtubeId: youtubeId
    }

    // Check if video already exists
    const currentVideos = uploadedFiles.videos || []
    if (currentVideos.some(v => v.youtubeId === youtubeId)) {
      toast.warning('This video is already in the gallery')
      return
    }

    // Update uploaded files
    setUploadedFiles((prev) => ({
      ...prev,
      videos: [...(prev.videos || []), newVideo]
    }))

    // Update react-hook-form values
    const currentImages = getValues('images') || []
    setValue('images', [...currentImages, newVideo], { shouldDirty: true })

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
      currentImages.filter((img) => img.url !== videoUrl),
      { shouldDirty: true }
    )
  }

  const showVideos = uploadedFiles.videos || []

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-4'>
        <div className='flex gap-3'>
          <div className='relative flex-1'>
            <Input
              type='text'
              value={youtubeLink}
              onChange={(e) => {
                setYoutubeLink(e.target.value)
                setIsValidLink(true)
              }}
              placeholder='Paste YouTube URL here...'
              className={cn(
                "pl-10 h-12 rounded-xl transition-all",
                !isValidLink && "border-red-500 bg-red-50/50 focus-visible:ring-red-200"
              )}
            />
            <Video className={cn(
              "absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors",
              !isValidLink ? "text-red-400" : "text-gray-400"
            )} />
          </div>
          <Button
            type='button'
            onClick={handleAddYoutubeLink}
            className='h-12 px-6 rounded-xl bg-[#387cae] hover:bg-[#387cae]/90 text-white font-bold gap-2 shadow-lg shadow-[#387cae]/10 transition-all active:scale-95'
          >
            <Plus size={18} />
            <span>Add Video</span>
          </Button>
        </div>
        {!isValidLink && (
          <p className='text-xs text-red-500 flex items-center gap-1 font-medium px-1'>
            <AlertCircle size={12} />
            Please enter a valid YouTube video link
          </p>
        )}
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {showVideos.map((video, index) => (
          <div
            key={video.youtubeId || index}
            className='group relative flex flex-col gap-3'
            onMouseEnter={() => setIsHovered(index)}
            onMouseLeave={() => setIsHovered(null)}
          >
            <div className='relative aspect-video rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 shadow-sm transition-all duration-300 group-hover:shadow-xl group-hover:shadow-[#387cae]/10 group-hover:-translate-y-1'>
              <img
                src={video.thumbnail || `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                alt={`YouTube Thumbnail ${index}`}
                className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = 'https://via.placeholder.com/480x360?text=Video+Not+Found'
                }}
              />

              {/* Overlay */}
              <div className='absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center'>
                <div className='w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white transform transition-all duration-300 group-hover:scale-110 group-hover:bg-[#387cae] group-hover:border-[#387cae]'>
                  <Play size={20} fill="currentColor" />
                </div>
              </div>

              {/* External Link Tag */}
              <a
                href={video.url.replace('embed/', 'watch?v=')}
                target='_blank'
                rel='noopener noreferrer'
                className='absolute top-3 right-3 w-8 h-8 rounded-lg bg-black/50 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#387cae]'
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink size={14} />
              </a>
            </div>

            <button
              type='button'
              onClick={() => removeVideo(video.url)}
              className='flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-red-100 bg-red-50/30 text-red-500 text-xs font-bold hover:bg-red-500 hover:text-white transition-all duration-200 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0'
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}

        {showVideos.length === 0 && (
          <div className='col-span-full py-20 border-2 border-dashed border-gray-100 rounded-3xl flex flex-col items-center justify-center gap-4 bg-gray-50/50'>
            <div className='w-16 h-16 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-400'>
              <Video size={28} />
            </div>
            <div className='text-center'>
              <h4 className='text-sm font-bold text-gray-900'>No videos added yet</h4>
              <p className='text-xs text-gray-500 mt-1 max-w-[200px]'>Add YouTube links to showcase college life and facilities</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default VideoSection
