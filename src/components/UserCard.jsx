import { IoIosMore } from 'react-icons/io'
import { HiOutlineUsers } from 'react-icons/hi'
import { IoSchoolSharp } from 'react-icons/io5'
import { FaUserTie, FaFileAlt, FaUniversity, FaBuilding } from 'react-icons/fa'
import { BsCalendarEvent } from 'react-icons/bs'
import { VscReferences } from 'react-icons/vsc'

const UserCard = ({ type, value, loading }) => {
  const displayValue =
    loading || value === undefined || value === null ? '...' : value

  // Get icon based on type
  const getIcon = () => {
    switch (type?.toLowerCase()) {
      case 'users':
        return <HiOutlineUsers className='w-6 h-6 text-blue-600' />
      case 'college':
        return <IoSchoolSharp className='w-6 h-6 text-green-600' />
      case 'agents':
        return <FaUserTie className='w-6 h-6 text-purple-600' />
      case 'events':
        return <BsCalendarEvent className='w-6 h-6 text-orange-600' />
      case 'referrals':
        return <VscReferences className='w-6 h-6 text-indigo-600' />
      case 'applications':
        return <FaFileAlt className='w-6 h-6 text-teal-600' />
      case 'university':
        return <FaUniversity className='w-6 h-6 text-red-600' />
      case 'consultancy':
        return <FaBuilding className='w-6 h-6 text-cyan-600' />
      default:
        return <HiOutlineUsers className='w-6 h-6 text-gray-600' />
    }
  }

  return (
    <div className='rounded-3xl odd:bg-white even:bg-white p-4 flex-1 min-w-[130px] border border-[#8884D8]'>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-2xl font-semibold'>{displayValue}</h1>
        <div className='flex items-center justify-center w-12 h-12 rounded-lg bg-gray-50'>
          {getIcon()}
        </div>
      </div>
      <h2 className='capitalize text-sm font-medium text-gray-500'>{type}</h2>
    </div>
  )
}

export default UserCard
