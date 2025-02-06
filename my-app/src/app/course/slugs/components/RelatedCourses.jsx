"use client";

import React from "react";
import Link from "next/link";

const RelatedCourses = () => {
  return (
    <div className="flex flex-col  max-w-[1150px]  mx-auto mb-20">
      <h2 className="font-bold text-3xl leading-10 mb-4">
        Other Colleges you might like
      </h2>
      <div className="grid grid-cols-3 gap-2">
        <div className="cursor-pointer  p-4 max-w-sm ">
          <div className="flex justify-center border-2 rounded-3xl items-center  overflow-hidden mb-2 p-4 ">
            <img
              src="/images/islington.png"
              alt={"College logo"}
              className="w-48 h-48 object-cover"
            />
          </div>
          <div className="px-4 pb-4 flex flex-col ">
            <h3 className="text-lg   font-bold text-center">Workshop</h3>
            <p className="text-xs text-gray-700 text-center">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sint,
              totam.
            </p>
          </div>
        </div>
        <div className="cursor-pointer  p-4 max-w-sm ">
          <div className="flex justify-center border-2 rounded-3xl items-center  overflow-hidden mb-2 p-4 ">
            <img
              src="/images/islington.png"
              //  src={college.logo}
              alt={"College logo"}
              className="w-48 h-48 object-cover"
            />
          </div>
          <div className="px-4 pb-4 flex flex-col ">
            <h3 className="text-lg   font-bold text-center">Workshop</h3>
            <p className="text-xs text-gray-700 text-center">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sint,
              totam.
            </p>
          </div>
        </div>
        <div className="cursor-pointer  p-4 max-w-sm ">
          <div className="flex justify-center border-2 rounded-3xl items-center  overflow-hidden mb-2 p-4 ">
            <img
              src="/images/islington.png"
              //  src={college.logo}
              alt={"College logo"}
              className="w-48 h-48 object-cover"
            />
          </div>
          <div className="px-4 pb-4 flex flex-col ">
            <h3 className="text-lg   font-bold text-center">Workshop</h3>
            <p className="text-xs text-gray-700 text-center">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sint,
              totam.
            </p>
          </div>
        </div>
        <div className="cursor-pointer  p-4 max-w-sm ">
          <div className="flex justify-center border-2 rounded-3xl items-center  overflow-hidden mb-2 p-4 ">
            <img
              src="/images/islington.png"
              //  src={college.logo}
              alt={"College logo"}
              className="w-48 h-48 object-cover"
            />
          </div>
          <div className="px-4 pb-4 flex flex-col ">
            <h3 className="text-lg   font-bold text-center">Workshop</h3>
            <p className="text-xs text-gray-700 text-center">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sint,
              totam.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelatedCourses;
