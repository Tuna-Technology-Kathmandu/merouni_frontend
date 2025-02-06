import React from "react";
import Image from "next/image";

const Gallery = ({ university }) => {
  // Extract gallery images and videos from college data
  const images = university?.gallery || []; // Use gallery images if available
  const video = university?.assets?.videos || null; // Use video if available

  return (
    <div className="flex flex-col w-[1150px] mx-auto mb-20">
      <h2 className="font-bold text-3xl leading-10 mb-6">Gallery</h2>

      {/* Videos Section */}
      {video && (
        <div className="mb-8">
          <h3 className="text-2xl  mb-4">Featured Video</h3>
          <video
            controls
            className="w-full  rounded-lg shadow-lg"
            poster="/images/course_description.png"
          >
            <source
              src={
                "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" ||
                video
              }
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      {/* Gallery Images Section */}
      {images.length > 0 ? (
        <div>
          <h3 className="text-2xl  mb-4">Gallery Images</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((photo, index) => (
              <Image
                alt={`Gallery image ${index + 1}`}
                src={
                  "https://yavuzceliker.github.io/sample-images/image-100.jpg" ||
                  photo
                }
                key={index}
                width={300}
                height={200}
                className="rounded-lg shadow-lg object-cover"
              />
            ))}
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-center">No images available.</p>
      )}
    </div>
  );
};

export default Gallery;
