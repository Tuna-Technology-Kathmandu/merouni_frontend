import { Edit2, Trash2, Eye, UserPlus } from 'lucide-react'

export const createColumns = ({
  handleView,
  handleEdit,
  handleDeleteClick,
  handleOpenCredentialsModal
}) => [
    {
      header: '',
      accessorKey: 'logo',
      cell: ({ getValue }) => {
        const logoUrl = getValue()
        return logoUrl ? (
          <div className='flex items-center justify-center'>
            <img
              src={logoUrl}
              alt='Consultancy Logo'
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
      header: 'Consultancy Name',
      accessorKey: 'title'
    },
    {
      header: 'Destinations',
      accessorKey: 'destination',
      cell: ({ row }) => {
        let destinations = row.original.destination
        if (typeof destinations === 'string') {
          try {
            destinations = JSON.parse(destinations)
          } catch {
            return 'N/A'
          }
        }
        if (!Array.isArray(destinations)) return 'N/A'
        return (
          destinations
            .map((d) => (typeof d === 'string' ? d : d?.country))
            .filter(Boolean)
            .join('; ') || 'N/A'
        )
      }
    },
    {
      header: 'Address',
      accessorKey: 'address',
      cell: ({ row }) => {
        const address =
          typeof row.original.address === 'string'
            ? JSON.parse(row.original.address)
            : row.original.address || {}
        const parts = [
          address.street,
          address.city,
          address.state,
          address.zip
        ].filter(Boolean)
        return parts.length > 0 ? parts.join(', ') : 'N/A'
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
            onClick={() => handleEdit(row.original)}
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
          {!row.original.has_account ? (
            <button
              onClick={() => handleOpenCredentialsModal(row.original)}
              className='p-1.5 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 transition-colors'
              title='Create Credentials'
            >
              <UserPlus className='w-4 h-4' />
            </button>
          ) : (

            null
)}
        </div>
      )
    }
  ]
