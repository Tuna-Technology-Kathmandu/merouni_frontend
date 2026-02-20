'use client'

const SchoolGoogleMap = ({ mapUrl }) => {
  if (!mapUrl) return null

  // Check if mapUrl is an iframe string (starts with <iframe)
  const isIframe = mapUrl.trim().startsWith('<iframe')

  if (isIframe) {
    return (
      <div
        className='w-full h-full [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0 rounded-lg'
        dangerouslySetInnerHTML={{ __html: mapUrl }}
      />
    )
  }

  return (
    <div className='w-full h-full rounded-lg overflow-hidden'>
      <iframe
        src={mapUrl}
        className='w-full h-full border-0'
        allowFullScreen
        loading='lazy'
        referrerPolicy='no-referrer-when-downgrade'
      />
    </div>
  )
}

export default SchoolGoogleMap;