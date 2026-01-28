import { Skeleton } from '@/components/ui/Skeleton'

const FCollegeShimmer = ({ count = 4 }) => {
  return (
    <div className='flex gap-6 overflow-x-hidden p-2'>
      {[...Array(count)].map((_, index) => (
        <div
          key={index}
          className='flex flex-col bg-white border border-gray-100 rounded-xl shadow-sm w-80 flex-shrink-0 p-5'
        >
          <Skeleton className='w-full h-32 rounded-xl mb-4' />
          <Skeleton className='w-3/4 h-6 mb-3' />
          <Skeleton className='w-1/2 h-4 mb-6' />
          <Skeleton className='w-2/3 h-10 rounded-lg mt-auto' />
        </div>
      ))}
    </div>
  )
}

export default FCollegeShimmer
