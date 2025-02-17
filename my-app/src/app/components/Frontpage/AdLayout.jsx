// import React, { useState, useEffect } from "react";
// import { getBannerById } from "@/app/action";

// const AdLayout = ({ banners = [] }) => {
//   const [bannerData, setBannerData] = useState([]);

//   useEffect(() => {
//     if (Array.isArray(banners) && banners.length > 0) {
//       fetchBannerDetails();
//     }
//   }, [banners]);

//   //   const fetchBannerDetails = async () => {
//   //     try {
//   //       const bannerPromises = banners.map((banner) =>
//   //         getBannerById(banner.college_id)
//   //       );
//   //       console.log("Banner promises:", bannerPromises);

//   //       const bannerResponses = await Promise.all(bannerPromises);
//   //       console.log("Raw banner responses:", bannerResponses);

//   //       const formattedBanners = bannerResponses
//   //         .map((banner) => {
//   //           console.log("Processing banner:", banner);
//   //           if (!banner?.Banners) {
//   //             console.log("No Banners property found in:", banner);
//   //             return null;
//   //           }

//   //           const randomIndex = Math.floor(Math.random() * banner.Banners.length)
//   //           const randomBanner = banner.Banners[randomIndex]
//   //           return banner.Banners.map((b) => ({
//   //             id: b.id,
//   //             title: b.title,
//   //             // images: b.banner_galleries?.map((gallery) => gallery.url) || [],
//   //             images:
//   //               b.banner_galleries
//   //                 ?.filter((gallery) => gallery.size === "medium")
//   //                 .map((gallery) => gallery.url) || [],
//   //           }));
//   //         })
//   //         .flat()
//   //         .filter(Boolean);

//   //       console.log("Formatted banners:", formattedBanners);
//   //       setBannerData(formattedBanners);
//   //     } catch (error) {
//   //       console.error("Error in fetchBannerDetails:", error);
//   //     }
//   //   };

//   const fetchBannerDetails = async () => {
//     try {
//       const bannerPromises = banners.map((banner) =>
//         getBannerById(banner.college_id)
//       );

//       const bannerResponses = await Promise.all(bannerPromises);

//       const formattedBanners = bannerResponses
//         .map((banner) => {
//           if (!banner?.Banners?.length) {
//             return null;
//           }

//           // Get a random banner
//           const randomIndex = Math.floor(Math.random() * banner.Banners.length);
//           const randomBanner = banner.Banners[randomIndex];

//           const mediumImage = randomBanner.banner_galleries?.find(
//             (gallery) => gallery.size === "medium"
//           );

//           return {
//             id: randomBanner.id,
//             title: randomBanner.title,
//             images: mediumImage ? [mediumImage.url] : [],
//           };
//         })
//         .filter(Boolean);

//       setBannerData(formattedBanners);
//     } catch (error) {
//       console.error("Error in fetchBannerDetails:", error);
//     }
//   };

//   useEffect(() => {
//     console.log("Banner detail data:", bannerData);
//   }, [bannerData]);

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//       {bannerData.map(({ id, title, images }) =>
//         images.map((imageUrl, index) => (
//           <div key={`${id}-${index}`} className="p-2">
//             <img
//               src={imageUrl}
//               alt={`Banner ${title}`}
//               className="border bg-gray-100 transform scale-90"
//             />
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default AdLayout;

// // import React, { useState, useEffect } from "react";
// // import { getBannerById } from "@/app/action";

// // const AdLayout = ({ banners = [] }) => {
// //   const [bannerData, setBannerData] = useState([]);

// //   useEffect(() => {
// //     if (Array.isArray(banners) && banners.length > 0) {
// //       fetchBannerDetails();
// //     }
// //   }, [banners]);

// //   const fetchBannerDetails = async () => {
// //     try {
// //       // Log the incoming banners
// //       console.log("Processing banners:", banners);

// //       const bannerPromises = banners.map((banner) =>
// //         getBannerById(banner.college_id)
// //       );

