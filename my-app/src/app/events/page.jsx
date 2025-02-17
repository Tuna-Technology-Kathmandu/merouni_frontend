"use client";
import React, { useState, useEffect, useCallback } from "react";
import { PiLineVerticalThin } from "react-icons/pi";
import { IoIosArrowDroprightCircle } from "react-icons/io";
import { IoArrowUp } from "react-icons/io5";
import Image from "next/image";
import EventCard from "../components/Frontpage/EventCard";
import { IoIosSearch } from "react-icons/io";
import {
  getEvents,
  getThisWeekEvents,
  getNextWeekEvents,
  searchEvent,
} from "./action";
import Navbar from "../components/Frontpage/Navbar";
import Footer from "../components/Frontpage/Footer";
import Header from "../components/Frontpage/Header";
import Link from "next/link";
import Loading from "../components/Loading";
import Pagination from "../blogs/components/Pagination";
import { debounce } from "lodash";

const Events = () => {
  const [allEvents, setAllEvents] = useState([]);
  const [thisWeekEvents, setThisWeekEvents] = useState([]);
  const [nextWeekEvents, setNextWeekEvents] = useState([]);
  const [featuredEvent, setFeaturedEvent] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 1,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!searchQuery) {
      loadEvents(pagination.currentPage);
    }
  }, [pagination.currentPage, searchQuery]);

  const loadEvents = async (page = 1) => {
    try {
      const response = await getEvents(page);
      const events = response.items;
      setAllEvents(events);
      setPagination({
        currentPage: response.pagination.currentPage,
        totalPages: response.pagination.totalPages,
        totalCount: response.pagination.totalCount,
      });

      // Filter events for different sections
      const thisWeek = await getThisWeekEvents();
      const nextWeek = await getNextWeekEvents();
      const featured = thisWeek.events[0]; // First event as featured

      // Parse the event_host data for the featured event
      const eventHost = featured?.event_host
        ? JSON.parse(featured.event_host)
        : null;
      featured.eventHost = eventHost; // Attach the parsed eventHost to the featuredEvent

      setFeaturedEvent(featured);
      setThisWeekEvents(thisWeek.events);
      setNextWeekEvents(nextWeek.events);
    } catch (error) {
      setError("Failed to load Events");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    console.log("Pages response from pagination controle:", page);
    if (page > 0 && page <= pagination.totalPages) {
      setPagination((prev) => ({
        ...prev,
        currentPage: page,
      }));
    }
  };

  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (query) {
        setIsSearching(true);
        const results = await searchEvent(query);
        console.log("Search Results in event:", results);
        setAllEvents(results.items);
        setPagination(results.pagination);
        setIsSearching(false);
      }
    }, 1000), // 1000ms delay
    []
  );

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <Header />
      <Navbar />

      {loading ? (
        <Loading />
      ) : (
        <div className="mx-auto">
          {featuredEvent && featuredEvent.event_host && (
            <div className="flex flex-col md:flex-row items-center justify-between p-6 md:p-10 max-w-[1600px] mx-auto mb-10">
              {/* Left Column - Featured Event */}
              <div className="md:w-1/2">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  {featuredEvent.title}
                </h2>
                <p className="mb-6">{featuredEvent.description}</p>

                {/* Event Details */}
                <div className="bg-gradient-to-l from-[#30AD8F] to-[#0A6FA7] text-white rounded-lg flex flex-row mb-8 items-center justify-between w-[600px] h-[120px] p-8">
                  <div className="flex flex-col items-center">
                    <p className="text-sm font-bold">Starts</p>
                    <p className="whitespace-nowrap">
                      {new Date(
                        JSON.parse(featuredEvent.event_host).start_date
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <PiLineVerticalThin style={{ color: "white" }} size={50} />
                  </div>
                  <div className="flex flex-col items-center">
                    <p className="text-sm font-bold">Ends</p>
                    <p className="whitespace-nowrap">
                      {new Date(
                        JSON.parse(featuredEvent.event_host).end_date
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <PiLineVerticalThin style={{ color: "white" }} size={50} />
                  </div>
                  <div className="flex flex-col items-center">
                    <p className="text-sm font-bold whitespace-nowrap">Time</p>
                    <p className="whitespace-nowrap">
                      {JSON.parse(featuredEvent.event_host).time}
                    </p>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-4">
                  <button className="border-2 border-black text-black px-6 py-2 rounded-lg hover:bg-gray-800 hover:text-white transition-all flex flex-row items-center justify-between mt-5">
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
                  alt={featuredEvent.title}
                  className="rounded-lg shadow-md"
                  width={400}
                  height={450}
                />
              </div>
            </div>
          )}
          {/* Sponsors Section */}
          <div className="bg-[#E8E8E8] py-20 flex flex-row items-center justify-center w-full">
            <h2 className="text-3xl font-bold">*Sponsors* (Sliding) </h2>
          </div>

          {/* This Week's Events */}
          <div className="flex max-w-[2000px] mx-auto items-center justify-center py-20">
            <div className="flex justify-center items-center space-y-2 w-1/2 ml-28">
              <div className="min-w-[200px] flex flex-col pr-8">
                <span className="text-3xl font-bold text-[#0A6FA7] block">
                  Events this Week
                </span>
              </div>
            </div>

            <div className="md:w-3/4">
              <div className="overflow-x-auto no-scrollbar">
                <div className="flex gap-6 pb-4 ml-20">
                  {thisWeekEvents.map((event, index) => (
                    <Link href={`/events/${event.slugs}`} key={index}>
                      <div
                        key={index}
                        className="transition-all duration-300 ease-in-out"
                        style={{ minWidth: "max-content" }}
                      >
                        <EventCard {...event} />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Next Week's Events */}
          <div className="flex max-w-[2000px] bg-[#30AD8F] bg-opacity-5 mx-auto items-center justify-center py-20">
            <div className="flex justify-center items-center space-y-2 w-1/2 ml-28">
              <div className="min-w-[200px] flex flex-col pr-8">
                <span className="text-3xl font-bold text-[#0A6FA7] block">
                  Upcoming Events
                </span>
              </div>
            </div>

            <div className="md:w-3/4">
              <div className="overflow-x-auto no-scrollbar">
                <div className="flex gap-6 pb-4 ml-20">
                  {nextWeekEvents.map((event, index) => (
                    <Link href={`/events/${event.slugs}`} key={index}>
                      <div
                        key={index}
                        className="transition-all duration-300 ease-in-out"
                        style={{ minWidth: "max-content" }}
                      >
                        <EventCard {...event} />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* All Events Section */}
          <div className="flex flex-row container mx-auto py-20 mb-20">
            {/* Left Section */}
            <div className="flex flex-col w-1/4 space-y-8 pr-8">
              <div>
                <span className="text-3xl font-bold text-[#0A6FA7] block">
                  All Events
                </span>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search Events..."
                  className="px-4 py-2 border-b border-black focus:outline-none"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                {isSearching && (
                  <div className="absolute right-3 top-2.5">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-500"></div>
                  </div>
                )}
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 -translate-x-28 text-gray-400">
                  <IoIosSearch />
                </span>
              </div>

              {/* Archive Section */}
              <div>
                <h2 className="text-xl font-bold mb-2 mt-8">Archive</h2>
                <div className="w-60 border-b border-black"></div>

                <ul className="list-disc space-y-4 ml-4 mt-2">
                  {[
                    "January 2025",
                    "December 2024",
                    "November 2024",
                    "October 2024",
                  ].map((month, index) => (
                    <li key={index} className="hover:underline cursor-pointer">
                      {month}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Section - All Events Grid */}
            <div className="flex flex-col w-3/4 items-center justify-center">
              <div className="grid grid-cols-3 gap-3">
                {allEvents.map((event, index) => (
                  <Link href={`/events/${event.slugs}`} key={index}>
                    <div
                      key={index}
                      className="transition-all duration-300 ease-in-out"
                      style={{ minWidth: "max-content" }}
                    >
                      <EventCard {...event} />
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-10">
                <Pagination
                  pagination={pagination}
                  onPageChange={handlePageChange}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Events;
