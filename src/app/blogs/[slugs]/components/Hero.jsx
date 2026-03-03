import { formatDate } from '@/utils/date.util'
import React from 'react'

const Hero = ({ blog }) => {
  return (
    <div className='relative px-16 pt-14  max-sm:px-9 max-w-[1600px] mx-auto'>
      <div className='w-full'>
        <h1 className='font-bold text-[28px] max-md:text-[26px] leading-[44px] max-md:leading-[34px]  max-sm:text-[20px] max-sm:leading-[27px] '>
          {blog?.title}
        </h1>

        <div className='mt-2'>
          <p className='font-medium text-[12px] text-black/70'>
            <span>{formatDate(blog?.createdAt)}</span>
          </p>
        </div>
        {blog?.newsAuthor && (
          <div className='font-medium text-[12px] my-2 text-black/70'>
            By {blog?.newsAuthor?.firstName} {blog?.newsAuthor?.middleName || ''}{' '}
            {blog?.newsAuthor?.lastName}
          </div>
        )}

        {blog?.featured_image && (
          <div className='w-full my-12 max-1xl:my-8 max-md:my-5'>
            <img
              src={blog.featured_image}
              alt={blog?.title || 'Blog featured image'}
              className='w-full h-auto max-h-[456px] max-1xl:max-h-[380px] max-sm:max-h-[300px] object-contain rounded-md'
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default Hero