// //       const bannerResponses = await Promise.all(bannerPromises);
// //       console.log("Banner responses:", bannerResponses);

// //       // Adjust this part according to your getBannerById response structure
// //       const formattedBanners = bannerResponses
// //         .filter(Boolean)
// //         .map((banner) => ({
// //           id: banner.id,
// //           title: banner.title,
// //           images: banner.banner_galleries || [], // Adjust based on your actual response
// //         }));

// //       console.log("Formatted banners:", formattedBanners);
// //       setBannerData(formattedBanners);
// //     } catch (error) {
// //       console.error("Error fetching banner details:", error);
// //     }
// //   };

// //   return (
// //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
// //       {bannerData.map((banner) =>
// //         banner.images.map((image, index) => (
// //           <div key={`${banner.id}-${index}`} className="p-2">
// //             <img
// //               src={image.url} // Adjust based on your image structure
// //               alt={`Banner ${banner.title}`}
// //               className="border bg-gray-100 transform scale-90"
// //             />
// //           </div>
// //         ))
// //       )}
// //     </div>
// //   );
// // };

// // export default AdLayout;

// import React, { useState, useEffect } from "react";
// import { getBannerById } from "@/app/action";

// const AdLayout = ({ banners = [] }) => {
//   const [bannerData, setBannerData] = useState([]);

//   useEffect(() => {
//     if (Array.isArray(banners) && banners.length > 0) {
//       fetchBannerDetails();
//     }
//   }, [banners]);

//   const fetchBannerDetails = async () => {
//     try {
//       const bannerPromises = banners.map((banner) =>
//         getBannerById(banner.college_id)
//       );

//       const bannerResponses = await Promise.all(bannerPromises);

//       const formattedBanners = bannerResponses
//         .map((banner) => {
//           if (!banner?.Banners?.length) {
//             return null;
//           }

//           const randomIndex = Math.floor(Math.random() * banner.Banners.length);
//           const randomBanner = banner.Banners[randomIndex];

//           const mediumImage = randomBanner.banner_galleries?.find(
//             (gallery) => gallery.size === "medium"
//           );

//           return {
//             id: randomBanner.id,
//             title: randomBanner.title,
//             images: mediumImage ? [mediumImage.url] : [],
//           };
//         })
//         .filter(Boolean);

//       setBannerData(formattedBanners);
//     } catch (error) {
//       console.error("Error in fetchBannerDetails:", error);
//     }
//   };

//   return (
//     // <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ">
//     //   {bannerData.map(({ id, title, images }) =>
//     //     images.map((imageUrl, index) => (
//     //       <div key={`${id}-${index}`} className="p-2">
//     //         <img
//     //           src={
//     //             "https://media.edusanjal.com/bfs/school-edusanjal.gif" ||
//     //             imageUrl
//     //           }
//     //           alt={`Banner ${title}`}
//     //           //   className="border bg-gray-100 transform "
//     //           className="w-[300px] h-auto object-cover border bg-gray-100"
//     //         />
//     //       </div>
//     //     ))
//     //   )}
//     // </div>

//     <div className=" mt-5 ml-4 mr-4">
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-4">
//         {bannerData.slice(0,4).map(({ id, title, images }) =>
//           images.map((imageUrl, index) => (
//             <div key={`${id}-${index}`} className="w-full">
//               <img
//                 src={
//                   "https://media.edusanjal.com/bfs/Techspire_College_Edusanjal_2.jpg" ||
//                   imageUrl
//                 }
//                 alt={`Banner ${title}`}
//                 className="w-full h-auto object-cover border bg-gray-100"
//               />
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdLayout;

// import React from "react";

// const AdLayout = ({ banners  }) => {
// //   const [bannerData, setBannerData] = useState([]);

// //   useEffect(() => {
// //     if (Array.isArray(banners) && banners.length > 0) {
// //       fetchBannerDetails();
// //     }
// //   }, [banners]);

// //   const fetchBannerDetails = async () => {
// //     try {
// //       const bannerPromises = banners.map((banner) =>
// //         getBannerById(banner.college_id)
// //       );

