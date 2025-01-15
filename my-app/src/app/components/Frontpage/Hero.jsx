import Image from "next/image";
import React from "react";

const Hero = () => {
  return (
    <div
      className="h-[calc(100vh-118px)] bg-gradient-to-r flex items-center "
      style={{
        background: "linear-gradient(107.56deg, #002F3B 0.57%, #157CB8 72.24%)",
      }}
    >
      <div className="flex items-center max-w-[1600px] mx-auto gap-64">
      <div className="flex flex-col">
        <div className="font-poppins text-2xl md:text-5xl font-bold leading-3 md:leading-[80px] text-left text-white w-80 mb-4">
          Discover the Best Colleges and Shape Your Future.
        </div>
        <div className=" flex">
          <button className="text-[#88d5ff]">Bachelors Portal</button>
          <div className="font-bold text-[#88d5ff] mx-2">|</div>
          <button className="text-[#88d5ff]">BIT in Nepal</button>
        </div>
      </div>
      <div className="flex justify-center">
        <Image
          src={"/images/hero.png"}
          width={400} // Adjusted size for better display
          height={400} // Adjusted size for better display
          alt="Mero UNI logo"
        />
      </div>
      </div>
    
    </div>
  );
};

export default Hero;
