// import React from "react";
// import EventCard from "./Cards"; // Import the EventCard component

// const Cardlist = () => {
//   // Sample data for the 6 event cards
//   const events=[
    
//   ]
//   return (
//     <div className="px-4 py-8 bg-[#E7E7E7] p-8 mt-20 rounded-md">
//       <div className=" max-w-[1600px] mx-auto">
//         <div className="text-2xl font-semibold mb-6">
//           Other events you may like
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {/* Map through events array and render EventCard for each event */}
//           {events.map((event, index) => (
//             <EventCard
//               key={index}
//               photo={event.photo}
//               month={event.month}
//               day={event.day}
//               title={event.title}
//               description={event.description}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Cardlist;


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
          {events.map((event) => (
            <EventCard
              key={event._id}
              photo="/images/eventsdesc.png"
              month={new Date(event.eventMeta.startDate).toLocaleString('default', { month: 'long' })}
              day={new Date(event.eventMeta.startDate).getDate()}
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