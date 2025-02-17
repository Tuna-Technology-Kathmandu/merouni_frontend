import AcademiaCard from "@/app/components/AcademiaCard";
import React from "react";

const page = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <AcademiaCard
          title="College"
          img="/images/logo.png"
          link="/dashboard/addCollege"
        />
        <AcademiaCard
          title="Courses"
          img="/images/logo.png"
          link="/dashboard/courses"
        />
        <AcademiaCard
          title="Exams"
          img="/images/logo.png"
          link="/dashboard/exams"
        />
        <AcademiaCard
          title="Faculty"
          img="/images/logo.png"
          link="/dashboard/faculty"
        />
        <AcademiaCard
          title="level"
          img="/images/logo.png"
          link="/dashboard/level"
        />
        <AcademiaCard
          title="Material"
          img="/images/logo.png"
          link="/dashboard/material"
        />
        <AcademiaCard
          title="Program"
          img="/images/logo.png"
          link="/dashboard/program"
        />
        <AcademiaCard
          title="Scholarship"
          img="/images/logo.png"
          link="/dashboard/scholarship"
        />
        <AcademiaCard
          title="Tag"
          img="/images/logo.png"
          link="/dashboard/tag"
        />
        <AcademiaCard
          title="University"
          img="/images/logo.png"
          link="/dashboard/university"
        />
      </div>
    </div>
  );
};

export default page;
