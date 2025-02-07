// import React from "react";
// import EventCard from "./Cards"; // Import the EventCard component

// const Cardlist = () => {
//   // Sample data for the 6 event cards
//   const events=[

//   ]
//   return (
//     <div className="px-4 py-8 bg-[#E7E7E7] p-8 mt-20 rounded-md">
//       <div className=" max-w-[1600px] mx-auto">
//         <div className="text-2xl font-semibold mb-6">
//           Other events you may like
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {/* Map through events array and render EventCard for each event */}
//           {events.map((event, index) => (
//             <EventCard
//               key={index}
//               photo={event.photo}
//               month={event.month}
//               day={event.day}
//               title={event.title}
//               description={event.description}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Cardlist;

import React from "react";
import BlogCard from "./Cards"; // Import the EventCard component

const Cardlist = ({ news }) => {
  console.log("Blogs obtained after passing :", news);
  const truncateString = (str, maxLength) => {
    if (str.length > maxLength) {
      return str.slice(0, maxLength) + "...";
    }
    return str;
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="px-4 py-8 bg-[#E7E7E7] p-8 mt-20 rounded-md">
      <div className="max-w-[1600px] mx-auto">
        <div className="text-2xl font-semibold mb-6">
          Other events you may like
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((blog) => (
            <BlogCard
              image={"/images/eventsdesc.png" || blog.featuredImage}
              date={formatDate(blog.createdAt)}
              description={truncateString(blog.description, 100)}
              title={truncateString(blog.title, 20)}
              key={blog.id}
              slug={blog.slug}
            />

            //   <BlogCard
            //   date={formatDate(blog.createdAt)}
            //   description={truncateString(blog.description, 100)}
            //   image={blogs[0]["image"]}
            //   title={truncateString(blog.title, 20)}
            //   views={blogs[0]["views"]}
            // />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Cardlist;
