"use client";

import React, { useState, useEffect } from "react";
import { getBanners } from "@/app/action";
import AdLayout from "./AdLayout";

const Sponsore = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); 
  const [banner, setBanner] = useState([]);

  useEffect(() => {
    fetchBanner();
  }, []);

  const fetchBanner = async () => {
    try {
      setLoading(true);
      const response = await getBanners();
      setBanner(response.items);
    } catch (error) {
      console.error("Error fetching banner content:", error);
      setError("Failed to load banners");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" w-full h-auto mr-10 ml-auto my-12">
      <AdLayout banners={banner} size="large" number={2} />
    </div>
  );
};

export default Sponsore;
