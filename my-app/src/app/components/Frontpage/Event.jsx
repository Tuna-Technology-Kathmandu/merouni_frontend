"use client";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { getEvents } from "@/app/action";
import Link from "next/link";

const Event = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const eventRef = useRef(null); // Reference for lazy loading

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await getEvents(1);
      setEvents(response.items.slice(0, 3));
    } catch (error) {
      setError("Failed to fetch events");
      console.error("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && events.length === 0) {
          fetchEvents(); // Fetch only when visible
          observer.disconnect(); // Stop observing after fetching
        }
      },
      { threshold: 0.1 }
    );

    if (eventRef.current) {
      observer.observe(eventRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  useEffect(() => {
  }, [events]);

  return (
    <div
      ref={eventRef}
      className="flex items-center max-w-[1800px] mx-auto justify-around"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="font-extrabold text-4xl md:text-7xl">Our Events</div>

        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}

        {events.length > 0 && !loading && (
          <>
            <Link href={`/events/${events[0].slugs}`}>
              <div className="w-[200px] h-[200px] md:w-[500px] md:h-[300px] relative">
                <Image
                  src={"/images/upcoming.png" || events[0]?.images}
                  layout="fill"
                  objectFit="contain"
                  alt={events[0].title || "Event Image"}
                  className="rounded-lg"
                />
              </div>
              <div className="font-bold text-lg md:text-2xl">
                {events[0]?.title || "Event Title"}
              </div>

              <div className="w-[300px] md:w-[400px]">
                {events[0]?.description || "Event description...."}
              </div>
            </Link>
          </>
        )}
      </div>

      <div className="hidden tb:block">
        <div className="flex flex-col gap-8 my-4 ">
          {events.slice(1).map((event, index) => (
            <Link href={`/events/${event.slugs}`} key={index}>
              <div className="flex gap-4 items-center" key={index}>
                <Image
                  src={"/images/upcoming.png" || event.images}
                  width={200}
                  height={200}
                  alt={event.title || "Event logo"}
                  className="object-contain"
                />
                <div>
                  <div className="font-bold text-2xl">{event.title}</div>
                  <div className="w-[250px] text-left">{event.description}</div>
                  <div className="mt-1 font-semibold">
                    {formatDate(event.eventMeta?.startDate) ||
                      "No date provided"}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
};

export default Event;
