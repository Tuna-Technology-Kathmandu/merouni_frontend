// import React from "react";

// const Description = () => {
//   return (
//     <>
//       <div className="p-4 flex max-w-[1200px] mx-auto  h-[90vh] items-center  leading-[200px]">
//         <div className="mb-6 w-1/2">
//           <div className="text-xl font-bold">Description</div>
//           <div className="text-base mt-2  leading-10">
//             Junior Entrepreneurship Circle (JEC), in collaboration with LBEF
//             College, is set to host "Next-Gen AI: Shaping Tomorrow," a
//             transformative event designed for high school (+2) students. The
//             event, endorsed by the Nepal Chamber of Commerce and supported by
//             strategic partner TEDxBaneshwor and internationally affiliated
//             partner GYES, aims to inspire and educate young minds about the
//             future of Artificial Intelligence (AI) and its potential to shape
//             tomorrow’s world.
//           </div>
//           <div className="text-base mt-4 leading-10 ">
//             Junior Entrepreneurship Circle (JEC), in collaboration with LBEF
//             College, is set to host "Next-Gen AI: Shaping Tomorrow," a
//             transformative event designed for high school (+2) students. The
//             event, endorsed by the Nepal Chamber of Commerce and supported by
//             strategic partner TEDxBaneshwor.
//           </div>
//         </div>

//         <div className="mb-6 w-1/3 ml-auto mr-20 self-start mt-36 flex flex-col">
//           <div className="text-xl font-bold my-6">Event Location</div>
//           <div className="mt-2 rounded-md">
//             <iframe
//               title="Event Location Map"
//               src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14130.819681647414!2d85.3414185!3d27.6955136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19bde57100db%3A0x9c61dc37723b191a!2sThe%20Everest%20Hotel!5e0!3m2!1sen!2snp!4v1737275311995!5m2!1sen!2snp"
//               width="100%"
//               height="300"
//               style={{ border: 0 }}
//               allowFullScreen
//               loading="lazy"
//               referrerPolicy="no-referrer-when-downgrade"
//             ></iframe>
//           </div>
//           <div className="text-4xl font-extrabold mt-4">NEXT-GEN AI:</div>
//           <div className="text-xl extraboldfont-sm mt-4">
//             LBEF College, Maitidevi{" "}
//           </div>
//         </div>
//       </div>
//       <div className=" max-w-[1200px] mx-auto  leading-[40px] flex">
//         <div className="w-1/2">
//           <div className=" font-bold text-2xl">Events highlights</div>
//           <ol>
//             <li>
//               1. Interactive Session: Dive into hands-on activities designed to
//               provide practical insights into AI technologies and their
//               real-world applications.{" "}
//             </li>
//             <li>
//               2. Panel Discussion: Gain valuable perspectives from renowned
//               experts in the AI and entrepreneurial domains.
//             </li>
//             <li>
//               3. Networking Opportunities: Connect with like-minded peers,
//               mentors, and industry professionals, fostering relationships that
//               could shape future endeavors.{" "}
//             </li>
//           </ol>
//         </div>
//         <div className="mx-auto font-bold text-2xl">Share with friends</div>
//       </div>
//     </>
//   );
// };

// export default Description;

import React from "react";
import { FaRegFaceLaugh } from "react-icons/fa6";
import { FaRegFaceAngry } from "react-icons/fa6";
import { FaRegSadCry } from "react-icons/fa";
import { AiOutlineLike } from "react-icons/ai";

const Description = ({ news }) => {
  return (
    <>
      <div className="p-4 flex max-w-[1200px] mx-auto h-[40vh] items-center leading-[200px]">
        <div className="mb-6">
          <div className="text-xl font-bold">Content</div>
          {/* <div className="text-base mt-2 leading-10">
            {news?.description}
          </div> */}
          <div className="text-base mt-4 leading-10">
            {news?.content} Lorem ipsum dolor sit amet consectetur adipisicing
            elit. Libero nisi minus iste iure sunt perferendis facilis obcaecati
            quam, nesciunt mollitia eius provident. Enim unde illo suscipit
            error neque. Rerum porro autem iure perferendis dolorem! Aut itaque
            consequatur illo minus facere. Aperiam quasi numquam corporis
            impedit molestiae odio, voluptate aspernatur eveniet eligendi ex
            fugit, dolorum pariatur asperiores. Earum repellat similique et?
          </div>
        </div>
      </div>

      {/* Rest of the component remains the same */}
      {/* <div className="max-w-[1200px] mx-auto leading-[40px] flex justify-start items-center"> */}
      <div className="max-w-[1200px] mx-auto flex justify-start items-center mt-4">
        {/* <div className="w-1/2">
          <div className="font-bold text-2xl">Events highlights</div>
          <div>{news?.content}</div>
        </div> */}

        <div className="flex flex-row gap-4">
          <button type="button" className="p-2  rounded hover:bg-blue-600">
            <FaRegFaceLaugh size={25} />
          </button>
          <button type="button" className="p-2   rounded hover:bg-red-600">
            <FaRegFaceAngry size={25} />
          </button>
          <button type="button" className="p-2 rounded hover:bg-yellow-600">
            <FaRegSadCry size={25} />
          </button>
          <button type="button" className="p-2  hover:bg-green-600">
            <AiOutlineLike size={25} />
          </button>
        </div>
        {/* <div className="mx-auto font-bold text-2xl">Share with friends</div> */}
      </div>
    </>
  );
};

export default Description;
