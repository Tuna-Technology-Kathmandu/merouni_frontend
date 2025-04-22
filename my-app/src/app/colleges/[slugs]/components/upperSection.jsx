import React from "react";
import Image from "next/image";
import { IoIosGlobe } from "react-icons/io";
import { PiLineVerticalThin } from "react-icons/pi";
import { FaUniversity, FaPhoneAlt } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { LiaUniversitySolid } from "react-icons/lia";
import { BsGlobe2 } from "react-icons/bs";

const ImageSection = ({ college }) => {
  console.log(college.college_logo);
  return (
    <>
      <div className="flex flex-col items-center relative ">

        {/* college image.names and location in cirlce */}
        <div className="w-full h-[600px] xl:mb-16 2xl:mb-32">
          <Image
            src={college.featured_img || "https://dummyimage.com/600x180/000/fff"}
            width={2400}
            height={600}
            alt="College Photo"
          // className="h-[25vh] md:h-[50vh] object-fill"
          />
          <div className="flex flex-row lg:h-[95px] bg-[#30AD8F] bg-opacity-5sw lg:mb-20 items-center p-0 px-8 sm:px-14 md:px-24">
            {/* Logo Container */}
            <div className="flex items-center justify-center rounded-full bg-white -translate-y-8 overflow-hidden w-24 h-24 md:w-32 md:h-32">
              <Image
                src={college.college_logo || `https://avatar.iran.liara.run/username?username=${college?.name}`}
                width={120}
                height={120}
                alt="College Logo"
                className="object-cover w-full h-full rounded-full aspect-square" // Ensures the image is circular
              />
            </div>
            <div className="ml-4">
              <h2 className="font-bold text-lg lg:text-4xl lg:leading-[50px]">
                {college?.name}
              </h2>
              <div className="flex flex-row ">
                <p className="font-semibold text-sm lg:text-lg ">
                  {college?.collegeAddress?.street},{" "}
                  {college?.collegeAddress?.city}
                </p>
                <span>
                  <IoIosGlobe size={25} />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* college all details */}
        <div className="sm:px-24 px-12 -mt-80 sm:-mt-72 md:-mt-48 lg:-mt-32 xl:-mt-20 2xl:-mt-16 w-full">
          <div className="bg-[#30AD8F] bg-opacity-10 text-black rounded-md flex items-center justify-center flex-wrap sm:justify-between md:justify-around md:gap-10 mb-8  items-left w-full l:w-[80%] gap-6 lg:gap-6 p-7 ">
            <div className="flex flex-col items-center gap-2 text-center ">
              <FaUniversity size={30} />
              <p className="max-w-36 sm:text-base text-xs font-semibold">{college?.university?.fullname || "N/A"}</p>
            </div>
            <div className=" items-center hidden xl:block">
              <PiLineVerticalThin size={60} />
            </div>
            <div className="flex flex-col items-center gap-2 text-center  ">
              <LiaUniversitySolid size={30} />
              <p className="whitespace-nowrap sm:text-base text-xs font-semibold">
                {college?.institute_type || "N/A"}
              </p>
            </div>
            <div className="items-center hidden xl:block">
              <PiLineVerticalThin size={60} />
            </div>
            <div className="flex flex-col items-center gap-2 text-center ">
              <img src="/images/level.png" alt="level" className="w-10" />
              <p className="whitespace-nowrap  sm:text-base text-xs font-semibold">+2, Bachelor Program</p>
            </div>
            <div className="items-center hidden xl:block">
              <PiLineVerticalThin size={60} />
            </div>
            <div className="flex flex-col items-center gap-2 text-center ">
              <FaPhoneAlt size={25} />
              {(college?.collegeContacts || []).map((contact, index) => (
                <div key={index} className="flex flex-row">
                  <p className="sm:text-base text-xs font-semibold">{contact?.contact_number || 'contact coming soon'}</p>
                </div>
              ))}
            </div>
            <div className="items-center hidden xl:block">
              <PiLineVerticalThin size={60} />
            </div>
            <div className="flex flex-col items-center gap-2 text-center ">
              {/* <IoMdMail size={25} /> */}
              <BsGlobe2 size={25} />
              <a href={college.website_url} target="_blank">
                <p className="whitespace-nowrap hover:underline hover:text-blue-500 hover:cursor-pointer sm:text-base text-xs font-semibold">
                  {college.website_url || "www.check.com"}
                </p>
              </a>
            </div>
          </div>
        </div>
        <div className="space-y-4 text-[#b0b2c3] fixed left-4 top-[30%] lg:block md:-translate-y-1 bg-white p-2 rounded-xl flex items-center flex-col">
          <div className="text-black font-bold text-sm">Share</div>
          <img src="/images/fb.png" alt="Facebook" className="w-6" />
          <img src="/images/insta.png" alt="Instagram" className="w-6" />
          <img src="/images/linkedin.png" alt="LinkedIn" className="w-6" />
          <img src="/images/twitter.png" alt="Twitter" className="w-6" />
        </div>
      </div>
    </>
  );
};

export default ImageSection;
