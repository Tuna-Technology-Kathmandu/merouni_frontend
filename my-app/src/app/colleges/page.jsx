import React from "react";
import Navbar from "../components/Frontpage/Navbar";
import Footer from "../components/Frontpage/Footer";
import Header from "../components/Frontpage/Header";
import Featured from "./components/Featured";
import Body from "./components/Body";

const page = () => {
  return (
    <>
      <Header />
      <Navbar />
      <Featured />
      <Body />  
      <Footer />
    </>
  );
};

export default page;
