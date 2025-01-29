// import React from "react";
// import Image from "next/image";

// const EventCard = ({ photo, month, day, title, description }) => {
//   return (
//     <div className="min-w-[350px] max-w-[350px] mx-2 my-2 bg-white rounded-2xl  shadow-md border border-gray-300 ">
//       {/* <!-- Top Section: Image --> */}
//       {/* <div className="flex justify-center mb-4"> */}
//       <img src={photo} alt={`${title} logo`} className="w-full  object-cover" />
//       {/* </div> */}

//       <div className="flex items-start space-x-4 mb-4">
//         {/* Month and Day */}
//         <div className="flex flex-col justify-between ">
//           <p className="text-blue-600 text-lg font-bold p-2">{month}</p>
//           <p className="text-2xl font-extrabold text-gray-700 p-2">{day}</p>
//         </div>

//         {/* Title and Description */}
//         <div className="flex-1">
//           <h3 className="text-lg font-bold text-gray-900 p-2">{title}</h3>
//           <p className="text-gray-700 text-sm p-2">{description}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EventCard;




import React from "react";
import { FaEye, FaRegHeart } from "react-icons/fa";

const BlogCard = ({ image, date, views, title, description }) => {
  return (
    <div className="min-w-[350px] max-w-[350px] my-2 bg-white rounded-2xl shadow-md border border-gray-300 mb-10">
      <div className="h-[200px] relative">
        <img
          src={image}
          alt={`${title} logo`}
          className="w-full h-full object-cover rounded-t-2xl"
        />
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Date */}
        <p className="text-gray-600 mb-2">{date}</p>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-3">{title}</h2>

        {/* Description */}
        <div
          className="text-gray-600 text-sm mb-4"
          style={{ minHeight: "60px" }} // Ensures consistent height
        >
          {description}
        </div>

        <div className="border mb-1"></div>

        {/* Views Counter */}
        <div className="flex items-center text-gray-500 justify-between">
          <div className="flex flex-row gap-1">
            <FaEye size={20} />
            <span>{views} views</span>
          </div>
          <div>
            <FaRegHeart size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
