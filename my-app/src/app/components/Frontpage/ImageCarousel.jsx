"use client";

import { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { getFeaturedColleges, getColleges } from "@/app/action";
import Link from "next/link";

const ImageCarousel = () => {
  const [featuredColleges, setFeaturedColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // State for error handling

  useEffect(() => {
    fetchFeaturedColleges();
  }, []);

 

  const fetchFeaturedColleges = async () => {
    try {
      console.log("Hlo zero");
      // const response = await getFeaturedColleges();
      const response = await getColleges(false, true);
      console.log("RESOPHOSG:", response);
      setFeaturedColleges(response.items);
    } catch (error) {
      console.error("Error fetching the colleges data:", error);
      setError("Failed to load featured Colleges");
    } finally {
      setLoading(false);
    }
  };

  const images = [
    {
      url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1",
      alt: "Modern college library",
      description:
        "Explore a modern library equipped with advanced resources for students.",
    },
    {
      url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f",
      alt: "University campus",
      description:
        "Experience a vibrant university campus filled with diverse opportunities.",
    },
    {
      url: "https://images.unsplash.com/photo-1627556704290-2b1f5853ff78",
      alt: "Tech Lab",
      description:
        "State-of-the-art tech labs to support innovation and learning.",
    },
    {
      url: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f",
      alt: "Graduation celebration",
      description:
        "Celebrate academic achievements in a prestigious graduation ceremony.",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === featuredColleges.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, featuredColleges.length]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === featuredColleges.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? featuredColleges.length - 1 : prevIndex - 1
    );
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    ); // Display loading text if data is being fetched
  if (error) return <div>{error}</div>; //

  return (
    <div className="relative w-full h-full overflow-hidden  shadow-lg">
      {/* Image and Overlay */}
      <div
        className="absolute w-full h-full transition-transform duration-500 ease-in-out"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
          display: "flex",
        }}
      >
        {featuredColleges.map((college, index) => (
          <div
            key={index}
            className="min-w-full h-full relative"
            style={{ flex: "0 0 100%" }}
          >
            <img
              src={images[1].url || college.assets.gallery.featuredImage} // Image URL from the API
              alt={college.fullname} // College name as alt text
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src =
                  "https://images.unsplash.com/photo-1531545514256-b1400bc00f31";
                e.target.alt = "Fallback college image";
              }}
            />

            <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-end p-6">
              <div className="flex justify-between items-center ml-10 mb-10">
                <div>
                  <p className="text-white text-lg font-semibold">
                    {college.name}
                  </p>
                  <p className="text-white">
                    {college.description || "Best College Out there"}
                  </p>
                </div>

                <div>
                  <Link href={`/colleges/${college.slugs}`} key={index}>
                    <button
                      type="button"
                      className=" text-white py-2 px-4 rounded-md shadow-lg hover:bg-[#30AD8F] transition-all duration-200"
                    >
                      View More
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 transition-all duration-200 focus:outline-none"
        aria-label="Previous slide"
      >
        <FiChevronLeft className="w-6 h-6 text-gray-800" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 transition-all duration-200 focus:outline-none"
        aria-label="Next slide"
      >
        <FiChevronRight className="w-6 h-6 text-gray-800" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {featuredColleges.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              currentIndex === index
                ? "bg-white"
                : "bg-white bg-opacity-50 hover:bg-opacity-75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
