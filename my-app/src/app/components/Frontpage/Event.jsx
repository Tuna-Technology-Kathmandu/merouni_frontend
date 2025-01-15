import Image from "next/image";
import React from "react";

const Event = () => {
  return (
    <div className="h-screen flex items-center max-w-[1200px] mx-auto justify-between">
      <div className="flex flex-col items-left gap-4">
        <div className="font-extrabold text-7xl">Our Events</div>
        <Image
          src={"/images/events.png"}
          width={500}
          height={500}
          alt="Mero UNI logo"
        />
        <div className="font-bold text-2xl">
          Hult Prize - Kathmandu University
        </div>
        <div> Lorem ipsum dolor sit amet consectetur adipisicing elit...</div>
      </div>
      <div className="flex flex-col gap-8">
  <div className="flex gap-4 items-center">
    <Image
      src={"/images/events.png"}
      width={200}
      height={200}
      alt="Mero UNI logo"
      className="object-contain"
    />
    <div>
      <div className="font-bold text-2xl">Hult Prize</div>
      <div className="w-[250px] text-left">
        Lorem ipsum dolor sit amet consectetur adipisicing elit Lorem ipsum
        dolor sit  sit amet consectetur
        adipisicing elit
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
      Lorem ipsum dolor sit amet consectetur adipisicing elit Lorem ipsum
        dolor sit  sit amet consectetur
        adipisicing elit
      </div>
      <div>2025/01/15</div>
    </div>
  </div>
</div>

    </div>
  );
};

export default Event;
