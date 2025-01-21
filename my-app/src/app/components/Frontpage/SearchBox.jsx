import React from "react";
import { IoIosSearch } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";

const SearchBox = ({ onClose }) => {
  const searchLists = [
    "KUUMAT",
    "SEE RESULT 2025",
    "NEB Class 12 Result 2025",
    "IOE Entrance Exam 2025",
    "MBBS Entrance Exam Nepal",
    "Best College for BIT in Nepal",
    "Lok Sewa Aayog Vacancy",
    "TU Entrance Exam",
  ];
  return (
    <div className="flex flex-col  bg-white shadow-md  w-full h-[450px] z-50 items-center justify-center">
      <div className="relative ">
        <input
          type="text"
          placeholder="Search Universities , Colleges , Events & more..."
          className="  py-2 border-b-2 border-black  focus:outline-none w-[550px] placeholder-black"
        />
        <span className="absolute  top-4  transform -translate-y-1/2 -translate-x-20 text-gray-400">
          <IoIosSearch size={25} style={{ color: "black" }} />
        </span>
        <button onClick={onClose} className="cursor-pointer ml-4">
          <span>
            <RxCross2 size={20} />
          </span>
        </button>
      </div>

      <div className=" w-[550px] mt-2">
        <ul className="mt-2 -ml-3">
          <li className="text-gray-500 mt-2 font-semibold">Popular Searches</li>
          {searchLists.map((search, index) => (
            <li key={index} className="mt-4 font-semibold">
              {search}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SearchBox;
