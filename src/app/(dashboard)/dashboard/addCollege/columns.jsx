import { Globe, MapPin, Edit2, Trash2, UserPlus, Eye } from 'lucide-react'

export const createColumns = ({
  handleView,
  handleEdit,
  handleOpenCredentialsModal,
  handleDeleteClick
}) => [
  {
    header: '',
    accessorKey: 'college_logo',
    cell: ({ getValue }) => {
      const logoUrl = getValue()
      return logoUrl ? (
        <div className='flex items-center justify-center'>
          <img
            src={logoUrl}
            alt='College Logo'
            className='w-20 h-20 object-contain rounded'
          />
        </div>
      ) : (
        <div className='flex items-center justify-center w-20 h-20 bg-gray-100 rounded'>
          <span className='text-gray-400 text-xs'>No Logo</span>
        </div>
      )
    }
  },
  {
    header: 'College Name',
    accessorKey: 'name',
    cell: ({ row }) => {
      const name = row.original.name
      const type = row.original.institute_type
      const websiteUrl = row.original.website_url
      return (
        <div className='flex flex-col'>
          <div className='flex items-center gap-2'>
            <span>{name}</span>
            {type && (
              <span className='px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800'>
                {type}
              </span>
            )}
          </div>
          {websiteUrl && (
            <a
              href={
                websiteUrl.startsWith('http')
                  ? websiteUrl
                  : `https://${websiteUrl}`
              }
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 hover:underline text-sm mt-1 inline-flex items-center gap-1'
            >
              <Globe className='inline w-4 h-4' /> {websiteUrl}
            </a>
          )}
        </div>
      )
    }
  },
  {
    header: 'Location',
    accessorKey: 'address',
    cell: ({ row }) => {
      const address = row.original.address || {}
      const location = [address.city, address.state, address.country]
        .filter(Boolean)
        .join(', ')
      const mapUrl = row.original.google_map_url

      if (!location && !mapUrl) {
        return 'N/A'
      }

      return (
        <div className='flex flex-col'>
          {location && <span>{location}</span>}
          {mapUrl && (
            <a
              href={mapUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 hover:underline text-sm mt-1 inline-flex items-center gap-1'
            >
              <MapPin className='inline w-4 h-4' /> View Map
            </a>
          )}
        </div>
      )
    }
  },
  {
    header: 'Featured',
    accessorKey: 'isFeatured',
    cell: ({ getValue }) => (getValue() ? 'Yes' : 'No')
  },
  {
    header: 'Pinned',
    accessorKey: 'pinned',
    cell: ({ getValue }) => (getValue() ? 'Yes' : 'No')
  },
  {
    header: 'Actions',
    id: 'actions',
    cell: ({ row }) => {
      const hasAccount =
        row.original.has_account === true || row.original.has_account === 1
      return (
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
          {!hasAccount && (
            <button
              onClick={() => handleOpenCredentialsModal(row.original)}
              className='p-1 text-green-600 hover:text-green-800'
              title='Create Credentials'
            >
              <UserPlus className='w-4 h-4' />
            </button>
          )}
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
  }
]
