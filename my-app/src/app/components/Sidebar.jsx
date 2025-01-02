"use client";
import React, { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { RxCross2 } from "react-icons/rx";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";

const SideBar = ({ onAddPost }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openOption, setOpenOption] = useState({
    post: false,
  });

  const toggleSection = (section) => {
    setOpenOption((openOption) => ({
      ...openOption,
      [section]: !openOption[section],
    }));
  };

  return (
    <div>
      {/* Sidebar */}
      <div
        // Conditional class based on isOpen
        // state to control width and visibility
        className={`bg-gray-700 text-white 
                   h-screen transition-all 
                  duration-300  fixed
                  ${isOpen ? "w-64" : "w-0 overflow-hidden"}`}
      >
        {/* Sidebar content */}
        <div className="flex flex-col items-center">
          <div className="mt-4 hover:bg-gray-200 hover:text-black hover:cursor-pointer">
            <p>DashBoard</p>
          </div>

          <section>
            <details
              className="m-4 border-b"
              open={openOption.post}
              onToggle={() => toggleSection("post")}
              onClick={(e) => e.stopPropagation()}
            >
              <summary className="text-base font-medium flex justify-between items-center  cursor-pointer ">
                Post
                <span>
                  {openOption.post ? (
                    <button type="button" className="p-2 hover:cursor-pointer">
                      <IoMdArrowDropup size={24} />
                    </button>
                  ) : (
                    <button type="button" className="p-2 hover:cursor-pointer">
                      <IoMdArrowDropdown size={24} />
                    </button>
                  )}
                  {/* {isOpen.sortBy ? "▲" : "▼"} */}
                </span>
              </summary>
              <ul className="mt-2 space-y-2 pl-4 border-t border-gray-300">
                <li className="border-b border-gray-300 p-2">
                  <a href="#" className="hover:underline">
                    Add Post
                  </a>
                </li>
                <li className="border-b border-gray-300 p-2">
                  <a href="/search?sort=newest" className="hover:underline">
                    Category
                  </a>
                </li>
                <li className="border-b border-gray-300 p-2">
                  <a
                    href="/search?sort=top-sellers"
                    className="hover:underline"
                  >
                    Tags
                  </a>
                </li>
                <li className="border-b border-gray-300 p-2">
                  <a
                    href="/search?sort=price-high-to-low"
                    className="hover:underline"
                  >
                    Articles
                  </a>
                </li>
              </ul>
            </details>
          </section>

          <div className="mt-4 hover:bg-gray-200 hover:text-black hover:cursor-pointer ">
            <p onClick={onAddPost}>Add Post</p>
          </div>
          <div className="mt-4 hover:bg-gray-200 hover:text-black hover:cursor-pointer ">
            <p onClick={onAddPost}>Comments</p>
          </div>

          <div className="mt-4 hover:bg-gray-200 hover:text-black hover:cursor-pointer ">
            <p onClick={onAddPost}>Logout</p>
          </div>

          {/* Add more sidebar items here */}
        </div>
      </div>
      {/* Main content */}
      <div
        className={`flex-1 p-4 
                      ${isOpen ? "ml-64" : "ml-0"}`}
      >
        {/* Button to toggle sidebar */}
        <div className="ml-auto">
          <button
            className="bg-blue-500 hover:bg-blue-700 
                     text-white font-bold py-2 px-4 rounded"
            onClick={() => setIsOpen(!isOpen)}
          >
            {/* Toggle icon based on isOpen state */}
            {isOpen ? (
              // <svg
              //   className="h-6 w-6"
              //   fill="none"
              //   viewBox="0 0 24 24"
              //   stroke="currentColor">
              //   <path
              //     strokeLinecap="round"
              //     strokeLinejoin="round"
              //     strokeWidth={2}
              //     d="M6 18L18 6M6 6l12 12" />
              // </svg>
              <RxCross2 />
            ) : (
              // <svg
              //   className="h-6 w-6"
              //   fill="none"
              //   viewBox="0 0 24 24"
              //   stroke="currentColor">
              //   <path
              //     strokeLinecap="round"
              //     strokeLinejoin="round"
              //     strokeWidth={2}
              //     d="M4 6h16M4 12h16m-7 6h7" />
              // </svg>
              <GiHamburgerMenu />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SideBar;