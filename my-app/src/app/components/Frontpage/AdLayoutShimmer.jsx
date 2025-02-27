import React from "react";

const AdLayoutShimmer = ({ number = 3 }) => {
  return (
    <div className="">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        {[...Array(number)].map((_, index) => (
          <div className="w-full md:w-auto relative">
            <div className="w-full h-48 bg-gray-300 rounded-lg animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdLayoutShimmer;
