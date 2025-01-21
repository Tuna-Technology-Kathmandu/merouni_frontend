import React from "react";

const Navbar = () => {
  return (
    <>
      <div className="bg-[#30ad8f] w-full h-12 pt-[10px] hidden md:block">
        <div className="flex items-center  mx-auto justify-center gap-8 md:gap-16 text-white ">
          <div>University</div>
          <div>Courses</div>
          <div>Colleges</div>
          <div>Events</div>
          <div>Blogs</div>
          <div>Materials</div>
        </div>
      </div>
      <div className="block md:hidden bg-[#30ad8f]  h-28 pt-[10px]  ">
        <div className="flex  gap-8 md:gap-16 overflow-x-auto parent-div my-4 px-4">
          <div className=" border-2  rounded-full bg-[#D9DEE0]  text-black p-2 px-6 font-bold whitespace-nowrap  ">
            Tribhuvan University
          </div>
          <div className=" border-2  rounded-full bg-[#D9DEE0]  text-black p-2 px-6 font-bold whitespace-nowrap ">
            Kathmandu University
          </div>
          <div className=" border-2  rounded-full bg-[#D9DEE0]  text-black p-2 px-6 font-bold whitespace-nowrap ">
            Purbanchal University
          </div>
          <div className=" border-2  rounded-full bg-[#D9DEE0]  text-black p-2 px-6 font-bold whitespace-nowrap ">
            Pokhara University
          </div>
          <div className=" border-2  rounded-full bg-[#D9DEE0]  text-black p-2 px-6 font-bold whitespace-nowrap ">
            Paschimanchal University
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
