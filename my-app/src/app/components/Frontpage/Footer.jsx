"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaFacebook } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa6";
import { TiSocialLinkedinCircular } from "react-icons/ti";
import { PiXLogoLight } from "react-icons/pi";
import { FaCopyright } from "react-icons/fa";
import { Section } from "lucide-react";
// import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { RiArrowDropDownLine } from "react-icons/ri";
import { RiArrowDropUpLine } from "react-icons/ri";

const Footer = () => {
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (index) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const Sections = {
    Exams: {
      header: "Top Exams",
      list: [
        "MAT 2025",
        "IOE Entrance Exam 2025",
        "NEB SEE 2025",
        "NEB +2 Board Exam 2025",
        "Lok Sewa Aayog Exams",
      ],
    },
    Colleges: {
      header: "Colleges",
      list: [
        "Colleges in Nepal",
        "College Reviews in Nepal",
        "Top Colleges in Nepal",
        "Top Colleges in Kathmandu",
        "Top MBA Colleges in Nepal",
      ],
    },
    Resources: {
      header: "Resources",
      list: [
        "B.Tech Companion Nepal",
        "MBBS Companion Nepal",
        "NEB (National Examination Board) Resources",
        "Nepal Board Exam Calendar",
        "MBA Salary in Nepal",
      ],
    },
  };

  return (
    <>
    <div className="hidden md:block">

      <header className=" bg-black text-white">
        <div className="container mx-auto px-4">
          <div>
            <nav className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <Image
                  src={"/images/logo.png"}
                  width={256}
                  height={86}
                  alt="Mero UNI logo"
                />
              </div>

              <div className="hidden md:flex items-center space-x-8">
                <Link
                  className="hover:text-[#30ad8f] transition-colors"
                  href={"/"}
                >
                  Home
                </Link>
                <Link
                  className="hover:text-[#30ad8f] transition-colors"
                  href={"/events"}
                >
                  Events
                </Link>
                <Link
                  className="hover:text-[#30ad8f] transition-colors"
                  href={"/blogs"}
                >
                  Blogs
                </Link>
                <Link
                  className="hover:text-[#30ad8f] transition-colors"
                  href={"/contact"}
                >
                  Contact
                </Link>
                <Link
                  className="hover:text-[#30ad8f] transition-colors"
                  href={"/about"}
                >
                  About Us
                </Link>
              </div>

              <div className="hidden md:flex items-center space-x-4">
                <a href="#">
                  <FaFacebook size={28} />
                </a>
                <a href="#">
                  <FaInstagram size={28} />
                </a>
                <a href="#">
                  <TiSocialLinkedinCircular size={30} />
                </a>
                <a href="#">
                  <PiXLogoLight size={28} />
                </a>
              </div>
            </nav>
            <div className=" h-[1px] bg-white"></div>
          </div>
        </div>
      </header>

      <footer class=" bg-black text-white py-10">
        <div class="container mx-auto px-4">
          {/* <!-- Footer Content Section --> */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            {/* <!-- Top Exams --> */}

            {Object.entries(Sections).map(([key, section], index) => (
              <div key={index}>
                <h3 className="text-xl font-semibold mb-10">
                  {section.header}
                </h3>
                <ul className="space-y-3">
                  {section.list.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      <Link
                        href={"#"}
                        className="hover:text-[#30ad8f] transition-colors"
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-white flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 mb-10">
            <div className="space-x-8">
              <Link
                href={"#"}
                className="hover:text-[#30ad8f] transition-colors font-semibold"
              >
                Disclaimer
              </Link>
              <Link
                href={"#"}
                className="hover:text-[#30ad8f] transition-colors font-semibold"
              >
                Privacy Policy
              </Link>
            </div>
            <div className="flex flex-row items-center justify-center">
              <span className="font-semibold">
                {" "}
                &copy; All rights reserved 2025
              </span>
            </div>
          </div>
        </div>
      </footer>
      </div>

      <>
        <div className="md:hidden flex flex-col justify-center items-center bg-black">
          <header className=" text-white">
            <div className="mx-auto px-4">
              <nav className="py-4">
                <Image
                  src={"/images/logo.png"}
                  width={250}
                  height={250}
                  alt="Mero UNI logo"
                  className="ml-10"
                />
                <div className="flex space-x-8">
                  <Link
                    className="hover:text-[#30ad8f] transition-colors"
                    href={"/"}
                  >
                    Home
                  </Link>
                  <Link
                    className="hover:text-[#30ad8f] transition-colors"
                    href={"/events"}
                  >
                    Events
                  </Link>
                  <Link
                    className="hover:text-[#30ad8f] transition-colors"
                    href={"/blogs"}
                  >
                    Blogs
                  </Link>
                  <Link
                    className="hover:text-[#30ad8f] transition-colors"
                    href={"/contact"}
                  >
                    Contact
                  </Link>
                  <Link
                    className="hover:text-[#30ad8f] transition-colors"
                    href={"/about"}
                  >
                    About Us
                  </Link>
                </div>
              </nav>
            </div>
          </header>

          <footer className="text-white w-full">
            <div className="md:hidden space-y-4 w-full px-4">
              {Object.entries(Sections).map(([key, section], index) => (
                <div className="border-b border-white w-full" key={index}>
                  <details
                    className="pb-4 w-full"
                    open={openSections[index]}
                    onToggle={() => toggleSection(index)}
                  >
                    <summary className="w-full list-none flex justify-between items-center hover:cursor-pointer font-semibold">
                      {section.header}
                      <span>
                        <button type="button" className="p-2">
                          {openSections[index] ? (
                            <RiArrowDropUpLine size={32} />
                          ) : (
                            <RiArrowDropDownLine size={32} />
                          )}
                          {/* <RiArrowDropDownLine size={24} /> */}
                        </button>
                      </span>
                    </summary>
                    <ul>
                      {section.list.map((item, itemIndex) => (
                        <li key={itemIndex} className="mb-2">
                          <Link
                            href={"#"}
                            className="hover:text-[#30ad8f] transition-colors"
                          >
                            {item}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                </div>
              ))}

              <div className="flex flex-col items-center">
                <span className="font-semibold mt-24">
                  {" "}
                  &copy; Merouni All rights reserved 2025
                </span>

                <div className="space-x-8 mt-8">
                  <Link
                    href={"#"}
                    className="hover:text-[#30ad8f] transition-colors font-semibold"
                  >
                    Disclaimer
                  </Link>
                  <Link
                    href={"#"}
                    className="hover:text-[#30ad8f] transition-colors font-semibold"
                  >
                    Privacy Policy
                  </Link>
                </div>

                <div className="flex items-center space-x-24 mt-16 mb-8">
                <a href="#">
                  <FaFacebook size={28} />
                </a>
                <a href="#">
                  <FaInstagram size={28} />
                </a>
                <a href="#">
                  <TiSocialLinkedinCircular size={30} />
                </a>
                <a href="#">
                  <PiXLogoLight size={28} />
                </a>
              </div>

              </div>
            </div>
          </footer>
        </div>
      </>
    </>
  );
};

export default Footer;
