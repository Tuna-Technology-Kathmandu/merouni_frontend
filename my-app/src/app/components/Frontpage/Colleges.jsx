"use client";
import React, { useState, useEffect } from "react";
import CollegeCard from "./CollegeCard";
import { useRef } from "react";
import { getColleges } from "@/app/action";
import Link from "next/link";

const Colleges = () => {
  const [featuredColleges, setFeaturedColleges] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const gradients = [
    "linear-gradient(150deg,#00ADEF, #B5F1F8)",
    "linear-gradient(150deg, #FF4B54, #FF6A88)",
    "linear-gradient(150deg, #0049FF, #C7D6FE)",
  ];

  useEffect(() => {
    fetchFeaturedColleges();
  }, []);

  const fetchFeaturedColleges = async () => {
    try {
      // const response = await getFeaturedColleges();
      const response = await getColleges(true, undefined);
      setFeaturedColleges(response.items);
    } catch (error) {
      console.error("Error fetching the colleges data:", error);
      setError("Failed to load featured Colleges");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  }, [featuredColleges]);

  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 520;
    const targetScroll =
      container.scrollLeft +
      (direction === "left" ? -scrollAmount : scrollAmount);

    container.scrollTo({
      left: targetScroll,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative max-w-[2500px] mx-auto my-16">
      <div className="font-extrabold text-lg mx-8 my-8">Featured Colleges</div>
      {loading ? (
        // <Loading/>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div
          ref={scrollContainerRef}
          className="flex max-h-[1000px] overflow-x-auto scroll-smooth parent-div hide-scrollbar"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {featuredColleges.map((college, index) => (
            <Link href={`/colleges/${college.slugs}`} key={index}>
              <CollegeCard
                logo={college.college_logo}
                name={college.name}
                address={`${college.address.city},${college.address.country}`}
                key={index}
                gradient={gradients[index % gradients.length]}
              />
            </Link>
          ))}
        </div>
      )}

      <div className="flex justify-end mx-8 gap-4 mt-8">
        <button
          onClick={() => scroll("left")}
          className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
          aria-label="Previous"
        >
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => scroll("right")}
          className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
          aria-label="Next"
        >
          <svg
            className="w-6 h-6 text-gray-600 "
            fill="none"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Colleges;
