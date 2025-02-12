import React from "react";
import Navbar from "../components/Frontpage/Navbar";
import Footer from "../components/Frontpage/Footer";
import Header from "../components/Frontpage/Header";
import Body from "./components/Body";

const page = () => {
  return (
    <>
      <Header />
      <Navbar />
      <Body />
      <Footer />
    </>
  );
};

export default page;
