export const ShimmerCard = () => {
  return (
    <div className='bg-white rounded-xl p-6 border border-gray-200 shadow-lg animate-pulse'>
      {/* Top row: logo + wishlist */}
      <div className='flex justify-between items-start mb-4'>
        {/* Logo placeholder */}
        <div className='w-12 h-12 bg-gray-200 rounded-md' />
        {/* Wishlist button placeholder */}
        <div className='w-8 h-8 bg-gray-200 rounded-full' />
      </div>

      {/* Title placeholder */}
      <div className='h-4 bg-gray-200 rounded w-3/4 mb-2' />

      {/* Description placeholder */}
      <div className='h-3 bg-gray-200 rounded w-full mb-2' />
      <div className='h-3 bg-gray-200 rounded w-5/6 mb-4' />

      {/* Buttons */}
      <div className='flex gap-3'>
        <div className='flex-1 h-9 bg-gray-200 rounded-2xl' />
        <div className='flex-1 h-9 bg-gray-200 rounded-2xl' />
      </div>
    </div>
  )
}
