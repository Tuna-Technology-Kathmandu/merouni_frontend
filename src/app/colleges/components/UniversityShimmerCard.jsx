import { Skeleton } from '@/components/ui/Skeleton'

const UniversityCardShimmer = () => {
  return (
    <div className='bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm w-full'>
      {/* Image Section */}
      <Skeleton className='h-32 w-full rounded-none' />

      {/* Content Section */}
      <div className='p-5'>
        <Skeleton className='h-6 w-4/5 mb-3' />
        <Skeleton className='h-4 w-3/5 mb-6' />

        <div className='flex gap-4'>
          <Skeleton className='h-10 flex-1 rounded-xl' />
          <Skeleton className='h-10 flex-1 rounded-xl' />
        </div>
      </div>
    </div>
  )
}

export default UniversityCardShimmer
