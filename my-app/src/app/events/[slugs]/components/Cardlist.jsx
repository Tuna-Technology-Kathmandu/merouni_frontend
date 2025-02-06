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
          {console.log(events)}
          {events.map((event) => (
            <EventCard
            key={event.id}
            photo="/images/eventsdesc.png"
            month={new Date(event.start_date).toLocaleString('default', { month: 'long' })}
            day={new Date(event.start_date).getDate()}
            title={event.title}
            description={event.description}
          />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Cardlist;
