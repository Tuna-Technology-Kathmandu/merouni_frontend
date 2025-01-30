// import Link from "next/link";
// import React from "react";

// const Navbar = () => {
//   return (
//     <>
//       <div className="bg-[#30ad8f] w-full h-12 pt-[10px] hidden md:block">
//         <div className="flex items-center  mx-auto justify-center gap-8 md:gap-16 text-white ">
//           <div>University</div>
//           <Link href="/courses">
//             <div>Courses</div>
//           </Link>
//           <Link href="/colleges">
//             <div>Colleges</div>
//           </Link>
//           <Link href="/events">
//             <div>Events</div>
//           </Link>
//           <Link href="/blogs">
//             <div>Blogs</div>
//           </Link>
//           <div>Materials</div>
//         </div>
//       </div>
//       <div className="block md:hidden bg-[#30ad8f]  h-28 pt-[10px]  ">
//         <div className="flex  gap-8 md:gap-16 overflow-x-auto parent-div my-4 px-4">
//           <div className=" border-2  rounded-full bg-[#D9DEE0]  text-black p-2 px-6 font-bold whitespace-nowrap  ">
//             Tribhuvan University
//           </div>
//           <div className=" border-2  rounded-full bg-[#D9DEE0]  text-black p-2 px-6 font-bold whitespace-nowrap ">
//             Kathmandu University
//           </div>
//           <div className=" border-2  rounded-full bg-[#D9DEE0]  text-black p-2 px-6 font-bold whitespace-nowrap ">
//             Purbanchal University
//           </div>
//           <div className=" border-2  rounded-full bg-[#D9DEE0]  text-black p-2 px-6 font-bold whitespace-nowrap ">
//             Pokhara University
//           </div>
//           <div className=" border-2  rounded-full bg-[#D9DEE0]  text-black p-2 px-6 font-bold whitespace-nowrap ">
//             Paschimanchal University
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Navbar;
import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <>
      <div className="bg-[#30ad8f] w-full h-12 pt-[10px] hidden md:block">
        <div className="flex items-center mx-auto justify-center gap-8 md:gap-16 text-white">
          <div className="hover:text-gray-200 cursor-pointer">University</div>
          <Link href="/courses">
            <div className="hover:text-gray-200 cursor-pointer">Courses</div>
          </Link>
          <Link href="/colleges">
            <div className="hover:text-gray-200 cursor-pointer">Colleges</div>
          </Link>
          <Link href="/events">
            <div className="hover:text-gray-200 cursor-pointer">Events</div>
          </Link>
          <Link href="/blogs">
            <div className="hover:text-gray-200 cursor-pointer">Blogs</div>
          </Link>
          <Link href="/materials">
            <div className="hover:text-gray-200 cursor-pointer">Materials</div>
          </Link>
        </div>
      </div>
      <div className="block md:hidden bg-[#30ad8f] h-28 pt-[10px]">
        <div className="flex gap-8 md:gap-16 overflow-x-auto parent-div my-4 px-4">
          <div className="border-2 rounded-full bg-[#D9DEE0] text-black p-2 px-6 font-bold whitespace-nowrap hover:bg-[#30ad8f] hover:text-white cursor-pointer">
            Tribhuvan University
          </div>
          <div className="border-2 rounded-full bg-[#D9DEE0] text-black p-2 px-6 font-bold whitespace-nowrap hover:bg-[#30ad8f] hover:text-white cursor-pointer">
            Kathmandu University
          </div>
          <div className="border-2 rounded-full bg-[#D9DEE0] text-black p-2 px-6 font-bold whitespace-nowrap hover:bg-[#30ad8f] hover:text-white cursor-pointer">
            Purbanchal University
          </div>
          <div className="border-2 rounded-full bg-[#D9DEE0] text-black p-2 px-6 font-bold whitespace-nowrap hover:bg-[#30ad8f] hover:text-white cursor-pointer">
            Pokhara University
          </div>
          <div className="border-2 rounded-full bg-[#D9DEE0] text-black p-2 px-6 font-bold whitespace-nowrap hover:bg-[#30ad8f] hover:text-white cursor-pointer">
            Paschimanchal University
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
