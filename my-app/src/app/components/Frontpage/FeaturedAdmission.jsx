"use client";
import React, { useEffect, useState } from "react";

import { getFeaturedCollege } from "../../[[...home]]/action";
import { toast } from "react-toastify";

const FeaturedAdmission = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      let items = await getFeaturedCollege();
      setData(items.items);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const admissions = [
    {
      id: 1,
      title: "Texas College of Management and IT",
      description: "Description for admission 1.",
      address: {
        city: "Kathmandu",
        country: "Nepal",
      },
      image:
        "https://media.edusanjal.com/__sized__/cover_photo/TCMIT-Edusanjal_CEMceMm-thumbnail-1400x280-70.jpg",
    },
    {
      id: 2,
      title: "Canvas College",
      description: "Description for admission 2.",
      address: {
        city: "Kathmandu",
        country: "Nepal",
      },
      image:
        "https://media.edusanjal.com/cover_photo/Admission_Open_2025_Cover_design-Uniglobe_College_SQG1RNv.jpg",
    },
    {
      id: 3,
      title: "Orchid International College",
      description: "Description for admission 3.",
      address: {
        city: "Kathmandu",
        country: "Nepal",
      },
      image:
        "https://media.edusanjal.com/__sized__/cover_photo/Softwarica-College-of-IT-Cover-thumbnail-1400x280-70.jpg",
    },
    {
      id: 4,
      title: "Bagmati Multiple College",
      description: "Description for admission 4.",
      address: {
        city: "Kathmandu",
        country: "Nepal",
      },
      image:
        "https://media.edusanjal.com/__sized__/cover_photo/thames-cover-crop-c0-5__0-5-302x128-70.jpg",
    },
    {
      id: 5,
      title: "Ace International School",
      description: "Description for admission 5.",
      address: {
        city: "Kathmandu",
        country: "Nepal",
      },
      image:
        "https://media.edusanjal.com/__sized__/cover_photo/kathford-cover-image-crop-c0-5__0-5-302x128.png",
    },
  ];

  return (
    <>
      <h1 className="text-4xl text-xl font-semibold text-gray-800 my-8">
        FEATURED ADMISSIONS
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <img
              src={item.featured_image || admissions[0].image}
              alt={item.name}
              className="w-full h-32 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {item.name}
              </h2>
              <p className="text-gray-600">
                {item.address.city} | {item.address.country}
              </p>
              <hr className="my-2" />
              <ul>
                {item.collegeCourses.map((i, k) => (
                  <li key={k} className="text-sm list-disc ml-4">
                    {" "}
                    {i.program.title}{" "}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default FeaturedAdmission;
