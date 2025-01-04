// components/SearchFilter.js
export default function SearchFilter({ searchParams }) {
    const currentSearch = searchParams?.search || ''
    const currentFilter = searchParams?.filter || ''
  
    return (
      <form method="GET" className="mb-4 flex items-center gap-4">
        <input
          type="text"
          name="search"
          placeholder="Search users..."
          defaultValue={currentSearch}
          className="border rounded px-4 py-2 w-1/3"
        />
        <select
          name="filter"
          defaultValue={currentFilter}
          className="border rounded px-4 py-2 w-1/4"
        >
          <option value="">All</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
          <option value="guest">Guest</option>
        </select>
        <button
          type="submit"
          className="bg-[#4949CA] text-white px-4 py-2 rounded"
        >
          Apply
        </button>
      </form>
    )
  }
  