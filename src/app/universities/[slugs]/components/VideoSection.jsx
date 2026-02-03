import React from 'react'

const VideoSection = ({ university }) => {
  const videoUrl = university?.assets?.videos

  if (!videoUrl) return null

  // Convert YouTube URL to embed URL
  const getEmbedUrl = (url) => {
    try {
      const urlObj = new URL(url)
      let videoId = ''
      let playlistId = urlObj.searchParams.get('list') || ''

      if (urlObj.hostname.includes('youtu.be')) {
        videoId = urlObj.pathname.slice(1)
      } else if (urlObj.hostname.includes('youtube.com')) {
        videoId = urlObj.searchParams.get('v')
      }

      if (!videoId) return null

      return `https://www.youtube.com/embed/${videoId}${playlistId ? `?list=${playlistId}` : ''}`
    } catch (error) {
      console.error('Invalid YouTube URL', error)
      return null
    }
  }

  const embedUrl = getEmbedUrl(videoUrl)
  if (!embedUrl) return null

  return (
    <div className="w-full mb-14 max-md:mb-7 px-[75px] max-md:px-[30px] flex justify-center">
      <div className="w-[70%] max-md:w-full rounded overflow-hidden aspect-video">
        <iframe
          src={embedUrl}
          title={`YouTube video of ${university?.fullname}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    </div>
  )
}

export default VideoSection
