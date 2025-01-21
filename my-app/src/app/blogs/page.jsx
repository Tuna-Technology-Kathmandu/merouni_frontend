import React from "react";
import Header from "../components/Frontpage/Header";
import Navbar from "../components/Frontpage/Navbar";
import Footer from "../components/Frontpage/Footer";
import Latest from "./components/Latest";
import FeaturedBlogs from "./components/FeaturedBlogs";
import Pagination from "./components/Pagination";

const Blogs = () => {
  return (
    <>
      <Header />
      <Navbar />
      <div>
        <Latest />
        <FeaturedBlogs />
        <Pagination/>
      </div>
      <Footer />
    </>
  );
};

export default Blogs;
