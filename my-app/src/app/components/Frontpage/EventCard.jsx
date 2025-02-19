import React from "react";
import Image from "next/image";

const EventCard = ({ event }) => {
  // console.log("Month and day in event card:", event_host.start_date, day);
  let month = "";
  let day = "";
  try {
    const { start_date } = JSON.parse(event.event_host);
    const dateObj = new Date(start_date);
    month = dateObj.toLocaleString("en-US", { month: "short" }); // e.g., "Feb"
    day = dateObj.getDate(); // e.g., 15
  } catch (error) {
    console.error("Error parsing event_host:", error);
  }
  return (
    <div className="min-w-[300px] max-w-[350px] mx-2 my-2 bg-white rounded-2xl  shadow-md border border-gray-300  ">
      {/* <!-- Top Section: Image --> */}
      {/* <div className="flex justify-center mb-4"> */}
      <div className="md:h-[300px]">
        <img
          src="/images/upcoming.png"
          alt={`${event.title} logo`}
          className="w-full  object-cover rounded-t-2xl"
        />
      </div>
      {/* </div> */}

      <div className="flex items-start space-x-4 mb-4">
        {/* Month and Day */}
        <div className="flex flex-col justify-between ">
          <p className="text-blue-600 text-lg font-bold p-2">{month}</p>
          <p className="text-2xl font-extrabold text-gray-700 p-2">{day}</p>
        </div>

        {/* Title and Description */}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 p-2">{event.title}</h3>
          <p className="text-gray-700 text-sm p-2">{event.description}</p>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
