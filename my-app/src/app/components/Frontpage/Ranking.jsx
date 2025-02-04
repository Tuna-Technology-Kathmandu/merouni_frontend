"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { FaGreaterThan } from "react-icons/fa";
import { getRankings } from "@/app/action";

// import Image from "next/image";
// import React, { useState, useEffect } from "react";
// import Link from "next/link";
// import { getItems } from "../../[[...home]]/action";

// const RankingCard = ({ title, slug }) => (
//   <div className="border border-black rounded-lg text-center p-4 w-full md:w-[275px]">
//     <Link href={`/blogs/${slug}`}>{title}</Link>
//   </div>
// );

// const Ranking = () => {
//   const [items, setItems] = useState([]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadItems();
//   }, []);

//   const loadItems = async () => {
//     try {
//       const response = await getItems("Rankings");
//       const data = response.items || [];
//       setItems(data);
//     } catch (err) {
//       setError("Failed to load rankings.");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-gradient-to-r from-gray-100 to-gray-300 flex items-center text-black py-16">
//       <div className="flex flex-col lg:flex-row items-center max-w-[1600px] mx-auto gap-16 px-4">
//         {/* Left Section */}
//         <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
//           <h1 className="font-poppins text-3xl md:text-5xl font-extrabold leading-tight mb-4">
//             Find The Perfect College For You
//           </h1>
//           <p className="text-md md:text-xl mb-6">
//             Select colleges based on your goals, interests, and future
//             aspirations.
//           </p>
//           <button className="flex items-center justify-center border border-black rounded-xl px-4 py-2 font-bold">
//             View All
//             <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center ml-2">
//               &gt;
//             </span>
//           </button>
//         </div>

//         {/* Right Section */}
//         <div className="flex flex-col items-center p-6 rounded-lg shadow-lg bg-gradient-to-br from-white to-gray-200 w-full lg:w-1/2">
//           <div className="flex items-center gap-4 mb-6">
//             <Image
//               src="/images/ranking.png"
//               width={100}
//               height={100}
//               alt="Mero UNI logo"
//             />
//             <h2 className="text-2xl font-extrabold">Rankings</h2>
//           </div>
//           <p className="text-center font-semibold mb-8">
//             1500+ colleges ranked with trusted, student-focused data approved by
//             Nepal’s Education Authorities.
//           </p>

//           {/* Ranking List */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
//             {items.length > 0 ? (
//               items.map((item, index) => (
//                 <RankingCard key={index} title={item.title} />
//               ))
//             ) : loading ? (
//               <p>Loading...</p>
//             ) : (
//               <p>{error}</p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Ranking;

const Ranking = () => {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRanking();
  }, []);

  const fetchRanking = async () => {
    try {
      const response = await getRankings(4, 1, "Ranking");
      setRanking(response.items);
    } catch (error) {
      setError(error || "Error fetching the rankings ");
      console.error("Error fetching the rankings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Ranking from the news:", ranking);
  }, [ranking]);

  return (
    <div className=" bg-gradient-to-r flex items-center text-black my-24 ">
      <div className="flex items-center max-w-[1600px] mx-auto gap-16  2xl:gap-40 flex-col lp:flex-row">
        <div className="flex flex-col items-left sm:items-center md:items-start ">
          <div className="font-poppins text-xl md:text-5xl 2xl:text-7xl font-bold md:font-extrabold leading-9 md:leading-[80px] text-left text-inherit w-[300px] md:w-[400px] mb-4">
            Find The Perfect College For You
          </div>
          <div className="w-[300px] md:w-[600px] text-black text-md md:text-2xl font-bold mb-4">
            Select colleges based on your goals, interests and future
            aspirations
          </div>
          <button className="w-[130px] text-center border border-black rounded-xl  flex items-center justify-center p-2 font-bold">
            View all
            <div className="w-6 h-6 rounded-full bg-black text-white mx-2">
              &gt;
            </div>
          </button>
        </div>
        <div
          className="flex flex-col justify-center rounded-lg border-2 shadow-md"
          style={
            {
              // background:
              //   "linear-gradient(133.94deg, #FFFFFF 0.51%, #E9E9E9 99.49%)",
              // boxShadow: "8px 10px 4px rgba(0, 0, 0, 0.1)",
            }
          }
        >
          <div className="flex items-center">
            <Image
              src={"/images/ranking.png"}
              width={100}
              height={100}
              alt="Mero UNI logo"
            />
            <div className="font-extrabold text-2xl">Rankings</div>
          </div>
          <p className="font-semibold w-[300px] md:w-[600px] mx-2">
            1500+ colleges ranked with trusted, student-focused data approved by
            Nepal’s Education Authorities
          </p>
          <div className="flex flex-col gap-4 mx-auto my-8 font-semibold">
            <div className="grid grid-cols-1  md:grid-cols-2 gap-4 ">
              {ranking.map((rank, index) => (
                <div
                  className="border border-black rounded-lg text-center p-2 w-[275px] flex justify-center items-center"
                  key={index}
                >
                  {rank.title}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ranking;