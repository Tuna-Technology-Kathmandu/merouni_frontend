import React from "react";
import Navbar from "../components/Frontpage/Navbar";
import Header from "../components/Frontpage/Header";
import Footer from "../components/Footer";
import Hero from "../components/Frontpage/Hero";
import Ranking from "../components/Frontpage/Ranking";
import Program from "../components/Frontpage/Program";
import Sponsore from "../components/Frontpage/Sponsore";
import Colleges from "../components/Frontpage/Colleges";
import TU from "../components/Frontpage/TU";
import KU from "../components/Frontpage/KU";
import PU from "../components/Frontpage/PU";
import Degree from "../components/Frontpage/Degree";

const page = () => {
  return <>
  <Header/>
  <Navbar/>
  <div className="min-h-screen"></div>
  <Footer/>
  </>;
};
export default page;
