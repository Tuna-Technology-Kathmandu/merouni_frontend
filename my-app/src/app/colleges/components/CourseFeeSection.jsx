"use client";
import React, { useState } from "react";

const CourseFeeSection = () => {
  const MIN = 1000;
  const MAX = 10000000;
  const [range, setRange] = useState([MIN, MAX]);

  const handleRangeChange = (e) => {
    const value = parseInt(e.target.value);
    const isMinSlider = e.target.name === "min";

    if (isMinSlider) {
      if (value <= range[1]) {
        setRange([value, range[1]]);
      }
    } else {
      if (value >= range[0]) {
        setRange([range[0], value]);
      }
    }
  };

  const handleInputChange = (e, index) => {
    const value = parseInt(e.target.value.replace(/,/g, ""));
    if (!isNaN(value)) {
      const newRange = [...range];
      if (index === 0) {
        newRange[0] = Math.max(MIN, Math.min(value, range[1]));
      } else {
        newRange[1] = Math.min(MAX, Math.max(value, range[0]));
      }
      setRange(newRange);
    }
  };

  const formatNumber = (num) => {
    return num.toLocaleString("en-IN");
  };

  const getSliderBackground = (isMin) => {
    const percentage = ((range[isMin ? 0 : 1] - MIN) / (MAX - MIN)) * 100;
    return `linear-gradient(to right, 
      #e5e7eb 0%, 
      #22c55e ${isMin ? percentage : 0}%, 
      #22c55e ${isMin ? 100 : percentage}%, 
      #e5e7eb 100%)`;
  };

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-lg">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-gray-800 font-medium">Course Fees</h3>
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      <div className="space-y-4">
        <div className="relative pt-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-green-500">
              NPR {formatNumber(range[0])}
            </span>
            <span className="text-xs text-green-500">
              NPR {formatNumber(range[1])}
            </span>
          </div>
          <div className="relative h-2 mt-2">
            <input
              type="range"
              name="min"
              min={MIN}
              max={MAX}
              value={range[0]}
              onChange={handleRangeChange}
              className="absolute w-full h-2 appearance-none bg-transparent cursor-pointer"
              style={{
                background: getSliderBackground(true),
                borderRadius: "9999px",
                zIndex: 1,
              }}
            />
            <input
              type="range"
              name="max"
              min={MIN}
              max={MAX}
              value={range[1]}
              onChange={handleRangeChange}
              className="absolute w-full h-2 appearance-none bg-transparent cursor-pointer"
              style={{
                background: getSliderBackground(false),
                borderRadius: "9999px",
                zIndex: 2,
              }}
            />
          </div>
        </div>
        <div className="flex gap-4">
          <input
            type="text"
            value={formatNumber(range[0])}
            onChange={(e) => handleInputChange(e, 0)}
            className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none"
          />
          <input
            type="text"
            value={formatNumber(range[1])}
            onChange={(e) => handleInputChange(e, 1)}
            className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};

export default CourseFeeSection;