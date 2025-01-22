"use client";
import React, { useRef, useState, useEffect } from "react";

import LatestBlogs from "./LatestBlogs";
import { GoArrowLeft } from "react-icons/go";
import { GoArrowRight } from "react-icons/go";
import { getBlogs } from "@/app/action";
import Loading from "../../components/Loading"

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
  const [latestBlogs, setLatestBlogs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBlogs();
  }, []);

  // const loadBlogs = async () => {
  //   try {
  //     const response = await getBlogs();
  //     console.log(response);

  //     if (response.items) {
  //       const allBlogs = response.items;
  //       console.logs("All Blogs:", allBlogs);

  //       const today = new Date();

  //       const latestBlogsFiltered = allBlogs.filter((blog) => {
  //         const blogDate = new Date(blog.createdAt);
  //         const timeDifference = today - blogDate;

  //         const daysDifference = timeDifference / (1000 * 60 * 60 * 24);
  //         return daysDifference <= 4;
  //       });

  //       latestBlogsFiltered.sort(
  //         (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  //       );

  //       const top10Blogs = latestBlogsFiltered.slice(0, 10);
  //       setBlogs(allBlogs);
  //       setLatestBlogs(top10Blogs);
  //     } else {
  //       throw new Error("Invalid Blog response format");
  //     }
  //   } catch (error) {
  //     setError("Failed to load Blogs");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const loadBlogs = async () => {
    try {
      const response = await getBlogs(); // Fetch the blogs
      console.log("Response:", response);

      if (response.items) {
        const allBlogs = response.items; // Use response.items as a property
        console.log("All Blogs:", allBlogs);

        const today = new Date();

        // Filter blogs created within the last 4 days
        const latestBlogsFiltered = allBlogs.filter((blog) => {
          const blogDate = new Date(blog.createdAt);
          const timeDifference = today - blogDate;
          const daysDifference = timeDifference / (1000 * 60 * 60 * 24);
          return daysDifference <= 4; // Return blogs created within 4 days
        });

        // Sort blogs by date in descending order (most recent first)
        latestBlogsFiltered.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        // Keep only the latest 10 blogs
        const top10Blogs = latestBlogsFiltered.slice(0, 10);

        setBlogs(allBlogs); // Set all blogs (if needed)
        setLatestBlogs(top10Blogs); // Update latest blogs
      } else {
        throw new Error("Invalid blog response format");
      }
    } catch (error) {
      console.error(error);
      setError("Failed to load Blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Latest Blogs:", latestBlogs);
  }, [latestBlogs]);

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

  if (loading) return <div className="mx-auto"><Loading /></div>;

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
            {/* <div
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
            </div> */}
            <div
              ref={scrollRef}
              className="flex  overflow-x-auto scrollbar-thin scrollbar-thumb-black scrollbar-track-gray-200 p-2"
            >
              {latestBlogs.length > 0 ? (
                latestBlogs.map((blog, index) => (
                  <LatestBlogs
                    key={index}
                    title={truncateString(blog.title, 30)}
                    description={truncateString(blog.description, 100)}
                    image={collegesData[1]["image"]}
                    date={formatDate(blog.createdAt)}
                  />
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
        </div>
      </div>
    </>
  );
};

export default Latest;
