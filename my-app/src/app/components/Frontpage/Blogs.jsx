import Image from "next/image";
import React from "react";

const Blogs = () => {
  return (
    <div className="max-w-[1700px] mx-auto my-36">
      <div className="font-extrabold text-xl md:text-4xl px-2 md:px-32 my-8 whitespace-nowrap ">
        Featured Blogs and Articles
      </div>
      <div className="hidden tb:block">
        <div className="flex flex-wrap gap-y-16 px-12 ">
          <div className="w-1/2 flex items-start justify-center">
            <div className="flex flex-col max-w-[500px] gap-1">
              <div className="font-bold">
                GATE 2025 Chemical Engineering (CH) Syllabus: Check Dates,
                Books, Syllabus, and More
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
              className="object-contain mx-2"
            />
          </div>
          <div className="w-1/2 flex items-start justify-center">
            <div className="flex flex-col max-w-[500px] gap-1">
              <div className="font-bold">
                GATE 2025 Chemical Engineering (CH) Syllabus: Check Dates,
                Books, Syllabus, and More
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
              className="object-contain mx-2"
              gap-1
            />
          </div>
          <div className="w-1/2 flex items-start justify-center">
            <div className="flex flex-col max-w-[500px] gap-1">
              <div className="font-bold">
                GATE 2025 Chemical Engineering (CH) Syllabus: Check Dates,
                Books, Syllabus, and More
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
              className="object-contain mx-2"
            />
          </div>
          <div className="w-1/2 flex items-start justify-center">
            <div className="flex flex-col max-w-[500px] gap-1">
              <div className="font-bold">
                GATE 2025 Chemical Engineering (CH) Syllabus: Check Dates,
                Books, Syllabus, and More
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
              className="object-contain mx-2"
            />
          </div>
        </div>
      </div>
      <div className="block tb:hidden">
        <div className="flex flex-col bg-white rounded-2xl shadow-lg overflow-hidden mx-4 my-4 md:max-w-[600px] ">
          <Image
            src="/images/aiimg.png"
            width={400}
            height={200}
            alt="GATE Chemical Engineering"
            className="w-full object-cover h-[200px]"
          />

          <div className="p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-800">
              GATE 2025 Chemical Engineering (CH) Syllabus: Check Dates, Books,
              Syllabus, and More
            </h2>

            <p className="text-gray-600 text-sm">
              IIT Roorkee released the GATE 2025 chemical engineering syllabus
              on the GATE's official website, gate2025.iit.ac.in. The
              detailed...
            </p>

            <p className="text-gray-500 text-sm">Jan 2, 2025</p>
          </div>
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
