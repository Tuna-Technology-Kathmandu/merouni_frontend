"use client";
import React, { useState, useEffect } from "react";
import BlogCard from "./BlogCard";
import { getBlogs } from "@/app/action";
import Pagination from "./Pagination";
import Loading from "../../components/Loading";

const FeaturedBlogs = () => {
  const blogs = [
    {
      title: "Engineering Education in Nepal",
      date: "June 20, 2024",
      description:
        "Engineering has long been regarded as one of Nepal's most prestigious and so...",
      image: "/images/blogs_image1.png",
      views: 100,
    },
    {
      title: "Engineering Education in Nepal",
      date: "June 20, 2024",
      description:
        "Engineering has long been regarded as one of Nepal's most prestigious and so...",
      image: "/images/blogs_image2.png",
      views: 100,
    },
    {
      title: "Engineering Education in Nepal",
      date: "June 20, 2024",
      description:
        "Engineering has long been regarded as one of Nepal's most prestigious and so...",
      image: "/images/blogs_image1.png",
      views: 100,
    },
    {
      title: "Engineering Education in Nepal",
      date: "June 20, 2024",
      description:
        "Engineering has long been regarded as one of Nepal's most prestigious and so...",
      image: "/images/blogs_image2.png",
      views: 100,
    },
    {
      title: "Engineering Education in Nepal",
      date: "June 20, 2024",
      description:
        "Engineering has long been regarded as one of Nepal's most prestigious and so...",
      image: "/images/blogs_image1.png",
      views: 100,
    },
    {
      title: "Engineering Education in Nepal",
      date: "June 20, 2024",
      description:
        "Engineering has long been regarded as one of Nepal's most prestigious and so...",
      image: "/images/blogs_image2.png",
      views: 100,
    },
    {
      title: "Engineering Education in Nepal",
      date: "June 20, 2024",
      description:
        "Engineering has long been regarded as one of Nepal's most prestigious and so...",
      image: "/images/blogs_image1.png",
      views: 100,
    },
    {
      title: "Engineering Education in Nepal",
      date: "June 20, 2024",
      description:
        "Engineering has long been regarded as one of Nepal's most prestigious and so...",
      image: "/images/blogs_image2.png",
      views: 100,
    },
    {
      title: "Engineering Education in Nepal",
      date: "June 20, 2024",
      description:
        "Engineering has long been regarded as one of Nepal's most prestigious and so...",
      image: "/images/blogs_image1.png",
      views: 100,
    },
    {
      title: "Engineering Education in Nepal",
      date: "June 20, 2024",
      description:
        "Engineering has long been regarded as one of Nepal's most prestigious and so...",
      image: "/images/blogs_image2.png",
      views: 100,
    },
  ];

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [Blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPageNumber(pagination.currentPage); // Pass the current page directly here
  }, [pagination.currentPage]);

  const loadPageNumber = async (page) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`Fetching blogs for page: ${page}`); // Debugging
      const response = await getBlogs(page); // Use the updated page directly
      console.log("Response from getBlogs:", response);

      if (response && response.pagination) {
        setBlogs(response.items);
        console.log("look", response.pagination);
        setPagination((prev) => ({
          ...prev,
          ...response.pagination, // Update the pagination state with the new data
        }));
      } else {
        console.error("Pagination data not found in response:", response);
      }
    } catch (error) {
      setError("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= pagination.totalPages) {
      setPagination((prev) => ({
        ...prev,
        currentPage: page, // Update current page
      }));
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

  if (loading)
    return (
      <div className="mx-auto">
        <Loading />
      </div>
    );

  return (
    <>
      <div className="flex flex-col max-w-[1600px] mx-auto px-8 mt-10">
        {/* top section  */}
        <div className="flex flex-row border-b-2 border-[#0A70A7] w-[45px] mb-10">
          <span className="text-2xl font-bold mr-2">Featured</span>
          <span className="text-[#0A70A7] text-2xl font-bold">Blogs</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
          {Blogs.map((blog, index) => (
            <div key={index}>
              <BlogCard
                date={formatDate(blog.createdAt)}
                description={truncateString(blog.description, 100)}
                image={blogs[0]["image"]}
                title={truncateString(blog.title, 20)}
                views={blogs[0]["views"]}
              />
            </div>
          ))}
        </div>
      </div>
      <Pagination pagination={pagination} onPageChange={handlePageChange} />
    </>
  );
};

export default FeaturedBlogs;
