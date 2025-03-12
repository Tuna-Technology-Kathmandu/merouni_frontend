import React from "react";

const BannerLayout = () => {
  const banner = [
    {
      id: 1,
      image: "https://media.edusanjal.com/bfs/Techspire_College_Edusanjal_2.jpg",
    },
    {
      id: 2,
      image: "https://media.edusanjal.com/bfs/Techspire_College_Edusanjal_2.jpg",
    },
    {
      id: 3,
      image: "https://media.edusanjal.com/bfs/Techspire_College_Edusanjal_2.jpg",
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {banner.map((item) => (
        <img
          src={item.image}
          alt={item.id}
          className="w-full h-18 object-cover rounded-lg"
          key={item.id}
        />
      ))}
    </div>
  );
};

export default BannerLayout;
