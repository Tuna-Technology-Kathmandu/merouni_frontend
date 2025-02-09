"use client";
import React, { useState } from "react";
import { Share, Heart } from "lucide-react";
import { toast } from "react-toastify";
import { getToken } from "../action";
import { useSelector } from "react-redux";
import { authFetch } from "../utils/authFetch";

const WishlistCollegeCard = ({
  name,
  description,
  collegeId,
  imageUrl = "/images/pu.png",
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);
  const user = useSelector((state) => state.user.data);

  const handleWishlistRemove = async () => {
    setIsLoading(true);


    try {
      const res = await authFetch(
        `${process.env.baseUrl}${process.env.version}/wishlist`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json", // Make sure the Content-Type is set to JSON
          },
          body: JSON.stringify({
            college_id: collegeId,
            user_id: user.id,
          }),
        }
      );
      // console.log("res is" + res);
      // const response = await res.json();
      if (!res.ok) {
        throw new Error(`HTTP Error! Status: ${res.status}`);
      }

      setIsRemoved(true);
      toast.success("College removed from wishlist!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast.error("Failed to remove from wishlist. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isRemoved) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg transition-all duration-300 hover:scale-105 hover:border-gray-300">
      <div className="flex justify-between items-start mb-4">
        <img
          src={imageUrl}
          alt={`${name} logo`}
          className="w-12 h-12 object-contain"
        />
        <div className="flex gap-2">
          <button
            className="p-2 hover:bg-gray-100 rounded-full"
            aria-label="Share college"
          >
            <Share className="w-5 h-5 text-gray-600" />
          </button>
          <button
            className="p-2 hover:bg-gray-100 rounded-full"
            onClick={handleWishlistRemove}
            disabled={isLoading}
            aria-label="Remove from wishlist"
          >
            <Heart
              className={`w-5 h-5 text-red-500 fill-red-500 ${
                isLoading ? "opacity-50" : ""
              }`}
            />
          </button>
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

export default WishlistCollegeCard;
