"use client";
import { useSelector } from "react-redux";

const WishlistPage = () => {
  const userData = useSelector((store) => store.user);
  
  if (!userData) {
    return <div>Please sign in to view your wishlist</div>;
  }

  return (
    <div>
      <h1>Wishlist</h1>
      <p>Welcome {userData.name}</p>
      <pre>{JSON.stringify(userData, null, 2)}</pre>
    </div>
  );
};

export default WishlistPage;