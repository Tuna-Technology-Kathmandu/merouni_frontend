"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getItems } from "../../[[...home]]/action";

const RankingCard = ({ title, slug }) => (
  <div className="border border-black rounded-lg text-center p-4 w-full md:w-[275px]">
    <Link href={`/blogs/${slug}`}>{title}</Link>
  </div>
);

const Ranking = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const response = await getItems("Rankings");
      const data = response.items || [];
      setItems(data);
    } catch (err) {
      setError("Failed to load rankings.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-100 to-gray-300 flex items-center text-black py-16">
      <div className="flex flex-col lg:flex-row items-center max-w-[1600px] mx-auto gap-16 px-4">
        {/* Left Section */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          <h1 className="font-poppins text-3xl md:text-5xl font-extrabold leading-tight mb-4">
            Find The Perfect College For You
          </h1>
          <p className="text-md md:text-xl mb-6">
            Select colleges based on your goals, interests, and future
            aspirations.
          </p>
          <button className="flex items-center justify-center border border-black rounded-xl px-4 py-2 font-bold">
            View All
            <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center ml-2">
              &gt;
            </span>
          </button>
        </div>

        {/* Right Section */}
        <div className="flex flex-col items-center p-6 rounded-lg shadow-lg bg-gradient-to-br from-white to-gray-200 w-full lg:w-1/2">
          <div className="flex items-center gap-4 mb-6">
            <Image
              src="/images/ranking.png"
              width={100}
              height={100}
              alt="Mero UNI logo"
            />
            <h2 className="text-2xl font-extrabold">Rankings</h2>
          </div>
          <p className="text-center font-semibold mb-8">
            1500+ colleges ranked with trusted, student-focused data approved by
            Nepal’s Education Authorities.
          </p>

          {/* Ranking List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {items.length > 0 ? (
              items.map((item, index) => (
                <RankingCard key={index} title={item.title} />
              ))
            ) : loading ? (
              <p>Loading...</p>
            ) : (
              <p>{error}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ranking;
