import React from "react";
import Navbar from "../../components/Frontpage/Navbar";
import Footer from "../../components/Frontpage/Footer";
import Header from "../../components/Frontpage/Header";
import ImageSection from "./components/upperSection";
import Syllabus from "./components/syllabus";
import ApplyNow from "./components/applyNow";
import RelatedCourses from "./components/RelatedCourses";

const CourseDescription = () => {
  return (
    <>
      <div>
        <Header />
        <Navbar />
        <ImageSection />
        <Syllabus />
        <ApplyNow />
        <RelatedCourses />
        <Footer />
      </div>
    </>
  );
};

export default CourseDescription;
