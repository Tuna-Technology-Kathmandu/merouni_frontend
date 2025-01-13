import Image from "next/image";
import React from "react";

const Sponsore = () => {
  return (
    <div className="max-w-[800px] mx-auto my-12">
      <Image
        src={"/images/ad.png"}
        width={800}
        height={500}
        alt="Mero UNI logo"
      />
    </div>
  );
};

export default Sponsore;
