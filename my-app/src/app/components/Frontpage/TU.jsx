import Image from "next/image";
import React from "react";

const UniversitySection = ({ name, colleges, logo, zIndex, index }) => {
  const allUniversities = [
    "Tribhuvan University",
    "Kathmandu University",
    "Pokhara University",
    "University of Nepal"
  ];

  return (
    <div 
      className="h-screen w-full flex items-start bg-black text-white sticky border-t-[1px] border-gray-100 pt-8"
      style={{ 
        zIndex,
        top: `${index * 200}px`
      }}
    >
      <div className="flex items-center max-w-[1600px] mx-auto gap-56">
        <div className="flex flex-col gap-12 items-left">
          {allUniversities.map((uni, idx) => (
            <div 
              key={idx} 
              className="flex text-white gap-2 items-center"
              style={{ opacity: uni === name ? 1 : 0.5 }}
            >
              {uni === name && <div className="h-3 w-3 rounded-full bg-white" />}
              <p className="font-bold text-lg">{uni}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-14 items-center">
          <h2 className="font-bold text-2xl">{name}</h2>
          <div className="flex flex-col gap-4 items-left">
            {colleges.map((college, index) => (
              <h3 key={index}>{college}</h3>
            ))}
          </div>
          <button className="w-[130px] text-center border border-white rounded-xl flex items-center justify-center p-2 font-bold mt-2">
            View all
            <div className="w-6 h-6 rounded-full bg-white text-black mx-2">&gt;</div>
          </button>
        </div>
        <Image src={logo} width={100} height={100} alt={`${name} logo`} />
      </div>
    </div>
  );
};

const Universities = () => {
  const universityData = [
    {
      name: "Tribhuvan University",
      colleges: [
        "South Asian Institute of Management(SAIM)",
        "LA Grandee International College",
        "Citizen College",
        "Excel Business College"
      ],
      logo: "/images/tu.png",
      zIndex: 0
    },
    {
      name: "Kathmandu University",
      colleges: [
        "School of Engineering",
        "School of Management",
        "School of Science",
        "School of Arts"
      ],
      logo: "/images/ku.png",
      zIndex: 10
    },
    {
      name: "Pokhara University",
      colleges: [
        "School of Business",
        "School of Health Sciences",
        "School of Engineering",
        "School of Computing"
      ],
      logo: "/images/pu.png",
      zIndex: 20
    }
  ];

  return (
    <div className="h-[300vh]">
      {universityData.map((uni, index) => (
        <UniversitySection
          key={index}
          name={uni.name}
          colleges={uni.colleges}
          logo={uni.logo}
          zIndex={uni.zIndex}
          index={index}
        />
      ))}
    </div>
  );
};

export default Universities;
