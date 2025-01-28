
import React from "react";
import { FiMapPin } from "react-icons/fi";
import Image from "next/image";

const Hero = ({ event }) => {
  return (
    <div className="relative">
      <img
        src={"/images/eventsdesc.png"}
        alt={event.title}
        layout="fill"
        objectFit="cover"
        className="w-full h-[70vh]"
      />
      <div className="left-36 absolute top-1/2 transform -translate-y-1/2 text-white text-4xl font-extrabold w-[800px]">
        <div className="text-5xl">{event.title.split(':')[0]}</div>
        <div className="text-6xl my-2">{event.title.split(':')[1] || ''}</div>
        <div className="font-medium text-sm my-6">
          By - {event.host}
        </div>
        <div className="">
          <div className="font-medium text-sm my-6">
            {event.host}
          </div>
          <div className="flex gap-2 font-medium text-sm my-6">
            <FiMapPin />
            <div>Map</div>
          </div>
        </div>
      </div>
      {/* Social share icons remain the same */}
      <div className="space-y-4 text-[#b0b2c3] fixed left-8 top-[30%] md:-translate-y-1 bg-white p-2 rounded-xl flex items-center flex-col">
        {/* Social share icons */}
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