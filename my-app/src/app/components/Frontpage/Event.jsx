import Image from "next/image";
import React from "react";

const Event = () => {
  return (
    <div className="h-[50vh] md:h-screen flex  items-center max-w-[1200px] mx-auto justify-between">
      <div className="flex flex-col items-center mx-auto gap-4">
        <div className="font-extrabold text-4xl md:text-7xl">Our Events</div>
        <Image
          src={"/images/events.png"}
          width={400}
          height={400}
          alt="Mero UNI logo"
        />
        <div className="font-bold text-lg md:text-2xl">
          Hult Prize - Kathmandu University
        </div>
        <div className="w-[300px] md:w-[400px]">
          {" "}
          Lorem ipsum dolor sit amet consectetur adipisicing elit...
        </div>
      </div>
      <div className="hidden tb:block">
      <div className="flex flex-col gap-8 my-4 ">
        <div className="flex gap-4 items-center">
          <Image
            src={"/images/events.png"}
            width={200}
            height={200}
            alt="Mero UNI logo"
            className="object-contain"
          />
          <div>
            <div className="font-bold text-2xl">Hult Prizes</div>
            <div className="w-[250px] text-left">
              Lorem ipsum dolor sit amet consectetur adipisicing elit Lorem
              ipsum dolor sit sit amet consectetur adipisicing elit
            </div>
            <div>2025/01/15</div>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <Image
            src={"/images/events.png"}
            width={200}
            height={150}
            alt="Mero UNI logo"
            className="object-contain"
          />
          <div>
            <div className="font-bold text-2xl">Hult Prizeme</div>
            <div className="w-[250px] text-left">
              Lorem ipsum dolor sit amet consectetur adipisicing elit Lorem
              ipsum dolor sit sit amet consectetur adipisicing elit
            </div>
            <div>2025/01/15</div>
          </div>
        </div>
      </div>
      </div>
     
    </div>
  );
};

export default Event;
