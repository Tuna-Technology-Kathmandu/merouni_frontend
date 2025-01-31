import React from "react";
import Image from "next/image";

const Gallery = ({ college }) => {
    const images = ['/images/events_photo.png','/images/events_photo.png','/images/events_photo.png','/images/events_photo.png','/images/events_photo.png','/images/events_photo.png','/images/events_photo.png','/images/events_photo.png','/images/events_photo.png','/images/events_photo.png','/images/events_photo.png','/images/events_photo.png',]
  return (
    <div className="flex flex-col  max-w-[1600px]  mx-auto mb-20">
      <h2 className="font-bold text-3xl leading-10 mb-4">Gallery</h2>
      <div className="grid grid-cols-4 gap-1">
        {images.map((photo, index) => (
          <Image
            alt="college photo"
            src={photo}
            key={index}
            width={250}
            height={100}
            cl
          />
        ))}
      </div>
    </div>
  );
};

export default Gallery;
