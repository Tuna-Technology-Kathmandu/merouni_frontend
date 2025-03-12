import React from "react";

import Navbar from "../components/Frontpage/Navbar";
import Header from "../components/Frontpage/Header";
import Footer from "../components/Frontpage/Footer";
import Newsletter from "../components/Frontpage/NewsLetter";
import BannerLayout from "../components/Frontpage/BannerLayout";
import FeaturedAdmission from "../components/Frontpage/FeaturedAdmission";
import LargeBanner from "../components/Frontpage/LargeBanner";
import FeaturedDegree from "../components/Frontpage/FeaturedDegree";
import FieldofStudy from "../components/Frontpage/FieldofStudy";

const Page = () => {
  return (
    <>
      <Header />
      <Navbar />
      <div className="bg-gray-100 py-4">
        <div className="container mx-auto px-4">
          {/* Flex container for horizontal layout */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* 80% Admission Cards */}
            <div className="w-full lg:w-4/5">
              <BannerLayout />
              <FeaturedAdmission />
            </div>

            {/* 20% Image */}
            <div className="w-full lg:w-1/5">
              <img
                src="https://placehold.co/600x400"
                alt="Admission Image"
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* large banner */}
      <LargeBanner />

      {/* degree section for home page */}
      <FeaturedDegree />
      <FieldofStudy />
      <Footer />
    </>
  );
};

export default Page;
