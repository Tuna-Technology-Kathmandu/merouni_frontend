import { Edit2, Trash2, Eye, MapPin, GraduationCap } from 'lucide-react'
import { cn } from '@/app/lib/utils'

export const createColumns = ({
  handleView,
  handleEdit,
  handleDeleteClick
}) => [
    {
      header: 'University',
      accessorKey: 'fullname',
      cell: ({ row }) => {
        const name = row.original.fullname
        const logoUrl = row.original.logo
        const type = row.original.type_of_institute

        return (
          <div className='flex items-center gap-4'>
            <div className='w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shrink-0'>
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={name}
                  className='w-full h-full object-contain p-1'
                />
              ) : (
                <GraduationCap className='w-6 h-6 text-gray-300' />
              )}
            </div>
            <div className='flex flex-col'>
              <span className='font-bold text-gray-900 line-clamp-1'>{name}</span>
              <div className='flex items-center gap-2 mt-1'>
                {type && (
                  <span className={cn(
                    'px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider',
                    type === 'Public' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-blue-50 text-blue-600 border border-blue-100'
                  )}>
                    {type}
                  </span>
                )}
              </div>
            </div>
          </div>
        )
      }
    },
    {
      header: 'Location',
      accessorKey: 'address',
      cell: ({ row }) => {
        const data = row.original
        const location = [data.city, data.state, data.country].filter(Boolean).join(', ')
        return (
          <div className='flex items-center gap-2 text-gray-500'>
            <MapPin size={14} className="text-[#387cae]" />
            <span className='text-sm font-medium'>{location || 'N/A'}</span>
          </div>
        )
      }
    },
    {
      header: 'Established',
      accessorKey: 'date_of_establish',
      cell: ({ getValue }) => {
        const date = getValue()
        return date ? (
          <span className='text-sm font-medium text-gray-600 uppercase'>
            {new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
          </span>
        ) : <span className='text-gray-400'>-</span>
      }
    },
    {
      header: 'Actions',
      id: 'actions',
      cell: ({ row }) => (
        <div className='flex gap-1.5 justify-end'>
          <button
            onClick={() => handleView(row.original.slugs)}
            className='w-9 h-9 flex items-center justify-center rounded-xl bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors'
            title='View Details'
          >
            <Eye className='w-4 h-4' />
          </button>
          <button
            onClick={() => handleEdit(row.original.slugs)}
            className='w-9 h-9 flex items-center justify-center rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors'
            title='Edit'
          >
            <Edit2 className='w-4 h-4' />
          </button>
          <button
            onClick={() => handleDeleteClick(row.original.id)}
            className='w-9 h-9 flex items-center justify-center rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors'
            title='Delete'
          >
            <Trash2 className='w-4 h-4' />
          </button>
        </div>
      )
    }
  ]
