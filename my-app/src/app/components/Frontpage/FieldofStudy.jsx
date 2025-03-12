import Link from "next/link";
import React from "react";

const FieldofStudy = () => {
  const degree = [
    {
      id: 1,
      title: "Engineering",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeFkRea-GyeWjSlr88zwu0ngFchRigG276wg&s",
    },
    {
      id: 2,
      title: "Bachelor of Computer Science and Information Technology (Bsc. CSIT)",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-hfVzc_dtKgvhBI8TW2w-kaSC8O6agNZ7vQ&s",
    },
    {
      id: 3,
      title: "Management",
      image: "https://placehold.co/600x400",
    },
    {
      id: 4,
      title: "Hospitality Management",
      image: "https://placehold.co/600x400",
    },
    {
      id: 5,
      title: "Science & Technology",
      image: "https://placehold.co/600x400",
    },
    {
      id: 6,
      title: "Admission Title 5",
      image: "https://placehold.co/600x400",
    },
    {
      id: 7,
      title: "Admission Title 5",
      image: "https://placehold.co/600x400",
    },
    {
      id: 8,
      title: "Admission Title 5",
      image: "https://placehold.co/600x400",
    },
  ];

  return (
    <div className="bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl text-xl font-semibold text-gray-800 my-8">
          Field of Study
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {degree.map((item) => (
            <Link href="#" key={item.id}>
              <div className="relative group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover transform transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-25 flex items-end p-4">
                  <h2 className="text-xl font-semibold text-white">
                    {item.title}
                  </h2>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FieldofStudy;