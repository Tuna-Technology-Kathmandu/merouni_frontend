import AcademiaCard from "@/app/components/AcademiaCard";
import React from "react";

const page = () => {
  return (
    <div className="m-2 flex flex-wrap gap-4 mx-auto">
      <AcademiaCard title="Faculty" img="/images/logo.png" link="/dashboard/faculty" />
      <AcademiaCard title="Scholarship" img="/images/logo.png" link="/dashboard/scholarship" />
      <AcademiaCard title="University" img="/images/logo.png" link="/dashboard/university" />
      <AcademiaCard title="Program" img="/images/logo.png" link="/dashboard/program" />
      <AcademiaCard title="College" img="/images/logo.png" link="/dashboard/addCollege" />


    </div>
  );
};

export default page;
