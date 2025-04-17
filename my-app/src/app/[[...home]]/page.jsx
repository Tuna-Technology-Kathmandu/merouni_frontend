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
import SideBanner from "../components/Frontpage/SideBanner";

const Page = () => {
  return (
    <>
      <Header />
      <Navbar />
      <div className="py-4">
        <div className="container px-4 mx-auto">
          <BannerLayout />
          {/* Flex container for horizontal layout */}
          <div className="flex gap-6">

            <div className="flex flex-col md:w-4/5 w-full sm:w-full">

              {/* 80% Admission Cards */}

              {/* <BannerLayout /> */}
              <FeaturedAdmission />

            </div>

            {/* 20% Image */}
            <div className="w-full md:w-1/5 hidden md:block mt-8">
              <SideBanner />
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
