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
    <div className=' my-2 bg-white rounded-2xl shadow-md border border-gray-300 hover:-translate-y-2 transition-all duration-300 ease-in-out '>
      <div className='h-[170px] relative'>
        <img
          src={image}
          alt={`${title} logo`}
          className='w-full h-full object-cover rounded-t-2xl'
        />
      </div>

      {/* Content Section */}
      <div className='p-4'>
        {/* Date */}
        <p className='text-gray-600 mb-1 text-[13px]'>{date}</p>

        {/* Title */}
        <h2 className='text-lg font-bold text-gray-900 mb-2'>{title}</h2>

        {/* Description */}
        <div
          className='text-gray-600 text-[13px] mb-4'
          style={{ minHeight: '60px' }} // Ensures consistent height
        >
          {description}
        </div>

        <div className='border mb-1'></div>

        <div className='flex items-center text-gray-500 justify-between'>
          <button onClick={handleShareClick} className='flex flex-row gap-1'>
            <Share size={20} />
          </button>
          <div>
            <FaRegHeart size={20} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogCard
