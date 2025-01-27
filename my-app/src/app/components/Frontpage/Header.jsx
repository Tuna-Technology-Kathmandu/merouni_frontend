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
const Header = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const menuItems = [
    { title: "Home", href: "/" },
    { title: "About", href: "/about" },
    { title: "Services", href: "/services" },
    { title: "Contact", href: "/contact" },
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
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          showSidebar ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close Button */}
        <div className="flex justify-end p-4">
          <button
            onClick={() => setShowSidebar(false)}
            className="text-gray-600 hover:text-gray-800"
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="px-4">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="block py-3 text-gray-700 hover:text-blue-600 border-b border-gray-200"
              onClick={() => setShowSidebar(false)}
            >
              {item.title}
            </Link>
          ))}
        </nav>
      </div>

      {/* Sidebar Backdrop */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Main Header */}
      <div className="flex justify-between items-center max-w-[1600px] mx-auto">
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
        <Usericon/>
          {/* <FaUserCircle
            style={{ width: "40px", height: "40px", color: "#0a6fa7" }}
          /> */}
        </div>

        {/* Mobile Menu Icon (☰) */}
        <div className="block md:hidden px-2 cursor-pointer">
          <IoMenu onClick={() => setShowSidebar(true)} size={24} />
        </div>
      </div>
    </>
  );
};

export default Header;
