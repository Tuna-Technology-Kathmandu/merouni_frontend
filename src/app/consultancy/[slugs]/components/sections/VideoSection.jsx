import React from 'react'
import { Video } from 'lucide-react'

const VideoSection = ({ consultancy }) => {
  const videoUrl = consultancy?.video_url || ''

  if (!videoUrl) {
    return null
  }

  // Convert YouTube URL to embed format
  const getEmbedUrl = () => {
    if (videoUrl.includes('youtube.com/watch?v=')) {
      const videoId = videoUrl.split('v=')[1]?.split('&')[0]
      return `https://www.youtube.com/embed/${videoId}`
    } else if (videoUrl.includes('youtu.be/')) {
      const videoId = videoUrl.split('youtu.be/')[1]?.split('?')[0]
      return `https://www.youtube.com/embed/${videoId}`
    } else if (videoUrl.includes('youtube.com/embed/')) {
      return videoUrl
    }
    return videoUrl
  }

  const embedUrl = getEmbedUrl()

  return (
    <div>
      <h2 className='text-sm md:text-lg lg:text-xl font-bold flex items-center gap-2 mb-4'>
        <Video className='text-[#30AD8F]' size={20} /> Video
      </h2>
      <div className='w-full aspect-video rounded-lg overflow-hidden mt-9 max-[1120px]:mt-5'>
        <iframe
          src={embedUrl}
          className='w-full h-full'
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
          allowFullScreen
          title='Consultancy Video'
        />
      </div>
    </div>
  )
}

export default VideoSection
