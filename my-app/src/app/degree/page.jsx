"use client";
import React, { useEffect, useState } from "react";
import { Share, Heart } from "lucide-react";
import { fetchDegrees } from "./actions";
import { Search } from "lucide-react";
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
        const response = await fetchDegrees();
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
    return <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
  }

  return (
    <>
      <Header />
      <Navbar />
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Available Degrees</h1>

          {/* Search Bar */}
          <div className="relative w-full max-w-md mb-6">
            <input
              type="text"
              placeholder="Search degrees..."
              className="w-full p-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Degrees Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((degree) => (
            <div
              key={degree.id}
              className="border rounded-lg p-6 hover:shadow-lg transition-shadow bg-white"
            >
              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-4">{degree.title}</h2>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span>{degree.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Credits:</span>
                  <span>{degree.credits}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Language:</span>
                  <span>{degree.language}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fee:</span>
                  <span>{degree.fee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery:</span>
                  <span>{degree.delivery_mode}</span>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-600">
                    <strong>Eligibility:</strong> {degree.eligibility_criteria}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results Message */}
        {courses.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            No degrees found matching your search.
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default CoursePage;
