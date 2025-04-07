'use client'

import { getBanner } from "../../[[...home]]/action";
import React, { useState } from "react";
import { useEffect } from "react";


const BannerLayout = () => {

  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  // const banner = [
  //   {
  //     id: 1,
  //     image:
  //       "https://media.edusanjal.com/bfs/Techspire_College_Edusanjal_2.jpg",
  //   },
  //   {
  //     id: 2,
  //     image:
  //       "https://media.edusanjal.com/bfs/Techspire_College_Edusanjal_2.jpg",
  //   },
  //   {
  //     id: 3,
  //     image:
  //       "https://media.edusanjal.com/bfs/Techspire_College_Edusanjal_2.jpg",
  //   },
  // ];

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getBanner(1, 3); // Set page & limit here
        setBanners(data.items); // Adjust based on API structure
        console.log('abnenrData', data);

      } catch (err) {
        console.error("Error loading banners", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <div>Loading banners...</div>;





  // Determine the number of items to display based on screen width
  // Default: 1 item for small screens

  // if (typeof window !== "undefined") {
  //   if (window.innerWidth >= 768) {
  //     displayedBanners = banner.slice(0, 2); // 2 items for medium screens
  //   }
  //   if (window.innerWidth >= 1024) {
  //     displayedBanners = banner; // 3 items for large screens
  //   }
  // }

  return (
    // <div className="grid grid-cols-1 w-full sm-d:grid-cols-3 lg:grid-cols-3 gap-7 sm:gap-4 mb-5">
    <div className="flex gap-4 md:gap-3 lg:gap-3 justify-center flex-wrap md:flex-nowrap xl:flex-nowrap">
      {banners.map((item) => (
        <div key={item.id} className=" w-full md:w-[350px] lg:w-[340px] xl:w-full cursor-pointer border border-blue-400">
          <a href={item.website_url} target="_blank" rel="noopener noreferrer">
            <img
              src={item.banner_galleries?.[0]?.url || "/images/exampleBanner.jpg"}
              onError={(e) => {
                e.target.src = "/images/exampleBanner.jpg";
              }}
              alt={`Banner ${item.id}`}
              className="w-full h-[64px] sm:h-[70px]  md:h-[58px] lg:h-[70px] rounded-lg cursor-pointer"
            />
          </a>
        </div>
      ))}
    </div>
  );
};

export default BannerLayout;
