"use client";
import React, { useRef, useState, useEffect } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { RxCross2 } from "react-icons/rx";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import Link from "next/link";
// import { logout } from "../../action";

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openOption, setOpenOption] = useState({
    post: false,
  });

  const sidebarRef = useRef(null);

  const toggleSection = (section) => {
    setOpenOption((openOption) => ({
      ...openOption,
      [section]: !openOption[section],
    }));
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div ref={sidebarRef} className="fixed">
      {/* Sidebar */}
      <div
        // Conditional class based on isOpen
        // state to control width and visibility
        className={`bg-gray-700 text-white 
                   h-screen transition-all 
                  duration-300  fixed z-10
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
                Settings
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
                  <Link href="/account/post" className="hover:underline">
                    Change password
                  </Link>
                </li>
                <li className="border-b border-gray-300 p-2">
                  <Link href="/account/category" className="hover:underline">
                    Update profile
                  </Link>
                </li>
              </ul>
            </details>
          </section>

          {/* <div className="mt-4 hover:bg-gray-200 hover:text-black hover:cursor-pointer ">
            <p onClick={onAddPost}>Add Post</p>
          </div> */}
          <div className="mt-4 hover:bg-gray-200 hover:text-black hover:cursor-pointer ">
            <p>Add events</p>
          </div>

          {/* <div className="mt-4 hover:bg-gray-200 hover:text-black hover:cursor-pointer " onClick={logout}> */}
          <div className="mt-4 hover:bg-gray-200 hover:text-black hover:cursor-pointer ">
            <Link href="/dashboard/addCollege">
              <p>Add colleges</p>
            </Link>
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
        <div className="ml-auto absolute">
          <button
            className="bg-blue-500 hover:bg-blue-700 
                     text-white font-bold py-2 px-4 rounded "
            onClick={() => setIsOpen(!isOpen)}
          >
            {/* Toggle icon based on isOpen state */}
            {isOpen ? <RxCross2 /> : <GiHamburgerMenu />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
