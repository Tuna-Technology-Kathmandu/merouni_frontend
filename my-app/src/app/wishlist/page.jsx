"use client";
import { useEffect, useState } from "react";
import Navbar from "../components/Frontpage/Navbar";
import Header from "../components/Frontpage/Header";
import Footer from "../components/Frontpage/Footer";
import UniversityCard from "./Card";
import { authFetch } from "./authFetch";
import { getToken } from "../action"; // Import the function to get the token
import { useSelector } from "react-redux";

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  const user = useSelector((state) => state.user.data);

  useEffect(() => {
    const fetchWishlist = async () => {
      setLoading(true);
      try {
        const response = await authFetch(
          `${process.env.baseUrl}${process.env.version}/wishlist?user_id=${user.id}`
        );
        const data = await response.json();
        setWishlist(data.items || []);
      } catch (error) {
        if (error.message.includes("login again")) {
          // Redirect to login page or show login modal
          setError("Session expired. Please login again.");
        } else {
          setError("Failed to load wishlist. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchWishlist();
    }
  }, [user]);
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
          {!user ? (
            <p className="text-gray-600">Please login to see your wishlist.</p>
          ) : wishlist.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlist.map((item) => (
                <UniversityCard
                  key={item.id}
                  collegeId={item.college_id}
                  name={item?.college?.name || "Unknown College"}
                  description={
                    item?.college?.description || "No description available"
                  }
                  logo={item?.college?.featuredImage || ""}
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
