import AcademiaCard from "@/app/components/AcademiaCard";
import React from "react";

const page = () => {
  return (
    <div className="m-2 flex flex-wrap gap-4 mx-auto">
      <AcademiaCard title="Faculty" img="/images/logo.png" link="/dashboard/faculty" />
      <AcademiaCard title="Scholarship" img="/images/logo.png" link="/dashboard/scholarship" />
    </div>
  );
};

export default page;
