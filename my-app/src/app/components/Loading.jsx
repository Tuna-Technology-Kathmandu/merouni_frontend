import React from "react";

const Loader = () => {
  return (
    <div className="h-screen flex justify-center items-center">
      <div className="w-12 h-12 border-4 border-black border-t-white rounded-full animate-spin "></div>
    </div>
  );
};

export default Loader;
