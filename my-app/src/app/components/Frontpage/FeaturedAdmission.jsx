"use client";
import React from "react";

const FeaturedAdmission = () => {
  const admissions = [
    {
      id: 1,
      title: "Texas College of Management and IT",
      description: "Description for admission 1.",
      address: "New Baneshowr",
      image: "https://placehold.co/600x400",
    },
    {
      id: 2,
      title: "Admission Title 2",
      description: "Description for admission 2.",
      address: "Chabahil",
      image: "https://placehold.co/600x400",
    },
    {
      id: 3,
      title: "Admission Title 3",
      description: "Description for admission 3.",
      address: "Siphal",
      image: "https://placehold.co/600x400",
    },
    {
      id: 4,
      title: "Admission Title 4",
      description: "Description for admission 4.",
      address: "Basundhara",
      image: "https://placehold.co/600x400",
    },
    {
      id: 5,
      title: "Admission Title 5",
      description: "Description for admission 5.",
      address: "Siphal",
      image: "https://placehold.co/600x400",
    },
  ];

  return (
    <>
      <h1 className="text-4xl text-xl font-semibold text-gray-800 my-8">
        FEATURED ADMISSIONS
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {admissions.map((admission) => (
          <div
            key={admission.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <img
              src={admission.image}
              alt={admission.title}
              className="w-full h-32 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {admission.title}
              </h2>
              <p className="text-gray-600">{admission.address} | Kathmandu</p>
              <hr className="my-2" />
              <p className="text-gray-600">{admission.description}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default FeaturedAdmission;
