import React from "react";
import EventCard from "./Cards"; // Import the EventCard component

const Cardlist = () => {
  // Sample data for the 6 event cards
  const events = [
    {
      photo: "/images/eventcard.png", // Path to the image in public folder
      month: "January",
      day: "22",
      title: "Next-Gen AI: Shaping Tomorrow",
      description:
        "Join us for a transformative event on AI, hosted by JEC and LBEF College.",
    },
    {
      photo: "/images/eventcard.png",
      month: "February",
      day: "18",
      title: "AI and the Future",
      description: "Explore the future of AI and its impact on the world.",
    },
    {
      photo: "/images/eventcard.png",
      month: "March",
      day: "10",
      title: "Tech Trends in 2025",
      description: "Stay ahead of the curve with the latest tech trends.",
    },
    {
      photo: "/images/eventcard.png",
      month: "April",
      day: "15",
      title: "Innovations in Robotics",
      description: "Discover how robotics is shaping industries worldwide.",
    },
    {
      photo: "/images/eventcard.png",
      month: "May",
      day: "5",
      title: "The Future of Work",
      description: "Learn about AI, automation, and the future of employment.",
    },
    {
      photo: "/images/eventcard.png",
      month: "June",
      day: "12",
      title: "Digital Transformation",
      description:
        "Understand how businesses are evolving with digital technologies.",
    },
  ];

  return (
    <div className="px-4 py-8 bg-[#E7E7E7] p-8 mt-20 rounded-md">
      <div className=" max-w-[1600px] mx-auto">
        <div className="text-2xl font-semibold mb-6">
          Other events you may like
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Map through events array and render EventCard for each event */}
          {events.map((event, index) => (
            <EventCard
              key={index}
              photo={event.photo}
              month={event.month}
              day={event.day}
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
