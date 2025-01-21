// import React from "react";

// const LatestBlogs = ({ image, date, title, description }) => {
//   return (
//     <div className="flex flex-col bg-[#e2ece9] border border-gray-300 rounded-lg shadow-md w-64 min-w-[20rem] ml-10 p-4  hover:shadow-lg transition-shadow duration-300 mb-8">
//       <div className="flex items-center mb-3">
//         <div className="font-semibold text-lg text-gray-800 truncate">
//           {title}
//           <p className="text-gray-600 mb-2">{date}</p>
//         </div>
//         <img
//           src={image}
//           alt="College"
//           className="w-12 h-12 rounded-full object-cover mr-4"
//         />
//       </div>
//       <div className="text-black text-sm mb-4 line-clamp-3 w-3/4">
//         {description}
//       </div>
//       <button className="mt-auto px-4 py-2 bg-[#387CAE] text-white rounded-lg  transition duration-200 w-1/2">
//         Learn More
//       </button>
//     </div>
//   );
// };

// export default LatestBlogs;

// import React from "react";

// const LatestBlogs = ({ image, date, title, description }) => {
//   return (
//     <div className="relative   w-80 min-w-[20rem] rounded-xl p-5 mb-8 hover:shadow-2xl transition-shadow duration-300 overflow-hidden m-3">
//       {/* Background Image */}
//       <div
//         className="absolute inset-0 bg-cover bg-center opacity-50"
//         style={{
//           backgroundImage: `url(${image})`,
//         }}
//       ></div>

//       {/* Content */}
//       <div className="relative z-10 text-left">
//         <h3 className="text-xl font-bold text-gray-800">{title}</h3>
//         <p className="text-gray-600 text-sm mb-3">{date}</p>
//         <p className="text-gray-700 text-sm mb-6 line-clamp-3">{description}</p>
//         <button className="px-4 py-2 bg-[#387CAE] text-white rounded-md text-sm hover:bg-[#285c7f] transition">
//           Learn More
//         </button>
//       </div>

//       {/* Decorative Border */}
//       <div className="absolute inset-0 rounded-lg border-2 border-gray-300"></div>
//     </div>
//   );
// };

// export default LatestBlogs;

import React from "react";

const LatestBlogs = ({ image, title, date, description }) => {
  return (
    <div className="relative rounded-xl shadow-lg  w-85 min-w-[25rem]  p-6 mb-8 hover:shadow-2xl transition-shadow duration-300 overflow-hidden m-2 text-white">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center  rounded-xl"
        style={{
          backgroundImage: `url(${image})`,
        }}
      ></div>
      <div className="absolute inset-0 bg-black bg-opacity-60 rounded-xl"></div>

      {/* Content */}
      <div className="relative z-10 text-left space-y-4">
        {/* Title */}

        <h3 className="text-xl font-bold ">{title}</h3>

        {/* Date */}
        <p className="text-sm ">{date}</p>
        {/* Description */}
        <p className=" text-sm line-clamp-3">{description}</p>

        {/* Button */}
        <button className="px-4 py-2 bg-[#387CAE] text-white rounded-md text-sm hover:bg-[#285c7f] transition">
          Learn More
        </button>
      </div>

      {/* Decorative Border */}
      <div className="absolute inset-0 rounded-lg border border-gray-300"></div>
    </div>
  );
};

export default LatestBlogs;
