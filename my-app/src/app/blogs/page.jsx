// "use client";
// import React, { useState, useEffect } from "react";
// import Header from "../components/Frontpage/Header";
// import Navbar from "../components/Frontpage/Navbar";
// import Footer from "../components/Frontpage/Footer";
// import Latest from "./components/Latest";
// import FeaturedBlogs from "./components/FeaturedBlogs";
// import Pagination from "./components/Pagination";
// import { getBlogs } from "../action";

// const Blogs = () => {
//   const [pagination, setPagination] = useState({
//     currentPage: 0,
//     totalPages: 1,
//     hasNextPage: false,
//     hasPreviousPage: false,
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     loadPageNumber(pagination.currentPage);
//   }, [pagination.currentPage]);

//   const loadPageNumber = async (page) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await getBlogs( page );
//       console.log("Response from getBlogs:", response); // Debugging log

//       if (response && response.pagination) {
//         console.log("look", response.pagination)
//         setPagination(response.pagination);

//       } else {
//         console.error("Pagination data not found in response:", response);
//       }
//     } catch (error) {
//       setError("Failed to load blogs");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePageChange = (page) => {
//     setPagination((prev) => ({
//       ...prev,
//       currentPage: page,
    
//     }));
//   };

//   return (
//     <>
//       <Header />
//       <Navbar />
//       <div>
//         <Latest />
//         <FeaturedBlogs />
//         <Pagination pagination={pagination} onPageChange={handlePageChange} />
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default Blogs;
"use client";
import React, { useState, useEffect } from "react";
import Header from "../components/Frontpage/Header";
import Navbar from "../components/Frontpage/Navbar";
import Footer from "../components/Frontpage/Footer";
import Latest from "./components/Latest";
import FeaturedBlogs from "./components/FeaturedBlogs";
import Pagination from "./components/Pagination";
import { getBlogs } from "../action";

const Blogs = () => {
  // const [pagination, setPagination] = useState({
  //   currentPage: 1,
  //   totalPages: 1,
  //   hasNextPage: false,
  //   hasPreviousPage: false,
  // });
  // const [Blogs, setBlogs] = useState([])
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(null);

  // useEffect(() => {
  //   loadPageNumber(pagination.currentPage); // Pass the current page directly here
  // }, [pagination.currentPage]);

  // const loadPageNumber = async (page) => {
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     console.log(`Fetching blogs for page: ${page}`); // Debugging
  //     const response = await getBlogs(page); // Use the updated page directly
  //     console.log("Response from getBlogs:", response);

  //     if (response && response.pagination) {
  //       setBlogs(response.items)
  //       console.log("look", response.pagination);
  //       setPagination((prev) => ({
  //         ...prev,
  //         ...response.pagination, // Update the pagination state with the new data
  //       }));
  //     } else {
  //       console.error("Pagination data not found in response:", response);
  //     }
  //   } catch (error) {
  //     setError("Failed to load blogs");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // // const handlePageChange = (page) => {
  // //   // Directly update `currentPage` in the pagination state
  // //   setPagination((prev) => ({
  // //     ...prev,
  // //     currentPage: page,
  // //   }));
  // // };

  // const handlePageChange = (page) => {
  //   if (page > 0 && page <= pagination.totalPages) {
  //     setPagination((prev) => ({
  //       ...prev,
  //       currentPage: page, // Update current page
  //     }));
  //   }
  // };

  return (
    <>
      <Header />
      <Navbar />
      <div>
        {/* {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : ( */}
          <>
            <Latest />
            <FeaturedBlogs title="Featured" subTitle="Blogs"/>
            {/* <Pagination pagination={pagination} onPageChange={handlePageChange} /> */}
          </>
        
      </div>
      <Footer />
    </>
  );
};

export default Blogs;
