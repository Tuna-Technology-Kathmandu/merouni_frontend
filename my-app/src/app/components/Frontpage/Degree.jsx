"use client";
import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FaArrowCircleRight } from "react-icons/fa";

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
    <div className="h-screen">
      <div className="relative max-w-[2000px] mx-auto px-4  bg-white text-black mt-36">
        <h2 className="text-xl font-bold mb-6">
          Find the Right Degree For You
        </h2>

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
                  <p className="text-sm text-gray-600">
                    Duration: {degree.duration}
                  </p>
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
      <div className="bg-[#f4fbf9]  max-w-[2000px] flex flex-row mt-44 p-12  mx-auto overflow-x-scroll justify-between gap-24 parent-div px-8">
        <div className="flex flex-col my-auto gap-4 ">
          <div className="font-extrabold text-7xl w-[600px]">
            Selective Fields to Study
          </div>
          <div className="font-bold">
            Explore diverse fields of study to find the best fit for your
            academic and career goals
          </div>
          <button className="w-[130px] text-center border border-black rounded-xl  flex items-center justify-center p-2 font-bold">
            View all
            <div className="w-6 h-6 rounded-full bg-black text-white mx-2">
              &gt;
            </div>
          </button>
        </div>
        <div className="flex  gap-4 ">
          <div className="bg-[#e1f3ef] h-[250px] w-[250px] p-4 rounded-2xl flex flex-col items-start justify-center gap-4 ">
            <div className="font-black  text-4xl">1</div>
            <div className="font-bold text-xl">Engineering</div>
            <div>120 colleges</div>
            <div className="self-end ">
              <FaArrowCircleRight
                style={{ width: "40px", height: "40px", color: "#9ad7c8" }}
              />
            </div>
          </div>
          <div className="bg-[#e1f3ef] h-[250px] w-[250px]  p-4 rounded-2xl flex flex-col items-start justify-center gap-4">
            <div className="font-black  text-4xl">2</div>
            <div className="font-bold text-xl">Medical</div>
            <div>120 colleges</div>
            <div className="self-end">
              <FaArrowCircleRight
                style={{ width: "40px", height: "40px", color: "#9ad7c8" }}
              />{" "}
            </div>
          </div>
          <div className="bg-[#e1f3ef] h-[250px] w-[250px]  p-4 rounded-2xl flex flex-col items-start justify-center gap-4">
            <div className="font-black  text-4xl">3</div>
            <div className="font-bold text-xl">Humanities</div>
            <div>120 colleges</div>
            <div className="self-end">
              <FaArrowCircleRight
                style={{ width: "40px", height: "40px", color: "#9ad7c8" }}
              />{" "}
            </div>
          </div>
          <div className="bg-[#e1f3ef] h-[250px] w-[250px]  p-4 rounded-2xl flex flex-col items-start justify-center gap-4">
            <div className="font-black  text-4xl">4</div>
            <div className="font-bold text-xl">Law</div>
            <div>120 colleges</div>
            <div className="self-end">
              <FaArrowCircleRight
                style={{ width: "40px", height: "40px", color: "#9ad7c8" }}
              />{" "}
            </div>
          </div>
          <div className="bg-[#e1f3ef] h-[250px] w-[250px]  p-4 rounded-2xl flex flex-col items-start justify-center gap-4">
            <div className="font-black  text-4xl">4</div>
            <div className="font-bold text-xl">Law</div>
            <div>120 colleges</div>
            <div className="self-end">
              <FaArrowCircleRight
                style={{ width: "40px", height: "40px", color: "#9ad7c8" }}
              />{" "}
            </div>
          </div>
          <div className="bg-[#e1f3ef] h-[250px] w-[250px]  p-4 rounded-2xl flex flex-col items-start justify-center gap-4">
            <div className="font-black  text-4xl">4</div>
            <div className="font-bold text-xl">Law</div>
            <div>120 colleges</div>
            <div className="self-end">
              <FaArrowCircleRight
                style={{ width: "40px", height: "40px", color: "#9ad7c8" }}
              />{" "}
            </div>
          </div>
          <div className="bg-[#e1f3ef] h-[250px] w-[250px]  p-4 rounded-2xl flex flex-col items-start justify-center gap-4">
            <div className="font-black  text-4xl">4</div>
            <div className="font-bold text-xl">Law</div>
            <div>120 colleges</div>
            <div className="self-end">
              <FaArrowCircleRight
                style={{ width: "40px", height: "40px", color: "#9ad7c8" }}
              />{" "}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DegreeScroller;
