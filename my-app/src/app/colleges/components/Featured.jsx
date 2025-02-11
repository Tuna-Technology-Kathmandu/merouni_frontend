"use client";

import React, { useRef, useState, useEffect } from "react";
import Fcollege from "./Fcollege";
import { GoArrowLeft } from "react-icons/go";
import { GoArrowRight } from "react-icons/go";
import { getColleges } from "@/app/action";

const collegesData = [
  {
    name: "Xavier Academy - Lazimpat, Kathmandu",
    description:
      "Located in the heart of the city precinct Baneshwor, a cultural melting point of communities from all over the country.",
    image: "/images/eventcard.png",
  },
  {
    name: "Thames International College",
    description:
      "One of the leading institutions with a focus on holistic education and interdisciplinary learning.",
    image: "/images/eventcard.png",
  },
  {
    name: "Xavier Academy - Lazimpat, Kathmandu",
    description:
      "Located in the heart of the city precinct Baneshwor, a cultural melting point of communities from all over the country.",
    image: "/images/eventcard.png",
  },
  {
    name: "Thames International College",
    description:
      "One of the leading institutions with a focus on holistic education and interdisciplinary learning.",
    image: "/images/eventcard.png",
  },
  {
    name: "Xavier Academy - Lazimpat, Kathmandu",
    description:
      "Located in the heart of the city precinct Baneshwor, a cultural melting point of communities from all over the country.",
    image: "/images/eventcard.png",
  },
  {
    name: "Thames International College",
    description:
      "One of the leading institutions with a focus on holistic education and interdisciplinary learning.",
    image: "/images/eventcard.png",
  },
  {
    name: "Xavier Academy - Lazimpat, Kathmandu",
    description:
      "Located in the heart of the city precinct Baneshwor, a cultural melting point of communities from all over the country.",
    image: "/images/eventcard.png",
  },
  {
    name: "Thames International College",
    description:
      "One of the leading institutions with a focus on holistic education and interdisciplinary learning.",
    image: "/images/eventcard.png",
  },
  {
    name: "Xavier Academy - Lazimpat, Kathmandu",
    description:
      "Located in the heart of the city precinct Baneshwor, a cultural melting point of communities from all over the country.",
    image: "/images/eventcard.png",
  },
  {
    name: "Thames International College",
    description:
      "One of the leading institutions with a focus on holistic education and interdisciplinary learning.",
    image: "/images/eventcard.png",
  },
  {
    name: "Xavier Academy - Lazimpat, Kathmandu",
    description:
      "Located in the heart of the city precinct Baneshwor, a cultural melting point of communities from all over the country.",
    image: "/images/eventcard.png",
  },
  {
    name: "Thames International College",
    description:
      "One of the leading institutions with a focus on holistic education and interdisciplinary learning.",
    image: "/images/eventcard.png",
  },
  {
    name: "Xavier Academy - Lazimpat, Kathmandu",
    description:
      "Located in the heart of the city precinct Baneshwor, a cultural melting point of communities from all over the country.",
    image: "/images/eventcard.png",
  },
  {
    name: "Thames International College",
    description:
      "One of the leading institutions with a focus on holistic education and interdisciplinary learning.",
    image: "/images/eventcard.png",
  },

  // Add more colleges as needed
];

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFeaturedColleges();
  }, []);

  const fetchFeaturedColleges = async () => {
    try {
      const response = await getColleges(true, undefined);
      console.log("RESOPHOSG:", response);
      setFeaturedColleges(response.items);
    } catch (error) {
      console.error("Error fetching the colleges data:", error);
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
        <div
          ref={scrollRef}
          className="flex gap-10 overflow-x-auto scrollbar-thin scrollbar-thumb-black scrollbar-track-gray-200 p-2  "
        >
          {featuredColleges.map((college, index) => (
            <Fcollege
              description={college.description}
              name={college.name}
              image={collegesData[0].image || college.featured_img}
              key={index}
              slug={college.slugs}
            />
          ))}

          {/* {collegesData.map((college, index) => (
            <Fcollege
              key={index}
              name={college.name}
              description={college.description}
              image={college.image}
            />
          ))} */}
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
  );
};

export default Featured;
