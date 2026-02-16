'use client'

const UniversityShimmer = () => {
  return (
    <div className='bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm h-full animate-pulse'>
      <div className='aspect-[16/10] bg-gray-200' />
      <div className='p-6 flex flex-col gap-4'>
        <div className='h-6 bg-gray-200 rounded w-3/4' />
        <div className='h-4 bg-gray-200 rounded w-1/2' />
        <div className='mt-4 pt-4 border-t border-gray-100 flex gap-3'>
          <div className='h-8 bg-gray-200 rounded flex-1' />
          <div className='h-8 bg-gray-200 rounded flex-1' />
        </div>
      </div>
    </div>
  )
}

export default UniversityShimmer
