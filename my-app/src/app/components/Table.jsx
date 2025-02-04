"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { Search, ChevronUp, ChevronDown } from "lucide-react";

const Table = ({ data, columns, pagination, onPageChange, onSearch }) => {
  const [sorting, setSorting] = useState([]);
  const [filtering, setFiltering] = useState("");
  // const [isLoading, setIsLoading] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);
  // const [searchResults, setSearchResults] = useState([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    pageCount: pagination.totalPages,
    state: {
      sorting: sorting,
      // globalFilter: filtering,
      pagination: {
        pageIndex: pagination.currentPage - 1,
        pageSize: 9,
      },
    },
    onSortingChange: setSorting,
    // onGlobalFilterChange: setFiltering,
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const newPageIndex = updater(table.getState().pagination).pageIndex;
        onPageChange(newPageIndex + 1);
      }
    },
  });

  const handleSearch = (value) => {
    setFiltering(value);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    const timeoutId = setTimeout(() => {
      onSearch(value);
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  // const fetchSearchUsers = async (query) => {
  //   setIsLoading(true);
  //   try {
  //     const response = await fetch(
  //       `${process.env.baseUrl}${process.env.version}/users/search?q=${query}`
  //     );

  //     if (response.ok) {
  //       const data = await response.json();
  //       setSearchResults(data);
  //     } else {
  //       console.error("Error fetching results:", response.statusText);
  //       setSearchResults([]);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching users results:", error.message);
  //     setSearchResults([]);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <div className="w-full p-4 space-y-4">
      {/* Search Input */}
      <div className="relative w-full max-w-md">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="w-4 h-4 text-gray-500" />
        </div>
        <input
          type="text"
          value={filtering}
          // onChange={(e) => setFiltering(e.target.value)}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search..."
        />
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-lg border shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center space-x-1">
                      <span>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </span>
                      <span className="inline-block w-4">
                        {header.column.getIsSorted() === "asc" ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : header.column.getIsSorted() === "desc" ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : null}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-700">
          Page {pagination.currentPage} of {pagination.totalPages}
          (Showing{" "}
          {Math.min(
            (pagination.currentPage - 1) * 9 + 1,
            pagination.total
          )} - {Math.min(pagination.currentPage * 9, pagination.total)} of{" "}
          {pagination.total} items)
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onPageChange(1)}
            disabled={pagination.currentPage === 1}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            First
          </button>

          <button
            onClick={() => onPageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <button
            onClick={() => onPageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>

          <button
            onClick={() => onPageChange(pagination.totalPages)}
            disabled={pagination.currentPage === pagination.totalPages}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Last
          </button>
        </div>
      </div>
    </div>
  );
};

export default Table;
