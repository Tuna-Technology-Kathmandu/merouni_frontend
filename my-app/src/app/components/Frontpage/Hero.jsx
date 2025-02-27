"use client";
import FrontPageCard from "./frontpageCard";
import React, { useState, useEffect } from "react";
import { getColleges, getBanners } from "@/app/action";
import AdLayout from "./AdLayout";

const Hero = () => {
  const [featuredColleges, setFeaturedColleges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCollegeLoading, setIsCollegeLoading] = useState(true);
  const [error, setError] = useState(null); // State for error handling
  const [banner, setBanner] = useState([]);

  useEffect(() => {
    fetchFeaturedColleges();
  }, []);

  const fetchFeaturedColleges = async () => {
    try {
      const response = await getColleges(undefined, true);
      setFeaturedColleges(response.items);
      setIsCollegeLoading(false);
    } catch (error) {
      setError("Failed to load featured Colleges");
      setIsCollegeLoading(false);
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
      console.log("From Hero: ", response);
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
      {/* The carousel takes the full height of the Hero section */}
      <div className="container mx-auto px-4">
        <AdLayout banners={banner} size="medium" number={3} />
        {/* <ImageCarousel />  */}
        <FrontPageCard
          colleges={featuredColleges}
          isLoading={isCollegeLoading}
        />
      </div>
    </div>
  );
};

export default Hero;
