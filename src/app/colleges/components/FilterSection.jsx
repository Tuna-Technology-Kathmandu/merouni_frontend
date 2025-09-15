// 'use client'
// import { Search } from 'lucide-react'
// import { useEffect, useState } from 'react'

// const FilterSection = ({
//   title,
//   options,
//   placeholder,
//   selectedItems = [],
//   onSelectionChange = () => {},
//   onSearchInputChange = null
// }) => {
//   const [searchText, setSearchText] = useState('')
//   const [isLoading, setIsLoading] = useState(false)
//   const [filteredOptions, setFilteredOptions] = useState(options)

//   // Update filteredOptions when options prop changes (external updates)
//   useEffect(() => {
//     setFilteredOptions(options)
//   }, [options])

//   useEffect(() => {
//     if (onSearchInputChange) {
//       setIsLoading(true)
//       const debounceTimeout = setTimeout(async () => {
//         await onSearchInputChange(searchText)
//         setIsLoading(false)
//       }, 500)

//       return () => clearTimeout(debounceTimeout)
//     } else {
//       // If not using backend search, just filter locally
//       const filtered = options.filter((option) =>
//         option.name.toLowerCase().includes(searchText.toLowerCase())
//       )
//       setFilteredOptions(filtered)
//     }
//   }, [searchText])

//   const handleCheckBoxChange = (option) => {
//     if (selectedItems === option.name) {
//       onSelectionChange('') // Unselect
//     } else {
//       onSelectionChange(option.name) // Select
//     }
//   }

//   return (
//     <div className='bg-white rounded-xl p-4 border border-gray-200 shadow-lg'>
//       <div className='flex justify-between items-center mb-3'>
//         <h3 className='text-gray-800 font-medium'>{title}</h3>
//       </div>
//       <div className='relative'>
//         <Search className='absolute left-3 top-2.5 w-4 h-4 text-gray-400' />
//         <input
//           type='text'
//           placeholder={placeholder}
//           value={searchText}
//           onChange={(e) => setSearchText(e.target.value)}
//           className='w-full pl-9 pr-3 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none'
//         />
//       </div>

//       <div className='mt-3 space-y-2 overflow-y-auto h-24 scrollbar-thin scrollbar-thumb-black scrollbar-track-gray-100'>
//         {isLoading ? (
//           <div className='text-center text-sm text-gray-400'>Loading...</div>
//         ) : filteredOptions.length === 0 ? (
//           <div className='text-center text-sm text-gray-400'>No data found</div>
//         ) : (
//           filteredOptions.map((option, index) => (
//             <label key={index} className='flex items-center gap-2'>
//               <input
//                 type='checkbox'
//                 className='rounded-full border-gray-300'
//                 checked={selectedItems?.includes(option.name)}
//                 onChange={() => handleCheckBoxChange(option)}
//               />
//               <span className='text-gray-700 text-sm'>{option.name}</span>
//             </label>
//           ))
//         )}
//       </div>
//     </div>
//   )
// }

// export default FilterSection
