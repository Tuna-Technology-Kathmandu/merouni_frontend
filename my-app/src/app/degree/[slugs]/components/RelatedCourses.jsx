"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { fetchDegrees } from "../../actions";

const RelatedCourses = ({ degree }) => {
  const [degrees, setDegrees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (degree) {
      // Only fetch if degree prop exists
      getDegrees();
    }
  }, [degree]); // Add degree as dependency

  const getDegrees = async () => {
    setIsLoading(true);
    try {
      const response = await fetchDegrees();
      const data = response.items;

      const filteredDegrees = data.filter((d) => {
        // Convert both IDs to strings for comparison
        const currentId = String(d.id);
        const degreeId = String(degree?.id);
        return currentId !== degreeId;
      });

      setDegrees(filteredDegrees);
    } catch (error) {
      console.error("Error fetching degrees:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col max-w-[1150px] mx-auto mb-20">
      <h2 className="font-bold text-3xl leading-10 mb-4">
        Other Degrees you might like
      </h2>
      <div className="grid grid-cols-3 gap-2">
        {degrees.map((degree, index) => (
          <Link href={`/degree/${degree.slugs}`} key={degree.id || index}>
            <div className="cursor-pointer p-4 max-w-sm">
              <div className="flex justify-center border-2 rounded-3xl items-center overflow-hidden mb-2 p-4">
                <img
                  src="/images/islington.png"
                  alt={degree.title}
                  className="w-48 h-48 object-cover"
                />
              </div>
              <div className="px-4 pb-4 flex flex-col">
                <h3 className="text-lg font-bold text-center">
                  {degree.title}
                </h3>
                <p className="text-xs text-gray-700 text-center">
                  Duration: {degree.duration}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedCourses;
