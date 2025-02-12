import React from "react";
import Link from "next/link";

const Fcollege = ({ name, description, image, slug }) => {
  return (
    <Link href={`/colleges/${slug}`}>
      <div className="flex flex-col bg-[#e2ece9] border border-gray-300 rounded-lg shadow-md w-full sm:w-72 md:w-80 lg:w-96 min-w-[20rem] ml-10 p-4  hover:shadow-lg transition-shadow duration-300 mb-8">
        <div className="flex items-center mb-3 justify-between">
          <div className="font-semibold text-lg text-gray-800 truncate">
            {name}
          </div>
          <img
            src={image}
            alt="College"
            className="w-12 h-12 rounded-full object-cover mr-4"
          />
        </div>
        <div className="text-black text-sm mb-4 line-clamp-3 w-3/4">
          {description}
        </div>
        <Link href={`/colleges/apply/${slug}`}>
          <button className="mt-auto px-4 py-2 bg-[#387CAE] text-white rounded-lg  transition duration-200 w-1/2">
            Apply
          </button>
        </Link>
      </div>
    </Link>
  );
};

export default Fcollege;
