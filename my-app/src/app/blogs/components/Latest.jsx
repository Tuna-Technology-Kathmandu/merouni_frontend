"use client";
import React, { useRef } from "react";

import LatestBlogs from "./LatestBlogs";
import { GoArrowLeft } from "react-icons/go";
import { GoArrowRight } from "react-icons/go";

const collegesData = [
  {
    title: "Engineering Education in Nepal",
    date: "June 20, 2024",
    description:
      "Engineering has long been regarded as one of Nepal's most prestigious and so...",
    image: "/images/blogs_image2.png",
  },
  {
    title: "Engineering Education in Nepal",
    date: "June 20, 2024",
    description:
      "Engineering has long been regarded as one of Nepal's most prestigious and so...",
    image: "/images/blogs_image1.png",
  },
  {
    title: "Engineering Education in Nepal",
    date: "June 20, 2024",
    description:
      "Engineering has long been regarded as one of Nepal's most prestigious and so...",
    image: "/images/blogs_image2.png",
  },
  {
    title: "Engineering Education in Nepal",
    date: "June 20, 2024",
    description:
      "Engineering has long been regarded as one of Nepal's most prestigious and so...",
    image: "/images/blogs_image1.png",
  },
  {
    title: "Engineering Education in Nepal",
    date: "June 20, 2024",
    description:
      "Engineering has long been regarded as one of Nepal's most prestigious and so...",
    image: "/images/blogs_image2.png",
  },
  {
    title: "Engineering Education in Nepal",
    date: "June 20, 2024",
    description:
      "Engineering has long been regarded as one of Nepal's most prestigious and so...",
    image: "/images/blogs_image1.png",
  },
  {
    title: "Engineering Education in Nepal",
    date: "June 20, 2024",
    description:
      "Engineering has long been regarded as one of Nepal's most prestigious and so...",
    image: "/images/blogs_image2.png",
  },
  {
    title: "Engineering Education in Nepal",
    date: "June 20, 2024",
    description:
      "Engineering has long been regarded as one of Nepal's most prestigious and so...",
    image: "/images/blogs_image1.png",
  },

  // Add more colleges as needed
];

const Latest = () => {
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

  return (
    <>
      {/*Top Section*/}
      <div className="bg-[#F1F1F1]">
        <div className=" flex flex-col max-w-[1600px]  mx-auto px-8 ">
          <div className="border-b-2 border-[#0A70A7] w-[45px] mt-10">
            <span className="text-2xl font-bold mr-2">Latest</span>
            <span className="text-[#0A70A7] text-2xl font-bold">Blogs</span>
          </div>

          <div className="relative mb-10">
            {/* Left Scroll Button */}
            <button
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 p-2 rounded-full shadow-md z-10"
            >
              <GoArrowLeft />
            </button>

            {/* Scrollable Container */}
            <div
              ref={scrollRef}
              className="flex  overflow-x-auto scrollbar-thin scrollbar-thumb-black scrollbar-track-gray-200 p-2  "
            >
              {collegesData.map((college, index) => (
                <LatestBlogs
                  key={index}
                  title={college.title}
                  description={college.description}
                  image={college.image}
                  date={college.date}
                />
              ))}
            </div>

            {/* Right Scroll Button */}
            <button
              onClick={scrollRight}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 p-2 rounded-full shadow-md z-10 "
            >
              <GoArrowRight />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Latest;
