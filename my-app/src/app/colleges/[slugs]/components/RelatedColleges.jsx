"use client";

import React, { useEffect, useState } from "react";
import { getColleges } from "../../actions";
import Link from "next/link";

const RelatedColleges = ({ college }) => {
  const [colleges, setColleges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getRelatedColleges();
  }, []);

  const getRelatedColleges = async () => {
    setIsLoading(true);
    try {
      const data = await getColleges();
      console.log("RElated clz", data);

      const filteredColleges = data.colleges.filter(
        (c) => c.collegeId !== college._id
      );
      console.log("Filtered Colleges:", filteredColleges);
      // setColleges(data.colleges);
      setColleges(filteredColleges);

    } catch (error) {
      console.error("Error fetching colleges:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("Obtained Colleges:", colleges)
  }, [])


  return (
    <div className="flex flex-col max-w-[1600px] mx-auto mb-20 px-24">
      <h2 className="font-bold text-xl md:text-3xl leading-10 m-4 max-sm:text-center max-sm:leading-7">
        Colleges you may like
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-sm:gap-1">
        {colleges.map((college, index) => (
          <Link href={`/colleges/${college.slug}`} key={index}>
            <div className="cursor-pointer p-4 max-w-sm mx-auto sm:mx-0 max-sm:p-2">
              <div className="flex justify-center border-2 rounded-3xl items-center overflow-hidden mb-2 p-4">
                <img
                  src={college.logo}
                  alt={college.name}
                  className="w-48 h-48 max-[840px]:h-40 max-sm:h-36 object-cover"
                />
              </div>
              <div className="px-4 pb-4 flex flex-col">
                <h3 className="text-lg font-bold text-center">{college.name}</h3>
                <p className="text-xs text-gray-700 text-center">
                  {college.location}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedColleges;
