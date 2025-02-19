// import React from "react";

// const Description = ({ event }) => {
//   return (
//     <>
//       <div className="ml-4 mt-4 flex flex-col md:flex-row max-w-full md:max-w-[1600px] md:mx-auto  items-start ">
//         {/* Description Section */}
//         <div className="mb-6 w-full md:w-1/2">
//           <div className="text-2xl font-bold text-left md:text-left">
//             Description
//           </div>
//           <div className="text-base mt-2 leading-8 text-left md:text-left">
//             {event?.description}
//           </div>
//           <div className="text-base mt-4 leading-8 text-left md:text-left">
//             {event?.content}
//           </div>

//           <div className="">
//           <div className="font-bold text-2xl text-left md:text-left">
//             Events Highlights
//           </div>
//           <div className="text-left md:text-left">{event?.content}</div>
//         </div>
//         </div>

//         {/* Event Location Section */}

//       {/* Events Highlights */}
//       <div className="md:max-w-[1600px] ml-4  max-w-full md:mx-auto leading-[40px] flex flex-col md:flex-row ">
//       <div className="text-2xl font-bold md:my-0 my-6 text-left md:text-left">
//             Event Location
//           </div>
//           <div
//             className="mt-2 rounded-md flex justify-center md:block"
//             dangerouslySetInnerHTML={{ __html: event?.event_host?.map_url }}
//           />
//           <div className="text-xl font-sm mt-4 text-center md:text-left">
//             {event?.host}
//           </div>
//       </div>
//       </div>

//     </>
//   );
// };

// export default Description;

// {/* <div className="mb-6 w-full md:w-1/3 md:ml-auto md:mr-20 flex flex-col">
//           <div className="text-2xl font-bold md:my-0 my-6 text-left md:text-left">
//             Event Location
//           </div>
//           <div
//             className="mt-2 rounded-md flex justify-center md:block"
//             dangerouslySetInnerHTML={{ __html: event?.event_host?.map_url }}
//           />
//           <div className="text-xl font-sm mt-4 text-center md:text-left">
//             {event?.host}
//           </div>
//         </div> */}

import React from "react";

const Description = ({ event }) => {
  return (
    <>
      <div className="ml-4 mt-4 flex flex-col md:flex-row max-w-full md:max-w-[1600px] md:mx-auto  items-start ">
        {/* Description Section */}
        <div className="mb-6 w-full md:w-1/2">
          <div className="text-2xl font-bold text-left md:text-left">
            Description
          </div>
          <div className="text-base mt-2 leading-8 text-left md:text-left">
            {event?.description}
          </div>
          <div className="text-base mt-4 leading-8 text-left md:text-left">
            {event?.content}
          </div>
        </div>

        {/* Event Location Section */}
        <div className="mb-6 w-full md:w-1/3 md:ml-auto md:mr-20 flex flex-col">
          <div className="text-2xl font-bold md:my-0 my-6 text-left md:text-left">
            Event Location
          </div>
          <div
            className="mt-2 rounded-md w-full h-[300px] md:h-[350px]" // Added fixed height
            style={{
              minWidth: "300px", // Minimum width
              maxWidth: "100%", // Maximum width
              overflow: "hidden", // Prevents content from overflowing
            }}
            dangerouslySetInnerHTML={{ __html: event?.event_host?.map_url }}
          />
          <div className="text-xl font-sm mt-4 text-center md:text-center ">
            {event?.event_host.host}
          </div>
        </div>
      </div>

      {/* Events Highlights */}
      <div className="md:max-w-[1600px] ml-4  max-w-full md:mx-auto leading-8 flex flex-col md:flex-row ">
        <div className="w-full md:w-1/2">
          <div className="font-bold text-2xl text-left md:text-left">
            Events Highlights
          </div>
          <div className="text-left md:text-left">{event?.content}</div>
        </div>
      </div>
    </>
  );
};

export default Description;
