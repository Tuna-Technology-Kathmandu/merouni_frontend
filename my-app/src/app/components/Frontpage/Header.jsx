import Image from "next/image";
import React from "react";
import { IoSearchOutline } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";

const Header = () => {
  return (
    <>
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
          />
        </div>
        <div>
          <FaUserCircle
            style={{ width: "40px", height: "40px", color: "#0a6fa7" }}
          />
        </div>
      </div>
    </>
  );
};

export default Header;