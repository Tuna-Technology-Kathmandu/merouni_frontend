import React from "react";
import Image from "next/image";
import { IoIosGlobe } from "react-icons/io";
import { PiLineVerticalThin } from "react-icons/pi";
import { FaUniversity, FaPhoneAlt } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { LiaUniversitySolid } from "react-icons/lia";
import { BsGlobe2 } from "react-icons/bs";

const ImageSection = ({ college }) => {
  console.log(college);
  return (
    <>
      <div className="flex flex-col items-center relative ">
        <div>
          <Image
            src={college.featured_img || "https://dummyimage.com/600x180/000/fff"}
            width={2400}
            height={600}
            alt="College Photo"
            // className="h-[25vh] md:h-[50vh] object-fill"
          />
          <div className="flex flex-row bg-[#30AD8F] bg-opacity-5 mb-20 items-center p-0 md:pl-32">
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
            <div className="ml-8">
              <h2 className="font-bold text-lg lp:text-3xl leading-10">
                {college?.name}
              </h2>
              <div className="flex flex-row">
                <p className="font-semibold text-lg ">
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

        <div className="bg-[#30AD8F] bg-opacity-10 text-black rounded-md flex  flex-col lp:flex-row mb-8  items-left w-full lp:w-[80%] justify-between gap-4 lp:gap-12  p-8 ">
          <div className="flex flex-row lp:flex-col items-center gap-2 ">
            <FaUniversity size={30} />
            <p className="">{college?.university?.fullname || "N/A"}</p>
          </div>
          <div className=" items-center hidden lp:block">
            <PiLineVerticalThin size={60} />
          </div>
          <div className="flex flex-row lp:flex-col items-center gap-2">
            <LiaUniversitySolid size={30} />
            <p className="whitespace-nowrap">
              {college?.institute_type || "N/A"}
            </p>
          </div>
          <div className="items-center hidden lp:block">
            <PiLineVerticalThin size={60} />
          </div>
          <div className="flex flex-row lp:flex-col items-center gap-2">
            <img src="/images/level.png" alt="level" className="w-10" />
            <p className="whitespace-nowrap">+2, Bachelor Program</p>
          </div>
          <div className="items-center hidden lp:block">
            <PiLineVerticalThin size={60} />
          </div>
          <div className="flex flex-row lp:flex-col items-center gap-2">
            <FaPhoneAlt size={25} />
            {(college?.collegeContacts || []).map((contact, index) => (
              <div key={index} className="flex flex-row">
                <p>{contact?.contact_number}</p>
              </div>
            ))}
          </div>
          <div className="items-center hidden lp:block">
            <PiLineVerticalThin size={60} />
          </div>
          <div className="flex flex-row lp:flex-col items-center gap-2">
            {/* <IoMdMail size={25} /> */}
            <BsGlobe2 size={25} />
            <a href={college.website_url} target="_blank">
              <p className="whitespace-nowrap hover:underline hover:text-blue-500 hover:cursor-pointer">
                {college.website_url || "N/A"}
              </p>
            </a>
          </div>
        </div>

        <div className="space-y-4 text-[#b0b2c3] fixed left-4 top-[30%] hidden lp:block md:-translate-y-1 bg-white p-2 rounded-xl flex items-center flex-col">
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
