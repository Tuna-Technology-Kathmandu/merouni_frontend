// "use client";
// import React, { useState,useEffect } from "react";

// const Pagination = ({ pagination,onPageChange }) => {
//   const {currentPage,totalPages,hasNextPage,hasPreviousPage} = pagination;
  
//   // const [currentPage, setCurrentPage] = useState(1);
//   // const [pagination, setPagination] = useState({
//   //   currentPage: 1,
//   //   totalPages: 1,
//   //   hasNextPage: false,
//   //   hasPreviousPage: false
//   // })

//   const handleNext = () => {
//     if (hasNextPage) {
//       onPageChange(currentPage +1)
//     }
//   }

//   const handlePrevious = () => {
//     if (hasPreviousPage){
//       onPageChange(currentPage -1)
//     }
//   }
  
//   // const [loading, setLoading] = useState(false);
//   // const [error, setError] = useState(null);

//   // const loadPageNumber = async () => {
//   //   setLoading(true);
//   //   setError(null);
//   //   try {
//   //     const response = await getBlogs({ page: 2 });
//   //     console.log(response);
//   //     setPagination(response.pagination);
//   //   } catch (error) {
//   //     setError("Failed to load blogs");
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

   

//   // const handlePageChange = (page) => {
//   //   if (page > 0 && page <= totalPages) {
//   //     setCurrentPage(page);
//   //   }
//   // };

//   // const renderPageNumbers = () => {
//   //   const pageNumbers = [];

//   //   if (totalPages <= 5) {
//   //     for (let i = 1; i <= totalPages; i++) {
//   //       pageNumbers.push(i);
//   //     }
//   //   } else {
//   //     if (currentPage <= 3) {
//   //       pageNumbers.push(1, 2, 3, "...", totalPages);
//   //     } else if (currentPage >= totalPages - 2) {
//   //       pageNumbers.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
//   //     } else {
//   //       pageNumbers.push(1, "...", currentPage, "...", totalPages);
//   //     }
//   //   }

//   //   return pageNumbers.map((number, index) => (
//   //     <button
//   //       key={index}
//   //       className={`px-3 py-1 mx-1 rounded-full border ${
//   //         currentPage === number
//   //           ? "bg-gray-300 text-black font-bold"
//   //           : "bg-white text-gray-600"
//   //       } ${
//   //         typeof number === "string" ? "cursor-default" : "hover:bg-gray-200"
//   //       }`}
//   //       onClick={() => typeof number === "number" && handlePageChange(number)}
//   //     >
//   //       {number}
//   //     </button>
//   //   ));
//   // };

//   return (
//     <div className="flex items-center justify-center mt-5 mb-10">
//       <button
//         className={`px-3 py-1 mx-1 rounded-full border ${
//           !hasPreviousPage
//             ? "bg-gray-200 text-gray-400 cursor-not-allowed"
//             : "hover:bg-gray-200 text-gray-600"
//         }`}
//         onClick={handlePrevious}
//         disabled={!hasPreviousPage}
//       >
//         &lt;
//       </button>
//       {renderPageNumbers()}
//       <button
//         className={`px-3 py-1 mx-1 rounded-full border ${
//           !hasNextPage
//             ? "bg-gray-200 text-gray-400 cursor-not-allowed"
//             : "hover:bg-gray-200 text-gray-600"
//         }`}
//         onClick={handleNext}
//         disabled={!hasNextPage}
//       >
//         &gt;
//       </button>
//     </div>
//   );
// };

// export default Pagination;



"use client";
import React from "react";

const Pagination = ({ pagination, onPageChange }) => {
  const { currentPage, totalPages, hasNextPage, hasPreviousPage } = pagination;
// console.log(onPageChange)

  const handleNext = () => {
    // console.log("inside handlenext")
    if (hasNextPage) {
      // console.log("inside handle next currentpage", currentPage)
      onPageChange(currentPage + 1);
      console.log("page:",currentPage)
    }
  };

  const handlePrevious = () => {
    if (hasPreviousPage) {
      onPageChange(currentPage - 1);
    }
  };

  return (
    <div className="flex items-center justify-center mt-5 mb-10">
      <button
        className={`px-3 py-1 mx-1 rounded-full border ${
          !hasPreviousPage
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "hover:bg-gray-200 text-gray-600"
        }`}
        onClick={handlePrevious}
        disabled={!hasPreviousPage}
      >
        &lt;
      </button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      {console.log("hasnextpage", hasNextPage)}
      <button
        className={`px-3 py-1 mx-1 rounded-full border ${
          !hasNextPage
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "hover:bg-gray-200 text-gray-600"
        }`}
        onClick={handleNext}
        disabled={!hasNextPage}
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;
