import { Edit2, Trash2, Eye } from 'lucide-react'

export const createColumns = ({
  handleView,
  handleEdit,
  handleDeleteClick
}) => [
  {
    header: '',
    accessorKey: 'featured_image',
    cell: ({ getValue }) => {
      const logoUrl = getValue()
      return logoUrl ? (
        <div className='flex items-center justify-center'>
          <img
            src={logoUrl}
            alt='University Logo'
            className='w-12 h-12 object-contain rounded'
          />
        </div>
      ) : (
        <div className='flex items-center justify-center w-12 h-12 bg-gray-100 rounded'>
          <span className='text-gray-400 text-xs'>No Logo</span>
        </div>
      )
    }
  },
  {
    header: 'Name',
    accessorKey: 'fullname',
    cell: ({ row }) => {
      const name = row.original.fullname
      const type = row.original.type_of_institute
      return (
        <div className='flex items-center gap-2'>
          <span>{name}</span>
          {type && (
            <span className='px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800'>
              {type}
            </span>
          )}
        </div>
      )
    }
  },
  {
    header: 'Location',
    accessorKey: 'address',
    cell: ({ row }) => {
      const data = row.original
      return `${data.city}, ${data.state}, ${data.country}`
    }
  },
  {
    header: 'Actions',
    id: 'actions',
    cell: ({ row }) => (
      <div className='flex gap-2'>
        <button
          onClick={() => handleView(row.original.slugs)}
          className='p-1 text-purple-600 hover:text-purple-800'
          title='View Details'
        >
          <Eye className='w-4 h-4' />
        </button>
        <button
          onClick={() => handleEdit(row.original.slugs)}
          className='p-1 text-blue-600 hover:text-blue-800'
          title='Edit'
        >
          <Edit2 className='w-4 h-4' />
        </button>
        <button
          onClick={() => handleDeleteClick(row.original.id)}
          className='p-1 text-red-600 hover:text-red-800'
          title='Delete'
        >
          <Trash2 className='w-4 h-4' />
        </button>
      </div>
    )
  }
]
