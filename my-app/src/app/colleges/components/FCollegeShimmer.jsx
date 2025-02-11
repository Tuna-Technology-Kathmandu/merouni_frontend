import React from "react";

const FcollegeShimmer = ({ count = 4 }) => {
  return (
    <div className="flex flex-row flex-wrap justify-between"> {/* Flex container */}
      {[...Array(count)].map((_, index) => (
        <div key={index} className="flex flex-col bg-gray-200 rounded-lg shadow-md w-72 min-w-[20rem] p-4 animate-pulse mb-8"> {/* Individual shimmer card */}
          <div className="flex items-center mb-3 justify-between">
            <div className="w-3/4 h-8 bg-gray-300 rounded"></div>
            <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
          </div>
          <div className="w-full h-16 bg-gray-300 rounded mb-4"></div>
          <div className="w-1/2 h-10 bg-gray-300 rounded mt-auto"></div>
        </div>
      ))}
    </div>
  );
};

export default FcollegeShimmer;