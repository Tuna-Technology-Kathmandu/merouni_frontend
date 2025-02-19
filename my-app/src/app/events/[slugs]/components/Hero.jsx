import React from "react";
import { FiMapPin } from "react-icons/fi";
import Image from "next/image";

const Hero = ({ event }) => {
  return (
    <div className="relative ">
      {" "}
      {/* Prevents horizontal scroll */}
      <img
        src={"/images/eventsdesc.png"}
        alt={event?.title || "Event"}
        layout="fill"
        objectFit="cover"
        className="w-full h-[50vh] md:h-[70vh]"
      />
      <div className="absolute top-1/2 left-4 md:left-36 transform -translate-y-1/2 text-white text-3xl md:text-4xl font-extrabold max-w-full px-4">
        <div className="text-4xl md:text-5xl">{event.title.split(":")[0]}</div>
        <div className="text-5xl md:text-6xl my-2">
          {event.title.split(":")[1] || ""}
        </div>
        <div className="font-medium text-sm my-6">
          By - {event.event_host.host}
        </div>
        <div className="font-medium text-sm my-6">{event.host}</div>
        <div className="flex gap-2 font-medium text-sm my-6">
          <FiMapPin />
          {/* <div>Map</div> */}
          <a
            href={event?.event_host?.map_url || "N/A"}
            target="_blank"
            rel="noopener noreferrer"
            className=" hover:underline"
          >
            Map
          </a>
        </div>
      </div>
      {/* Social share icons */}
      <div className="fixed md:left-8 right-2 md:right-auto top-[30%] md:-translate-y-1 bg-white p-2 rounded-xl flex items-center flex-col space-y-4 text-[#b0b2c3] z-10">
        <div className="text-black font-bold text-sm">Share</div>
        <img src="/images/fb.png" alt="Facebook" className="w-6" />
        <img src="/images/insta.png" alt="Instagram" className="w-6" />
        <img src="/images/linkedin.png" alt="LinkedIn" className="w-6" />
        <img src="/images/twitter.png" alt="Twitter" className="w-6" />
      </div>
    </div>
  );
};

export default Hero;
