"use client";
import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { getMaterials } from "../action";
import Pagination from "../../blogs/components/Pagination";
import Loading from "../../components/Loading";
import Link from "next/link";

const MaterialCard = () => {
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPageNumber(pagination.currentPage); // Pass the current page directly here
  }, [pagination.currentPage]);

  const loadPageNumber = async (page) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getMaterials(page);

      if (response && response.pagination) {
        setBlogs(response.materials);

        setPagination((prev) => ({
          ...prev,
          ...response.pagination, // Update the pagination state with the new data
        }));
      } else {
        console.error("Pagination data not found in response:", response);
      }
    } catch (error) {
      setError("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= pagination.totalPages) {
      setPagination((prev) => ({
        ...prev,
        currentPage: page, // Update current page
      }));
    }
  };

  const truncateString = (str, maxLength) => {
    if (str.length > maxLength) {
      return str.slice(0, maxLength) + "...";
    }
    return str;
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <>
      <div className="flex flex-col max-w-[1600px] mx-auto px-8 mt-10">
        {/* top section  */}
        <div className="flex flex-row border-b-2 border-[#0A70A7] w-[45px] mb-10">
          <span className="text-2xl font-bold mr-2">Our</span>
          <span className="text-[#0A70A7] text-2xl font-bold">Materials</span>
        </div>

        {/* Search Bar */}
        <div className="flex justify-end w-full">
          <div className="relative w-full max-w-md mb-6">
            <input
              type="text"
              placeholder="Search material..."
              className="w-full p-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
             // onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {loading ? (
          <Loading />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
            {blogs.map((blog, index) => (
              <div
                key={index}
                className="bg-white shadow-md rounded-2xl overflow-hidden transition-transform transform hover:scale-105"
              >
                <img
                  src="https://placehold.co/600x400"
                  alt={blog.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h1 className="text-lg font-semibold mb-2">{blog.title}</h1>
                  <button
                    className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                    onClick={() => window.open(blog.downloadUrl, "_blank")}
                  >
                    Download Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Pagination pagination={pagination} onPageChange={handlePageChange} />
    </>
  );
};

export default MaterialCard;
