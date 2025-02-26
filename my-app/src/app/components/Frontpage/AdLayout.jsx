import Link from "next/link";
import React from "react";

const AdLayout = ({ banners = [], size = "", number = 1 }) => {
  console.log("Banner data from params:", banners);

  const getRandomBanners = () => {
    return banners
      .filter((banner) => banner.banner_galleries?.length > 0)
      .sort(() => 0.5 - Math.random())
      .slice(0, number)
      .map((banner) => {
        const mediumImage = banner.banner_galleries.find(
          (gallery) => gallery.size === size
        );

        return {
          id: banner.id,
          title: banner.title,
          imageUrl: mediumImage?.url,
        };
      });
  };

  const selectedBanners = getRandomBanners();

  return (
    <div className="mb-5 mt-4 ">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        {selectedBanners.slice(0, number).map((banner, index) => (
          <Link href={`${banner.website_url}`}>
            <div key={`${banner.id}-${index}`} className="w-full md:w-auto">
              <img
                src={"/images/Large-Banner.jpg" || banner.imageUrl}
                alt={`Banner ${banner.title}`}
                className="w-full h-auto object-cover border bg-gray-100 rounded-lg"
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdLayout;
