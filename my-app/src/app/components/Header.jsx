import React from "react";
import Image from "next/image";
import { IoSearch } from "react-icons/io5";
import { HiQuestionMarkCircle } from "react-icons/hi";

const Header = () => {
  return (
<<<<<<< HEAD
    <div className="max-w-[1400px] justify-center p-3 mx-auto m-3 flex flex-row">
      <div className="flex flex-row items-center space-x-8">
        {" "}
        {/* Added items-center */}
        <Image
          alt="meroUni logo"
          src="/images/logo.png"
          width={200}
          height={200}
        />
        <div className="flex border-blue-500 bg-blue-500 p-1 rounded-lg">
          <input
            type="search"
            name="search"
            placeholder="   Search colleges, courses, schools .."
            className="border-gray-200 border-2 rounded-l-2xl w-full h-10"
            size={50}
          />
          <button
            type="submit"
            className="flex items-center justify-center p-2"
          >
            <IoSearch className="" />
          </button>
=======
    <div className="w-full border-b">
      <div className="max-w-[1400px] mx-auto py-3 px-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Image
              alt="meroUni logo"
              src="/images/edusanjal-logo.svg"
              width={200}
              height={200}
              className="object-contain"
            />
          </div>

          {/* Search Bar */}
          <div className="flex-grow max-w-2xl">
            <div className="flex items-center border-blue-500 bg-blue-500 p-1 rounded-3xl">
              <input
                type="search"
                name="search"
                placeholder="Search Universities, Colleges, Events & more..."
                className="w-full px-4 py-2 border border-gray-200 rounded-l-3xl focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="px-6 py-2  text-white rounded-r-lg hover:bg-blue-600"
              >
                <IoSearch size={20} />
              </button>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Ask Button */}
            <button
              type="button"
              className="flex items-center gap-1 text-gray-700 hover:text-blue-600"
            >
              <HiQuestionMarkCircle size={24} />
              <span>Ask</span>
            </button>

            {/* Auth Buttons */}
            <button
              type="button"
              className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Sign In
            </button>
            <button
              type="button"
              className="px-6 py-2 bg-[#0362C7] text-white rounded-lg hover:bg-blue-600"
            >
              Sign Up
            </button>
          </div>
>>>>>>> db06809 (Header)
        </div>
      </div>
    </div>
  );
};

export default Header;
