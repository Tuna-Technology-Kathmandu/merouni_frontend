// "use client";
// import React, { useState, useEffect } from "react";
// import { getAdmission } from "../actions";

// const Body = () => {
//   const [admission, setAdmission] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchAdmission();
//   }, []);

//   const fetchAdmission = async () => {
//     setLoading(true);
//     try {
//       const response = await getAdmission();
//       console.log("Admission data:", response);
//       setAdmission(response);
//     } catch (error) {
//       console.error("Error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     console.log("Admission get:", admission);
//   }, [admission]);

//   return (
//   <>
//   <div className="flex flex-col ">
//         <div className="grid grid-cols-1 gap-x-8 gap-y-4">
//             {admission.map((admis,index) => (
//                 <div key={index} className="w-[600px] border-2 shadow-lg">
//                     <div className="flex flex-col ">
//                         <h2>{admis.program.title}</h2>
//                     </div>
//                 </div>
//             ))}
//         </div>
//   </div>
//   </>

// );
// };

// export default Body;

"use client";
import React, { useState, useEffect } from "react";
import { getAdmission } from "../actions";
import Link from "next/link";

const Body = () => {
  const [admission, setAdmission] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAdmission();
  }, []);

  const fetchAdmission = async () => {
    setLoading(true);
    try {
      const response = await getAdmission();
      console.log("Admission data:", response);
      setAdmission(response);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6">Admission Details</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {admission.map((admis, index) => (
          <div
            key={index}
            className="border-2 border-gray-200 rounded-lg shadow-lg p-6 bg-white"
          >
            <Link
              href={`/degree/${admis?.program?.slugs}`}
              className="hover:underline hover:decoration-[#30AD8F]"
            >
              <h2 className="text-xl font-semibold mb-2">
                {admis.program.title}
              </h2>
            </Link>

            <p className="text-gray-700 mb-2">
              <Link
                href={`/colleges/${admis?.collegeAdmissionCollege?.slugs}`}
                className="hover:underline hover:decoration-[#30AD8F]"
              >
                {/* <h2 className="text-xl font-semibold mb-2">{admis.program.title}</h2> */}
                <span className="font-semibold">College:</span>{" "}
                {admis.collegeAdmissionCollege.name}
              </Link>
              {/* <span className="font-bold">College:</span>{" "}
              {admis.collegeAdmissionCollege.name} */}
            </p>
            <p className="text-gray-700 mb-2">
              <span className="font-semibold">Admission Process:</span>{" "}
              {admis.admission_process}
            </p>
            <p className="text-gray-700 mb-2">
              <span className="font-semibold">Eligibility:</span>{" "}
              {admis.eligibility_criteria}
            </p>
            <p className="text-gray-700 mb-2">
              <span className="font-semibold">Fee Details:</span>{" "}
              {admis.fee_details}
            </p>
            {/* Add more details as needed */}
          </div>
        ))}
      </div>

      {/* No Results Message */}
      {admission.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          No admission details available.
        </div>
      )}
    </div>
  );
};

export default Body;
