import React from "react";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import Footer from "../components/Footer";

const page = () => {
  return <>
  <Header/>
  <Navbar/>
  <div className="min-h-screen"></div>
  <Footer/>
  </>;
};
export default page;
