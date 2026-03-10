'use client'
import { MapPin } from 'lucide-react'

const GoogleMap = ({ mapUrl }) => {
  if (!mapUrl) return null

  const isIframe = mapUrl.trim().startsWith('<iframe')

  if (isIframe) {
    return (
      <div
        className='w-full rounded-md overflow-hidden [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0'
        style={{ height: '350px' }}
        dangerouslySetInnerHTML={{ __html: mapUrl }}
      />
    )
  }

  // Plain URL — show a "View on Map" hyperlink
  return (
    <a
      href={mapUrl}
      target='_blank'
      rel='noopener noreferrer'
      className='inline-flex items-center gap-2 px-4 py-2.5 bg-[#0A6FA7] hover:bg-[#085e8a] text-white text-sm font-medium rounded-md transition-all shadow-sm active:scale-95'
    >
      <MapPin className='w-4 h-4' />
      View on Map
    </a>
  )
}

export default GoogleMap

