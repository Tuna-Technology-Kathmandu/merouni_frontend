import React from "react";
import Navbar from "../components/Frontpage/Navbar";
import Header from "../components/Frontpage/Header";
import Footer from "../components/Footer";
import Hero from "../components/Frontpage/Hero";
import Ranking from "../components/Frontpage/Ranking";

const page = () => {
  return (
    <>
      <Header />
      <Navbar />
      <Hero/>
      <Ranking/>
    </>
  );
};
export default page;
