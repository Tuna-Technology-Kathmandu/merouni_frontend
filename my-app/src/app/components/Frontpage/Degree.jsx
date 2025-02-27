"use client";
import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FaArrowCircleRight } from "react-icons/fa";
import { getPrograms } from "@/app/action";

const DegreeScroller = () => {
  const scrollerRef = useRef(null);
  const fieldsScrollerRef = useRef(null);
  const sectionRef = useRef(null);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);

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

  const fetchPrograms = async () => {
    try {
      const response = await getPrograms();
      setPrograms(response.items);
    } catch (error) {
      setError("Failed to fetch degrees");
      console.error("Failed to fetch degrees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !hasFetched) {
          fetchPrograms();
          setHasFetched(true);
        }
      },
      {
        root: null,
        threshold: 0.5,
      }
    );
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [hasFetched]);

  const scrollBy = (offset, ref) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: offset,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
  }, [programs]);

  return (
    <div className=" my-12">
      {/* First Section - Degree Programs */}
      <div
        className="relative max-w-[2000px] mx-auto px-4 bg-white text-black mt-12 md:mt-36"
        ref={sectionRef}
      >
        <h2 className="text-xl font-bold mb-6">
          Find the Right Degree For You
        </h2>

        <div className="relative">
          <div
            ref={scrollerRef}
            className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-thin scrollbar-track-gray-100 h-72 md:h-96 scrollbar-thumb-black pb-4"
            style={{
              scrollbarWidth: "thin",
              msOverflowStyle: "none",
            }}
            onWheel={(e) => {
              e.preventDefault();
              scrollerRef.current.scrollLeft += e.deltaY;
            }}
          >
            {programs.map((degree, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[280px] md:w-64 bg-[#dedede] rounded-lg p-8 md:p-12 flex items-center justify-center text-center"
              >
                <h3 className="font-bold text-black my-auto   break-normal ">
                  {/* whitespace-nowrap */}
                  {degree.title}
                </h3>
              </div>
            ))}
            {/* {degrees.map((degree) => (
              <div
                key={degree.id}
                className="flex-shrink-0 w-[280px] md:w-64 bg-[#dedede] rounded-lg p-8 md:p-12 flex items-center justify-center "
              >
                <h3 className="font-bold text-black my-auto  whitespace-nowrap ">
                  {degree.name}
                </h3>
              </div>
            ))} */}
          </div>

          {/* Navigation Buttons - Hidden on mobile */}
          <button
            onClick={() => scrollBy(-300, scrollerRef)}
            className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-lg"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={() => scrollBy(300, scrollerRef)}
            className="hidden md:block absolute right-0 top-1/2 translate-x-4 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Second Section - Fields of Study */}
      <div className=" max-w-[2000px] mx-auto mt-12 md:mt-44 p-4 md:p-12">
        {/* Content Container */}
        <div className="flex flex-col lg:flex-row gap-8 md:gap-24">
          {/* Text Content */}
          <div className="flex flex-col gap-4 px-4 md:px-8">
            <h2 className="font-extrabold text-4xl md:text-7xl max-w-full md:w-[600px]">
              Selective Fields to Study
            </h2>
            <p className="font-bold text-sm md:text-base">
              Explore diverse fields of study to find the best fit for your
              academic and career goals
            </p>
            <button className="w-[130px] text-center border border-black rounded-xl flex items-center justify-center p-2 font-bold">
              View all
              <div className="w-6 h-6 rounded-full bg-black text-white mx-2">
                &gt;
              </div>
            </button>
          </div>

          {/* Scrollable Cards */}
          <div
            ref={fieldsScrollerRef}
            className="flex gap-4 overflow-x-auto scroll-smooth pb-4 px-4 md:px-8 parent-div"
          >
            {[
              { number: "1", title: "Engineering" },
              { number: "2", title: "Medical" },
              { number: "3", title: "Humanities" },
              { number: "4", title: "Law" },
              { number: "4", title: "Law" },
              { number: "4", title: "Law" },
              { number: "4", title: "Law" },
              { number: "4", title: "Law" },
              // ... add more fields as needed
            ].map((field, index) => (
              <div
                key={index}
                className="flex-shrink-0 border-2 h-[200px] md:h-[250px] w-[200px] md:w-[250px] p-4 rounded-2xl flex flex-col items-start justify-center gap-4"
              >
                <div className="font-black text-3xl md:text-4xl">
                  {field.number}
                </div>
                <div className="font-bold text-lg md:text-xl">
                  {field.title}
                </div>
                <div className="text-sm md:text-base">120 colleges</div>
                <div className="self-end">
                  <FaArrowCircleRight className="w-8 h-8 md:w-10 md:h-10 " />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DegreeScroller;
