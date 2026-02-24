import React from 'react'

const getEmbedUrl = (url) => {
  if (!url) return null
  if (url.includes('youtube.com/embed/')) return url

  let videoId = ''
  if (url.includes('youtube.com/watch?v=')) {
    videoId = url.split('v=')[1]?.split('&')[0]
  } else if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1]?.split('?')[0]
  }

  return videoId ? `https://www.youtube.com/embed/${videoId}` : null
}

const VideoSection = ({ university }) => {
  const videos = university?.videos

  if (!videos || !Array.isArray(videos) || videos.length === 0) return null

  return (
    <section className='w-full mb-14 max-md:mb-7'>
      <div className='relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#30AD8F]/5 to-white border border-[#30AD8F]/10 p-10 max-md:p-6 px-[75px] max-md:px-[30px]'>
        <div className='flex items-center justify-between mb-8'>
          <h2 className='font-bold text-lg md:text-xl text-gray-900'>
            Campus Videos
          </h2>

          {videos.length > 1 && (
            <span className='text-sm font-medium bg-[#30AD8F]/20 text-[#30AD8F] px-4 py-1.5 rounded-full'>
              {videos.length} Videos
            </span>
          )}
        </div>

        <div className={`grid gap-6 ${videos.length === 1
            ? 'grid-cols-1 max-w-3xl'
            : 'grid-cols-1 md:grid-cols-2'
          }`}>
          {videos.map((videoUrl, index) => {
            const embedUrl = getEmbedUrl(videoUrl)
            if (!embedUrl) return null

            return (
              <div
                key={index}
                className='group relative w-full rounded-2xl overflow-hidden aspect-video shadow-sm hover:shadow-xl transition-all duration-300 border border-white bg-black'
              >
                <iframe
                  src={embedUrl}
                  title={`YouTube video ${index + 1} of ${university?.fullname}`}
                  allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                  allowFullScreen
                  className='w-full h-full opacity-90 group-hover:opacity-100 transition-opacity'
                />
                <div className='absolute inset-0 pointer-events-none border-2 border-transparent group-hover:border-[#30AD8F]/20 rounded-2xl transition-all duration-300' />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default VideoSection