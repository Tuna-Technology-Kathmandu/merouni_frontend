// import React from "react";
// import Image from "next/image";
// import { FaEye } from "react-icons/fa";
// import { FaRegHeart } from "react-icons/fa";

// const BlogCard = ({ image, date,views, title, description }) => {
//   return (
//     <div className="min-w-[350px] max-w-[350px]  my-2 bg-white rounded-2xl  shadow-md border border-gray-300  mb-10">
//       <div className="h-[px] relative">
//         <img
//           src={image}
//           alt={`${title} logo`}
//           className="w-full  object-cover "
//         />
//       </div>

//       {/* Content Section */}
//       <div className="p-4 ">
//         {/* Date */}
//         <p className="text-gray-600 mb-2">{date}</p>

//         {/* Title */}
//         <h2 className="text-2xl font-bold text-gray-900 mb-3">{title}</h2>

//         {/* Description */}
//         <p className="text-gray-600  text-sm mb-4">{description}</p>

//         <div className="border mb-1"></div>

//         {/* Views Counter */}
//         <div className="flex items-center text-gray-500 justify-between">
//            <div className="flex flex-row gap-1">
//           <FaEye size={20} />
//           <span>{views} views</span>
//             </div>
//             <div>
//                 <FaRegHeart size={20}/>
//             </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BlogCard;

import React from "react";
import { FaEye, FaRegHeart } from "react-icons/fa";
import { Share } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";

const BlogCard = ({ image, date, title, description, slug }) => {
  const handleShareClick = () => {
    const blogUrl = `${window.location.origin}/blogs/${slug}`;
    navigator.clipboard.writeText(blogUrl).then(() => {
      toast.success("Blog URL copied to clipboard!");
    });
  };
  return (
    <div className="md:min-w-[350px] md:max-w-[350px] my-2 bg-white rounded-2xl shadow-md border border-gray-300 mb-10">
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

        <div className="flex items-center text-gray-500 justify-between">
          <button onClick={handleShareClick} className="flex flex-row gap-1">
            <Share size={20} />
          </button>
          <div>
            <FaRegHeart size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
