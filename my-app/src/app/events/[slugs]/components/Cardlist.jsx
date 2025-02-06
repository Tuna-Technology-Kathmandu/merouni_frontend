import React from "react";
import EventCard from "./Cards"; // Import the EventCard component

const Cardlist = ({ events }) => {
  return (
    <div className="px-4 py-8 bg-[#E7E7E7] p-8 mt-20 rounded-md">
      <div className="max-w-[1600px] mx-auto">
        <div className="text-2xl font-semibold mb-6">
          Other events you may like
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => {
            const eventHost = JSON.parse(event.event_host); // Parse the JSON string
            const startDate = new Date(eventHost.start_date); // Get the start date

            return (
              <EventCard
                key={event.id}
                photo={"/images/eventsdesc.png"} // Use the event image or fallback
                month={startDate.toLocaleString('default', { month: 'long' })} // Get the month in text
                day={startDate.getDate()} // Get the day of the month
                title={event.title}
                description={event.description}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Cardlist;
