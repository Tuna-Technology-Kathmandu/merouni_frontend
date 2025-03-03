"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Search } from "lucide-react";
import { fetchCourses } from "./actions"; // Make sure this points to the updated version of fetchCourses

import Navbar from "../components/Frontpage/Navbar";
import Footer from "../components/Frontpage/Footer";
import Header from "../components/Frontpage/Header";
import Shimmer from "../components/Shimmer";

import { getBanners } from "../action";
import AdLayout from "../components/Frontpage/AdLayout";
import Link from "next/link";

const CoursePage = () => {
  const [courses, setCourses] = useState([]);
  const [banner, setBanner] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    credits: { min: "", max: "" },
    duration: { min: "", max: "" },
    faculty: "",
  });

  const debounce = (func, delay) => {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(this, args), delay);
    };
  };

  const fetchCoursesDebounced = useCallback(
    debounce(async () => {
      setLoading(true);
      try {
        const response = await fetchCourses(
          `${filters.credits.min}-${filters.credits.max}`,
          `${filters.duration.min}-${filters.duration.max}`,
          filters.faculty
        );
        setCourses(response.items);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }, 1500),
    [filters]
  );

  useEffect(() => {
    fetchCoursesDebounced();
  }, [fetchCoursesDebounced]);

  useEffect(() => {
    fetchBanner();
  }, []);

  const fetchBanner = async () => {
    try {
      const response = await getBanners();
      setBanner(response.items);
    } catch (error) {}
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearchTerm = course.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
  
    const filterCredits =
      filters.credits.min && filters.credits.max
        ? `${filters.credits.min}-${filters.credits.max}`
        : null;
  
    const filterDuration =
      filters.duration.min && filters.duration.max
        ? `${filters.duration.min}-${filters.duration.max}`
        : null;
  
    // Filter courses based on the range of credits, duration, and faculty
    const matchesCredits = filterCredits
      ? course.credits >= filters.credits.min && course.credits <= filters.credits.max
      : true;
    const matchesDuration = filterDuration
      ? course.duration >= filters.duration.min && course.duration <= filters.duration.max
      : true;
    const matchesFaculty = filters.faculty
      ? course.faculty === filters.faculty
      : true;
  
    return matchesSearchTerm && matchesCredits && matchesDuration && matchesFaculty;
  });
  

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const [type, key] = name.split(".");
    setFilters((prevFilters) => ({
      ...prevFilters,
      [type]: { ...prevFilters[type], [key]: value },
    }));
  };

  return (
    <>
      <Header />
      <Navbar />
      <AdLayout banners={banner} size="medium" number={3} />

      <div className="container mx-auto p-6 flex flex-col lg:flex-row">
        {/* Sidebar with Filters */}
        <div className="w-full lg:w-1/4 lg:pr-6 mb-6 lg:mb-0">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg">
            <h3 className="font-semibold text-xl mb-4">Filters</h3>

            {/* faculty filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Faculty
              </label>
              <select
                name="faculty"
                value={filters.faculty}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Faculty</option>
                <option value="Science">Science</option>
                <option value="Management">Management</option>
                <option value="HM">HM</option>
                <option value="Education">Education</option>
              </select>
            </div>

            {/* Credits Filter (Range) */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Credits
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  name="credits.min"
                  value={filters.credits.min}
                  onChange={handleFilterChange}
                  placeholder="Min"
                  className="w-1/2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  name="credits.max"
                  value={filters.credits.max}
                  onChange={handleFilterChange}
                  placeholder="Max"
                  className="w-1/2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Duration Filter (Range) */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Duration (months)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  name="duration.min"
                  value={filters.duration.min}
                  onChange={handleFilterChange}
                  placeholder="Min"
                  className="w-1/2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  name="duration.max"
                  value={filters.duration.max}
                  onChange={handleFilterChange}
                  placeholder="Max"
                  className="w-1/2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-3/4">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
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
                      {/* <Link href="/courses/asdsd">
                        <button className="flex-1 py-2 px-4 border border-gray-300 rounded-2xl text-gray-700 hover:bg-gray-50 text-sm font-medium">
                          Details
                        </button>
                      </Link> */}
                    </div>
                  </div>
                ))
              ) : (
                <p>No courses found with the selected filters.</p>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default CoursePage;
