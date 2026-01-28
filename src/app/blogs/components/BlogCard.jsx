import React from 'react'
import { FaEye, FaRegHeart } from 'react-icons/fa'
import { Share } from 'lucide-react'
import { toast, ToastContainer } from 'react-toastify'

const BlogCard = ({ image, date, title, description, slug }) => {
  const handleShareClick = () => {
    const blogUrl = `${window.location.origin}/blogs/${slug}`
    navigator.clipboard.writeText(blogUrl).then(() => {
      toast.success('Blog URL copied to clipboard!')
    })
  }
  return (
    <div className='group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 ease-in-out border border-gray-100 overflow-hidden h-full flex flex-col'>
      <div className='h-[200px] relative overflow-hidden'>
        <img
          src={image}
          alt={`${title} thumbnail`}
          className='w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500'
        />
        <div className='absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-300' />
      </div>

      {/* Content Section */}
      <div className='p-5 flex flex-col flex-grow'>
        <div className='flex justify-between items-center mb-3'>
          <span className='bg-blue-50 text-[#0A70A7] text-xs font-semibold px-2.5 py-1 rounded-full'>
            Blog
          </span>
          <span className='text-gray-400 text-xs font-medium'>{date}</span>
        </div>

        {/* Title */}
        <h2 className='text-lg font-bold text-gray-800 mb-3 leading-tight line-clamp-2 group-hover:text-[#0A70A7] transition-colors'>
          {title}
        </h2>

        {/* Description */}
        <p className='text-gray-600 text-sm mb-4 line-clamp-3 flex-grow'>
          {description}
        </p>

        <div className='pt-4 mt-auto border-t border-gray-100 flex items-center justify-between text-gray-500'>
          <button
            onClick={handleShareClick}
            className='flex items-center gap-2 text-xs font-medium hover:text-[#0A70A7] transition-colors'
          >
            <Share size={16} />
            <span>Share</span>
          </button>
          <button className='hover:text-red-500 transition-colors'>
            <FaRegHeart size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default BlogCard
