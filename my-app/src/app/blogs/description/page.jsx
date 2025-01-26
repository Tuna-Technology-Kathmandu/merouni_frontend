import React from "react";
import Navbar from "../../components/Frontpage/Navbar";
import Footer from "../../components/Frontpage/Footer";
import Header from "../../components/Frontpage/Header";
import Hero from "./components/Hero";
import Description from "./components/Description";
import Cardlist from "./components/Cardlist";

const page = () => {
  return (
    <div>
      <Header />
      <Navbar />
      <Hero />
      <Description/>
      <Cardlist />

      <Footer />
    </div>
  );
};

export default page;
