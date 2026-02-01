'use client'

import React from 'react'
import { Video } from 'lucide-react'

const VideoSection = ({ consultancy }) => {
  const videoUrl = consultancy?.video_url || ''

  if (!videoUrl) {
    return null
  }

  const getEmbedUrl = () => {
    if (videoUrl.includes('youtube.com/watch?v=')) {
      const videoId = videoUrl.split('v=')[1]?.split('&')[0]
      return `https://www.youtube.com/embed/${videoId}`
    }
    if (videoUrl.includes('youtu.be/')) {
      const videoId = videoUrl.split('youtu.be/')[1]?.split('?')[0]
      return `https://www.youtube.com/embed/${videoId}`
    }
    if (videoUrl.includes('youtube.com/embed/')) {
      return videoUrl
    }
    return videoUrl
  }

  const embedUrl = getEmbedUrl()

  return (
    <div className='max-w-4xl'>
      <h2 className='text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2'>
        <Video className='w-5 h-5 text-[#30AD8F]' />
        Video
      </h2>
      <div className='w-full aspect-video rounded-2xl overflow-hidden border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)]'>
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
