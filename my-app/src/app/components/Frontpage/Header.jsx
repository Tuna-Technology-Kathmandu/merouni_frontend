"use client";

import Image from "next/image";
import React, { useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import SearchBox from "./SearchBox";

const Header = () => {
  const [showSearch, setShowSearch] = useState(false);
  return (
    <>
      <div
        className={`fixed top-0 left-0 w-full transform transition-transform duration-200 ease-in-out ${
          showSearch ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <SearchBox onClose={() => setShowSearch(false)} />
      </div>

      {showSearch && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowSearch(false)}
        />
      )}

      <div className="flex justify-between max-w-[1600px] mx-auto px-8  items-center">
        <Image
          src={"/images/logo.png"}
          width={200}
          height={200}
          alt="Mero UNI logo"
        />
        <div className="flex items-center bg-[#e4e4e4] p-2 rounded-lg">
          <IoSearchOutline />
          <div className="mx-2">Search</div>
          <input
            type="text"
            name=""
            id=""
            className="p-[2px] bg-inherit focus:outline-none"
            onClick={() => setShowSearch(true)}
          />
        </div>
        <div>
          <FaUserCircle
            style={{ width: "40px", height: "40px", color: "#0a6fa7" }}
          />
        </div>
      </div>

      {/* {showSearch && <SearchBox onClose={() => setShowSearch(false)}/>} */}
    </>
  );
};

export default Header;
