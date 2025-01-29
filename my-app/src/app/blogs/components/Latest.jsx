"use client";
import React, { useRef, useState, useEffect } from "react";

import LatestBlogs from "./LatestBlogs";
import { GoArrowLeft } from "react-icons/go";
import { GoArrowRight } from "react-icons/go";
import { getBlogs } from "@/app/action";
import Loading from "../../components/Loading";
import Link from "next/link";

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

  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getBlogs(1);
      setBlogs(response.items);
    } catch (error) {
      setError("Failed to load latest Blogs");
      console.error("Error fetching latest blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const truncateString = (str, maxLength) => {
    if (str.length > maxLength) {
      return str.slice(0, maxLength) + "...";
    }
    return str;
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
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

          {loading ? (
            <Loading />
          ) : (
            <div className="relative mb-10">
              {/* Left Scroll Button */}
              <button
                onClick={scrollLeft}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 p-2 rounded-full shadow-md z-10"
              >
                <GoArrowLeft />
              </button>

              {/* <Link href={`/events/${event.slugs}`} key={index}> */}


              <div
                ref={scrollRef}
                className="flex  overflow-x-auto scrollbar-thin scrollbar-thumb-black scrollbar-track-gray-200 p-2"
              >
                {blogs.length > 0 ? (
                  blogs.map((blog, index) => (
                    <Link href={`/blogs/${blog.slugs}`} key={index}>
                    <LatestBlogs
                      key={index}
                      title={truncateString(blog.title, 30)}
                      description={truncateString(blog.description, 100)}
                      image={collegesData[1]["image"]}
                      date={formatDate(blog.createdAt)}
                      />
                      </Link>
                  ))
                ) : loading ? (
                  <p>Loading....</p>
                ) : error ? (
                  <p>{error}</p>
                ) : (
                  <p>No blogs found within the 4 days</p>
                )}
              </div>

              {/* Right Scroll Button */}
              <button
                onClick={scrollRight}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 p-2 rounded-full shadow-md z-10 "
              >
                <GoArrowRight />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Latest;
