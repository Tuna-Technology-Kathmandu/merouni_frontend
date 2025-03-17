import React from "react";

const BannerLayout = () => {
  const banner = [
    {
      id: 1,
      image:
        "https://media.edusanjal.com/bfs/Techspire_College_Edusanjal_2.jpg",
    },
    {
      id: 2,
      image:
        "https://media.edusanjal.com/bfs/Techspire_College_Edusanjal_2.jpg",
    },
    {
      id: 3,
      image:
        "https://media.edusanjal.com/bfs/Techspire_College_Edusanjal_2.jpg",
    },
  ];

  // Determine the number of items to display based on screen width
  let displayedBanners = banner.slice(0, 1); // Default: 1 item for small screens

  if (typeof window !== "undefined") {
    if (window.innerWidth >= 768) {
      displayedBanners = banner.slice(0, 2); // 2 items for medium screens
    }
    if (window.innerWidth >= 1024) {
      displayedBanners = banner; // 3 items for large screens
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {displayedBanners.map((item) => (
        <div key={item.id} className="w-full">
          <img
            src={item.image}
            alt={`Banner ${item.id}`}
            className="w-full h-[48px] sm:h-[48px] md:h-[48px] lg:h-[48px] object-cover rounded-lg"
          />
        </div>
      ))}
    </div>
  );
};

export default BannerLayout;
