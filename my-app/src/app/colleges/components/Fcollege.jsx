// import React from "react";

// const Fcollege = () => {
//   return (
//     <div className="flex flex-col border border-gray-300 rounded-lg shadow-md w-64 min-w-[16rem] p-4 bg-white hover:shadow-lg transition-shadow duration-300">
//       <div className="flex items-center mb-3">
//         <img
//           src="/images/eventcard.png"
//           alt="College"
//           className="w-12 h-12 rounded-full object-cover mr-4"
//         />
//         <div className="font-semibold text-lg text-gray-800 truncate">
//           Name of College
//         </div>
//       </div>
//       <div className="text-gray-600 text-sm mb-4 line-clamp-3">
//         This is a brief description of the college. Highlight some unique features or offerings to attract students.
//       </div>
//       <button className="mt-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200">
//         Apply
//       </button>
//     </div>
//   );
// };

// export default Fcollege;


import React from "react";

const Fcollege = ({ name, description, image }) => {
  return (
    <div className="flex flex-col border border-gray-300 rounded-lg shadow-md w-64 min-w-[16rem] p-4 bg-white hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center mb-3">
        <img
          src={image}
          alt="College"
          className="w-12 h-12 rounded-full object-cover mr-4"
        />
        <div className="font-semibold text-lg text-gray-800 truncate">
          {name}
        </div>
      </div>
      <div className="text-gray-600 text-sm mb-4 line-clamp-3">
        {description}
      </div>
      <button className="mt-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200">
        Apply
      </button>
    </div>
  );
};

export default Fcollege;
