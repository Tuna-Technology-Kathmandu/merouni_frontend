"use client";
import React, { useEffect, useState } from "react";
import { fetchUniversities } from "./actions";
import { Search } from "lucide-react";
import Navbar from "../components/Frontpage/Navbar";
import Footer from "../components/Frontpage/Footer";
import Header from "../components/Frontpage/Header";
import Link from "next/link";
import UniversityShimmer from "./components/UniversityShimmer";

const UniversityPage = () => {
  const [universities, setUniversities] = useState([]); // Renamed for clarity
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const getUniversities = async () => {
      setLoading(true);
      try {
        const response = await fetchUniversities();
        console.log("RESPONS Universities:", response);
        setUniversities(response.items || []); // Handle potential missing 'items'
      } catch (error) {
        console.error("Error:", error);
        setUniversities([]); // Set to empty array on error to avoid rendering issues
      } finally {
        setLoading(false);
      }
    };

    getUniversities();
  }, []);

  // Removed unnecessary useEffect that just logged the universities

  return (
    <>
      <Header />
      <Navbar />
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <div className="border-b-2 border-[#0A70A7] w-[45px] mt-8 mb-4 pl-2">
            <span className="text-2xl font-bold mr-2">Available</span>
            <span className="text-[#0A70A7] text-2xl font-bold">Universities</span>
          </div>

          {/* Search Bar */}
          <div className="flex justify-end w-full mb-6">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search university..."
                className="w-full p-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Universities Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <UniversityShimmer key={index} />
            ))}
          </div>
        ) : universities.length === 0 ? ( // Check for empty universities array *after* loading
          <div className="text-center text-gray-500 mt-8">
            No universities found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {universities
              .filter((uni) =>
                uni.fullname.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((uni, index) => (
                <Link href={`/universities/${uni?.slugs}`} key={index}>
                  <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow bg-white">
                    <div className="mb-4 flex justify-between items-center">
                      <h2 className="text-xl font-semibold">{uni.fullname}</h2>
                      <img
                        src="https://placehold.co/600x400" // Consider using a placeholder or actual university logo
                        alt={uni.fullname + " Logo"} // Add alt text for accessibility
                        className="w-[65px] h-[75px] rounded-2xl"
                        onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/600x400"; }} // Placeholder on image error
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Address:</span>
                        <span>
                          {uni.city}, {uni.state} {uni.country}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default UniversityPage;