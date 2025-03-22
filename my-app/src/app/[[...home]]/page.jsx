import React from "react";

import Navbar from "../components/Frontpage/Navbar";
import Header from "../components/Frontpage/Header";
import Footer from "../components/Frontpage/Footer";
import BannerLayout from "../components/Frontpage/BannerLayout";
import FeaturedAdmission from "../components/Frontpage/FeaturedAdmission";
import LargeBanner from "../components/Frontpage/LargeBanner";
import FeaturedDegree from "../components/Frontpage/FeaturedDegree";
import FieldofStudy from "../components/Frontpage/FieldofStudy";
import Colleges from "../components/Frontpage/Colleges";
import Degree from "../components/Frontpage/Degree";
import ScrollToTop from "../components/ScrollToTop";

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
              <div className="flex flex-col gap-4">
                {" "}
                {/* Added gap between images */}
                <img
                  src="https://placehold.co/600x400"
                  alt="Admission Image"
                  className="w-full h-auto rounded-lg shadow-lg"
                />
                <img
                  src="https://placehold.co/600x400"
                  alt="Admission Image"
                  className="w-full h-auto rounded-lg shadow-lg"
                />
                <img
                  src="https://placehold.co/600x400"
                  alt="Admission Image"
                  className="w-full h-auto rounded-lg shadow-lg"
                />
                <img
                  src="https://placehold.co/600x400"
                  alt="Admission Image"
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Degree />
      {/* large banner */}
      {/* <LargeBanner /> */}

      {/* degree section for home page */}
      <FeaturedDegree />
      <Colleges />
      <FieldofStudy />
      <Footer />
      <ScrollToTop />
    </>
  );
};

export default Page;
