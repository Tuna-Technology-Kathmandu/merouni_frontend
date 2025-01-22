import React from "react";

const LatestBlogs = ({ image, title, date, description }) => {
  return (
    <div className="relative rounded-xl shadow-lg  w-85 min-w-[25rem]  p-6 mb-8 hover:shadow-2xl transition-shadow duration-300 overflow-hidden m-2 text-white">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center  rounded-xl"
        style={{
          backgroundImage: `url(${image})`,
        }}
      ></div>
      <div className="absolute inset-0 bg-black bg-opacity-60 rounded-xl"></div>

      {/* Content */}
      <div className="relative z-10 text-left space-y-4">
        {/* Title */}

        <h3 className="text-xl font-bold ">{title}</h3>

        {/* Date */}
        <p className="text-sm ">{date}</p>
        {/* Description */}
        <p className=" text-sm line-clamp-3">{description}</p>

        {/* Button */}
        <button className="px-4 py-2 bg-[#387CAE] text-white rounded-md text-sm hover:bg-[#285c7f] transition">
          Learn More
        </button>
      </div>

      {/* Decorative Border */}
      <div className="absolute inset-0 rounded-lg border border-gray-300"></div>
    </div>
  );
};

export default LatestBlogs;
