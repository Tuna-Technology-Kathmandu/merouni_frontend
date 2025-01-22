import React from "react";
import { FaLocationArrow } from "react-icons/fa6";

const Newsletter = () => {
  return (
    <div className=" bg-gradient-to-b from-[#E0E0E0] to-[#FFFFFF] py-20 h-[70vh] flex items-center">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center md:justify-center gap-8 md:gap-48 flex-wrap">
        {/* Left Section */}
        <div className="mb-6 md:mb-0 text-center md:text-left">
          <h2 className="text-2xl font-bold md:text-5xl md:font-extrabold text-black mb-4 md:mb-2">News Letter</h2>
          <p className="text-black font-semibold mt-2">
            Get the latest exam updates, study resources, and <br/>
            expert tips delivered straight to your inbox
          </p>
        </div>

        {/* Right Section */}
        <div className="mt-2 flex flex-row  md:flex-row items-center bg-[#eaf4f3]  rounded-xl shadow-md w-full md:w-auto">
          <input
            type="email"
            placeholder="Your Email Address"
            className="flex-grow w-full px-4 py-4 bg-transparent text-gray-700 placeholder-gray-500 focus:outline-none rounded-t-xl md:rounded-t-none md:rounded-l-xl"
          />
          <button className="bg-[#30AD8F] bg-opacity-20  py-6 px-6 rounded-r-xl flex items-center justify-center hover:bg-[#288c74] transition-colors">
              Send
            <span className="ml-2">
              <FaLocationArrow className="rotate-45 " />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
