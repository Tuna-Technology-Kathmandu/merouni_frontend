"use client";
import React, { useState, useEffect } from "react";
import Navbar from "../components/Frontpage/Navbar";
import Footer from "../components/Frontpage/Footer";
import Header from "../components/Frontpage/Header";
import Featured from "./components/Featured";
import Body from "./components/Body";
import { getBanners } from "../action";
import AdLayout from "../components/Frontpage/AdLayout";
import AdLayoutShimmer from "../components/Frontpage/AdLayoutShimmer";

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [banners, setBanners] = useState([]);
  const [error, setError] = useState(""); // Added error state to handle errors

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await getBanners();
      setBanners(response.items);
    } catch (error) {
      console.error("Error fetching banners:", error);
      setError("Failed to load banners");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <Navbar />
      <AdLayout banners={banners} size="medium" number={3} />
      <Featured />
      <Body />
      <Footer />
    </>
  );
};

export default Page;
