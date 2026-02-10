'use client'

import React from 'react'
import EventCard from '@/components/Frontpage/EventCard'
import Pagination from '../../blogs/components/Pagination'
import { GridSkeleton } from '@/ui/shadcn/GridSkeleton'
import EventCardSkeleton from '@/ui/shadcn/EventCardSkeleton'
import Link from 'next/link'
import { Calendar } from 'lucide-react'
import EmptyState from '@/ui/shadcn/EmptyState'

const FeaturedEvents = ({ events, featuredEvents = [], loading, pagination, onPageChange, searchQuery }) => {
  
  // Filter out featured events from the main events list to avoid duplication
  const regularEvents = events?.filter(event => 
    !featuredEvents.some(fe => fe.id === event.id)
  ) || []

  // Helper to render a grid of events
  const renderEventGrid = (title, eventList) => (
    <div className="mb-12">
      <div className='flex items-center gap-2 mb-6 border-l-4 border-[#0A70A7] pl-4'>
        <h2 className='text-2xl font-bold text-gray-800'>{title}</h2>
        <span className='px-2 py-0.5 rounded-full bg-blue-50 text-[#0A70A7] text-xs font-semibold'>
          {eventList.length}
        </span>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full'>
        {eventList.map((event, index) => (
          <Link href={`/events/${event.slugs}`} key={index} className='h-full'>
            <div className='h-full transition-all duration-300 hover:scale-[1.02]'>
              <EventCard event={event} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )

  return (
    <div className='max-w-[1600px] mx-auto px-4 sm:px-8 mb-8'>
      {loading ? (
        <div className='py-8'>
          <GridSkeleton count={8} className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            <EventCardSkeleton />
          </GridSkeleton>
        </div>
      ) : events && events.length > 0 ? (
        <>
          {/* Featured Section - This Week Events */}
          {!searchQuery && featuredEvents.length > 0 && renderEventGrid("This Week's Events", featuredEvents)}
          
          {/* Regular Section */}
          {regularEvents.length > 0 && renderEventGrid(searchQuery ? "Search Results" : "Latest Events", regularEvents)}
        </>
      ) : (
        <EmptyState
          icon={Calendar}
          title='No Events Found'
          description={searchQuery ? `No events match your search "${searchQuery}". Please try another keyword.` : "We couldn't find any events scheduled. Please check back later."}
          className='mb-12'
          action={searchQuery ? {
            label: 'Clear Search',
            onClick: () => onPageChange(1, '') // This will be handled in the parent
          } : null}
        />
      )}

      {pagination && pagination.totalCount > 0 && (
        <div className='flex justify-center mt-12'>
          <Pagination pagination={pagination} onPageChange={onPageChange} />
        </div>
      )}
    </div>
  )
}

export default FeaturedEvents
