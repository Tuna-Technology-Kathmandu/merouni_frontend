// "use client";
// import Image from "next/image";
// import React from "react";

// const Hero = () => {
//   return (
//     <>
//       <div
//         className="h-[calc(100vh-118px)] bg-gradient-to-r flex items-center "
//         style={{
//           background:
//             "linear-gradient(107.56deg, #002F3B 0.57%, #157CB8 72.24%)",
//         }}
//       >
//         <div className="flex items-center max-w-[1600px] mx-auto gap-2 md:gap-64">
//           <div className="flex flex-col">
//             <div className="font-poppins  text-4xl md:text-5xl font-bold  text-left text-white w-60 md:w-80 mb-4 mx-6">
//               Discover the Best Colleges and Shape Your Future.
//             </div>
//             <div className=" flex mx-6">
//               <button className="text-[#88d5ff]">Bachelors Portal</button>
//               <div className="font-bold text-[#88d5ff] mx-2">|</div>
//               <button className="text-[#88d5ff]">BIT in Nepal</button>
//             </div>
//           </div>
//           <div className="flex justify-center">
//             <Image
//               src={"/images/hero.png"}
//               width={400} // Adjusted size for better display
//               height={400} // Adjusted size for better display
//               alt="Mero UNI logo"
//               className="hidden md:block"
//             />
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Hero;


// "use client";
// import React from "react";
// import ImageCarousel from "./ImageCarousel"; // Importing the modified carousel

// const Hero = () => {
//   return (
//     <div
//       className="h-[calc(100vh-118px)] bg-gradient-to-r flex items-center justify-center"
//       style={{
//         background: "linear-gradient(107.56deg, #002F3B 0.57%, #157CB8 72.24%)",
//       }}
//     >
//       <div className="w-full max-w-[1200px] h-[400px] md:h-[500px] lg:h-[600px]">
//         <ImageCarousel /> 
//       </div>
//     </div>
//   );
// };

// export default Hero;












"use client";
import React from "react";
import ImageCarousel from "./ImageCarousel"; // Importing the modified carousel

const Hero = () => {
  return (
    <div className="w-full h-[calc(100vh-118px)]">
      {/* The carousel takes the full height of the Hero section */}
      <div className="w-full h-full">
        <ImageCarousel /> 
      </div>
    </div>
  );
};

export default Hero;
