"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative mx-2" ref={dropdownRef}>
      <FaUserCircle
        style={{
          width: "40px",
          height: "40px",
          color: "#0a6fa7",
          cursor: "pointer",
        }}
        onClick={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div className="absolute right-0  mt-2 w-60 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
          <div className="flex justify-center -mt-2">
            {/* Optional icon inside dropdown */}
          </div>
          <ul className="p-4 text-gray-700">
            <Link href="/dashboard">
              <li className="py-2 border-b cursor-pointer hover:text-blue-600">
                My Account
              </li>
            </Link>
            <Link href="/contact">
              <li className="py-2 border-b cursor-pointer hover:text-blue-600">
                Contact Us
              </li>
            </Link>
            <li className="py-2 border-b cursor-pointer hover:text-blue-600">
              My Watchlist
            </li>
            <Link href="/sign-in">
              <button className="w-full py-2 mt-2 bg-blue-600 text-white rounded-lg font-bold">
                Login
              </button>
            </Link>
            <Link href="/contact">
              <button className="w-full py-2 mt-2 border border-blue-600 text-blue-600 rounded-lg font-bold">
                Join Us →
              </button>
            </Link>
          </ul>
        </div>
      )}
    </div>
  );
}
