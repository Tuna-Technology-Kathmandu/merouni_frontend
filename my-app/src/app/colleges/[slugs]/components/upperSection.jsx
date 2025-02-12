import React from "react";
import Image from "next/image";
import { IoIosGlobe } from "react-icons/io";
import { PiLineVerticalThin } from "react-icons/pi";
import { FaUniversity, FaPhoneAlt } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { LiaUniversitySolid } from "react-icons/lia";
import { BsGlobe2 } from "react-icons/bs";

const ImageSection = ({ college }) => {
  return (
    <>
      <div className="flex flex-col items-center">
        <div>
          <Image
            src={college.featured_img || "/images/collegePhoto.png"}
            width={2400}
            height={600}
            alt="College Photo"
            className="h-[50vh] object-fill"
          />
          <div className="flex flex-row bg-[#30AD8F] bg-opacity-5 h-[110px] mb-20 items-center p-0 md:pl-32">
            <div className="flex items-center justify-center w-[150px] h-[150px] rounded-full bg-white -translate-y-8">
              <Image
                src={college.college_logo || "/images/texas_logo.png"}
                width={120}
                height={120}
                alt="College Logo"
                className=""
              />
            </div>
            <div className="ml-8">
              <h2 className="font-bold text-3xl leading-10">{college?.name}</h2>
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

        <div className="bg-[#30AD8F] bg-opacity-10 text-black rounded-md flex flex-row mb-8 items-center justify-between w-[1150px] h-[150px] p-8">
          <div className="flex flex-col items-center">
            <FaUniversity size={30} />
            <p className="whitespace-nowrap">
              {college?.university?.fullname || "N/A"}
            </p>
          </div>
          <div className="flex items-center">
            <PiLineVerticalThin size={60} />
          </div>
          <div className="flex flex-col items-center">
            <LiaUniversitySolid size={30} />
            <p className="whitespace-nowrap">
              {college?.institute_type || "N/A"}
            </p>
          </div>
          <div className="flex items-center">
            <PiLineVerticalThin size={60} />
          </div>
          <div className="flex flex-col items-center">
            <img src="/images/level.png" alt="level" className="w-10" />
            <p className="whitespace-nowrap">+2, Bachelor Program</p>
          </div>
          <div className="flex items-center">
            <PiLineVerticalThin size={60} />
          </div>
          <div className="flex flex-col items-center">
            <FaPhoneAlt size={25} />
            {(college?.collegeContacts || []).map((contact, index) => (
              <div key={index} className="flex flex-row">
                <p>{contact?.contact_number}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center">
            <PiLineVerticalThin size={60} />
          </div>
          <div className="flex flex-col items-center">
            {/* <IoMdMail size={25} /> */}
            <BsGlobe2 size={25} />
            <a href={college.website_url} target="_blank">
            <p className="whitespace-nowrap hover:underline hover:text-blue-500 hover:cursor-pointer">
              {college.website_url || N / A}
            </p>
            </a>
          </div>
        </div>

        <div className="space-y-4 text-[#b0b2c3] fixed left-8 top-[30%] md:-translate-y-1 bg-white p-2 rounded-xl flex items-center flex-col">
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
