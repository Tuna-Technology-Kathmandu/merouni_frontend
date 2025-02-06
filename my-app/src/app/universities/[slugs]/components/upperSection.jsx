import React from "react";
import Image from "next/image";
import { PiLineVerticalThin } from "react-icons/pi";
import { IoIosGlobe } from "react-icons/io";
import { FaPhoneAlt } from "react-icons/fa";
import { MdOutlineArrowRight } from "react-icons/md";
import { FaUniversity } from "react-icons/fa";
import { MdDateRange } from "react-icons/md";
import { LiaUniversitySolid } from "react-icons/lia";
import { IoMdMail } from "react-icons/io";

const ImageSection = ({ university }) => {
  return (
    <div className="flex flex-col items-center">
      <div>
        <Image
          src={"/images/course_description.png"}
          width={2400}
          height={600}
          alt="Course Affiliation photo"
        />

        <div className="flex flex-row bg-[#30AD8F] bg-opacity-5 h-[110px] mb-20 items-center p-0 md:pl-32">
          <div className="bg-white w-40 h-40 rounded-full -translate-y-10 items-center flex flex-col justify-center">
            <img
              src={"/images/tu.png"}
              alt="College Logo"
              className=" w-32 h-32"
            />
          </div>
          <div className="ml-8">
            <h2 className="font-bold text-3xl leading-10">
              {university?.fullname || "Bachelor of Computer Application"}
            </h2>
            {/* 
            <div className="flex flex-row items-center ">
              <p className="font-semibold text-lg ">BCA</p>
              <span>
                <MdOutlineArrowRight size={25} />
              </span>
              <p className="font-semibold text-lg ">Tribhuvan University</p>
            </div> */}
            <div className="flex flex-row">
              <p className="font-semibold text-lg ">
                {university.street},{university.city},{university.country}
              </p>
              <span>
                <IoIosGlobe size={25} />
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="  bg-[#30AD8F] bg-opacity-10 text-black rounded-md flex flex-row  mb-8  items-center justify-center w-[1150px] h-[150px] p-8">
        <div className=" flex flex-col items-center pr-14">
          {/* <p className="text-sm font-bold">Starts</p> */}
          {/* <img src="/images/course_year.png" alt="year" className="w-8" /> */}
          <MdDateRange size={30} />
          <p className="whitespace-nowrap">
            {university?.date_of_establish || "2009-12-10"}
          </p>
        </div>
        <div className="flex items-center pr-5">
          <PiLineVerticalThin size={60} />
        </div>
        <div className=" flex flex-col items-center pl-14 pr-14">
          {/* <p className="text-sm font-bold">Starts</p> */}
          {/* <img
            src="/images/course_faculty.png"
            alt="faculty"
            className="w-10"
          /> */}
          <LiaUniversitySolid size={30} />

          <p className=" whitespace-nowrap">
            {university?.type_of_institute || "Private"}
          </p>
        </div>
        <div className="flex items-center pr-5">
          <PiLineVerticalThin size={60} />
        </div>
        <div className=" flex flex-col items-center pl-14 pr-14">
          <FaPhoneAlt size={20} />

          <div className="flex flex-row">
            <p>{university?.contact?.phone_number || "N/A"}</p>
          </div>
        </div>
        <div className="flex items-center ">
          <PiLineVerticalThin size={60} />
        </div>
        <div className=" flex flex-col items-center pl-14">
          {/* <p className="text-sm font-bold">Ends</p> */}
          {/* <img src="/images/course_hour.png" alt="level" className="w-10" />

          <p className="whitespace-nowrap">
            {degree?.delivery_mode || "74 Hours"}
          </p> */}
          <IoMdMail size={25} />
          <p className="whitespace-nowrap ">
            {university?.contact?.email || "N/A"}
          </p>
        </div>
      </div>

      <div className="   bg-opacity-10 text-black rounded-md flex flex-col  mb-8    w-[1150px]  pt-10">
        <h2 className="font-bold text-3xl leading-10">
          Why Study in {university.fullname}?
        </h2>
        <p className="pt-6 leading-7 ">
          {university?.description ||
            " This university has good environment for excelling"}
        </p>
        {/* <p className="pt-4 leading-7">
          The objective of the BCA program of Tribhuvan University is to produce
          high quality computer application users and developers. The program of
          study for Bachelor of Arts in Computer Application (BCA) is over a
          period of eight semesters (four academic years). The academic year
          begins in September and February of each year. The medium of
          instruction and examination in the Bachelor of Arts in Computer
          Application (BCA) program is English.
        </p> */}
      </div>
    </div>
  );
};

