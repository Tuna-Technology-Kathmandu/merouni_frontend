import React from "react";

const Shimmer = ({ width = "100%", height = "20px", borderRadius = "4px" }) => {
  return (
    <div
      style={{
        width: width,
        height: height,
        borderRadius: borderRadius,
        background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
        animation: "shimmer 1.5s infinite ease-in-out",
      }}
    />
  );
};

export default Shimmer;
