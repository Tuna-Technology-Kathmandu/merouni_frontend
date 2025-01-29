"use client";
// import { Share, Heart } from "lucide-react";
// import { useSelector } from "react-redux";
// const UniversityCard = ({ name, location, description, logo }) => {
//   const userData = useSelector((store) => store.user);

//   return (
//     <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg transition-all duration-300  hover:scale-105 hover:border-gray-300">
//       <div className="flex justify-between items-start mb-4">
//         <img
//           src="/images/pu.png"
//           alt={`${name} logo`}
//           className="w-12 h-12 object-contain"
//         />
//         <div className="flex gap-2">
//           <button className="p-2 hover:bg-gray-100 rounded-full">
//             <Share className="w-5 h-5 text-gray-600" />
//           </button>
//           {userData?.data?.id && (
//             <button className="p-2 hover:bg-gray-100 rounded-full">
//               <Heart className="w-5 h-5 text-gray-600" />
//             </button>
//           )}
//         </div>
//       </div>
//       <h3 className="font-semibold text-lg mb-1">{name}</h3>
//       <p className="text-black text-sm my-4">{description}</p>
//       <div className="flex gap-3">
//         <button className="flex-1 py-2 px-4 border border-gray-300 rounded-2xl text-gray-700 hover:bg-gray-50 text-sm font-medium">
//           Details
//         </button>
//         <button className="flex-1 py-2 px-4 bg-gray-900 text-white rounded-2xl hover:bg-gray-800 text-sm font-medium">
//           Apply Now
//         </button>
//       </div>
//     </div>
//   );
// };
// export default UniversityCard;

import { useState, useEffect } from "react";
import { Share, Heart } from "lucide-react";
import { useSelector } from "react-redux";

const UniversityCard = ({
  name,
  location,
  description,
  logo,
  collegeId,
  isWishlistPage = false,
}) => {
  const userData = useSelector((store) => store.user);
  const [isInWishlist, setIsInWishlist] = useState(isWishlistPage);
  const [isLoading, setIsLoading] = useState(false);

  // Check if the college is in wishlist on component mount
  useEffect(() => {
    if (userData?.token && !isWishlistPage) {
      checkWishlistStatus();
    }
  }, [userData?.token, collegeId]);

  const checkWishlistStatus = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/wishlist", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userData?.token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        const isInList = data.items.some(
          (item) => item.colleges?.[0]?._id === collegeId
        );
        setIsInWishlist(isInList);
      }
    } catch (error) {
      console.error("Error checking wishlist status:", error);
    }
  };

  const handleWishlistToggle = async () => {
    if (!userData?.token) {
      alert("Please sign in to manage your wishlist");
      return;
    }

    setIsLoading(true);
    try {
      const method = isWishlistPage || isInWishlist ? "DELETE" : "POST";
      const response = await fetch("http://localhost:8000/api/v1/wishlist", {
        method,
        headers: {
          Authorization: `Bearer ${userData.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ college_id: collegeId }),
      });
      console.log("college_id", collegeId);

      if (response.ok) {
        setIsInWishlist(!isInWishlist);

        // If we're on the wishlist page and removing an item, we might want to
        // trigger a refresh of the parent component
        if (isWishlistPage && method === "DELETE") {
          // You can pass an onWishlistUpdate prop to handle this
          props.onWishlistUpdate?.(collegeId);
        }
      } else {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      alert("Failed to update wishlist. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg transition-all duration-300 hover:scale-105 hover:border-gray-300">
      <div className="flex justify-between items-start mb-4">
        <img
          src="/images/pu.png"
          alt={`${name} logo`}
          className="w-12 h-12 object-contain"
        />
        <div className="flex gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Share className="w-5 h-5 text-gray-600" />
          </button>
          {userData?.data?.id && (
            <button
              className="p-2 hover:bg-gray-100 rounded-full"
              onClick={handleWishlistToggle}
              disabled={isLoading}
            >
              <Heart
                className={`w-5 h-5 ${
                  isInWishlist ? "text-red-500 fill-red-500" : "text-gray-600"
                }`}
              />
            </button>
          )}
        </div>
      </div>

      <h3 className="font-semibold text-lg mb-1">{name}</h3>
      <p className="text-black text-sm my-4">{description}</p>
      <div className="flex gap-3">
        <button className="flex-1 py-2 px-4 border border-gray-300 rounded-2xl text-gray-700 hover:bg-gray-50 text-sm font-medium">
          Details
        </button>
        <button className="flex-1 py-2 px-4 bg-gray-900 text-white rounded-2xl hover:bg-gray-800 text-sm font-medium">
          Apply Now
        </button>
      </div>
    </div>
  );
};

export default UniversityCard;
