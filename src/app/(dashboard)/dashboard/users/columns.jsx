import { Edit2, Trash2, Eye } from 'lucide-react'
import { Button } from '@/ui/shadcn/button'
import { formatRelativeWithTitle } from '@/utils/date.util'

export const createColumns = ({ handleEdit, handleDelete, handleView }) => [
  {
    header: 'Full Name',
    accessorKey: 'fullName',
    cell: ({ row }) => {
      const firstName = row.original.firstName || ''
      const lastName = row.original.lastName || ''
      const fullName = `${firstName} ${lastName}`.trim() || 'N/A'
      let roles = row.original.roles || {}
      if (typeof roles === 'string') {
        try {
          roles = JSON.parse(roles)
        } catch (e) {
          console.error('Failed to parse roles:', row.original.roles)
          roles = {}
        }
      }
      const activeRoles = Object.entries(roles)
        .filter(([_, value]) => value)
        .map(([role]) => role)

      return (
        <div className='flex flex-col gap-1'>
          <span className='font-medium text-gray-900'>{fullName}</span>
          {activeRoles.length > 0 && (
            <div className='flex gap-1 flex-wrap'>
              {activeRoles.map((role) => (
                <span
                  key={role}
                  className='px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800'
                >
                  {role}
                </span>
              ))}
            </div>
          )}
        </div>
      )
    }
  },
  {
    header: 'Email',
    accessorKey: 'email',
    cell: ({ getValue }) => (
      <span className='text-gray-600 text-sm'>{getValue() || 'N/A'}</span>
    )
  },
  {
    header: 'Phone Number',
    accessorKey: 'phoneNo',
    cell: ({ getValue }) => (
      <span className='text-gray-600 text-sm'>{getValue() || 'N/A'}</span>
    )
  },
  {
    header: 'Created At',
    accessorKey: 'createdAt',
    cell: ({ getValue }) => {
      const { label, title } = formatRelativeWithTitle(getValue())
      return (
        <span className='text-gray-500 text-sm cursor-default' title={title}>
          {label}
        </span>
      )
    }
  },
  {
    header: 'Actions',
    id: 'actions',
    cell: ({ row }) => {
      let isStudent = false
      let roles = row.original.roles || {}
      if (typeof roles === 'string') {
        try {
          roles = JSON.parse(roles)
        } catch (e) {
          roles = {}
        }
      }
      if (roles.student === true) {
        isStudent = true
      }

      return (
        <div className='flex gap-1'>
          {isStudent && handleView && (
            <Button
              variant='ghost'
              size='icon'
              onClick={() => handleView(row.original)}
              className='hover:bg-blue-50 text-blue-600'
              title='View Details'
            >
              <Eye className='w-4 h-4' />
            </Button>
          )}
          <Button
            variant='ghost'
            size='icon'
            onClick={() => handleEdit(row.original)}
            className='hover:bg-amber-50 text-amber-600'
            title='Edit'
          >
            <Edit2 className='w-4 h-4' />
          </Button>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => handleDelete(row.original.id)}
            className='hover:bg-red-50 text-red-600'
            title='Delete'
          >
            <Trash2 className='w-4 h-4' />
          </Button>
        </div>
      )
    }
  }
]
