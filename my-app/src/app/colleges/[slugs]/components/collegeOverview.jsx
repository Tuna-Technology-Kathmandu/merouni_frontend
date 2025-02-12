// "use client";
// import React, { useState } from "react";
// import Image from "next/image";
// import { FaUser } from "react-icons/fa";
// import { FaPhoneAlt } from "react-icons/fa";
// import { IoMdMail } from "react-icons/io";
// import { PiLineVerticalThin } from "react-icons/pi";

// const CollegeOverview = ({ college }) => {
//   const [activeTab, setActiveTab] = useState("Overview");
//   const programs = [
//     "Bachelor (Hons) of Business Administration (BBA)",
//     "Bachelor of Information Technology (BIT)",
//     "Bachelor of Computer Science (Hons) Network Technology & Cyber Security (BCS)",
//     "BSc Hons. in Hospitality Management (BHM)",
//     "Master of Business Administration (MBA)",
//     "Master of Computer Science (MCS)",
//     "MBA in Hospitaily Management",
//   ];

//   const members = [
//     {
//       name: "Bhesh Raj Pokhrel",
//       post: "Executive Chairman",
//       phoneNumber: "981234578",
//       email: "demo@gmail.com",
//       image: "/images/college_member.png",
//     },
//     {
//       name: "Bhesh Raj Pokhrel",
//       post: "Executive Chairman",
//       phoneNumber: "981234578",
//       email: "demo@gmail.com",
//       image: "/images/college_member.png",
//     },
//     {
//       name: "Bhesh Raj Pokhrel",
//       post: "Executive Chairman",
//       phoneNumber: "981234578",
//       email: "demo@gmail.com",
//       image: "/images/college_member.png",
//     },
//     {
//       name: "Bhesh Raj Pokhrel",
//       post: "Executive Chairman",
//       phoneNumber: "981234578",
//       email: "demo@gmail.com",
//       image: "/images/college_member.png",
//     },
//     {
//       name: "Bhesh Raj Pokhrel",
//       post: "Executive Chairman",
//       phoneNumber: "981234578",
//       email: "demo@gmail.com",
//       image: "/images/college_member.png",
//     },
//     {
//       name: "Bhesh Raj Pokhrel",
//       post: "Executive Chairman",
//       phoneNumber: "981234578",
//       email: "demo@gmail.com",
//       image: "/images/college_member.png",
//     },
//   ];
//   console.log("Get college params:", college);
//   return (
//     <div className="w-[1150px]  mx-auto bg-white border-2 shadow-md rounded-2xl mb-10 pb-5">
//       {/* Tabs Section */}

//       <div className="grid grid-cols-6 rounded-t-2xl bg-[#D9D9D9]">
//         {[
//           "Overview",
//           "Programs",
//           "Members",
//           "Facilities",
//           "Contact",
//           "Address",
//         ].map((tab) => (
//           <button
//             key={tab}
//             onClick={() => setActiveTab(tab)}
//             className={`py-3 text-lg font-semibold text-center transition-all duration-300 ${
//               activeTab === tab
//                 ? "text-[#30AD8F] border-b-2 border-[#30AD8F] bg-white rounded-t-2xl"
//                 : "text-gray-500 bg-[#D9D9D9] rounded-t-2xl"
//             }`}
//           >
//             {tab}
//           </button>
//         ))}
//       </div>

//       {/* Overview Section */}
//       {activeTab === "Overview" && (
//         <div className="mt-6 ml-4">
//           <h2 className="text-2xl font-bold">About</h2>
//           <p className="text-gray-700 mt-4 leading-7">{college.description}</p>

//           {/* Mission Section */}
//           {/* <h2 className="text-2xl font-bold mt-6">Mission</h2>
//           <ul className="list-disc list-inside mt-4 text-gray-700">
//             <li>Being a truly international business school</li>
//             <li>The excellence of our learning experience</li>
//             <li>World-Class Research and thinking</li>
//           </ul> */}

//           {/* Vision Section */}
//           <h2 className="text-2xl font-bold mt-6">Vision</h2>
//           <p className="text-gray-700 mt-4">{college.visions}</p>
//         </div>
//       )}

//       {activeTab === "Programs" && (
//         <div className="mt-6 ml-4">
//           <h2 className="text-2xl font-bold">
//             OFFERED PROGRAMS - {college.fullname}
//           </h2>
//           {programs.map((program, index) => (
//             <div className="mt-2">
//               <h2 className="font-bold mb-1">{program}</h2>
//               <button
//                 type="button"
//                 className="bg-[#2981B2] p-2 rounded-lg text-white"
//               >
//                 Apply Now
//               </button>
//             </div>
//           ))}
//         </div>
//       )}

