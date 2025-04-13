import Link from "next/link";
import React from "react";

const AdLayout = ({ banners = [], size = "", number = 1 }) => {
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
          websiteUrl: banner.website_url,
        };
      });
  };

  const selectedBanners = getRandomBanners();

  return (
    <div className="my-5 p-4">
      <div className="grid grid-cols-2 gap-3 sm:gap-5 sm:grid-cols-2 md:px-20 w-full">
        {selectedBanners.slice(0, number).map((banner, index) => (
          <Link href={`${banner.websiteUrl}`}>
            <div key={`${banner.id}-${index}`}
              className={`h-[48px]  md:h-[58px] lg:h-[70px] ${index == 2 ? 'col-span-2 w-[calc(200%+12px)] flex justify-center' : ''}`}
            >
              <img
                src={"/images/Large-Banner.jpg" || banner.imageUrl}
                alt={`Banner ${banner.title}`}
                className={`w-full h-full object-fill rounded-lg ${index == 2 ? 'sm:w-[50%] ' : ''}`}
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdLayout;
