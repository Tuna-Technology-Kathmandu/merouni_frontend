"use client";

import React, { useState, useEffect } from "react";
import { IoIosSearch } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import Link from "next/link";

const SearchBox = ({ onClose }) => {
  const popularSearches = [
    "KUUMAT",
    "SEE RESULT 2025",
    "NEB Class 12 Result 2025",
    "IOE Entrance Exam 2025",
    "MBBS Entrance Exam Nepal",
    "Best College for BIT in Nepal",
    "Lok Sewa Aayog Vacancy",
    "TU Entrance Exam",
  ];

  const [searchTag, setSearchTag] = useState("");
  const [searchResults, setSearchResults] = useState({
    // colleges: [],
    // universities: [],
    events: [],
    blogs: [],
    colleges: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  // Fetch search results based on input
  const fetchSearchResults = async (query) => {
    setIsLoading(true);
    try {
      console.log("INside searching box component");
      const response = await fetch(
        `${process.env.baseUrl}${process.env.version}/search?q=${query}`
      );
      if (response.ok) {
        const data = await response.json();
        console.log("Data of search:", data);
        setSearchResults({
          blogs: Array.isArray(data.blogs) ? data.blogs : [],
          events: Array.isArray(data.events) ? data.events : [],
          colleges: Array.isArray(data.colleges) ? data.colleges : [],
        });
      } else {
        console.error("Error fetching results:", response.statusText);
        setSearchResults({ blogs: [], events: [] });
      }
    } catch (error) {
      console.error("Error fetching search results:", error.message);
      setSearchResults({ blogs: [], events: [] });
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    console.log("Search result data:", searchResults);
  }, [searchResults]);

  useEffect(() => {
    if (searchTag.trim() !== "") {
      fetchSearchResults(searchTag);
    } else {
      setSearchResults({ blogs: [], events: [] });
    }
  }, [searchTag]);

  const handleInputChange = (e) => {
    setSearchTag(e.target.value);
  };

  const handleItemClick = (value) => {
    setSearchTag(value);
  };

  const handleViewAll = () => {
    onClose();
  };

  const ResultSection = ({ title, items }) => {
    if (!Array.isArray(items) || items.length === 0) return null;
    const categoryPath = title.toLowerCase();

    return (
      items.length > 0 && (
        <div className="mb-8 px-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">{title}</h2>
            {items.length > 3 && (
              <Link
                href={`/${categoryPath}`}
                className="text-sm text-[#30AD8F] border-b border-[#30AD8F] "
                onClick={onClose}
              >
                View All
              </Link>
            )}
            {/* <button className="text-sm text-[#30AD8F]" >View All</button> */}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {items.slice(0, 3).map((item, index) => (
              <>
                <Link href={`/${categoryPath}/${item.slugs}`} key={index}>
                  <div key={index} className="cursor-pointer   p-4 max-w-sm ">
                    <div className="flex justify-center border-2 rounded-3xl items-center  overflow-hidden mb-2 p-4">
                      <img
                        src="/images/hult_prize.png"
                        alt={item.name}
                        className="w-48 h-48 object-contain"
                      />
                    </div>
                    <div className="px-4 pb-4 flex flex-col ">
                      <h3 className="text-lg   font-bold text-center">
                        {item.name}
                      </h3>
                      {/* <p className="text-xs text-gray-700 text-center">
                        {item.location}
                      </p> */}
                    </div>
                  </div>
                </Link>
              </>
            ))}
          </div>
        </div>
      )
    );
  };

  return (
    <div
      className={`fixed flex flex-col top-0 left-0 w-full transition-all duration-300 z-50 ${
        searchTag.trim()
          ? "h-screen bg-white overflow-auto"
          : "h-[450px] bg-white shadow-md"
      }`}
      onClick={(e) => e.stopPropagation()} // Prevents clicks from propagating
    >
      {/* Search Input Container */}
      <div className="relative flex justify-center mt-6">
        <div className="relative w-[600px]">
          <input
            type="text"
            placeholder="Search Universities, Colleges, Events & more..."
            value={searchTag}
            className="w-full py-2 border-b-2 border-black focus:outline-none placeholder-gray-500 pr-16"
            onChange={handleInputChange}
            autoFocus
          />
          {/* Icons Container */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-4 pr-2">
            {searchTag.trim() && (
              <button
                onClick={() => {
                  setSearchTag("");
                  setSearchResults({ news: [], events: [] });
                }}
                className="hover:bg-[#30AD8F] hover:rounded-lg  "
              >
                <RxCross2
                  size={20}
                  className="text-gray-600 hover:text-white "
                />
              </button>
            )}
            <IoIosSearch size={20} className="text-black" />
          </div>
        </div>
      </div>

      {/* 🔹 Popular Searches (Now Centered Below Search Field) */}
      {!searchTag.trim() && (
        <div className="absolute left-1/2 transform -translate-x-1/2 mt-20 w-[600px] h-[400px] overflow-y-auto">
          <h3 className="text-gray-500 font-semibold">Popular Searches</h3>
          <ul className="mt-2  ">
            {popularSearches.map((search, index) => (
              <li
                key={index}
                className="py-2  font-medium cursor-pointer hover:bg-gray-100 hover:text-[#30AD8F] rounded-md"
                onClick={() => handleItemClick(search)}
              >
                {search}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 🔹 Search Results */}
      {searchTag.trim() && (
        <div className="w-full mt-6 px-10">
          {isLoading ? (
            <div className="text-gray-500 text-center mt-10">Loading...</div>
          ) : (
            <>
              {Object.values(searchResults).every((arr) => arr.length === 0) ? (
                <div className="text-gray-500 text-center mt-10">
                  No results found for "{searchTag}"
                </div>
              ) : (
                <>
                  {/* <ResultSection title="Colleges" items={searchResults.colleges} />
                  <ResultSection title="Universities" items={searchResults.universities} /> */}
                  <ResultSection title="Events" items={searchResults.events} />
                  <ResultSection title="Blogs" items={searchResults.blogs} />
                  <ResultSection
                    title="Colleges"
                    items={searchResults.colleges}
                  />
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBox;
