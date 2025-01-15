import Image from "next/image";
import React from "react";

const KU = () => {
  return (
    <div
      className="flex items-center h-screen bg-black text-white  z-10  sticky
      "
    >
      <div className="flex items-center max-w-[1600px] mx-auto gap-56">
        <div className="flex flex-col gap-12 items-center ">
          <p>Tribhuvan University</p>

          <div className="flex text-white gap-2 items-center">
            <div className="h-3 w-3 rounded-full bg-white"></div>
            <p className="font-bold text-lg">Kathmandu University</p>
          </div>
          <p>Pokhara University</p>
          <p>Purbanchal University</p>
          <p>University of Nepal</p>
        </div>
        <div className="flex flex-col gap-14 items-center">
          <h2 className="font-bold text-2xl">Kathmandu University</h2>
          <div className="flex flex-col gap-4 items-left">
            <h3>South Asian Institute of Management(SAIM)</h3>
            <h3>LA Grandee International College</h3>
            <h3>Citizen College</h3>
            <h3>Excel Business COllege</h3>
          </div>
          <button className="w-[130px] text-center border border-white rounded-xl  flex items-center justify-center p-2 font-bold mt-2">
            View all
            <div className="w-6 h-6 rounded-full bg-white text-black mx-2">
              &gt;
            </div>
          </button>
        </div>
        <Image
          src={"/images/ku.png"}
          width={100}
          height={100}
          alt="Mero UNI logo"
        />
      </div>
    </div>
  );
};

export default KU;
