import React from "react";
import Navbar from "../components/Frontpage/Navbar";
import Footer from "../components/Frontpage/Footer";
import Header from "../components/Frontpage/Header";
import Featured from "./components/Featured";
const page = () => {
  return (
    <>
      <Header />
      <Navbar />
      <Featured />
      <Footer />
    </>
  );
};

export default page;