//       {activeTab === "Members" && (
//         <div className="mt-6 ml-4">
//           <h2 className="text-2xl font-bold">Members</h2>
//           <div className="grid grid-cols-2 gap-4 mt-4">
//             {college.members.map((member, index) => (
//               <div className="flex flex-row mb-8 ml-14 " key={index}>
//                 {/* <div className="mr-3 ">
//                               <Image
//                                 src={member.image}
//                                 width={150}
//                                 height={150}
//                                 alt="Member Logo"
//                               />
//                             </div> */}
//                 <div className="flex flex-col">
//                   <div className="flex flex-row mb-2 gap-2 items-center">
//                     <FaUser />
//                     <p>
//                       {member.salutation}
//                       {member.name}
//                     </p>
//                   </div>
//                   <div className="flex flex-row mb-2 gap-2 items-center">
//                     <img
//                       src="/images/Role icon.png"
//                       alt="Role Icon"
//                       className="w-4"
//                     />
//                     <p>{member.role}</p>
//                   </div>
//                   <div className="flex flex-row mb-2 gap-2 items-center">
//                     <FaUser />

//                     <p>{member.contactInfo.phone}</p>
//                   </div>
//                   <div className="flex flex-row mb-2 gap-2 items-center">
//                     <IoMdMail />
//                     <p>{member.contactInfo.email}</p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {activeTab === "Facilities" && (
//         <div className="mt-6 ml-4">
//           {college.facilities.map((facility, index) => (
//             <div key={index} className="mt-2">
//               <h2 className="text-2xl font-bold">{facility.title}:</h2>
//               <p className="text-gray-700 mt-2 leading-7">
//                 {facility.description}
//               </p>
//             </div>
//           ))}
//         </div>
//       )}
//       {activeTab === "Contact" && (
//         <>
//           <div className="flex flex-col mt-8 ml-8 mb-10">
//             {/*Upper part section of contact */}
//             <div className="grid grid-cols-3 gap-4">
//               <div className="w-[250px] h-[180px] bg-[#30AD8F] bg-opacity-10 items-center flex flex-col rounded-lg">
//                 <img
//                   src="/images/contact_college.png"
//                   alt="Contact Icon"
//                   className="w-8 -translate-y-5"
//                 />
//                 <h2 className="text-2xl font-bold mt-2">Contact Info</h2>
//                 {/* <p>{college.contactInfo.faxes}</p> */}
//                 {college.contactInfo.phoneNumber.map((phone, index) => (
//                   <p
//                     key={index}
//                     className="flex flex-col items-center justify-center"
//                   >
//                     {phone}
//                   </p>
//                 ))}
//               </div>

//               <div className="w-[250px] h-[180px] bg-[#30AD8F] bg-opacity-10 items-center flex flex-col rounded-lg">
//                 <img
//                   src="/images/fax_college.png"
//                   alt="Fax Icon"
//                   className="w-8 -translate-y-5"
//                 />
//                 <h2 className="text-2xl font-bold mt-2">Fax Info</h2>
//                 <p>{college.contactInfo.faxes}</p>
//               </div>

//               <div className="w-[250px] h-[180px] bg-[#30AD8F] bg-opacity-10 items-center flex flex-col rounded-lg">
//                 <img
//                   src="/images/PO_college.png"
//                   alt="PO Box Icon"
//                   className="w-8 -translate-y-5"
//                 />
//                 <h2 className="text-2xl font-bold mt-2">PO Box Info</h2>
//                 <p>{college.contactInfo.poboxes}</p>
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-8 mt-8 ml-28">
//               <div className="w-[250px] h-[180px] bg-[#30AD8F] bg-opacity-10 items-center flex flex-col rounded-lg">
//                 <img
//                   src="/images/mail_college.png"
//                   alt="Email Icon"
//                   className="w-16 -translate-y-6 "
//                 />
//                 <h2 className="text-2xl font-bold ">Email</h2>
//                 <p>{college.contactInfo.email}</p>
//               </div>

//               <div className="w-[250px] h-[180px] bg-[#30AD8F] bg-opacity-10 items-center flex flex-col rounded-lg">
//                 <img
//                   src="/images/website_college.png"
//                   alt="Website Icon"
//                   className="w-10 -translate-y-5"
//                 />
//                 <h2 className="text-2xl font-bold mt-6">Website</h2>
//                 <a
//                   href={college.contactInfo.websiteUrl}
//                   className="underline text-blue-600"
//                 >
//                   {college.contactInfo.websiteUrl}
//                 </a>
//                 {/* <p>{college.contactInfo.websiteUrl}</p> */}
//               </div>
//             </div>
//           </div>
//         </>
//       )}

