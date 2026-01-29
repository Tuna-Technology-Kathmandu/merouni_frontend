import { Search } from 'lucide-react'

const FilterSection = ({
  title,
  options = [],
  placeholder,
  selectedItems = [],
  onSelectionChange
}) => {
  const handleCheckboxChange = (name) => {
    let newSelection
    if (selectedItems.includes(name)) {
      newSelection = selectedItems.filter((item) => item !== name)
    } else {
      newSelection = [...selectedItems, name]
    }
    if (onSelectionChange) {
      onSelectionChange(newSelection)
    }
  }

  return (
    <div className='bg-white rounded-xl p-4 border border-gray-200 shadow-lg'>
      <div className='flex justify-between items-center mb-3'>
        <h3 className='text-gray-800 font-medium'>{title}</h3>
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
      {placeholder && (
        <div className='relative mb-4'>
          <Search className='absolute left-3 top-2.5 w-4 h-4 text-gray-400' />
          <input
            type='text'
            placeholder={placeholder}
            className='w-full pl-9 pr-3 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none'
          />
        </div>
      )}
      <div className='mt-3 space-y-2 overflow-y-auto max-h-48 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-50'>
        {options.map((option, index) => (
          <label key={index} className='flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded-md transition-colors'>
            <input
              type='checkbox'
              className='rounded-md border-gray-300 w-4 h-4 text-blue-600 focus:ring-blue-500'
              checked={selectedItems.includes(option.name)}
              onChange={() => handleCheckboxChange(option.name)}
            />
            <span className='text-gray-700 text-sm flex-1'>{option.name}</span>
            {option.count !== undefined && (
              <span className='text-gray-400 text-xs ml-auto'>
                ({option.count})
              </span>
            )}
          </label>
        ))}
      </div>
    </div>
  )
}
export default FilterSection
