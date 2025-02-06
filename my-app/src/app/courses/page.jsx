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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
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
              <div className="flex justify-evenly items-start mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 font-semibold">
                    {course.code.substring(0, 2)}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">{course.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Code: {course.code}
                  </p>
                  <p className="text-black text-sm my-4">
                    {course.description}
                  </p>
                  <div className="flex gap-2 mb-4">
                    <span className="text-sm text-gray-600">
                      Credits: {course.credits}
                    </span>
                    <span className="text-sm text-gray-600">
                      Duration: {course.duration} months
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 py-2 px-4 border border-gray-300 rounded-2xl text-gray-700 hover:bg-gray-50 text-sm font-medium">
                  Details
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
