"use client";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Navbar from "../components/Frontpage/Navbar";
import Header from "../components/Frontpage/Header";
import Footer from "../components/Frontpage/Footer";
import UniversityCard from "./Card";

const WishlistPage = () => {
  const userData = useSelector((store) => store.user);
  const userId = userData?.data?.id;
  const token = userData?.token;
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Redux State:", userData);

    if (!userId || !token) {
      console.log("User not logged in or token missing.");
      setLoading(false);
      return;
    }

    console.log("Fetching wishlist...");
    fetch("http://localhost:8000/api/v1/wishlist", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        console.log("Response Status:", res.status);
        if (!res.ok) {
          throw new Error(`HTTP Error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Wishlist Data:", data);
        setWishlist(data.items[0].colleges || []);
      })
      .catch((err) => {
        console.error("Error fetching wishlist:", err);
      })
      .finally(() => setLoading(false));
  }, [userId, token]);

  if (!userData) {
    return <div>Please sign in to view your wishlist</div>;
  }

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
          {!userId || !token ? (
            <p className="text-gray-600">
              Please login to add to your wishlist.
            </p>
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
