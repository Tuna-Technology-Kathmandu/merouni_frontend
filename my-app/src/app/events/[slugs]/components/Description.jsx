

import React from "react";

const Description = ({ event }) => {
  return (
    <>
      <div className="p-4 flex max-w-[1200px] mx-auto h-[90vh] items-center leading-[200px]">
        <div className="mb-6 w-1/2">
          <div className="text-xl font-bold">Description</div>
          <div className="text-base mt-2 leading-10">
            {event?.description}
          </div>
          <div className="text-base mt-4 leading-10">
            {event?.content}
          </div>
        </div>

        <div className="mb-6 w-1/3 ml-auto mr-20 self-start mt-36 flex flex-col">
          <div className="text-xl font-bold my-6">Event Location</div>
          <div className="mt-2 rounded-md" 
               dangerouslySetInnerHTML={{ __html: event?.eventMeta?.mapIframe }} 
          />
          <div className="text-4xl font-extrabold mt-4">{""}</div>
          <div className="text-xl font-sm mt-4">{event?.host}</div>
        </div>
      </div>
      
      {/* Rest of the component remains the same */}
      <div className="max-w-[1200px] mx-auto leading-[40px] flex">
        <div className="w-1/2">
          <div className="font-bold text-2xl">Events highlights</div>
          <div>{event?.content}</div>
        </div>
        {/* <div className="mx-auto font-bold text-2xl">Share with friends</div> */}
      </div>
    </>
  );
};

export default Description;