import Image from "next/image";
import React from "react";

const Blogs = () => {
  return (
    <div className="max-w-[1700px] mx-auto">
      <div className="font-extrabold text-4xl px-32 my-8">Featured Blogs and Articles</div>
      <div className="flex flex-wrap gap-y-16 px-12 ">
        <div className="w-1/2 flex items-start justify-center">
          <div className="flex flex-col max-w-[500px] gap-1">
            <div className="font-bold">
              GATE 2025 Chemical Engineering (CH) Syllabus: Check Dates, Books,
              Syllabus, and More
            </div>
            <div>
              IIT Roorkee released the GATE 2025 chemical engineering syllabus
              on the GATE’s official website, gate2025.iitr.ac.in. The
              detailed...
            </div>
            <div className="font-bold">Jan 2, 2025</div>
          </div>
          <Image
            src={"/images/blogs.png"}
            width={100}
            height={100}
            alt="Mero UNI logo"
            className="object-contain"
          />
        </div>
        <div className="w-1/2 flex items-start justify-center">
          <div className="flex flex-col max-w-[500px] gap-1">
            <div className="font-bold">
              GATE 2025 Chemical Engineering (CH) Syllabus: Check Dates, Books,
              Syllabus, and More
            </div>
            <div>
              IIT Roorkee released the GATE 2025 chemical engineering syllabus
              on the GATE’s official website, gate2025.iitr.ac.in. The
              detailed...
            </div>
            <div className="font-bold">Jan 2, 2025</div>
          </div>
          <Image
            src={"/images/blogs.png"}
            width={100}
            height={100}
            alt="Mero UNI logo"
            className="object-contain"gap-1
          />
        </div>
        <div className="w-1/2 flex items-start justify-center">
          <div className="flex flex-col max-w-[500px] gap-1">
            <div className="font-bold">
              GATE 2025 Chemical Engineering (CH) Syllabus: Check Dates, Books,
              Syllabus, and More
            </div>
            <div>
              IIT Roorkee released the GATE 2025 chemical engineering syllabus
              on the GATE’s official website, gate2025.iitr.ac.in. The
              detailed...
            </div>
            <div className="font-bold">Jan 2, 2025</div>
          </div>
          <Image
            src={"/images/blogs.png"}
            width={100}
            height={100}
            alt="Mero UNI logo"
            className="object-contain"
          />
        </div>
        <div className="w-1/2 flex items-start justify-center">
          <div className="flex flex-col max-w-[500px] gap-1">
            <div className="font-bold">
              GATE 2025 Chemical Engineering (CH) Syllabus: Check Dates, Books,
              Syllabus, and More
            </div>
            <div>
              IIT Roorkee released the GATE 2025 chemical engineering syllabus
              on the GATE’s official website, gate2025.iitr.ac.in. The
              detailed...
            </div>
            <div className="font-bold">Jan 2, 2025</div>
          </div>
          <Image
            src={"/images/blogs.png"}
            width={100}
            height={100}
            alt="Mero UNI logo"
            className="object-contain"
          />
        </div>
      </div>
      <button className="w-[210px] text-center  border-[#2EAE8F] border-2 rounded-xl  flex items-center justify-center p-2 font-bold text-[#9ad7c8] self-center mx-auto my-8">
        View more articles
        <div className="w-6 h-6 rounded-full  mx-2 text-[#9ad7c8]">&gt;</div>
      </button>
    </div>
  );
};

export default Blogs;
