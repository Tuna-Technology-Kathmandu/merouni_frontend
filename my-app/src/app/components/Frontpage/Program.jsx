"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getItems } from "../../[[...home]]/action";

const Program = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const response = await getItems("Exams");
      const data = response.items || [];
      setItems(data);
    } catch (err) {
      setError("Failed to load exams.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className=" bg-[#E3E3E3] text-black  border-black flex items-center  flex-col lp:flex-row">
        <div className="block lp:hidden  flex flex-col items-center mt-20">
          <div className="font-extrabold text-3xl md:text-6xl w-[250px] md:w-[400px]">
            Discover Your Perfect Study Program
          </div>
          <div className="font-medium text-md md:text-lg w-[300px] md:w-[400px] m-2">
            Browse through programs based on your interests and career goals,
            Browse through programs based on your interests and career goals
          </div>
          <button className="w-[130px] text-center border border-black rounded-xl  flex items-center justify-center p-2 font-bold mt-2">
            View all
            <div className="w-6 h-6 rounded-full bg-black text-white mx-2">
              &gt;
            </div>
          </button>
        </div>
        <div className="max-w-[1600px] mx-auto">
          <div className="flex justify-around flex-wrap gap-64 mt-20 lp:mt-40">
            <div className="flex flex-col  bg-white rounded-lg shadow-[8px_10px_4px_rgba(0,0,0,0.1)] max-w-[650px] w-full p-8">
              <div className="flex items-center">
                <Image
                  src={"/images/exam.png"}
                  width={50}
                  height={50}
                  alt="Mero UNI logo"
                />
                <div className="font-extrabold text-2xl px-2">Exams</div>
              </div>
              <div className="font-semibold mt-4">
                Simple access to information on preparation, dates, syllabus and
                more...
              </div>
              <div className="flex flex-wrap gap-4  m-4 py-6 font-bold">
                {items.length > 0 ? (
                  items.map((item, index) => (
                    <Link href={`/blogs/${item.slugs}`}>
                      <div
                        key={index}
                        className="border border-black rounded-lg text-center p-4 w-[250px] "
                      >
                        {item.title}
                      </div>
                    </Link>
                  ))
                ) : loading ? (
                  <p>Loading...</p>
                ) : (
                  <p>{error}</p>
                )}
              </div>
            </div>
            <div className="font-extrabold text-6xl w-[400px] ml-auto hidden lp:block">
              Discover Your Perfect Study Program
            </div>
          </div>
          <div className="flex justify-around flex-wrap gap-12  my-40">
            <div className="flex flex-col hidden lp:block">
              <div className="font-medium text-lg w-[400px]">
                Browse through programs based on your interests and career
                goals, Browse through programs based on your interests and
                career goals
              </div>
              <button className="w-[130px] text-center border border-black rounded-xl  flex items-center justify-center p-2 font-bold mt-2">
                View all
                <div className="w-6 h-6 rounded-full bg-black text-white mx-2">
                  &gt;
                </div>
              </button>
            </div>

            <div className="flex flex-col  bg-white rounded-lg shadow-[8px_10px_4px_rgba(0,0,0,0.1)] max-w-[600px] w-full p-8 ml-auto mb-4">
              <div className="flex items-center">
                <Image
                  src={"/images/courses.png"}
                  width={50}
                  height={50}
                  alt="Mero UNI logo"
                />
                <div className="font-extrabold text-2xl px-2">Courses</div>
              </div>
              <div className="font-semibold mt-4">
                Simple access to information on preparation, dates, syllabus and
                more...
              </div>
              <div className="flex flex-wrap gap-4  m-4 py-6 font-bold ">
                <div className="border border-black rounded-lg text-center p-4 w-[150px] ">
                  MBBS
                </div>
                <div className="border border-black rounded-lg text-center p-4 w-[150px] ">
                  BBA
                </div>
                <div className="border border-black rounded-lg text-center p-4 w-[150px] ">
                  Engineering
                </div>
                <div className="border border-black rounded-lg text-center p-4 w-[150px] ">
                  Agriculture
                </div>
                <div className="border border-black rounded-lg text-center p-4 w-[150px] ">
                  Law
                </div>
                <div className="border border-black rounded-lg text-center p-4 w-[150px] ">
                  IT
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Program;
