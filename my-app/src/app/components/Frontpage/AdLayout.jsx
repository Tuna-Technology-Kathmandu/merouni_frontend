import Link from "next/link";
import React from "react";


const defaultImages = [
  "/images/UTCBanners/UTCLarge.gif",
  "/images/UTCBanners/UTCLarge2.gif",
  "/images/UTCBanners/UTCLarge3.gif"
];
const AdLayout = ({ banners = [], size = "", number = 1, loading = false }) => {
  const getFeaturedBanners = () => {
    const featured = [];

    for (const banner of banners) {
      if (banner.priority === 1) {
        const images = banner.banner_galleries
          ?.filter(g => g.is_featured === 1)
          .map(g => ({
            id: banner.id,
            title: banner.title,
            imageUrl: g.url,
            websiteUrl: banner.website_url
          })) || [];

        for (const img of images) {
          if (featured.length < number) {
            featured.push(img);
          } else {
            break;
          }
        }

        if (featured.length >= number) break;
      }
    }

    return featured;
  };

  const selectedBanners = getFeaturedBanners();
  const fallBackBanners = [
    {
      imageUrl: "/images/UTCBanners/UTCLarge.gif",
      title: 'Mero Uni 1',
      websiteUrl: 'https://merouni.com/'
    },

    {
      imageUrl: "/images/UTCBanners/UTCLarge2.gif",
      title: 'Mero Uni 2',
      websiteUrl: 'https://merouni.com/'
    }, {

      imageUrl: "/images/UTCBanners/UTCLarge3.gif",
      title: 'Mero Uni 3',
      websiteUrl: 'https://merouni.com/'
    }
  ]

  const finalBanners = selectedBanners.length > 0 ? selectedBanners : fallBackBanners;


  return (
    <div className="mt-2 p-4">

      <div className="grid grid-cols-2 gap-3 sm:gap-5 sm:grid-cols-2 md:px-20 w-full">
        {loading
          ? [...Array(2)].map((_, index) => (
            <div
              key={index}
              className={`rounded-lg animate-pulse bg-slate-300 h-[48px] md:h-[58px] lg:h-[70px] ${index === 2
                ? "col-span-2 w-[calc(200%+12px)] flex justify-center"
                : ""
                }`}
            ></div>
          ))
          : finalBanners.slice(0, number).map((banner, index) => (
            <Link href={banner.websiteUrl} key={`${banner.id}-${index}`}>
              <div
                className={`h-[48px] md:h-[58px] lg:h-[70px] ${index === 2
                  ? "col-span-2 w-[calc(200%+12px)] flex justify-center"
                  : ""
                  }`}
              >
                <img
                  src={
                    banner.imageUrl || defaultImages[index % defaultImages.length]
                  }
                  alt={`Banner ${banner.title}`}
                  className={`w-full h-full object-fill rounded-lg ${index === 2 ? "sm:w-[50%]" : ""
                    }`}
                />
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default AdLayout;
