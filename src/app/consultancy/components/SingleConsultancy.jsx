import React from 'react'
import { ExternalLink, MapPin, Phone, Globe, Map, Video } from 'lucide-react'
import Image from 'next/image'

const SingleConsultancy = ({ consultancy }) => {
  if (typeof window !== 'undefined') {
    window.scrollTo(0, 0)
  }

  // Handle both array and single object formats
  let data = Array.isArray(consultancy) ? consultancy[0] : consultancy

  if (!data || (!data.id && !data.title)) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='text-center p-8'>
          <p className='text-gray-600 text-lg mb-4'>
            No consultancy data available
          </p>
          <p className='text-gray-400 text-sm'>
            Received data: {JSON.stringify(data)}
          </p>
        </div>
      </div>
    )
  }

  const description = data?.description || ''
  const logo = data?.logo || ''
  const websiteUrl = data?.website_url || ''
  const googleMapUrl = data?.google_map_url || ''
  const videoUrl = data?.video_url || ''

  // Parse JSON fields
  const parseJsonField = (field) => {
    if (!field) return null
    if (typeof field === 'string') {
      try {
        return JSON.parse(field)
      } catch (e) {
        return field
      }
    }
    return field
  }

  const destinations = parseJsonField(data?.destination) || []
  const address = parseJsonField(data?.address) || {}
  const contacts = data?.contact
    ? typeof data.contact === 'string'
      ? (() => {
          try {
            return JSON.parse(data.contact)
          } catch {
            return []
          }
        })()
      : Array.isArray(data.contact)
        ? data.contact
        : []
    : []

  return (
    <div className='flex flex-col items-center w-full min-h-screen bg-gray-50 py-8'>
      <div className='w-full'>
        <div className='h-[25vh] w-full md:h-[400px] relative bg-gray-200'>
          {data?.featured_image ? (
            <img
              src={data.featured_image}
              alt={data?.title || 'Consultancy Image'}
              className='object-cover w-full h-full'
              onError={(e) => {
                console.error('Image failed to load:', e)
                e.target.style.display = 'none'
              }}
            />
          ) : (
            <div className='w-full h-full bg-gray-300 flex items-center justify-center'>
              <p className='text-gray-600'>No image available</p>
            </div>
          )}
          <div className='absolute w-full h-full inset-0 bg-black/25 z-10'></div>
        </div>

        <div className='flex flex-row bg-[#30AD8F] bg-opacity-5 h-[110px] mb-10 items-center px-[75px] max-md:px-[30px] gap-4'>
          {logo ? (
            <div className='relative w-20 h-20 flex-shrink-0'>
              <Image
                src={logo}
                alt={`${data?.title || 'Consultancy'} Logo`}
                fill
                className='object-contain'
                onError={(e) => {
                  console.error('Logo failed to load')
                  e.target.style.display = 'none'
                }}
              />
            </div>
          ) : null}
          <div className='flex-1'>
            <h2 className='font-bold text-lg sm:text-2xl md:leading-10 text-gray-800'>
              {data?.title || 'Untitled Consultancy'}
            </h2>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className='w-full max-w-5xl px-6 pb-10'>
        {/* Description */}
        <div className='bg-white rounded-xl custom-shadow p-6 mb-8'>
          <h2 className='text-lg font-semibold mb-3'>About</h2>
          {description ? (
            <div
              className='text-gray-700 leading-relaxed prose max-w-none'
              dangerouslySetInnerHTML={{ __html: description }}
            />
          ) : (
            <p className='text-gray-500 italic'>No description available.</p>
          )}
        </div>

        {/* Website URL */}
        <div className='bg-white rounded-xl custom-shadow p-6 mb-8'>
          <h2 className='text-lg font-semibold flex items-center gap-2 mb-3'>
            <ExternalLink className='text-[#30AD8F]' size={20} /> Website
          </h2>
          {websiteUrl ? (
            <a
              href={websiteUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-2'
            >
              {websiteUrl}
              <ExternalLink className='text-[#30AD8F]' size={16} />
            </a>
          ) : (
            <p className='text-gray-500 italic'>No website available.</p>
          )}
        </div>

        {/* Google Map */}
        {googleMapUrl && (
          <div className='bg-white rounded-xl custom-shadow p-6 mb-8'>
            <h2 className='text-lg font-semibold flex items-center gap-2 mb-3'>
              <Map className='text-[#30AD8F]' size={20} /> Location
            </h2>
            <div className='w-full h-96 rounded-lg overflow-hidden'>
              <div
                className='w-full h-full [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0'
                dangerouslySetInnerHTML={{ __html: googleMapUrl }}
              />
            </div>
          </div>
        )}

        {/* YouTube Video */}
        {videoUrl && (
          <div className='bg-white rounded-xl custom-shadow p-6 mb-8'>
            <h2 className='text-lg font-semibold flex items-center gap-2 mb-3'>
              <Video className='text-[#30AD8F]' size={20} /> Video
            </h2>
            <div className='w-full aspect-video rounded-lg overflow-hidden'>
              {(() => {
                // Convert YouTube URL to embed format
                let embedUrl = ''
                if (videoUrl.includes('youtube.com/watch?v=')) {
                  const videoId = videoUrl.split('v=')[1]?.split('&')[0]
                  embedUrl = `https://www.youtube.com/embed/${videoId}`
                } else if (videoUrl.includes('youtu.be/')) {
                  const videoId = videoUrl.split('youtu.be/')[1]?.split('?')[0]
                  embedUrl = `https://www.youtube.com/embed/${videoId}`
                } else if (videoUrl.includes('youtube.com/embed/')) {
                  embedUrl = videoUrl
                } else {
                  // If it's already an embed URL or unknown format, use as-is
                  embedUrl = videoUrl
                }

                return (
                  <iframe
                    src={embedUrl}
                    className='w-full h-full'
                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                    allowFullScreen
                    title='Consultancy Video'
                  />
                )
              })()}
            </div>
          </div>
        )}

        {/* Contact Information */}
        {contacts.length > 0 && contacts.some((c) => c) && (
          <div className='bg-white rounded-xl custom-shadow p-6 mb-8'>
            <h2 className='text-lg font-semibold flex items-center gap-2 mb-3'>
              <Phone className='text-[#30AD8F]' size={20} /> Contact Information
            </h2>
            <div className='space-y-2'>
              {contacts.map(
                (contact, i) =>
                  contact && (
                    <p
                      key={i}
                      className='text-gray-700 flex items-center gap-2'
                    >
                      <Phone className='text-[#30AD8F]' size={16} />
                      {contact}
                    </p>
                  )
              )}
            </div>
          </div>
        )}

        {/* Address */}
        {(address?.street ||
          address?.city ||
          address?.state ||
          address?.zip) && (
          <div className='bg-white rounded-xl custom-shadow p-6 mb-8'>
            <h2 className='text-lg font-semibold flex items-center gap-2 mb-3'>
              <MapPin className='text-[#30AD8F]' size={20} /> Address
            </h2>
            <p className='text-gray-700'>
              {[address.street, address.city, address.state, address.zip]
                .filter(Boolean)
                .join(', ')}
            </p>
          </div>
        )}

        {/* Destinations */}
        {destinations.length > 0 && (
          <div className='bg-white rounded-xl custom-shadow p-6 mb-8'>
            <h2 className='text-lg font-semibold flex items-center gap-2 mb-3'>
              <Globe className='text-[#30AD8F]' size={20} /> Destinations
            </h2>
            <ul className='list-disc list-inside text-gray-700'>
              {destinations.map((d, i) => (
                <li key={i}>
                  {d.city}, {d.country}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default SingleConsultancy
