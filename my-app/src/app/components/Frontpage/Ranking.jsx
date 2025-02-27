"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { FaGreaterThan } from "react-icons/fa";
import { getRankings } from "@/app/action";
import Link from "next/link";

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
  }, [ranking]);

  return (
    <div className=" bg-gradient-to-r flex items-center text-black my-24 ">
      <div className="flex items-center max-w-[1600px] mx-auto gap-16  2xl:gap-40 flex-col lp:flex-row">
        <div className="flex flex-col items-center sm:items-center md:items-start ">
          <div className="font-poppins text-2xl  md:text-5xl 2xl:text-7xl text-center text-wrap md:text-wrap font-bold md:font-extrabold leading-9 md:leading-[80px] md:text-left md:text-inherit w-[300px] md:w-[400px] mb-4">
            Find The Perfect College For You
          </div>
          <div className="w-[300px] md:w-[600px] text-center md:text-start text-black text-md md:text-2xl font-medium mb-4">
            Select colleges based on your goals, interests and future
            aspirations
          </div>
          <Link href="/colleges">
            <button className="w-[130px] text-center border border-black rounded-xl  flex items-center justify-center p-2 font-bold">
              View all
              <div className="w-6 h-6 rounded-full bg-black text-white mx-2">
                &gt;
              </div>
            </button>
          </Link>
        </div>
        <div
          className="flex flex-col justify-center rounded-lg border-2 shadow-md m-4 md:m-0"
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
          <p className="md:font-semibold   md:w-[600px] mx-2 ">
            1500+ colleges ranked with trusted, student-focused data approved by
            Nepal’s Education Authorities
          </p>
          <div className="flex flex-col gap-4 mx-auto my-8 font-semibold">
            <div className="grid grid-cols-2  md:grid-cols-2 gap-4 m-2">
              {ranking.map((rank, index) => (
                <Link href={`/blogs/${rank.slug}`}>
                  <div
                    className="border border-black rounded-lg text-center p-2  md:w-[275px] flex justify-center items-center "
                    key={index}
                  >
                    {rank.title}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ranking;
