"use client";
import React, { useEffect, useState } from "react";
import { fetchScholarships } from "./actions";
import Navbar from "../components/Frontpage/Navbar";
import Footer from "../components/Frontpage/Footer";
import Header from "../components/Frontpage/Header";

const ScholarshipPage = () => {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getScholarships = async () => {
      setLoading(true);
      try {
        const response = await fetchScholarships();
        setScholarships(response.scholarships);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    getScholarships();
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
        <h1 className="text-2xl font-bold mb-6">Available Scholarships</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scholarships.map((scholarship) => (
            <div
              key={scholarship.id}
              className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg transition-all duration-300 hover:scale-105 hover:border-gray-300"
            >
              <div className="flex flex-col mb-4">
                <h3 className="font-semibold text-lg mb-2">{scholarship.name}</h3>
                <div className="space-y-2">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-600">
                      Amount:
                    </span>
                    <span className="text-lg font-semibold text-green-600">
                      ${parseFloat(scholarship.amount).toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-600">
                      Deadline:
                    </span>
                    <span className="text-sm">
                      {new Date(scholarship.applicationDeadline).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-600">
                      Eligibility:
                    </span>
                    <span className="text-sm">
                      {scholarship.eligibilityCriteria.replace(/"/g, '')}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-600">
                      Renewal Criteria:
                    </span>
                    <span className="text-sm">
                      {scholarship.renewalCriteria.replace(/"/g, '')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 py-2 px-4 border border-gray-300 rounded-2xl text-gray-700 hover:bg-gray-50 text-sm font-medium">
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

export default ScholarshipPage;