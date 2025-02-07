"use client";
import ImageCarousel from "./ImageCarousel"; // Importing the modified carousel
import FrontPageCard from "./frontpageCard";
import React, { useState, useEffect } from "react";
import { getFeaturedColleges, getColleges, getBanners } from "@/app/action";
import AdLayout from "./AdLayout";

const Hero = () => {
  const [featuredColleges, setFeaturedColleges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // State for error handling
  const [banner, setBanner] = useState([]);

  useEffect(() => {
    fetchFeaturedColleges();
  }, []);

  const fetchFeaturedColleges = async () => {
    try {
      console.log("Hlo hero");
      // const response = await getFeaturedColleges();
      const response = await getColleges(undefined, true);
      console.log("RESOPHOSG hero page of front:", response);
      setFeaturedColleges(response.items);
    } catch (error) {
      console.error("Error fetching the colleges data:", error);
      setError("Failed to load featured Colleges");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanner();
  }, []);

  const fetchBanner = async () => {
    try {
      setLoading(true);
      const response = await getBanners();
      console.log("Banner data:", response);
      setBanner(response.items);
    } catch (error) {
      console.error("Error fetching banner content:", error);
      setError("Failed to load banners");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full ">
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}
      {/* The carousel takes the full height of the Hero section */}
      <div className="container mx-auto px-4">
        <AdLayout banners={banner} size="medium" number={3} />
        {/* <ImageCarousel />  */}
        <FrontPageCard colleges={featuredColleges} />
      </div>
    </div>
  );
};

export default Hero;
