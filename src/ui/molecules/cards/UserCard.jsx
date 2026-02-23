import Link from 'next/link'
import { IoIosMore } from 'react-icons/io'
import { HiOutlineUsers } from 'react-icons/hi'
import { IoSchoolSharp } from 'react-icons/io5'
import { FaUserTie, FaFileAlt, FaUniversity, FaBuilding } from 'react-icons/fa'
import { BsCalendarEvent, BsNewspaper } from 'react-icons/bs'
import { VscReferences } from 'react-icons/vsc'

const UserCard = ({ type, value, loading }) => {
  const displayValue =
    loading || value === undefined || value === null ? '...' : value

  // Get route for each card type
  const getRoute = () => {
    switch (type?.toLowerCase()) {
      case 'users':
        return '/dashboard/users'
      case 'college':
        return '/dashboard/addCollege'
      case 'university':
        return '/dashboard/university'
      case 'consultancy':
        return '/dashboard/consultancy'
      case 'agents':
        return '/dashboard/agent'
      case 'events':
        return '/dashboard/events'
      case 'referrals':
        return '/dashboard/referrals'
      case 'blogs':
        return '/dashboard/blogs'
      case 'applications':
        return '/dashboard/applications'
      case 'wishlist':
        return '/dashboard/wishlist'
      case "referred students":
        return "/dashboard/referStudent"
      case "referred consultancies":
        return "/dashboard/referConsultancy"
      case "total applications":
        return "/dashboard/applications"
      default:
        return '/dashboard'
    }
  }

  // Get icon and color scheme based on type
  const getIconConfig = () => {
    switch (type?.toLowerCase()) {
      case 'users':
        return {
          icon: <HiOutlineUsers className='w-5 h-5' />,
          bgColor: 'bg-blue-50',
          iconColor: 'text-blue-600',
          borderColor: 'border-blue-100'
        }
      case 'college':
        return {
          icon: <IoSchoolSharp className='w-5 h-5' />,
          bgColor: 'bg-green-50',
          iconColor: 'text-green-600',
          borderColor: 'border-green-100'
        }
      case 'agents':
        return {
          icon: <FaUserTie className='w-5 h-5' />,
          bgColor: 'bg-purple-50',
          iconColor: 'text-purple-600',
          borderColor: 'border-purple-100'
        }
      case 'events':
        return {
          icon: <BsCalendarEvent className='w-5 h-5' />,
          bgColor: 'bg-orange-50',
          iconColor: 'text-orange-600',
          borderColor: 'border-orange-100'
        }
      case 'referrals':
        return {
          icon: <VscReferences className='w-5 h-5' />,
          bgColor: 'bg-indigo-50',
          iconColor: 'text-indigo-600',
          borderColor: 'border-indigo-100'
        }
      case 'applications':
        return {
          icon: <FaFileAlt className='w-5 h-5' />,
          bgColor: 'bg-teal-50',
          iconColor: 'text-teal-600',
          borderColor: 'border-teal-100'
        }
      case 'applied-colleges':
        return {
          icon: <IoSchoolSharp className='w-5 h-5' />,
          bgColor: 'bg-blue-50',
          iconColor: 'text-blue-600',
          borderColor: 'border-blue-100'
        }
      case 'university':
        return {
          icon: <FaUniversity className='w-5 h-5' />,
          bgColor: 'bg-red-50',
          iconColor: 'text-red-600',
          borderColor: 'border-red-100'
        }
      case 'consultancy':
        return {
          icon: <FaBuilding className='w-5 h-5' />,
          bgColor: 'bg-cyan-50',
          iconColor: 'text-cyan-600',
          borderColor: 'border-cyan-100'
        }
      case 'wishlist':
        return {
          icon: <IoSchoolSharp className='w-5 h-5' />,
          bgColor: 'bg-pink-50',
          iconColor: 'text-pink-600',
          borderColor: 'border-pink-100'
        }
      case 'blogs':
        return {
          icon: <BsNewspaper className='w-5 h-5' />,
          bgColor: 'bg-amber-50',
          iconColor: 'text-amber-600',
          borderColor: 'border-amber-100'
        }
      default:
        return {
          icon: <HiOutlineUsers className='w-5 h-5' />,
          bgColor: 'bg-gray-50',
          iconColor: 'text-gray-600',
          borderColor: 'border-gray-100'
        }
    }
  }

  const { icon, bgColor, iconColor, borderColor } = getIconConfig()
  const route = getRoute()

  return (
    <Link
      href={route}
      className={`group relative bg-white rounded-2xl p-5 flex-1 min-w-[140px] border ${borderColor} shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer block`}
    >
      <div className='flex justify-between items-start mb-3'>
        <div className='flex-1'>
          <h1 className='text-3xl font-bold text-gray-900 tabular-nums tracking-tight'>
            {displayValue}
          </h1>
        </div>
        <div className={`flex items-center justify-center w-11 h-11 rounded-xl ${bgColor} ${iconColor} transition-transform duration-200 group-hover:scale-110`}>
          {icon}
        </div>
      </div>
      <h2 className='capitalize text-sm font-semibold text-gray-600 tracking-wide'>
        {type}
      </h2>
    </Link>
  )
}

export default UserCard
