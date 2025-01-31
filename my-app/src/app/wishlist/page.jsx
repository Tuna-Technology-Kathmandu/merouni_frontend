
"use client";
import { useEffect, useState } from "react";
import Navbar from "../components/Frontpage/Navbar";
import Header from "../components/Frontpage/Header";
import Footer from "../components/Frontpage/Footer";
import UniversityCard from "./Card";
import { authFetch } from "./authFetch";
import { getToken } from "../action"; // Import the function to get the token

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const tokenObj = await getToken();
        if (!tokenObj?.value) {
          setError("Please login to see your wishlist.");
          setLoading(false);
          return;
        }

        setToken(tokenObj.value);
        const response = await authFetch(
          "http://localhost:8000/api/v1/wishlist",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${tokenObj.value}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const data = await response.json();
        setWishlist(data.items[0].colleges || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching wishlist:", err);
        setError("Failed to load wishlist.");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  if (loading) {
    return <div>Loading wishlist...</div>;
  }

  return (
    <div>
      <Header />
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Wishlist</h1>
          <span className="text-gray-600 text-lg">
            Total: {wishlist.length}
          </span>
        </div>
        <div className="border border-black rounded-xl p-6">
          {!token ? (
            <p className="text-gray-600">Please login to see your wishlist.</p>
          ) : wishlist.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlist.map((item) => (
                <UniversityCard
                  key={item._id}
                  collegeId={item._id}
                  name={item?.fullname || "Unknown College"}
                  description={item?.description || "No description available"}
                  logo={item?.assets?.featuredImage || ""}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-600">Your wishlist is empty.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default WishlistPage;
