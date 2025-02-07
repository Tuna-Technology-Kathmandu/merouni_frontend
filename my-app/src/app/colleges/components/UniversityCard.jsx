import { useState, useEffect } from "react";
import { Share, Heart } from "lucide-react";
import { toast } from "react-toastify";
import { getToken } from "../../action"; // Assuming getToken is correctly imported

const UniversityCard = ({
  name,
  location,
  description,
  logo,
  collegeId,
  isWishlistPage = false,
}) => {
  const [isInWishlist, setIsInWishlist] = useState(isWishlistPage);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      const tokenObj = await getToken();
      setToken(tokenObj?.value || null);
      console.log("Token:", token);
    };
    fetchToken();
  }, []);

  useEffect(() => {
    if (token && !isWishlistPage) {
      checkWishlistStatus();
    }
  }, [token, collegeId]);

  const checkWishlistStatus = async () => {
    try {
      const response = await fetch(
        `${process.env.baseUrl}${process.env.version}/wishlist`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }

      const data = await response.json();
      const isInList = data.items.some((item) =>
        item.colleges?.some((college) => college._id === collegeId)
      );

      setIsInWishlist(isInList);
    } catch (error) {
      console.error("Error checking wishlist status:", error);
    }
  };

  const handleWishlistToggle = async () => {
    if (!token) {
      toast.warning("Please sign in to manage your wishlist", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setIsLoading(true);
    try {
      const method = isWishlistPage || isInWishlist ? "DELETE" : "POST";
      const response = await fetch(
        `${process.env.baseUrl}${process.env.version}/wishlist`,
        {
          method,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ college_id: collegeId }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }

      setIsInWishlist(!isInWishlist);

      toast.success(
        method === "DELETE"
          ? "Successfully removed from wishlist"
          : "Successfully added to wishlist",
        {
          position: "top-right",
          autoClose: 2000,
        }
      );
    } catch (error) {
      console.error("Error updating wishlist:", error);
      toast.error("Failed to update wishlist. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
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
          {token && (
            <button
              className="p-2 hover:bg-gray-100 rounded-full"
              onClick={handleWishlistToggle}
              disabled={isLoading}
            >
              <Heart
                className={`w-5 h-5 transition-colors duration-200 ${
                  isInWishlist ? "text-red-500 fill-red-500" : "text-gray-600"
                } ${isLoading ? "opacity-50" : ""}`}
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