//       {activeTab === "Address" && (
//         <>
//           <div className="flex flex-col mt-8 ml-8 mb-10">
//             <div className="  bg-[#30AD8F] bg-opacity-10 text-black rounded-md flex flex-row  mb-8  items-center justify-between w-[1050px] h-[120px] p-8">
//               <div className=" flex flex-col items-center">
//                 {/* <p className="text-sm font-bold">Starts</p> */}
//                 {/* <FaUniversity size={30} /> */}
//                 <img
//                   src="/images/country_college.png"
//                   alt="level"
//                   className="w-8"
//                 />

//                 <p className="whitespace-nowrap">{college.address.country}</p>
//               </div>
//               <div className="flex items-center">
//                 <PiLineVerticalThin size={60} />
//               </div>
//               <div className=" flex flex-col items-center">
//                 {/* <p className="text-sm font-bold">Starts</p> */}
//                 {/* <LiaUniversitySolid size={30} /> */}
//                 <img
//                   src="/images/state_college.png"
//                   alt="level"
//                   className="w-8"
//                 />

//                 <p className="whitespace-nowrap">
//                   {college.address.state} Province
//                 </p>
//               </div>
//               <div className="flex items-center">
//                 <PiLineVerticalThin size={60} />
//               </div>
//               <div className=" flex flex-col items-center">
//                 {/* <p className="text-sm font-bold">Ends</p> */}
//                 {/* <img src="/images/level.png" alt="level" className="w-10" /> */}
//                 <img
//                   src="/images/city_college.png"
//                   alt="level"
//                   className="w-8"
//                 />

//                 <p className="whitespace-nowrap">{college.address.city}</p>
//               </div>
//               <div className="flex items-center">
//                 <PiLineVerticalThin size={60} />
//               </div>
//               <div className=" flex flex-col items-center">
//                 {/* <p className="text-sm font-bold">Ends</p> */}
//                 {/* <img src="/images/level.png" alt="level" className="w-10"/> */}
//                 {/* <FaPhoneAlt size={25} /> */}
//                 <img
//                   src="/images/street_college.png"
//                   alt="level"
//                   className="w-6"
//                 />

//                 <p className="whitespace-nowrap">{college.address.street}</p>
//               </div>
//               <div className="flex items-center">
//                 <PiLineVerticalThin size={60} />
//               </div>
//               <div className="  flex flex-col items-center">
//                 {/* <p className="text-sm font-bold whitespace-nowrap">Time</p> */}
//                 {/* <IoMdMail size={25} /> */}
//                 <img
//                   src="/images/postalCode_college.png"
//                   alt="level"
//                   className="w-8"
//                 />

//                 <p className="whitespace-nowrap ">
//                   {college.address.postalCode}
//                 </p>
//               </div>
//             </div>

//             {/** Map portion*/}
//             <div className="mt-10 flex flex-col">
//               <h2 className="text-2xl font-bold mb-5">Get Direction</h2>
//               <div className="mt-2 rounded-md">
//                 <iframe
//                   src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.727672774474!2d85.3403091!3d27.712974!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1970a9ff7041%3A0xfcaa45db29104458!2sTexas%20International%20College!5e0!3m2!1sen!2snp!4v1706633788483!5m2!1sen!2snp"
//                   style={{ border: "0", borderRadius: "8px" }}
//                   className="w-[1050px] h-[300px] border-0 rounded-md"
//                   allowFullScreen
//                   loading="lazy"
//                 ></iframe>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default CollegeOverview;

import React, { useState } from "react";
import { FaUser } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { PiLineVerticalThin } from "react-icons/pi";

