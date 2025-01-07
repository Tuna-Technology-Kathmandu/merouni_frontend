// import {
//     createColumnHelper,
//     flexRender,
//     getCoreRowModel,
//     getFilteredRowModel,
//     getSortedRowModel,
//     useReactTable,
//   } from "@tanstack/react-table";
//   import {
//     ArrowUpDown,
//     ChevronLeft,
//     ChevronRight,
//     ChevronsLeft,
//     ChevronsRight,
//     Mail,
//     Phone,
//     Search,
//     User,
//   } from "lucide-react";
//   import React from "react";
//   import mockData from "./data"

//   const columnHelper = createColumnHelper();

//   const columns = [
//     columnHelper.accessor("id", {
//       cell: (info) => info.getValue(),
//       header: () => (
//         <span className="flex items-center">
//           <User className="mr-2" size={16} /> ID
//         </span>
//       ),
//     }),

//     columnHelper.accessor("name", {
//       cell: (info) => info.getValue(),
//       header: () => (
//         <span className="flex items-center">
//           <User className="mr-2" size={16} /> Name
//         </span>
//       ),
//     }),
//     columnHelper.accessor("email", {
//       id: "email",
//       cell: (info) => (
//         <span className="italic text-blue-600">{info.getValue()}</span>
//       ),
//       header: () => (
//         <span className="flex items-center">
//           <Mail className="mr-2" size={16} /> Email
//         </span>
//       ),
//     }),
//     columnHelper.accessor("phone", {
//       header: () => (
//         <span className="flex items-center">
//           <Phone className="mr-2" size={16} /> Phone
//         </span>
//       ),
//       cell: (info) => info.getValue(),
//     }),
//   ];

//   export default function App() {
//     const [data] = React.useState(() => [...mockData]);
//     const [sorting, setSorting] = React.useState([]);
//     const [globalFilter, setGlobalFilter] = React.useState("");

//     const table = useReactTable({
//       data,
//       columns,
//       state: {
//         sorting,
//         globalFilter,
//       },
//       initialState: {
//         pagination: {
//           pageSize: 5,
//         },
//       },
//       getCoreRowModel: getCoreRowModel(),

//       onSortingChange: setSorting,
//       getSortedRowModel: getSortedRowModel(),

//       onGlobalFilterChange: setGlobalFilter,
//       getFilteredRowModel: getFilteredRowModel(),
//     });

//     console.log(table.getRowModel());

//     return (
//       <div className="flex flex-col min-h-screen max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
//         <div className="mb-4 relative">
//           <input
//             value={globalFilter ?? ""}
//             onChange={(e) => setGlobalFilter(e.target.value)}
//             placeholder="Search..."
//             className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
//           />
//           <Search
//             className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
//             size={20}
//           />
//         </div>

//         <div className="overflow-x-auto bg-white shadow-md rounded-lg">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               {table.getHeaderGroups().map((headerGroup) => (
//                 <tr key={headerGroup.id}>
//                   {headerGroup.headers.map((header) => (
//                     <th
//                       key={header.id}
//                       className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     >
//                       <div
//                         {...{
//                           className: header.column.getCanSort()
//                             ? "cursor-pointer select-none flex items-center"
//                             : "",
//                           onClick: header.column.getToggleSortingHandler(),
//                         }}
//                       >
//                         {flexRender(
//                           header.column.columnDef.header,
//                           header.getContext()
//                         )}
//                         <ArrowUpDown className="ml-2" size={14} />
//                       </div>
//                     </th>
//                   ))}
//                 </tr>
//               ))}
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {table.getRowModel().rows.map((row) => (
//                 <tr key={row.id} className="hover:bg-gray-50">
//                   {row.getVisibleCells().map((cell) => (
//                     <td
//                       key={cell.id}
//                       className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
//                     >
//                       {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                     </td>
//                   ))}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         <div className="flex flex-col sm:flex-row justify-between items-center mt-4 text-sm text-gray-700">
//           <div className="flex items-center mb-4 sm:mb-0">
//             <span className="mr-2">Items per page</span>
//             <select
//               className="border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2"
//               value={table.getState().pagination.pageSize}
//               onChange={(e) => {
//                 table.setPageSize(Number(e.target.value));
//               }}
//             >
//               {[5, 10, 20, 30].map((pageSize) => (
//                 <option key={pageSize} value={pageSize}>
//                   {pageSize}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="flex items-center space-x-2">
//             <button
//               className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
//               onClick={() => table.setPageIndex(0)}
//               disabled={!table.getCanPreviousPage()}
//             >
//               <ChevronsLeft size={20} />
//             </button>

//             <button
//               className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
//               onClick={() => table.previousPage()}
//               disabled={!table.getCanPreviousPage()}
//             >
//               <ChevronLeft size={20} />
//             </button>

//             <span className="flex items-center">
//               <input
//                 min={1}
//                 max={table.getPageCount()}
//                 type="number"
//                 value={table.getState().pagination.pageIndex + 1}
//                 onChange={(e) => {
//                   const page = e.target.value ? Number(e.target.value) - 1 : 0;
//                   table.setPageIndex(page);
//                 }}
//                 className="w-16 p-2 rounded-md border border-gray-300 text-center"
//               />
//               <span className="ml-1">of {table.getPageCount()}</span>
//             </span>

//             <button
//               className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
//               onClick={() => table.nextPage()}
//               disabled={!table.getCanNextPage()}
//             >
//               <ChevronRight size={20} />
//             </button>

//             <button
//               className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
//               onClick={() => table.setPageIndex(table.getPageCount() - 1)}
//               disabled={!table.getCanNextPage()}
//             >
//               <ChevronsRight size={20} />
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

// {
//   "id": 1,
//   "name": "John Doe",
//   "email": "johndoe@example.com",
//   "phone": "123-456-7890"
// },
"use client";
import React, { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel
} from "@tanstack/react-table";
import { Search, ChevronUp, ChevronDown } from "lucide-react";

const Table = ({ data, columns }) => {
  const [sorting, setSorting] = useState([]);
  const [filtering, setFiltering] = useState("");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting: sorting,
      globalFilter: filtering
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltering
  });

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
          onChange={(e) => setFiltering(e.target.value)}
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
                  <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            First
          </button>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
          <button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
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