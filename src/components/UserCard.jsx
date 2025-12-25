import { IoIosMore } from 'react-icons/io'

const UserCard = ({ type, value, loading }) => {
  const displayValue =
    loading || value === undefined || value === null ? '...' : value

  return (
    <div className='rounded-3xl odd:bg-white even:bg-white p-4 flex-1 min-w-[130px] border border-[#8884D8]'>
      <div className='flex justify-between items-center'></div>
      <h1 className='text-2xl font-semibold my-4'>{displayValue}</h1>
      <h2 className='capitalize text-sm font-medium text-gray-500'>{type}</h2>
    </div>
  )
}

export default UserCard
