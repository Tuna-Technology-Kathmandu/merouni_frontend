"use client";
import React, { useRef } from "react";
import { FaArrowCircleRight } from "react-icons/fa";

const DegreeScroller = () => {
  const fieldsScrollerRef = useRef(null);

  return (
    <div className="md:p-12 bg-gradient-to-r from-blue-50 to-purple-50 py-12">
      {/* Content Container */}
      <div className="flex flex-col lg:flex-row gap-8 md:gap-24 max-w-7xl mx-auto">
        {/* Text Content */}
        <div className="flex flex-col gap-4 px-4 md:px-8 lg:w-1/3">
          <h2 className="font-extrabold text-4xl md:text-5xl text-gray-900">
            Upcoming Events From
          </h2>
          <p className="font-bold text-sm md:text-base text-gray-600">
            Explore diverse fields of study to find the best fit for your
            academic and career goals
          </p>
        </div>

        {/* Scrollable Cards */}
        <div
          ref={fieldsScrollerRef}
          className="flex gap-6 overflow-x-auto scroll-smooth pb-4 px-4 md:px-8 lg:w-2/3"
        >
          {[
            {
              number: "1",
              title: "Holi Events from Himalayan College",
              host: "JIEC",
              images: "https://static.toiimg.com/photo/62999121.cms",
            },
            {
              number: "2",
              title: "New Year Eve from Nepal",
              host: "JIEC",
              images: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuiCC_XChL0O400c2K1RSl89u2XoSZ5m-ysw&s",
            },
            {
              number: "3",
              title: "Humanities",
              host: "JIEC",
              images: "https://grdedu.in/wp-content/gallery/hotel-management/Hotel-Management-7.JPG",
            },
            {
              number: "4",
              title: "Law",
              host: "JIEC",
              images: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVaNFeuojkWV8oUqk48cRKjPq-8csnNhs3qg&s",
            },
            {
              number: "5",
              title: "Business",
              host: "JIEC",
              images: "https://placehold.co/600x400",
            },
            {
              number: "6",
              title: "Arts",
              host: "JIEC",
              images: "https://placehold.co/600x400",
            },
            {
              number: "7",
              title: "Science",
              host: "JIEC",
              images: "https://placehold.co/600x400",
            },
            {
              number: "8",
              title: "Technology",
              host: "JIEC",
              images: "https://placehold.co/600x400",
            },
          ].map((field, index) => (
            <div
              key={index}
              className="flex-shrink-0 border-2 border-gray-200 h-[200px] md:h-[250px] p-6 rounded-2xl flex flex-col items-start justify-center gap-4 bg-white hover:shadow-lg transition-all transform hover:scale-105 relative overflow-hidden w-[300px]" // Fixed width here
              style={{
                backgroundImage: `url(${field.images})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-30 z-10"></div>

              {/* Content */}
              <div className="z-20 relative">
                <div className="font-black text-3xl md:text-4xl text-white">
                  {field.number}
                </div>
                <div className="font-bold text-lg md:text-xl text-white">
                  {field.title}
                </div>
                <div className="text-sm md:text-base text-white">{field.host}</div>
              </div>

              {/* Arrow Icon */}
              <div className="self-end z-20">
                <FaArrowCircleRight className="w-8 h-8 md:w-10 md:h-10 text-white hover:text-purple-300 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DegreeScroller;