const CollegeOverview = ({ college }) => {
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <div className="w-full max-w-[1150px] mx-auto bg-white border-2 shadow-md rounded-2xl mb-10 pb-5">
      <div className="grid grid-cols-6 rounded-t-2xl bg-[#D9D9D9]">
        {[
          "Overview",
          "Programs",
          "Members",
          "Facilities",
          "Contact",
          "Address",
        ].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-3 text-lg font-semibold text-center transition-all duration-300 ${
              activeTab === tab
                ? "text-[#30AD8F] border-b-2 border-[#30AD8F] bg-white rounded-t-2xl"
                : "text-gray-500 bg-[#D9D9D9] rounded-t-2xl"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Overview" && (
        <div className="mt-6 ml-4">
          <h2 className="text-2xl font-bold">About</h2>
          <p className="text-gray-700 mt-4 leading-7">{college.description}</p>
          <h2 className="text-2xl font-bold mt-6">Institution Type</h2>
          <p className="text-gray-700 mt-4">{college.institute_type}</p>
        </div>
      )}

      {activeTab === "Programs" && (
        <div className="mt-6 ml-4">
          <h2 className="text-2xl font-bold">
            OFFERED PROGRAMS - {college.university.fullname}
          </h2>
          {college.collegeCourses.map((course, index) => (
            <div key={index} className="mt-2">
              <h2 className="font-bold mb-1">{course.program.title}</h2>
              <button
                type="button"
                className="bg-[#2981B2] p-2 rounded-lg text-white"
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === "Members" && (
        <div className="mt-6 ml-4">
          <h2 className="text-2xl font-bold">Members</h2>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {college.collegeMembers.map((member, index) => (
              <div className="flex flex-row mb-8 ml-14" key={index}>
                <div className="flex flex-col">
                  <div className="flex flex-row mb-2 gap-2 items-center">
                    <FaUser />
                    <p>{member.name}</p>
                  </div>
                  <div className="flex flex-row mb-2 gap-2 items-center">
                    <img
                      src="/images/Role icon.png"
                      alt="Role Icon"
                      className="w-4"
                    />
                    <p>{member.role}</p>
                  </div>
                  <div className="flex flex-row mb-2 gap-2 items-center">
                    <FaUser />
                    <p>{member.contact_number}</p>
                  </div>
                  <div className="flex flex-row mb-2 gap-2 items-center">
                    <IoMdMail />
                    <p>{member.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "Contact" && (
        <div className="flex flex-col mt-8 ml-8 mb-10">
          <div className="grid grid-cols-3 gap-4">
            <div className="w-[250px] h-[180px] bg-[#30AD8F] bg-opacity-10 items-center flex flex-col rounded-lg">
              <img
                src="/images/contact_college.png"
                alt="Contact Icon"
                className="w-8 -translate-y-5"
              />
              <h2 className="text-2xl font-bold mt-2">Contact Info</h2>
              {college.collegeContacts.map((contact, index) => (
                <p
                  key={index}
                  className="flex flex-col items-center justify-center"
                >
                  {contact.contact_number}
                </p>
              ))}
            </div>

            <div className="w-[250px] h-[180px] bg-[#30AD8F] bg-opacity-10 items-center flex flex-col rounded-lg">
              <img
                src="/images/website_college.png"
                alt="Website Icon"
                className="w-10 -translate-y-5"
              />
              <h2 className="text-2xl font-bold mt-6">Website</h2>
              {/* console.log("Website url:") */}
              <a
                href="https://www.merouni.com"
                className="underline text-blue-600"
                target="_blank"
              >
                {college.website_url || "N/A"}
              </a>
            </div>
          </div>
        </div>
      )}

      {activeTab === "Address" && (
        <div className="flex flex-col mt-8 ml-8 mb-10">
          <div className="bg-[#30AD8F] bg-opacity-10 text-black rounded-md flex flex-row mb-8 items-center justify-between w-[1050px] h-[120px] p-8">
            <div className="flex flex-col items-center">
              <img
                src="/images/country_college.png"
                alt="level"
                className="w-8"
              />
              <p className="whitespace-nowrap">
                {college.collegeAddress.country}
              </p>
            </div>
            <div className="flex items-center">
              <PiLineVerticalThin size={60} />
            </div>
            <div className="flex flex-col items-center">
              <img
                src="/images/state_college.png"
                alt="level"
                className="w-8"
              />
              <p className="whitespace-nowrap">
                {college.collegeAddress.state}
              </p>
            </div>
            <div className="flex items-center">
              <PiLineVerticalThin size={60} />
            </div>
            <div className="flex flex-col items-center">
              <img src="/images/city_college.png" alt="level" className="w-8" />
              <p className="whitespace-nowrap">{college.collegeAddress.city}</p>
            </div>
            <div className="flex items-center">
              <PiLineVerticalThin size={60} />
            </div>
            <div className="flex flex-col items-center">
              <img
                src="/images/street_college.png"
                alt="level"
                className="w-6"
              />
              <p className="whitespace-nowrap">
                {college.collegeAddress.street}
              </p>
            </div>
            <div className="flex items-center">
              <PiLineVerticalThin size={60} />
            </div>
            <div className="flex flex-col items-center">
              <img
                src="/images/postalCode_college.png"
                alt="level"
                className="w-8"
              />
              <p className="whitespace-nowrap">
                {college.collegeAddress.postal_code}
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-col">
            <h2 className="text-2xl font-bold mb-5">Get Direction</h2>
            <div className="mt-2 rounded-md">
              <iframe
                src={college.google_map_url}
                style={{ border: "0", borderRadius: "8px" }}
                className="w-[1050px] h-[300px] border-0 rounded-md"
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollegeOverview;
