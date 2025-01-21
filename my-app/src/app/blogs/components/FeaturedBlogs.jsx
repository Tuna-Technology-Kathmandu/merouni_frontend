import React from "react";
import BlogCard from "./BlogCard";

const FeaturedBlogs = () => {

    

  const blogs = [
    {
      title: "Engineering Education in Nepal",
      date: "June 20, 2024",
      description:
        "Engineering has long been regarded as one of Nepal's most prestigious and so...",
      image: "/images/blogs_image1.png",
      views: 100,
    },
    {
      title: "Engineering Education in Nepal",
      date: "June 20, 2024",
      description:
        "Engineering has long been regarded as one of Nepal's most prestigious and so...",
      image: "/images/blogs_image2.png",
      views: 100,
    },
    {
        title: "Engineering Education in Nepal",
        date: "June 20, 2024",
        description:
          "Engineering has long been regarded as one of Nepal's most prestigious and so...",
        image: "/images/blogs_image1.png",
        views: 100,
      },
      {
        title: "Engineering Education in Nepal",
        date: "June 20, 2024",
        description:
          "Engineering has long been regarded as one of Nepal's most prestigious and so...",
        image: "/images/blogs_image2.png",
        views: 100,
      },
      {
        title: "Engineering Education in Nepal",
        date: "June 20, 2024",
        description:
          "Engineering has long been regarded as one of Nepal's most prestigious and so...",
        image: "/images/blogs_image1.png",
        views: 100,
      },
      {
        title: "Engineering Education in Nepal",
        date: "June 20, 2024",
        description:
          "Engineering has long been regarded as one of Nepal's most prestigious and so...",
        image: "/images/blogs_image2.png",
        views: 100,
      },
      {
        title: "Engineering Education in Nepal",
        date: "June 20, 2024",
        description:
          "Engineering has long been regarded as one of Nepal's most prestigious and so...",
        image: "/images/blogs_image1.png",
        views: 100,
      },
      {
        title: "Engineering Education in Nepal",
        date: "June 20, 2024",
        description:
          "Engineering has long been regarded as one of Nepal's most prestigious and so...",
        image: "/images/blogs_image2.png",
        views: 100,
      },
      {
        title: "Engineering Education in Nepal",
        date: "June 20, 2024",
        description:
          "Engineering has long been regarded as one of Nepal's most prestigious and so...",
        image: "/images/blogs_image1.png",
        views: 100,
      },
      {
        title: "Engineering Education in Nepal",
        date: "June 20, 2024",
        description:
          "Engineering has long been regarded as one of Nepal's most prestigious and so...",
        image: "/images/blogs_image2.png",
        views: 100,
      },
  ];
  return (

    <div className="flex flex-col max-w-[1600px] mx-auto px-8 mt-10">
      {/* top section  */}
      <div className="flex flex-row border-b-2 border-[#0A70A7] w-[45px] mb-10">
        <span className="text-2xl font-bold mr-2">Featured</span>
        <span className="text-[#0A70A7] text-2xl font-bold">Blogs</span>
      </div>

      {/*Bottom Section*/}

      <div className="grid grid-cols-4  ">
        {blogs.map((blog, index) => (
          <div key={index}>
            <BlogCard {...blog}/>
          </div>
        
        ))}
      </div>


    </div>
  );
};

export default FeaturedBlogs;
