"use client";

import React, { useState, useEffect } from "react";
import { IoIosSearch } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";

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
  const [searchResults, setSearchResults] = useState({ news: [], events: [] });
  const [isLoading, setIsLoading] = useState(false); // For loading indication

  // Fetch search results based on input
  const fetchSearchResults = async (query) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.baseUrl}/search?q=${query}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
      } else {
        console.error("Error fetching results:", response.statusText);
        setSearchResults({ news: [], events: [] });
      }
    } catch (error) {
      console.error("Error fetching search results:", error.message);
      setSearchResults({ news: [], events: [] });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (searchTag.trim() !== "") {
      // Only fetch results for non-empty queries
      fetchSearchResults(searchTag);
    } else {
      setSearchResults({ news: [], events: [] });
    }
  }, [searchTag]);

  const handleInputChange = (e) => {
    setSearchTag(e.target.value);
  };

  const handleItemClick = (value) => {
    setSearchTag(value);
  };

  return (
    <div
      className="flex flex-col bg-white shadow-md w-full h-[450px] z-50 items-center justify-center"
      onClick={(e) => e.stopPropagation()} // Prevents clicks from propagating
    >
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search Universities, Colleges, Events & more..."
          name="searchTag"
          value={searchTag}
          className="py-2 border-b-2 border-black focus:outline-none w-[550px] placeholder-gray-500"
          onChange={handleInputChange}
          autoFocus
        />
        <span className="absolute top-1/2 right-20 transform -translate-y-1/2 text-gray-400">
          <IoIosSearch size={25} style={{ color: "black" }} />
        </span>
        <button
          onClick={onClose}
          className="absolute top-1/2 right-4 transform -translate-y-1/2"
        >
          <RxCross2 size={20} />
        </button>
      </div>

      {/* Search Results or Popular Searches */}
      <div className="w-[550px] mt-4 h-[350px] overflow-y-auto">
        {searchTag.trim() ? (
          isLoading ? (
            <div className="text-gray-500 text-center">Loading...</div>
          ) : (
            <>
              <ul>
                {searchResults.news.length > 0 && (
                  <>
                    <li className="text-gray-500 mt-2 font-semibold">News</li>
                    {searchResults.news.map((news, index) => (
                      <li
                        key={`news-${index}`}
                        className="mt-2 font-medium cursor-pointer hover:text-[#30AD8F]"
                        onClick={() => handleItemClick(news.title)}
                      >
                        {news.title}
                      </li>
                    ))}
                  </>
                )}
                {searchResults.events.length > 0 && (
                  <>
                    <li className="text-gray-500 mt-2 font-semibold">Events</li>
                    {searchResults.events.map((event, index) => (
                      <li
                        key={`event-${index}`}
                        className="mt-2 font-medium cursor-pointer hover:text-[#30AD8F]"
                        onClick={() => handleItemClick(event.title)}
                      >
                        {event.title}
                      </li>
                    ))}
                  </>
                )}
              </ul>
              {searchResults.news.length === 0 &&
                searchResults.events.length === 0 && (
                  <div className="text-gray-500 text-center">
                    No results found for "{searchTag}"
                  </div>
                )}
            </>
          )
        ) : (
          <ul className="mt-2">
            <li className="text-gray-500 mt-2 font-semibold">
              Popular Searches
            </li>
            {popularSearches.map((search, index) => (
              <li key={index} className="mt-2 font-medium cursor-pointer hover:text-[#30AD8F]" onClick={() => handleItemClick(search)}>
                {search}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SearchBox;
