import React, { useState, useEffect, useRef } from "react";
import { FaUser } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { PiLineVerticalThin } from "react-icons/pi";

const CollegeOverview = ({ college }) => {
  const middleRef = useRef(null);
  const [activeOption, setActiveOption] = useState("Overview");
  const [inView, setInView] = useState(false);
  const [lastScrollTime, setLastScrollTime] = useState(0); // Track last scroll time

  const options = ["Overview", "Programs", "Members", "Contact", "Address"];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0.7 }
    );

    if (middleRef.current) {
      observer.observe(middleRef.current);
    }

    return () => {
      if (middleRef.current) {
        observer.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (inView && activeOption !== "Address" && activeOption !== "Overview") {
      document.body.style.overflow = "hidden";  // Prevent scrolling
    } else {
      document.body.style.overflow = "auto";
    }
  }, [inView, activeOption]);

  const handleScroll = (event) => {
    if (!inView) return;

    const now = Date.now();
    const SCROLL_DELAY = 500;

    if (now - lastScrollTime < SCROLL_DELAY) return;
    setLastScrollTime(now);

    const currentIndex = options.indexOf(activeOption);

    if (event.deltaY > 0 && currentIndex < options.length - 1) {
      setActiveOption(options[currentIndex + 1]);
    } else if (event.deltaY < 0 && currentIndex > 0) {
      setActiveOption(options[currentIndex - 1]);
    }
  };

  useEffect(() => {
    window.addEventListener("wheel", handleScroll);

    return () => {
      window.removeEventListener("wheel", handleScroll);
    };
  }, [inView, activeOption, lastScrollTime]);

  return (
    <div className="px-24 w-full "
      ref={middleRef}
    >
      <div

        className={`w-full lp:w-[80%] mx-auto bg-white border-2 shadow-md rounded-2xl mb-10 pb-5 overflow-x-visible parent-div`}

      >
        {/* Tabs */}
        <div className="grid grid-cols-5 w-full md:w-full rounded-t-2xl bg-[#D9D9D9]">
          {options.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveOption(tab)}
              className={`py-3 text-xs sm:text-sm md:text-base xl:text-lg font-semibold text-center transition-all duration-300 ${activeOption === tab
                ? "text-[#30AD8F] border-b-2 border-[#30AD8F] bg-white rounded-t-2xl"
                : "text-gray-500 bg-[#D9D9D9] rounded-t-2xl"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeOption === "Overview" && (
          <div className="mt-6 sm:mt-8 px-4 sm:px-8">
            <h2 className="text-sm md:text-lg lg:text-xl font-bold">About</h2>
            <p className="text-gray-700 mt-4 leading-7 text-xs md:text-sm lg:text-base">{college.description}</p>
            <p className="text-gray-700 mt-4 leading-7 text-xs md:text-sm lg:text-base">{college.content}</p>

            <h2 className=" font-bold text-sm md:text-lg lg:text-xl mt-6">Institution Type</h2>
            <p className="text-gray-700 mt-4">{college.institute_type}</p>
          </div>
        )}

        {activeOption === "Programs" && (
          <div className="mt-6 sm:mt-8 px-4 sm:px-8">
            <h2 className="text-sm md:text-lg lg:text-xl font-bold">
              OFFERED PROGRAMS - {college.university.fullname}
            </h2>
            {college.collegeCourses.map((course, index) => (
              <div key={index} className="mt-2">
                <h2 className="text-sm md:text-lg lg:text-xl mb-1">
                  {course.program.title}
                </h2>
                <button
                  type="button"
                  className="bg-[#2981B2] text-xs md:text-sm lg:text-base p-1 px-2 rounded-lg text-white"
                >
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        )}

        {activeOption === "Members" && (
          <div className="mt-6 sm:mt-8 px-4 sm:px-8">
            <h2 className="text-sm md:text-lg lg:text-xl font-bold">Members</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-4">
              {college.collegeMembers.map((member, index) => (
                <div className="flex flex-row mb-8" key={index}>
                  <div className="flex flex-col">
                    <div className="flex flex-row mb-2 gap-2 items-center">
                      <FaUser />
                      <p className="text-xs md:text-sm lg:text-base">{member.name}</p>
                    </div>
                    <div className="flex flex-row mb-2 gap-2 items-center">
                      <img
                        src="/images/Role icon.png"
                        alt="Role Icon"
                        className="w-4"
                      />
                      <p className="text-xs md:text-sm lg:text-base">{member.role}</p>
                    </div>
                    <div className="flex flex-row mb-2 gap-2 items-center">
                      <FaUser />
                      <p className="text-xs md:text-sm lg:text-base">{member.contact_number}</p>
                    </div>
                    <div className="flex flex-row mb-2 gap-2 items-center">
                      <IoMdMail />
                      <p className="text-xs md:text-sm lg:text-base">{member.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeOption === "Contact" && (
          <div className="flex flex-col mt-6 sm:mt-8 px-4 sm:px-8">
            <h2 className="text-sm md:text-lg lg:text-xl font-bold">Contact Info</h2>
            {college.collegeContacts.map((contact, index) => (
              <p key={index} className="mt-2 text-xs md:text-sm lg:text-base">{contact.contact_number}</p>
            ))}
            <h2 className="text-sm md:text-lg lg:text-xl font-bold mt-4">Website</h2>
            <a
              href={college.website_url}
              className="underline text-blue-600"
              target="_blank"
              rel="noopener noreferrer"
            >
              {college.website_url || "N/A"}
            </a>
          </div>
        )}

        {activeOption === "Address" && (
          <div className="flex flex-col mt-6 sm:mt-8 px-4 sm:px-8">
            <h2 className="text-sm md:text-lg lg:text-xl font-bold">Address</h2>
            <p className="text-xs md:text-sm lg:text-base">{college.collegeAddress.country}</p>
            <p className="text-xs md:text-sm lg:text-base">{college.collegeAddress.state}</p>
            <p className="text-xs md:text-sm lg:text-base">{college.collegeAddress.city}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollegeOverview;
