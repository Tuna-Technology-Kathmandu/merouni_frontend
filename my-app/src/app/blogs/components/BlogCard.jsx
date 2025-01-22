import React from "react";
import Image from "next/image";
import { FaEye } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";



const BlogCard = ({ image, date,views, title, description }) => {
  return (
    <div className="min-w-[350px] max-w-[350px]  my-2 bg-white rounded-2xl  shadow-md border border-gray-300  mb-10">
      <div className="h-[px] relative">
        <img
          src={image}
          alt={`${title} logo`}
          className="w-full  object-cover "
        />
      </div>

      

      {/* Content Section */}
      <div className="p-4">
        {/* Date */}
        <p className="text-gray-600 mb-2">{date}</p>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-3">{title}</h2>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4">{description}</p>

        <div className="border mb-1"></div>

        {/* Views Counter */}
        <div className="flex items-center text-gray-500 justify-between">
           <div className="flex flex-row gap-1">
          <FaEye size={20} />
          <span>{views} views</span>
            </div> 
            <div>
                <FaRegHeart size={20}/>
            </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
