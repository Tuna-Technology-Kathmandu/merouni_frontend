// "use client";

// import Image from "next/image";
// import React, { useState, useEffect } from "react";
// import { getBanners } from "@/app/action";
// // import Loading from "../../../components/Loading";

// const Sponsore = () => {
//   const [banners, setBanners] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [imageUrls, setImageUrls] = useState([]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchBanners();
//   }, []);

//   const fetchBanners = async () => {
//     try {
//       const response = await getBanners();
//       setBanners(response.items);

//       const allImages = response.items.flatMap((item) =>
//         item.bannerImage.map((img) => img.gallery.medium)
//       );

//       setImageUrls(allImages);
//     } catch (error) {
//       setError("Failed to Load Banners");
//       console.error("Error loading Banners:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // useEffect(() => {
//   //   if (imageUrls.length === 0) return;

//   //   const interval = setInterval(() => {
//   //     setCurrentIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
//   //   }, 3000);

//   //   return () => clearInterval(interval);
//   // }, [imageUrls]);

//   useEffect(() => {
//     console.log("Banners data:", banners);
//   }, [banners]);

//   useEffect(() => {
//     console.log("Image URLS:", imageUrls);
//   }, [imageUrls]);

//   return (
//     <div className="max-w-[800px] mx-auto my-12">
//       {loading ? (
//         // <Loading />
//         <div className="flex justify-center items-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//         </div>
//       ) : imageUrls.length > 0 ? (
//         <div className="relative w-[800px]  overflow-hidden rounded-lg">
//           <Image
//             src={"/images/ad.png" || imageUrls[0]}
//             width={800}
//             height={200}
//             alt="Banner Image"
//             // className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
//             unoptimized
//           />
//         </div>
//       ) : (
//         <p>No images available</p>
//       )}
//     </div>
//   );
// };

// export default Sponsore;

// // "use client";

// // import Image from "next/image";
// // import React, { useState, useEffect } from "react";

// // // Placeholder images
// // const placeholderImages = [
// //   "/images/ad.png",
// //   "/images/aiimg.png",
// //   "/images/city_college.png",
// //   "/images/tu.png",
// // ];

// // const Sponsore = () => {
// //   const [currentIndex, setCurrentIndex] = useState(0);

// //   useEffect(() => {
// //     // Change image every 3 seconds
// //     const interval = setInterval(() => {
// //       setCurrentIndex((prevIndex) => (prevIndex + 1) % placeholderImages.length);
// //     }, 3000);

// //     return () => clearInterval(interval);
// //   }, []);

// //   return (
// //     <div className="max-w-[800px] mx-auto my-12 relative">
// //       {/* <div className="relative w-[800px] h-[500px] overflow-hidden rounded-lg"> */}
// //         <Image
// //           src={placeholderImages[currentIndex]}
// //           width={800}
// //           height={500}
// //           alt="Banner Image"
// //           // className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
// //         />
// //       {/* </div> */}
// //     </div>
// //   );
// // };

// // export default Sponsore;
"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { getBanners } from "@/app/action";
import AdLayout from "./AdLayout";

const Sponsore = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // State for error handling
  const [banner, setBanner] = useState([]);

  useEffect(() => {
    fetchBanner();
  }, []);

  const fetchBanner = async () => {
    try {
      setLoading(true);
      const response = await getBanners();
      console.log("Banner data in Sponsors:", response);
      setBanner(response.items);
    } catch (error) {
      console.error("Error fetching banner content:", error);
      setError("Failed to load banners");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" w-full h-auto mr-10 ml-auto my-12">
      <AdLayout banners={banner} size="large" number={2} />
    </div>
  );
};

export default Sponsore;