export default ImageSection;

// import React from "react";
// import Image from "next/image";
// import { IoIosGlobe } from "react-icons/io";
// import { PiLineVerticalThin } from "react-icons/pi";
// import { FaUniversity } from "react-icons/fa";
// import { FaPhoneAlt } from "react-icons/fa";
// import { IoMdMail } from "react-icons/io";
// import { LiaUniversitySolid } from "react-icons/lia";

// const ImageSection = ({ college }) => {
//   return (
//     <>
//       <div className="flex flex-col items-center">
//         <div>
//           <Image
//             src={"/images/collegePhoto.png"}
//             width={2400}
//             height={600}
//             alt="College Photo"
//           />
//           <div className="flex flex-row bg-[#30AD8F] bg-opacity-5 h-[110px] mb-20 items-center p-0 md:pl-32">
//             <div>
//               <Image
//                 src={"/images/texas_logo.png"}
//                 width={150}
//                 height={150}
//                 alt="College Logo"
//                 className="-translate-y-8"
//               />
//             </div>
//             <div className="ml-8">
//               <h2 className="font-bold text-3xl leading-10">
//                 {college.fullname}
//               </h2>

//               <div className="flex flex-row">
//                 <p className="font-semibold text-lg ">
//                   {college.address.street},{college.address.city}
//                 </p>
//                 <span>
//                   <IoIosGlobe size={25} />
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="  bg-[#30AD8F] bg-opacity-10 text-black rounded-md flex flex-row  mb-8  items-center justify-between w-[1150px] h-[150px] p-8">
//           <div className=" flex flex-col items-center">
//             <FaUniversity size={30} />
//             <p className="whitespace-nowrap">
//               {college?.affiliation?.fullname || "N/A"}
//             </p>
//           </div>
//           <div className="flex items-center">
//             <PiLineVerticalThin size={60} />
//           </div>
//           <div className=" flex flex-col items-center">
//             <LiaUniversitySolid size={30} />
//             <p className="whitespace-nowrap">
//               {college?.instituteType || "N/A"}
//             </p>
//           </div>
//           <div className="flex items-center">
//             <PiLineVerticalThin size={60} />
//           </div>
//           <div className=" flex flex-col items-center">
//             <img src="/images/level.png" alt="level" className="w-10" />

//             <p className="whitespace-nowrap">+2, Bachelor Program</p>
//           </div>
//           <div className="flex items-center">
//             <PiLineVerticalThin size={60} />
//           </div>
//           <div className=" flex flex-col items-center">
//             <FaPhoneAlt size={25} />

//             {(college?.contactInfo?.phoneNumber || []).map((phone, index) => (
//               <div key={index} className="flex flex-row">
//                 <p>{phone}</p>
//               </div>
//             ))}
//           </div>
//           <div className="flex items-center">
//             <PiLineVerticalThin size={60} />
//           </div>
//           <div className="  flex flex-col items-center">
//             <IoMdMail size={25} />
//             <p className="whitespace-nowrap ">
//               {college?.contactInfo?.email || "N/A"}
//             </p>
//           </div>
//         </div>

//         <div className="space-y-4 text-[#b0b2c3] fixed left-8 top-[30%] md:-translate-y-1 bg-white p-2 rounded-xl flex items-center flex-col">
//           <div className="text-black font-bold text-sm">Share</div>
//           <img src="/images/fb.png" alt="Facebook" className="w-6" />
//           <img src="/images/insta.png" alt="Instagram" className="w-6" />
//           <img src="/images/linkedin.png" alt="LinkedIn" className="w-6" />
//           <img src="/images/twitter.png" alt="Twitter" className="w-6" />
//         </div>
//       </div>
//     </>
//   );
// };

// export default ImageSection;
