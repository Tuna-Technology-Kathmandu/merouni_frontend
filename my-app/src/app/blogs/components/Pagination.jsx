"use client";
import React, { useState } from "react";

const Pagination = ({ totalPages }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pageNumbers.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pageNumbers.push(1, "...", currentPage, "...", totalPages);
      }
    }

    return pageNumbers.map((number, index) => (
      <button
        key={index}
        className={`px-3 py-1 mx-1 rounded-full border ${
          currentPage === number
            ? "bg-gray-300 text-black font-bold"
            : "bg-white text-gray-600"
        } ${
          typeof number === "string" ? "cursor-default" : "hover:bg-gray-200"
        }`}
        onClick={() => typeof number === "number" && handlePageChange(number)}
      >
        {number}
      </button>
    ));
  };

  return (
    <div className="flex items-center justify-center mt-5 mb-10">
      <button
        className={`px-3 py-1 mx-1 rounded-full border ${
          currentPage === 1
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "hover:bg-gray-200 text-gray-600"
        }`}
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &lt;
      </button>
      {renderPageNumbers()}
      <button
        className={`px-3 py-1 mx-1 rounded-full border ${
          currentPage === totalPages
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "hover:bg-gray-200 text-gray-600"
        }`}
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;
