const AffiliationSection = () => {
  return (
    <div className='bg-white rounded-xl p-4 border border-gray-200 shadow-lg'>
      <div className='flex justify-between items-center mb-3'>
        <h3 className='text-gray-800 font-medium'>Affiliation (130)</h3>
        <svg
          className='w-4 h-4'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
        >
          <path d='M19 9l-7 7-7-7' />
        </svg>
      </div>
      <div className='relative'>
        <select className='w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none appearance-none'>
          <option>All</option>
        </select>
      </div>
    </div>
  )
}
export default AffiliationSection
