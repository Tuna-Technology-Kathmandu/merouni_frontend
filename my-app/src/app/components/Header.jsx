// import React from "react";
// import Image from "next/image";
// import { IoSearch } from "react-icons/io5";

// const Header = () => {
//   return (
//     <div className="max-w-[1400px] justify-center  p-3  mx-auto m-3 flex flex-row">
//       <div className="flex flex-row items-center space-x-4">
//         <Image
//           alt="meroUni logo"
//           src="/images/edusanjal-logo.svg"
//           width={200}
//           height={200}
//         />

//         <input
//           type="search"
//           name="search"
//           placeholder="   Search colleges, courses, schools .."
//           className="border-gray-200 border-2 rounded-lg w-full h-10"
//           size={50}
//         />
//         <button type="submit" className="">
//           <IoSearch />
//         </button>

//         {/* <p>
//           <span>Sign In</span>
//         </p> */}
//         <div className="flex flex-row">
//           <button
//             type="button"
//             className="flex items-center  hover:bg-[#0362C7] p-2  rounded bg-[#0362C7] text-white"
//           >
//             <span>Sign Up</span>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Header;

import React from "react";
import Image from "next/image";
import { IoSearch } from "react-icons/io5";

const Header = () => {
  return (
    <div className="max-w-[1400px] justify-center p-3 mx-auto m-3 flex flex-row">
      <div className="flex flex-row items-center space-x-8">
        {" "}
        {/* Added items-center */}
        <Image
          alt="meroUni logo"
          src="/images/edusanjal-logo.svg"
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
        </div>
        <button type="button" className=" py-3  rounded  w-32">
          Sign in
        </button>
        <button
          type="button"
          className=" py-2 hover:bg-[#0362C7] rounded bg-[#0362C7] text-white   w-32"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default Header;
