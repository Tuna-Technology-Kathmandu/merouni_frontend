"use client";
import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { fetchCourses } from "./actions";

import Navbar from "../components/Frontpage/Navbar";
import Footer from "../components/Frontpage/Footer";
import Header from "../components/Frontpage/Header";
import Shimmer from "../components/Shimmer";

import { getBanners } from "../action";
import AdLayout from "../components/Frontpage/AdLayout";

const CoursePage = () => {
  const [courses, setCourses] = useState([]);
  const [banner, setBanner] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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

  useEffect(() => {
    fetchBanner();
  }, []);

  const fetchBanner = async () => {
    try {
      const response = await getBanners();
      setBanner(response.items);
    } catch (error) {}
  };

  // Filter courses based on search term
  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Header />
      <Navbar />
      <AdLayout banners={banner} size="medium" number={3} />

      <div className="container mx-auto p-6">
        <div className="border-b-2 border-[#0A70A7] w-[45px] mt-8 mb-4 pl-2">
          <span className="text-2xl font-bold mr-2">Our</span>
          <span className="text-[#0A70A7] text-2xl font-bold">Courses</span>
        </div>
        {/* Search Bar */}
        <div className="flex justify-end w-full mb-6">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search course..."
              className="w-full p-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6)
              .fill("")
              .map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg"
                >
                  <div className="flex justify-evenly items-start mb-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <Shimmer width="30px" height="30px" />
                    </div>
                    <div className="flex flex-col gap-4 w-full">
                      <Shimmer width="80%" height="20px" />
                      <Shimmer width="60%" height="18px" />
                      <Shimmer width="90%" height="15px" />
                      <div className="flex gap-2">
                        <Shimmer width="40%" height="15px" />
                        <Shimmer width="40%" height="15px" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
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
                    <h3 className="font-semibold text-lg mb-1">
                      {course.title}
                    </h3>
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
        )}
      </div>

      <Footer />
    </>
  );
};

export default CoursePage;
