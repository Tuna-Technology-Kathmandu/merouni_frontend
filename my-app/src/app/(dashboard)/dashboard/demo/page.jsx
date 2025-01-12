"use client";
import React, { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CollegeScroller = () => {
  const scrollerRef = useRef(null);

  const colleges = [
    {
      id: 1,
      name: "Thapathali Campus",
      location: "Kathmandu, Nepal",
      fees: 1200,
      image: "/uni.jpg",
    },
    {
      id: 2,
      name: "Pulchowk Campus",
      location: "Lalitpur, Nepal",
      fees: 1500,
      image: "/uni.jpg",
    },
    {
      id: 3,
      name: "Kathmandu University",
      location: "Dhulikhel, Nepal",
      fees: 2000,
      image: "/uni.jpg",
    },
    {
      id: 4,
      name: "Patan Multiple Campus",
      location: "Patan, Nepal",
      fees: 1000,
      image: "/uni.jpg",
    },
    {
      id: 5,
      name: "IOE Western Region Campus",
      location: "Pokhara, Nepal",
      fees: 1400,
      image: "/uni.jpg",
    },
    {
      id: 6,
      name: "Nepal Engineering College",
      location: "Bhaktapur, Nepal",
      fees: 1300,
      image: "/uni.jpg",
    },
    {
      id: 7,
      name: "Tribhuvan University",
      location: "Kirtipur, Nepal",
      fees: 1100,
      image: "/uni.jpg",
    },
    {
      id: 8,
      name: "IOE Eastern Region Campus",
      location: "Dharan, Nepal",
      fees: 1350,
      image: "/uni.jpg",
    },
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
    <div className="relative max-w-6xl mx-auto px-4">
      <h2 className="text-xl font-bold mb-6">Explore Colleges</h2>

      <div className="relative">
        {/* Scroller Container */}
        <div
          ref={scrollerRef}
          className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-black"
          style={{
            scrollbarWidth: "thin",
            msOverflowStyle: "none",
          }}
          onWheel={(e) => {
            e.preventDefault();
            scrollerRef.current.scrollLeft += e.deltaY;
          }}
        >
          {colleges.map((college) => (
            <div
              key={college.id}
              className="flex-shrink-0 w-64 bg-gray-100 rounded-lg p-4"
            >
              <img
                src={college.image}
                alt={college.name}
                className="w-full h-40 object-cover mb-4 rounded"
              />

              <div className="space-y-2">
                <h3 className="font-semibold">{college.name}</h3>
                <p className="text-sm text-gray-600">{college.location}</p>
                <p className="font-bold">Fees: ${college.fees.toFixed(2)}</p>
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

export default CollegeScroller;