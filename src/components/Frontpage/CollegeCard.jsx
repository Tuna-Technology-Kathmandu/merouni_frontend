const CollegeCard = ({ logo, name, address, gradient, featuredImg }) => {
  return (
    <div
      className='min-w-[260px] md:min-w-[320px] lg:min-w-[360px] h-[320px] md:h-[360px] lg:h-[380px] mx-4 rounded-3xl p-[1px] transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl overflow-hidden'
      style={{
        background: gradient
      }}
    >
      <div className='h-full w-full rounded-3xl bg-white/95 backdrop-blur-sm flex flex-col overflow-hidden'>
        {/* Featured Image - Full width, half height */}
        <div className='w-full h-1/2 flex-shrink-0 overflow-hidden'>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={featuredImg || logo}
            alt={`${name} featured image`}
            className='w-full h-full object-cover'
          />
        </div>

        {/* Content Section - Half height */}
        <div className='h-1/2 flex flex-col items-center px-5 py-4 gap-3 flex-shrink-0'>
          {/* Name & address */}
          <div className='text-center space-y-2 flex-1 flex flex-col justify-center min-h-0 w-full'>
            <h3 className='text-lg md:text-xl font-semibold text-gray-900 line-clamp-2 min-h-[3.5rem]'>
              {name}
            </h3>
            <p className='text-sm text-gray-500 flex items-center justify-center gap-1'>
              <span className='inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0'></span>
              <span className='line-clamp-1'>{address}</span>
            </p>
          </div>

          {/* CTA */}
          <div className='w-full flex justify-center flex-shrink-0'>
            <span className='inline-flex items-center gap-2 text-xs font-medium text-blue-700 bg-blue-50 rounded-full px-3 py-1'>
              View details
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-3 w-3'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path d='M10.293 3.293a1 1 0 011.414 0l5 5a.997.997 0 01.083.094l.007.01a1.003 1.003 0 01-.09 1.32l-5 5a1 1 0 01-1.414-1.414L13.586 11H4a1 1 0 110-2h9.586l-3.293-3.293a1 1 0 010-1.414z' />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CollegeCard
