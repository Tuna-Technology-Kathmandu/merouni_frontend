'use client'

import Image from 'next/image'
import Link from 'next/link'
import { MapPin } from 'lucide-react'

const ConsultancyCard = ({ consultancy }) => {
  const slug = consultancy?.slugs
  const destinations = (() => {
    try {
      return typeof consultancy.destination === 'string'
        ? JSON.parse(consultancy.destination || '[]')
        : consultancy.destination || []
    } catch {
      return []
    }
  })()
  const address = (() => {
    try {
      return typeof consultancy.address === 'string'
        ? JSON.parse(consultancy.address || '{}')
        : consultancy.address || {}
    } catch {
      return {}
    }
  })()
  const locationText = [address.street, address.city].filter(Boolean).join(', ')
  const description = consultancy?.description?.replace(/<[^>]*>/g, '') || ''
  const logo = consultancy?.logo
  const image = consultancy?.featured_image || ''
  const isPinned = consultancy?.pinned === 1

  return (
    <Link
      href={slug ? `/consultancy/${slug}` : '#'}
      className='group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A6FA7] focus-visible:ring-offset-2 rounded-xl'
    >
      <article className='bg-white rounded-xl border border-gray-200/80 overflow-hidden h-full flex flex-col hover:border-gray-300 hover:shadow-md transition-all duration-200'>
        {/* Image — fixed 16:9 aspect ratio so image never stretches */}
        <div className='relative w-full aspect-[16/9] bg-gray-100 overflow-hidden'>
          <Image
            src={image || 'https://placehold.co/600x400?text=Consultancy'}
            alt={consultancy?.title || 'Consultancy'}
            fill
            className='object-cover group-hover:scale-[1.02] transition-transform duration-300'
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          />
          {isPinned && (
            <span className='absolute top-3 right-3 px-2.5 py-1 rounded-md bg-white/95 text-xs font-semibold text-[#0A6FA7] shadow-sm'>
              Featured
            </span>
          )}
        </div>

        {/* Content */}
        <div className='p-5 flex flex-col flex-1 min-w-0'>
          <div className='flex items-start gap-3 mb-3'>
            {logo && (
              <div className='relative w-10 h-10 flex-shrink-0 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden'>
                <Image src={logo} alt='' fill className='object-contain p-1' />
              </div>
            )}
            <h2 className='text-base font-semibold text-gray-900 line-clamp-2 leading-snug group-hover:text-[#0A6FA7] transition-colors flex-1 min-w-0'>
              {consultancy?.title || 'Consultancy'}
            </h2>
          </div>

          {description && (
            <p className='text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed'>
              {description}
            </p>
          )}

          <div className='mt-auto space-y-3 pt-4 border-t border-gray-100'>
            {destinations.length > 0 && (
              <div className='flex flex-wrap gap-1.5'>
                {destinations.slice(0, 3).map((d, i) => (
                  <span
                    key={i}
                    className='inline-flex px-2 py-0.5 rounded-md bg-gray-50 text-xs font-medium text-gray-600'
                  >
                    {d.country}
                  </span>
                ))}
                {destinations.length > 3 && (
                  <span className='text-xs text-gray-400'>
                    +{destinations.length - 3}
                  </span>
                )}
              </div>
            )}
            {locationText && (
              <div className='flex items-center gap-1.5 text-sm text-gray-600 min-w-0'>
                <MapPin className='w-4 h-4 flex-shrink-0 text-[#0A6FA7]' />
                <span className='truncate'>{locationText}</span>
              </div>
            )}
          </div>
        </div>
      </article>
    </Link>
  )
}

export default ConsultancyCard
