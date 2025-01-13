import React from "react";
import Navbar from "../components/Frontpage/Navbar";
import Header from "../components/Frontpage/Header";
import Footer from "../components/Footer";
import Hero from "../components/Frontpage/Hero";
import Ranking from "../components/Frontpage/Ranking";
import Program from "../components/Frontpage/Program";
import Sponsore from "../components/Frontpage/Sponsore";
import Colleges from "../components/Frontpage/Colleges";

const page = () => {
  return (
    <>
      <Header />
      <Navbar />
      <Hero />
      <Ranking />
      <Program />
      <Sponsore />
      <Colleges/>
     
    </>
  );
};
export default page;
