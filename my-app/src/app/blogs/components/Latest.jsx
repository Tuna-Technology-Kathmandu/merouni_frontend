"use client";
import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { GoArrowLeft } from "react-icons/go";
import { GoArrowRight } from "react-icons/go";
import { getBlogs } from "@/app/action";
import LatestBlogsShimmer from "../components/LatestBlogShimmer"; // Adjust path if needed
import LatestBlogs from "./LatestBlogs"; // Adjust path if needed

const Latest = () => {
  const scrollRef = useRef(null);
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

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
    if (str?.length > maxLength) {
      // Optional chaining for str
      return str.slice(0, maxLength) + "...";
    }
    return str;
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    try {
      // Try-catch for date parsing
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date"; // Or a suitable default
    }
  };

  return (
    <div className="bg-[#F1F1F1]">
      <div className="flex flex-col max-w-[1600px] mx-auto px-4 sm:px-8">
        <div className="border-b-2 border-[#0A70A7] w-[45px] mt-10">
          <span className="text-2xl font-bold mr-2">Latest</span>
          <span className="text-[#0A70A7] text-2xl font-bold">Blogs</span>
        </div>

        {loading ? (
          <div className="relative mb-10">
            <div className="flex overflow-x-auto scrollbar-thin scrollbar-thumb-black scrollbar-track-gray-200 p-2">
              {[...Array(4)].map((_, i) => (
                <LatestBlogsShimmer key={i} />
              ))}
            </div>
          </div>
        ) : (
          <div className="relative mb-10">
            <button
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 p-2 rounded-full shadow-md z-10"
            >
              <GoArrowLeft />
            </button>
            <button
              onClick={scrollRight}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 p-2 rounded-full shadow-md z-10"
            >
              <GoArrowRight />
            </button>
            <div
              ref={scrollRef}
              className="flex overflow-x-auto scrollbar-thin scrollbar-thumb-black scrollbar-track-gray-200 p-2"
            >
              {blogs?.length > 0 ? ( // Optional chaining for blogs
                blogs.map((blog, index) => (
                  <Link href={`/blogs/${blog.slug}`} key={index}>
                    <LatestBlogs
                      key={index}
                      title={truncateString(blog.title, 30)}
                      description={truncateString(blog.description, 100)}
                      image={
                        blog?.featured_image ||
                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ718nztPNJfCbDJjZG8fOkejBnBAeQw5eAUA&s"
                      } // Use blog.image if available
                      date={formatDate(blog.createdAt)}
                    />
                  </Link>
                ))
              ) : error ? (
                <p>{error}</p>
              ) : (
                <p>No blogs found</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Latest;
