"use client";
import React, { useEffect, useState } from "react";
import { Share, Heart } from "lucide-react";
import { fetchCourses } from "./actions";

import Navbar from "../components/Frontpage/Navbar";
import Footer from "../components/Frontpage/Footer";
import Header from "../components/Frontpage/Header";

const CoursePage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getCourses = async () => {
      setLoading(true);
      try {
        const response = await fetchCourses();
        setCourses(response.items);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    getCourses();
  }, []);

  const handleWishlistRemove = (courseId) => {
    // Implement wishlist removal functionality
    console.log("Remove from wishlist:", courseId);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header />
      <Navbar />

      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Available Courses</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg transition-all duration-300 hover:scale-105 hover:border-gray-300"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 font-semibold">
                    {course.code.substring(0, 2)}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    className="p-2 hover:bg-gray-100 rounded-full"
                    aria-label="Share course"
                  >
                    <Share className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    className="p-2 hover:bg-gray-100 rounded-full"
                    onClick={() => handleWishlistRemove(course._id)}
                    disabled={loading}
                    aria-label="Remove from wishlist"
                  >
                    <Heart className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              </div>
              <h3 className="font-semibold text-lg mb-1">{course.title}</h3>
              <p className="text-sm text-gray-600 mb-2">Code: {course.code}</p>
              <p className="text-black text-sm my-4">{course.description}</p>
              <div className="flex gap-2 mb-4">
                <span className="text-sm text-gray-600">
                  Credits: {course.credits}
                </span>
                <span className="text-sm text-gray-600">
                  Duration: {course.duration} months
                </span>
              </div>
              <div className="flex gap-3">
                <button className="flex-1 py-2 px-4 border border-gray-300 rounded-2xl text-gray-700 hover:bg-gray-50 text-sm font-medium">
                  Details
                </button>
                <button className="flex-1 py-2 px-4 bg-gray-900 text-white rounded-2xl hover:bg-gray-800 text-sm font-medium">
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CoursePage;
