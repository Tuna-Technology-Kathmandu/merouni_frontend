import { Edit2, Trash2 } from 'lucide-react'

export const createColumns = ({ handleEdit, handleDelete }) => [
  {
    header: 'Full Name',
    accessorKey: 'fullName',
    cell: ({ row }) => {
      const firstName = row.original.firstName || ''
      const lastName = row.original.lastName || ''
      const fullName = `${firstName} ${lastName}`.trim() || 'N/A'
      const roles = JSON.parse(row.original.roles || '{}') // Parse the string to an object
      const activeRoles = Object.entries(roles)
        .filter(([_, value]) => value) // keep only true roles
        .map(([role]) => role)

      return (
        <div className='flex flex-col gap-1'>
          <span className='font-medium'>{fullName}</span>
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
    accessorKey: 'email'
  },
  {
    header: 'Phone Number',
    accessorKey: 'phoneNo',
    cell: ({ getValue }) => getValue() || 'N/A'
  },
  {
    header: 'Created At',
    accessorKey: 'createdAt',
    cell: ({ getValue }) => new Date(getValue()).toLocaleDateString()
  },
  {
    header: 'Actions',
    id: 'actions',
    cell: ({ row }) => (
      <div className='flex gap-2'>
        <button
          onClick={() => handleEdit(row.original)}
          className='p-1 text-blue-600 hover:text-blue-800'
        >
          <Edit2 className='w-4 h-4' />
        </button>
        <button
          onClick={() => handleDelete(row.original.id)}
          className='p-1 text-red-600 hover:text-red-800'
        >
          <Trash2 className='w-4 h-4' />
        </button>
      </div>
    )
  }
]
