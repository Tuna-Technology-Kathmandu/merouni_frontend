
import React from "react";
import Link from "next/link";

const CollegeTeach = ({ degree }) => {
  return (
    <>
      <div className="flex flex-col items-center">
        <h2 className="font-bold text-3xl leading-10 mt-8">
          Colleges offering course
        </h2>

        <div className="w-[800px] max-h-[600px] overflow-y-auto mt-3 mb-2 border border-gray-300 rounded-lg">
          {degree?.colleges?.map((college, index) => {
            // Find the matching address for each college
            const collegeAddress = degree.collegesAddress.find(
              (address) =>
                address.program_college.college_id ===
                college.program_college.college_id
            );

            return (
              <Link href={`/college/${college.slugs}`} key={index}>
                <div className=" m-2 flex items-center gap-4 p-4 border rounded-lg mb-3 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="w-12 h-12 relative flex-shrink-0">
                    <img
                      src="/images/collegePhoto.png"
                      alt={college.name}
                      className="w-[50px] h-[50px] rounded-full"
                    />
                  </div>

                  <div>
                    <h3 className="font-medium">{college.name}</h3>
                    {/* Display the college address */}
                    {collegeAddress && (
                      <p className="text-sm text-gray-600">
                        {collegeAddress.city}, {collegeAddress.state},{" "}
                        {collegeAddress.country}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default CollegeTeach;
