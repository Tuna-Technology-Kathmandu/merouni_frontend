"use client";
import React, { useEffect, useState } from "react";
// import { Share, Heart } from "lucide-react";
import { fetchUniversities } from "./actions";
import { Search } from "lucide-react";
import Navbar from "../components/Frontpage/Navbar";
import Footer from "../components/Frontpage/Footer";
import Header from "../components/Frontpage/Header";
import Link from "next/link";

const UniversityPage = () => {
  const [university, setUniversity] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getUniversity = async () => {
      setLoading(true);
      try {
        const response = await fetchUniversities();
        console.log("RESPONS Universities:", response);
        setUniversity(response.items);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    getUniversity();
  }, []);
  useEffect(() => {
    console.log("Courses:", university);
  }, [university]);

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Universities Available:</h1>

          {/* Search Bar */}
          <div className="relative w-full max-w-md mb-6">
            <input
              type="text"
              placeholder="Search universites..."
              className="w-full p-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* <Link href={`/colleges/${university.slug}`} key={index}>
                      <UniversityCard key={index} {...university} />
                    </Link> */}

        {/* Degrees Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {university.map((uni, index) => (
            <Link href={`/universities/${uni?.slugs}`} key={index}>
              <div
                key={uni.id}
                className="border rounded-lg p-6 hover:shadow-lg transition-shadow bg-white"
              >
                <div className="mb-4 flex flex-row justify-between items-center ">
                  <h2 className="text-xl font-semibold mb-4">{uni.fullname}</h2>
                  <img
                    src="https://placehold.co/600x400"
                    className="w-[65px] h-[75px] rounded-2xl"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Address:</span>
                    <span>
                      {uni.city}, {uni.state} {uni.country}
                    </span>
                  </div>
                  {/* <div className="flex justify-between">
                    <span className="text-gray-600">Contact:</span>
                    <span>{uni.contact.phone_number}</span>
                  </div> */}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* No Results Message */}
        {university.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            No degrees found matching your search.
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default UniversityPage;
