
import React, { useState } from "react";
import { FaUser } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { PiLineVerticalThin } from "react-icons/pi";

const CollegeOverview = ({ college }) => {
  console.log("Clz:", college);
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <div className="w-full lp:w-[80%] mx-auto bg-white border-2 shadow-md rounded-2xl mb-10 pb-5 overflow-x-auto parent-div">
      <div className=" grid grid-cols-5  w-[700px] md:w-full rounded-t-2xl bg-[#D9D9D9] ">
        {[
          "Overview",
          "Programs",
          "Members",
          "Contact",
          "Address",
        ].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-3   text-lg font-semibold text-center transition-all duration-300 ${
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
          <p className="text-gray-700 mt-4 leading-7">{college.content}</p>

          <h2 className="text-2xl font-bold mt-6">Institution Type</h2>
          <p className="text-gray-700 mt-4">{college.institute_type}</p>
        </div>
      )}

      {activeTab === "Programs" && (
        <div className="mt-6 ml-4">
          <h2 className="text-md font-semibold ">
            OFFERED PROGRAMS - {college.university.fullname}
          </h2>
          {college.collegeCourses.map((course, index) => (
            <div key={index} className="mt-2">
              <h2 className="text-md font-semibold mb-1">{course.program.title}</h2>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
          <div className="grid md:grid-cols-3 gap-4">
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
        <div className="flex flex-col mt-8 mb-10">
          <div className="bg-[#30AD8F] bg-opacity-10 text-black rounded-md flex flex-col lp:flex-row mb-8 items-left gap-4 justify-between w-full p-8">
            <div className="flex flex-row lp:flex-col items-center gap-2">
              <img
                src="/images/country_college.png"
                alt="level"
                className="w-8"
              />
              <p className="whitespace-nowrap">
                {college.collegeAddress.country}
              </p>
            </div>
            <div className="items-center hidden lp:block">
              <PiLineVerticalThin size={60} />
            </div>
            <div className="flex flex-row lp:flex-col items-center gap-2">
              <img
                src="/images/state_college.png"
                alt="level"
                className="w-8"
              />
              <p className="whitespace-nowrap">
                {college.collegeAddress.state}
              </p>
            </div>
            <div className="items-center hidden lp:block">
              <PiLineVerticalThin size={60} />
            </div>
            <div className="flex flex-row lp:flex-col items-center gap-2">
              <img src="/images/city_college.png" alt="level" className="w-8" />
              <p className="whitespace-nowrap">{college.collegeAddress.city}</p>
            </div>
            <div className="items-center hidden lp:block">
              <PiLineVerticalThin size={60} />
            </div>
            <div className="flex flex-row lp:flex-col items-center gap-2">
              <img
                src="/images/street_college.png"
                alt="level"
                className="w-6"
              />
              <p className="whitespace-nowrap">
                {college.collegeAddress.street}
              </p>
            </div>
            <div className="items-center hidden lp:block">
              <PiLineVerticalThin size={60} />
            </div>
            <div className="flex flex-row lp:flex-col items-center gap-2">
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
            <div className="mt-2 rounded-md flex items-center justify-center mx-auto">
              <div
                dangerouslySetInnerHTML={{ __html: college.google_map_url }}
              className="w-full"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollegeOverview;
