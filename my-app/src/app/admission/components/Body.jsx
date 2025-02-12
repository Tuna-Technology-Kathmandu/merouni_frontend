"use client";
import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { getAdmission } from "../actions";
import Link from "next/link";

// Define a simple Shimmer component for loading state
const Shimmer = ({ width, height }) => (
  <div className="shimmer bg-gray-200 rounded" style={{ width, height }}></div>
);

const Body = () => {
  const [admission, setAdmission] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    fetchAdmission();
  }, []);

  const fetchAdmission = async () => {
    setLoading(true);
    try {
      const response = await getAdmission();
      console.log("Admission data:", response);
      setAdmission(response);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter admissions based on search term
  const filteredAdmissions = admission.filter((admis) =>
    admis.program.title.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  return (
    <div className="flex flex-col p-6">
      <div className="border-b-2 border-[#0A70A7] w-[45px] mt-8 mb-4 pl-2">
        <span className="text-2xl font-bold mr-2">Opening</span>
        <span className="text-[#0A70A7] text-2xl font-bold">Admission</span>
      </div>
      {/* Search Bar */}
      <div className="flex justify-end w-full">
        <div className="relative w-full max-w-md mb-6">
          <input
            type="text"
            placeholder="Search admissions..."
            className="w-full p-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAdmissions.map((admis, index) => (
            <div
              key={index}
              className="border-2 border-gray-200 rounded-lg shadow-lg p-6 bg-white"
            >
              <Link
                href={`/degree/${admis?.program?.slugs}`}
                className="hover:underline hover:decoration-[#30AD8F]"
              >
                <h2 className="text-xl font-semibold mb-2">
                  {admis.program.title}
                </h2>
              </Link>

              <p className="text-gray-700 mb-2">
                <Link
                  href={`/colleges/${admis?.collegeAdmissionCollege?.slugs}`}
                  className="hover:underline hover:decoration-[#30AD8F]"
                >
                  <span className="font-semibold">College:</span>{" "}
                  {admis.collegeAdmissionCollege.name}
                </Link>
              </p>
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">Admission Process:</span>{" "}
                {admis.admission_process}
              </p>
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">Eligibility:</span>{" "}
                {admis.eligibility_criteria}
              </p>
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">Fee Details:</span>{" "}
                {admis.fee_details}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* No Results Message */}
      {!loading && filteredAdmissions.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          No admission details available.
        </div>
      )}
    </div>
  );
};

export default Body;
