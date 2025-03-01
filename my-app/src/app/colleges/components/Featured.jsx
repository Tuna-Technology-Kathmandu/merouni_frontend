"use client";

import React, { useRef, useState, useEffect } from "react";
import FcollegeShimmer from "./FCollegeShimmer";
import Fcollege from "./Fcollege";
import { GoArrowLeft } from "react-icons/go";
import { GoArrowRight } from "react-icons/go";
import { getColleges } from "@/app/action";

const Featured = () => {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({
      left: -300, // Adjust the scroll amount as needed
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({
      left: 300,
      behavior: "smooth",
    });
  };

  const [featuredColleges, setFeaturedColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFeaturedColleges();
  }, []);

  const fetchFeaturedColleges = async () => {
    try {
      const response = await getColleges(true, undefined);
      setFeaturedColleges(response.items);
    } catch (error) {
      setError("Failed to load featured Colleges");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {}, [featuredColleges]);

  return (
    <div className="flex flex-col p-4">
      <div className="border-b-2 border-[#0A70A7] w-[45px] mt-8 mb-4 pl-2">
        <span className="text-2xl font-bold mr-2">Featured</span>
        <span className="text-[#0A70A7] text-2xl font-bold">Colleges</span>
      </div>
      <div className="relative">
        {/* Left Scroll Button */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 p-2 rounded-full shadow-md z-10"
        >
          <GoArrowLeft />
        </button>

        {/* Scrollable Container */}
        {loading ? (
          <FcollegeShimmer />
        ) : (
          <div
            ref={scrollRef}
            className="flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-black scrollbar-track-gray-200"
          >
            {featuredColleges.map((college, index) => (
              <Fcollege
                description={college.description}
                name={college.name}
                image={
                  college?.logo ||
                  `https://avatar.iran.liara.run/username?username=${college?.name}`
                }
                key={index}
                slug={college.slugs}
              />
            ))}
          </div>
        )}

        {/* Right Scroll Button */}
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 p-2 rounded-full shadow-md z-10 "
        >
          <GoArrowRight />
        </button>
      </div>
    </div>
  );
};

export default Featured;