// //       const bannerResponses = await Promise.all(bannerPromises);

// //       const formattedBanners = bannerResponses
// //         .map((banner) => {
// //           if (!banner?.Banners?.length) {
// //             return null;
// //           }

// //           const randomIndex = Math.floor(Math.random() * banner.Banners.length);
// //           const randomBanner = banner.Banners[randomIndex];

// //           const mediumImage = randomBanner.banner_galleries?.find(
// //             (gallery) => gallery.size === "medium"
// //           );

// //           return {
// //             id: randomBanner.id,
// //             title: randomBanner.title,
// //             images: mediumImage ? [mediumImage.url] : [],
// //           };
// //         })
// //         .filter(Boolean);

// //       setBannerData(formattedBanners);
// //     } catch (error) {
// //       console.error("Error in fetchBannerDetails:", error);
// //     }
// //   };

//   return (
//     // <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ">
//     //   {bannerData.map(({ id, title, images }) =>
//     //     images.map((imageUrl, index) => (
//     //       <div key={`${id}-${index}`} className="p-2">
//     //         <img
//     //           src={
//     //             "https://media.edusanjal.com/bfs/school-edusanjal.gif" ||
//     //             imageUrl
//     //           }
//     //           alt={`Banner ${title}`}
//     //           //   className="border bg-gray-100 transform "
//     //           className="w-[300px] h-auto object-cover border bg-gray-100"
//     //         />
//     //       </div>
//     //     ))
//     //   )}
//     // </div>

//     <div className=" mt-5 ml-4 mr-4">
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-4">
//         {bannerData.slice(0,4).map(({ id, title, images }) =>
//           images.map((imageUrl, index) => (
//             <div key={`${id}-${index}`} className="w-full">
//               <img
//                 src={
//                   "https://media.edusanjal.com/bfs/Techspire_College_Edusanjal_2.jpg" ||
//                   imageUrl
//                 }
//                 alt={`Banner ${title}`}
//                 className="w-full h-auto object-cover border bg-gray-100"
//               />
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdLayout;

// import React from "react";

// const AdLayout = ({ banners = [] }) => {
//   // Function to get medium images from banners
//   console.log("Banner data from params:", banners);
//   const getMediumImages = () => {
//     return banners
//       .filter((banner) => banner.Banners && banner.Banners.length > 0)
//       .map((banner) => {
//         // Get a random banner from each college's Banners array
//         const randomIndex = Math.floor(Math.random() * banner.Banners.length);
//         const randomBanner = banner.Banners[randomIndex];

//         if (!randomBanner?.banner_galleries?.length) return null;

//         // Find medium size image
//         const mediumImage = randomBanner.banner_galleries.find(
//           (gallery) => gallery.size === "medium"
//         );

//         return mediumImage
//           ? {
//               id: randomBanner.id,
//               title: randomBanner.title,
//               imageUrl: mediumImage.url,
//             }
//           : null;
//       })
//       .filter(Boolean); // Remove null entries
//   };

//   const bannerImages = getMediumImages();

//   return (
//     <div className="mb-5 mt-4">
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-4">
//         {bannerImages.slice(0, 4).map((banner, index) => (
//           <div key={`${banner.id}-${index}`} className="w-full">
//             <img
//               src={
//                 "https://media.edusanjal.com/bfs/Techspire_College_Edusanjal_2.jpg" ||
//                 banner.imageUrl
//               }
//               alt={`Banner ${banner.title}`}
//               className="w-full h-auto object-cover border bg-gray-100"
//             />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default AdLayout;

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
      <div className="flex  justify-between">
        {selectedBanners.slice(0, number).map((banner, index) => (
          <div key={`${banner.id}-${index}`} className="w-full ml-4 mr-2">
            <img
              src={
                "/images/Large-Banner.jpg" ||
                banner.imageUrl
              }
              alt={`Banner ${banner.title}`}
              className="w-full h-auto object-cover border bg-gray-100"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdLayout;
