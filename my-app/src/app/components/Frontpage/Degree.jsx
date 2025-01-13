"use client";
import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DegreeScroller = () => {
  const scrollerRef = useRef(null);

  const degrees = [
    { id: 1, name: "Computer Engineering", duration: "4 years", fees: 1200 },
    { id: 2, name: "Electrical Engineering", duration: "4 years", fees: 1500 },
    { id: 3, name: "Mechanical Engineering", duration: "4 years", fees: 2000 },
    { id: 4, name: "Civil Engineering", duration: "4 years", fees: 1000 },
    { id: 5, name: "Architecture", duration: "5 years", fees: 1400 },
    { id: 6, name: "Software Engineering", duration: "4 years", fees: 1300 },
    { id: 7, name: "Electronics Engineering", duration: "4 years", fees: 1100 },
    { id: 8, name: "Biomedical Engineering", duration: "4 years", fees: 1350 },
  ];

  const scrollBy = (offset) => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollBy({
        left: offset,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative max-w-6xl mx-auto px-4 h-screen bg-white text-black mt-36">
      <h2 className="text-xl font-bold mb-6">Explore Degrees</h2>

      <div className="relative">
        {/* Scroller Container */}
        <div
          ref={scrollerRef}
          className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-thin scrollbar-track-gray-100 h-64  scrollbar-thumb-black"
          style={{
            scrollbarWidth: "thin",
            msOverflowStyle: "none",
          }}
          onWheel={(e) => {
            e.preventDefault();
            scrollerRef.current.scrollLeft += e.deltaY;
          }}
        >
          {degrees.map((degree) => (
            <div
              key={degree.id}
              className="flex-shrink-0 w-64 bg-gray-100 rounded-lg p-12"
            >
              <div className="space-y-4">
                <h3 className="font-semibold">{degree.name}</h3>
                <p className="text-sm text-gray-600">Duration: {degree.duration}</p>
                <p className="font-bold">Fees: ${degree.fees.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Left and Right Navigation Buttons */}
        <button
          onClick={() => scrollBy(-300)}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-lg"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={() => scrollBy(300)}
          className="absolute right-0 top-1/2 translate-x-4 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default DegreeScroller;
