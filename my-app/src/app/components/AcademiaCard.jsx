import Image from "next/image";
import Link from "next/link";
import React from "react";

const AcademiaCard = ({ title, img }) => {
  return (
    <Link href={"/dashboard/agent"}>
      <div className="border-2 border-gray-300 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105">
        <div className="flex justify-center mb-4">
          <Image src={img || "/images/logo.png"} alt={title} height={200} width={200} className="object-contain" />
        </div>
        <div className="text-center font-semibold text-lg text-gray-800">{title}</div>
      </div>
    </Link>
  );
};

export default AcademiaCard;
