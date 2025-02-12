"use client";
import Image from "next/image";
import React, { useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import SearchBox from "./SearchBox";
import Link from "next/link";
import { IoMenu } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import Usericon from "./Usericon";
import { FiChevronRight } from "react-icons/fi";
import { GoArrowUpRight } from "react-icons/go";

const Header = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const menuItems = [
    { title: "College", href: "/colleges" },
    { title: "Course", href: "/course" },
    { title: "Degree", href: "/degree" },
    { title: "Admission", href: "/admission" },
    { title: "Scholarship", href: "/scholarship" },
    { title: "Events", href: "/events" },
    { title: "Blogs", href: "/blogs" },
    { title: "Exams", href: "/exams" },
    // {title: " Consultancy,Materials,Events,School,Videos,Universities,Career,Vacancy,Wishlist"}
    { title: "Consultancy", href: "/events" },
    { title: "School", href: "/schools" },
    { title: "Universites", href: "/universities" },
    { title: "Career", href: "/career" },
  ];

  return (
    <>
      {/* Search Box Overlay */}
      {showSearch && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowSearch(false)}
          />

          {/* SearchBox */}
          <div className="fixed top-0 left-0 w-full z-50">
            <SearchBox onClose={() => setShowSearch(false)} />
          </div>
        </>
      )}

      {/* Sidebar */}
      <div
        className={`absolute top-[80px] left-0 h-screen  w-full bg-white shadow-lg border-t-2 transform transition-transform duration-300 ease-in-out z-50 ${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* className={`absolute top-[80px] left-0 h-[550px]  w-full bg-white shadow-lg border-t-2 transform transition-transform duration-300 ease-in-out z-50 ${ */}

        {/* Close Button */}
        {/* <div className="flex justify-end p-4">
          <button
            onClick={() => setShowSidebar(false)}
            className="text-gray-600 hover:text-gray-800"
          >
            <IoClose size={24} />
          </button>
        </div> */}

        {/* Menu Items */}
        <nav className="px-4 h-[80%] overflow-auto">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className=" py-4  text-gray-700 hover:text-blue-600 border-b border-gray-200 flex flex-row justify-between"
              onClick={() => setShowSidebar(false)}
            >
              <span className="text-lg font-bold">{item.title}</span>
              <FiChevronRight style={{ color: "black" }} size={25} />
            </Link>
          ))}
        </nav>

        <div className="flex flex-row justify-between m-4">
          <Link href="/sign-in">
            <button type="button" className=" bg-[#0A6FA7] w-[150px] p-2 rounded-lg">
              <span className="text-white font-bold text-lg">Login</span>
            </button>
          </Link>

          <div className="border-2  border-solid border-[#0A6FA7] rounded-lg">
            <button
              type="button"
              className="  w-[150px] p-2 flex flex-row justify-center items-center"
            >
              <span className=" font-bold text-lg">Join Us</span>
              <GoArrowUpRight size={25} />
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar Backdrop */}
      {showSidebar && (
        <div
          className="fixed inset-0  z-40"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Main Header */}
      <div className="flex justify-between items-center  md:w-[85%] max-w-[1600px] md:mx-auto">
        {/* Left Logo */}
        {/* <Link href="/" className="flex-shrink-0">
          <Image
            src={"/images/logo.png"}
            width={200}
            height={200}
            alt="Mero UNI logo"
            className="hidden md:block"
          />
        </Link> */}
        <Link href="/" className="flex-shrink-0">
          <div className="hidden md:block w-[180px] h-[80px] relative">
            <Image
              src={"/images/logo.png"}
              alt="Mero UNI logo"
              fill
              className="object-contain"
            />
          </div>
        </Link>

        {/* Search Box for desktop */}
        <div
          className="bg-[#e4e4e4] p-2 rounded-lg hidden md:block flex-1 max-w-[300px] mx-auto cursor-pointer"
          onClick={() => setShowSearch(true)}
        >
          <div className="flex items-center">
            <IoSearchOutline />
            <div className="mx-2">Search</div>
          </div>
        </div>

        {/*Menu Bar Mobile Show */}
        <div className="block md:hidden px-2 cursor-pointer ">
          <IoMenu onClick={() => setShowSidebar(true)} size={24} />
        </div>

        <Link href="/" className="block md:hidden">
          <div className=" w-[180px] h-[80px] relative">
            <Image
              src={"/images/logo.png"}
              alt="Mero UNI logo"
              fill
              className="object-contain"
            />
          </div>
        </Link>
        {/* Search Icon for mobile */}
        <div className="block md:hidden" onClick={() => setShowSearch(true)}>
          <IoSearchOutline />
        </div>

        {/* User Icon */}
        <div className="">
          <Usericon />
          {/* <FaUserCircle
            style={{ width: "40px", height: "40px", color: "#0a6fa7" }}
          /> */}
        </div>

        {/* Mobile Menu Icon (☰) */}
        {/* <div className="block md:hidden px-2 cursor-pointer ">
          <IoMenu onClick={() => setShowSidebar(true)} size={24} />
        </div> */}
      </div>
    </>
  );
};

export default Header;
