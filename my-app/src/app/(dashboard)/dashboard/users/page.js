// app/(dashboard)/dashboard/users/page.js
import { Suspense } from 'react'
import { getUsers } from '../../../actions/userActions'
import { UserTableClient } from '../../../components/UserTableClient'
import Pagination from '../../../components/Pagination'
import SearchFilter from '../../../components/SearchFilter'

export default async function UsersPage({ searchParams }) {
  const currentPage = Number(searchParams?.page) || 1
  const search = searchParams?.search || ''
  const filter = searchParams?.filter || ''

  try {
    const users = await getUsers(currentPage, search, filter)

    return (
      <div className="m-8">
        {/* Search and Filter Section */}
        <SearchFilter searchParams={searchParams} />

        {/* User Table */}
        <UserTableClient users={users.items} />

        {/* Pagination */}
        <Suspense fallback={<div>Loading pagination...</div>}>
          <Pagination
            currentPage={users.pagination.currentPage}
            totalPages={users.pagination.totalPages}
          />
        </Suspense>
      </div>
    )
  } catch (error) {
    console.error('Error loading users:', error)
    return (
      <div className="m-8 text-center">
        <div className="text-red-500">Error loading users. Please try again later.</div>
      </div>
    )
  }
}
