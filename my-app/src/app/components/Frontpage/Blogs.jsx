"use client";

import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { getBlogs } from "@/app/action";
import Link from "next/link";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const blogRef = useRef(null);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await getBlogs(1);
      console.log("Response of blogs:", response);
      setBlogs(response.items.slice(0, 4));
    } catch (error) {
      setError("Failed to fetch Blogs");
      console.error("Failed to fetch blogs and articles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && blogs.length === 0) {
          fetchBlogs(); // Fetch only when visible
          observer.disconnect(); // Stop observing after fetching
        }
      },
      { threshold: 0.1 }
    );

    if (blogRef.current) {
      observer.observe(blogRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  useEffect(() => {
    console.log("Blogs HOme:", blogs);
  }, [blogs]);

  return (
    <div ref={blogRef} className="max-w-[1700px] mx-auto my-36">
      <div className="font-extrabold text-xl md:text-4xl px-2 md:px-32 my-8 whitespace-nowrap ">
        Featured Blogs and Articles
      </div>

      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}
      <div className="hidden tb:block">
        <div className="flex flex-wrap gap-y-16 px-12 ">
          {blogs.slice(0, 2).map((blog, index) => (
            <Link
              href={`/blogs/${blog.slug}`}
              key={index}
              className="w-1/2 flex items-start justify-center"
            >
              <div className="w-1/2 flex items-start justify-center">
                <div className="flex flex-col max-w-[500px] gap-1">
                  <div className="font-bold">
                    {blog?.title ||
                      "GATE 2025 Chemical Engineering (CH) Syllabus: Check Dates,  Books, Syllabus, and More"}
                  </div>
                  <div>
                    {blog?.description ||
                      " IIT Roorkee released the GATE 2025 chemical engineering  syllabus on the GATE’s official website, gate2025.iitr.ac.in.  The detailed..."}
                  </div>
                  <div className="font-bold">{formatDate(blog.createdAt)}</div>
                </div>
                <Image
                  src={"/images/blogs.png" || blog.images}
                  width={100}
                  height={100}
                  alt={blog.title || "Event image"}
                  className="object-contain mx-2"
                />
              </div>
            </Link>
          ))}

          {blogs.slice(2, 4).map((blog, index) => (
            <Link
              href={`/blogs/${blog.slugs}`}
              key={index}
              className="w-1/2 flex items-start justify-center"
            >
              <div className="w-1/2 flex items-start justify-center">
                <div className="flex flex-col max-w-[500px] gap-1">
                  <div className="font-bold">
                    {blog?.title ||
                      "GATE 2025 Chemical Engineering (CH) Syllabus: Check Dates,  Books, Syllabus, and More"}
                  </div>
                  <div>
                    {blog?.description ||
                      " IIT Roorkee released the GATE 2025 chemical engineering  syllabus on the GATE’s official website, gate2025.iitr.ac.in.  The detailed..."}
                  </div>
                  <div className="font-bold">{formatDate(blog.createdAt)}</div>
                </div>
                <Image
                  src={"/images/blogs.png" || blog.images}
                  width={100}
                  height={100}
                  alt={blog.title || "Event image"}
                  className="object-contain mx-2"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="block tb:hidden">
        {blogs.length > 0 && (
          <Link href={`/blogs/${blogs[0]?.slugs}`}>
            <div className="flex flex-col bg-white rounded-2xl shadow-lg overflow-hidden mx-4 my-4 md:max-w-[600px]">
              <Image
                src={"/images/aiimg.png" || blogs[0]?.images} // Dynamically set image
                width={400}
                height={200}
                alt={blogs[0]?.title || "GATE Chemical Engineering"}
                className="w-full object-cover h-[200px]"
              />

              <div className="p-6 space-y-4">
                <h2 className="text-xl font-bold text-gray-800">
                  {blogs[0]?.title ||
                    "GATE 2025 Chemical Engineering (CH) Syllabus: Check Dates, Books, Syllabus, and More"}
                </h2>

                <p className="text-gray-600 text-sm">
                  {blogs[0]?.description ||
                    "IIT Roorkee released the GATE 2025 chemical engineering syllabus on the GATE's official website, gate2025.iitr.ac.in. The detailed..."}
                </p>

                <p className="text-gray-500 text-sm">
                  {blogs[0]?.createdAt
                    ? formatDate(blogs[0].createdAt)
                    : "Jan 2, 2025"}
                </p>
              </div>
            </div>
          </Link>
        )}
      </div>

      <Link href={"/blogs"}>
        <button className="w-[210px] text-center  border-[#2EAE8F] border-2 rounded-xl  flex items-center justify-center p-2 font-bold text-[#9ad7c8] self-center mx-auto my-8">
          View more articles
          <div className="w-6 h-6 rounded-full  mx-2 text-[#9ad7c8]">&gt;</div>
        </button>
      </Link>
    </div>
  );
};

export default Blogs;
