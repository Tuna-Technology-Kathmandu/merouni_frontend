
"use client";

import React, { useState, useEffect } from "react";
import { PiLineVerticalThin } from "react-icons/pi";
import { IoIosArrowDroprightCircle } from "react-icons/io";
import { IoArrowUp } from "react-icons/io5";
import Image from "next/image";
import EventCard from "../components/Frontpage/EventCard";
import { IoIosSearch } from "react-icons/io";
import { getEvents } from "../action";
import Navbar from "../components/Frontpage/Navbar";
import Footer from "../components/Frontpage/Footer";
import Header from "../components/Frontpage/Header";

const Events = () => {
  const events = [
    {
      day: "17",
      month: "Sep",
      title: "Competition Program",
      description:
        "The Hult Prize at IMS is a student-driven competition in its third year, where students pitch sustainable business ideas.",
      photo: "/images/hult_prize.png",
    },
    {
      day: "17",
      month: "Sep",
      title: "Workshop",
      description:
        "The Hult Prize at IMS is a student-driven competition in its third year, where students pitch sustainable business ideas.",
      photo: "/images/events_photo.png",
    },
    {
      day: "17",
      month: "Sep",
      title: "Competition Program",
      description:
        "The Hult Prize at IMS is a student-driven competition in its third year, where students pitch sustainable business ideas.",
      photo: "/images/hult_prize.png",
    },
    {
      day: "17",
      month: "Sep",
      title: "Workshop",
      description:
        "The Hult Prize at IMS is a student-driven competition in its third year, where students pitch sustainable business ideas.",
      photo: "/images/events_photo.png",
    },
    {
      day: "17",
      month: "Sep",
      title: "Competition Program",
      description:
        "The Hult Prize at IMS is a student-driven competition in its third year, where students pitch sustainable business ideas.",
      photo: "/images/hult_prize.png",
    },
    {
      day: "17",
      month: "Sep",
      title: "Workshop",
      description:
        "The Hult Prize at IMS is a student-driven competition in its third year, where students pitch sustainable business ideas.",
      photo: "/images/events_photo.png",
    },
  ];

  const allEvents = [
    {
      day: "17",
      month: "Sep",
      title: "Competition Program",
      description:
        "The Hult Prize at IMS is a student-driven competition in its third year, where students pitch sustainable business ideas.",
      photo: "/images/hult_prize.png",
    },
    {
      day: "17",
      month: "Sep",
      title: "Workshop",
      description:
        "The Hult Prize at IMS is a student-driven competition in its third year, where students pitch sustainable business ideas.",
      photo: "/images/events_photo.png",
    },
    {
      day: "17",
      month: "Sep",
      title: "Competition Program",
      description:
        "The Hult Prize at IMS is a student-driven competition in its third year, where students pitch sustainable business ideas.",
      photo: "/images/hult_prize.png",
    },
    {
      day: "17",
      month: "Sep",
      title: "Workshop",
      description:
        "The Hult Prize at IMS is a student-driven competition in its third year, where students pitch sustainable business ideas.",
      photo: "/images/events_photo.png",
    },
    {
      day: "17",
      month: "Sep",
      title: "Competition Program",
      description:
        "The Hult Prize at IMS is a student-driven competition in its third year, where students pitch sustainable business ideas.",
      photo: "/images/hult_prize.png",
    },
    {
      day: "17",
      month: "Sep",
      title: "Workshop",
      description:
        "The Hult Prize at IMS is a student-driven competition in its third year, where students pitch sustainable business ideas.",
      photo: "/images/events_photo.png",
    },
    {
      day: "17",
      month: "Sep",
      title: "Competition Program",
      description:
        "The Hult Prize at IMS is a student-driven competition in its third year, where students pitch sustainable business ideas.",
      photo: "/images/hult_prize.png",
    },
    {
      day: "17",
      month: "Sep",
      title: "Workshop",
      description:
        "The Hult Prize at IMS is a student-driven competition in its third year, where students pitch sustainable business ideas.",
      photo: "/images/events_photo.png",
    },
    {
      day: "17",
      month: "Sep",
      title: "Competition Program",
      description:
        "The Hult Prize at IMS is a student-driven competition in its third year, where students pitch sustainable business ideas.",
      photo: "/images/hult_prize.png",
    },
    {
      day: "17",
      month: "Sep",
      title: "Workshop",
      description:
        "The Hult Prize at IMS is a student-driven competition in its third year, where students pitch sustainable business ideas.",
      photo: "/images/events_photo.png",
    },
    {
      day: "17",
      month: "Sep",
      title: "Competition Program",
      description:
        "The Hult Prize at IMS is a student-driven competition in its third year, where students pitch sustainable business ideas.",
      photo: "/images/hult_prize.png",
    },
    {
      day: "17",
      month: "Sep",
      title: "Workshop",
      description:
        "The Hult Prize at IMS is a student-driven competition in its third year, where students pitch sustainable business ideas.",
      photo: "/images/events_photo.png",
    },
  ];

  const [eevents, setEevents] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    console.log("Events updated:", eevents);
  }, [eevents]);

  const loadEvents = async () => {
    try {
      const response = await getEvents();
      console.log(response);
      setEevents(response.items);
    } catch (error) {
      setError("Failed to load Events");
    } finally {
      setLoading(false);
      console.log(eevents);
    }
  };

  return (
    <>
    <Header/>
    <Navbar/>
      <div className=" mx-auto ">
        <div className="flex flex-col md:flex-row items-center justify-between  p-6 md:p-10 max-w-[1600px] mx-auto mb-10">
          {/* Left Column */}
          <div className="md:w-1/2">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Residential Agricultural Training - <br /> Nepal Agricultural
              Research <br />
              Coucnil (NARC)
            </h2>
            <p className="mb-6">
              The National Agricultural Engineering Research Center has
              announced <br />a 7-day "National Level Residential Agricultural
              Mechanization <br /> Training" for young farmers ...
            </p>

            {/* Event Details */}
            <div className="  bg-gradient-to-l from-[#30AD8F]  to-[#0A6FA7] bg-[length:100%_100%] bg-[right_bottom] text-white rounded-lg flex flex-row  mb-8  items-center justify-between w-[600px] h-[120px] p-8">
              <div className=" flex flex-col items-center">
                <p className="text-sm font-bold">Starts</p>
                <p className="whitespace-nowrap">January 03, 2025</p>
              </div>
              <div className="flex items-center">
                <PiLineVerticalThin style={{ color: "white" }} size={50} />
              </div>
              <div className=" flex flex-col items-center">
                <p className="text-sm font-bold">Ends</p>
                <p className="whitespace-nowrap">January 18, 2025</p>
              </div>
              <div className="flex items-center">
                <PiLineVerticalThin style={{ color: "white" }} size={50} />
              </div>
              <div className="  flex flex-col items-center">
                <p className="text-sm font-bold whitespace-nowrap">Time</p>
                <p className="whitespace-nowrap ">10:00 Am - 5:00 Pm</p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 ">
              <button className="border-2 border-black text-black px-6 py-2 rounded-lg hover:bg-gray-800 flex flex-row items-center justify-between mt-5">
                <span className="pr-4 font-semibold">View More</span>
                <IoIosArrowDroprightCircle size={25} />
              </button>
              <a
                href="#"
                className="text-[#3D3D3D] hover:text-blue-700 underline flex items-center mt-5"
              >
                <span>Apply Here</span>
                <IoArrowUp className="rotate-45" />
              </a>
            </div>
          </div>

          {/* Right Column (Image) */}
          <div className="md:w-1/2 flex justify-center mt-6 md:mt-0">
            <Image
              src="/images/events.png"
              alt="Upcoming Events"
              className="rounded-lg shadow-md"
              width={400}
              height={450}
            />
          </div>
        </div>

        <div className=" bg-[#E8E8E8] py-20 flex flex-row items-center justify-center w-full">
          <h2 className="text-3xl font-bold">*Sponsors* (Sliding) </h2>
        </div>

        <div className=" flex max-w-[2000px] mx-auto items-center justify-center py-20">
          <div className="flex  justify-center items-center space-y-2 w-1/2 ml-28">
            <div className="min-w-[200px] flex flex-col pr-8">
              <span className="text-3xl font-bold text-[#0A6FA7] block">
                Events this
              </span>
              <span className="text-3xl font-bold text-[#0A6FA7] block">
                Week
              </span>
            </div>
          </div>

          <div className="md:w-3/4  ">
            <div className="">
              <div className="md:w-full ">
                <div
                  className="overflow-x-auto no-scrollbar"
                  style={{ scrollBehavior: "smooth" }}
                >
                  <div className="flex gap-6 pb-4 ml-20">
                    {events.map((event, index) => (
                      <div
                        key={index}
                        className="transition-all duration-300 ease-in-out "
                        style={{ minWidth: "max-content" }}
                      >
                        <EventCard {...event} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="bg-[#30AD8F] flex ">
                      <div className="w-1/2 flex mx-">
                        <p>Lorem ipsum dolor sit amet.</p>
                      </div>
                      <div className="w-1/2">
                        <p>Lorem ipsum dolor sit amet.</p>
                      </div>

                    </div> */}

        {/* <div className=" flex flex-row   bg-[#30AD8F] bg-opacity-5 items-center justify-center py-20">
          <div className="flex  justify-center items-center space-y-2 w-1/2">
            <div className="min-w-[200px] flex flex-col pr-8">
              <span className="text-2xl font-bold text-[#0A6FA7]">
                Upcoming 
              </span>
              <span className="text-2xl font-bold text-[#0A6FA7]">Events</span>
            </div>
          </div>

          <div className="md:w-3/4 ">
            <div className="">
              <div className="md:w-full ">
                <div
                  className="overflow-x-auto no-scrollbar"
                  style={{ scrollBehavior: "smooth" }}
                >
                  <div className="flex gap-6 pb-4">
                    {events.map((event, index) => (
                      <div
                        key={index}
                        className="transition-all duration-300 ease-in-out"
                        style={{ minWidth: "max-content" }}
                      >
                        <EventCard {...event} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div> 
          
        </div> */}

        <div className=" flex max-w-[2000px] bg-[#30AD8F] bg-opacity-5 mx-auto items-center justify-center py-20">
          <div className="flex  justify-center items-center space-y-2 w-1/2 ml-28">
            <div className="min-w-[200px] flex flex-col pr-8">
              <span className="text-3xl font-bold text-[#0A6FA7] block">
                Upcoming
              </span>
              <span className="text-3xl font-bold text-[#0A6FA7] block">
                Events
              </span>
            </div>
          </div>

          <div className="md:w-3/4  ">
            <div className="">
              <div className="md:w-full ">
                <div
                  className="overflow-x-auto no-scrollbar"
                  style={{ scrollBehavior: "smooth" }}
                >
                  <div className="flex gap-6 pb-4 ml-20">
                    {events.map((event, index) => (
                      <div
                        key={index}
                        className="transition-all duration-300 ease-in-out "
                        style={{ minWidth: "max-content" }}
                      >
                        <EventCard {...event} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-row container mx-auto   py-20 mb-20 ">
          {/* Left Section */}
          <div className="flex flex-col w-1/4  space-y-8 pr-8">
            {/* Heading */}
            <div>
              <span className="text-3xl font-bold text-[#0A6FA7] block">
                All
              </span>
              <span className="text-3xl font-bold text-[#0A6FA7] block">
                Events
              </span>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search Events..."
                className=" px-4 py-2 border-b border-black  focus:outline-none"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 -translate-x-28 text-gray-400">
                <IoIosSearch />
              </span>
            </div>

            {/* Archive Section */}
            <div className="">
              <h2 className="text-xl  font-bold mb-2 mt-8">Archive</h2>
              <div className="w-60 border-b border-black "></div>

              <ul className="list-disc space-y-4 ml-4 mt-2">
                {[
                  "January 2025",
                  "December 2024",
                  "November 2024",
                  "October 2024",
                ].map((month, index) => (
                  <li key={index} className="hover:underline cursor-pointer ">
                    {month}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Section */}
          <div className="w-3/4 ">
            {/* Grid of Event Cards */}
            <div className="grid grid-cols-3 gap-3 ">
              {allEvents.map((event, index) => (
                <div
                  key={index}
                  className="transition-all duration-300 ease-in-out"
                  style={{ minWidth: "max-content" }}
                >
                  <EventCard {...event} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {/* <div className="flex justify-between items-center mt-6">
              <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg">
                ⬅
              </button>
              <span className="text-gray-600">1 / 5</span>
              <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg">
                ➡
              </button>
            </div> */}
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default Events;
