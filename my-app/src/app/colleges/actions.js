"use server";

// export async function getColleges(page = 1, sort = "ASC", filters = {}) {
//   try {
//     const queryParams = new URLSearchParams({
//       page: page,
//       degree: filters.disciplines?.join(","),
//       state: filters.state?.join(","),
//     });

//     console.log("Query params to string:", queryParams.toString());
//     const response = await fetch(
//       `${process.env.baseUrl}${
//         process.env.version
//       }/college?${queryParams.toString()}`,
//       {
//         cache: "no-store",
//       }
//     );

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data = await response.json();
//     console.log("Data response clz:", data);

//     return {
//       colleges: data.items.map((college) => ({
//         name: college.name,
//         location: `${college.address.city}, ${college.address.state}`,
//         description: college.description,
//         googleMapUrl: college.google_map_url,
//         instituteType: college.institute_type,
//         // logo: college.assets.featured_img,
//         // programmes: college.programmes,
//         slug: college.slugs,
//         collegeId: college.id,
//       })),
//       pagination: data.pagination || {
//         currentPage: 1,
//         totalPages: 1,
//         totalCount: data.items.length,
//       },
//     };
//   } catch (error) {
//     console.error("Failed to fetch colleges:", error);
//     return {
//       colleges: [],
//       pagination: {
//         currentPage: 1,
//         totalPages: 1,
//         totalCount: 0,
//       },
//     };
//   }
// }

export async function getColleges(page = 1, filters = {}) {
  try {
    // Initialize query parameters with page
    const queryParams = new URLSearchParams({
      page: page.toString(),
    });

    // Check if any filters are actually selected before applying them
    const hasActiveFilters =
      filters.disciplines?.length > 0 ||
      filters.states?.length > 0 ||
      filters.degrees?.length > 0 ||
      filters.affiliations?.length > 0;

    // Only add filter parameters if there are active filters
    if (hasActiveFilters) {
      if (filters.disciplines?.length > 0) {
        queryParams.append("degree", filters.disciplines.join(","));
      }
      if (filters.states?.length > 0) {
        queryParams.append("state", filters.states.join(","));
      }
    }

    // Log the final URL for debugging
    console.log(
      "Fetching URL:",
      `${process.env.baseUrl}${process.env.version
      }/college?${queryParams.toString()}`
    );

    const response = await fetch(
      `${process.env.baseUrl}${process.env.version
      }/college?${queryParams.toString()}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return {
      colleges: data.items.map((college) => ({
        name: college.name,
        location: `${college.address.city}, ${college.address.state}`,
        description: college.description,
        googleMapUrl: college.google_map_url,
        instituteType: college.institute_type,
        slug: college.slugs,
        collegeId: college.id,
        collegeImage: college.featured_img
      })),
      pagination: data.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalCount: data.items.length,
      },
    };
  } catch (error) {
    console.error("Failed to fetch colleges:", error);
    return {
      colleges: [],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalCount: 0,
      },
    };
  }
}

// export async function searchColleges(query) {
//   console.log(
//     "URL OF search:",
//     `${process.env.baseUrl}${process.env.version}/college?q=${query}`
//   );
//   try {
//     const response = await fetch(
//       `${process.env.baseUrl}${process.env.version}/college?q=${query}`,
//       {
//         cache: "no-store",
//       }
//     );

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data = await response.json();
//     console.log("College Search Results:", data);

//     // If no results found
//     if (!data[0]) {
//       return {
//         colleges: [],
//         pagination: data.pagination,
//       };
//     }

//     // const colleges = Object.keys(data)
//     //   .filter((key) => !isNaN(key)) // Only process numeric keys (actual college data)
//     //   .map((key) => {
//     //     const college = data[key];
//     //     return {
//     //       name: college.name,
//     //       location: `${college.address.city}, ${college.address.state}`,
//     //       description: college.description,
//     //       logo: college.college_logo,
//     //       instituteType: college.institute_type,
//     //       programmes: college.collegeCourses,
//     //     };
//     //   });
//     const colleges = data.items.map((clz) => {
//       return {
//         name: clz.name,
//         location: `${clz.address.city}, ${clz.address.state}`,
//         description: clz.description,
//         logo: clz.college_logo,
//         instituteType: clz.institute_type,
//         programmes: clz.collegeCourses,
//       };
//     });

//     return {
//       colleges,
//       pagination: data.pagination,
//     };
//   } catch (error) {
//     console.error("Failed to search colleges:", error);
//     return {
//       colleges: [],
//       pagination: {
//         currentPage: 1,
//         totalPages: 0,
//         totalCount: 0,
//         // hasNextPage: false,
//         // hasPreviousPage: false,
//       },
//     };
//   }
// }

export async function searchColleges(query) {
  console.log(
    "URL OF search:",
    `${process.env.baseUrl}${process.env.version}/college?q=${query}`
  );

  try {
    const response = await fetch(
      `${process.env.baseUrl}${process.env.version}/college?q=${query}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("College Search Results:", data);

    // Handle case where no colleges are found
    if (!data.items || data.items.length === 0) {
      return {
        colleges: [],
        pagination: data.pagination,
      };
    }

    const colleges = data.items.map((clz) => {
      return {
        id: clz.id,
        name: clz.name,
        location: `${clz.address.city}, ${clz.address.state}`,
        description: clz.description || "No description available.",
        logo: clz.college_logo || "default_logo.png", // Provide a fallback
        instituteType: clz.institute_type || "Unknown",
        instituteLevel: JSON.parse(clz.institute_level || "[]"), // Properly parse the field
        programmes: clz.collegeCourses.map((course) => ({
          id: course.id,
          title: course.program.title,
          slug: course.program.slugs,
        })),
      };
    });

    return {
      colleges,
      pagination: data.pagination,
    };
  } catch (error) {
    console.error("Failed to search colleges:", error);
    return {
      colleges: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalCount: 0,
      },
    };
  }
}

export async function getCollegeBySlug(slug) {
  try {
    // console.log("Fetching college details for slug:", slug);
    console.log(`${process.env.baseUrl}${process.env.version}/college/${slug}`);

    const response = await fetch(
      `${process.env.baseUrl}${process.env.version}/college/${slug}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    console.log("RESPOnse:", response);

    if (!response.ok) {
      throw new Error("Failed to fetch College Details");
    }

    const data = await response.json();
    console.log("Data:", data);
    return data.item;
  } catch (error) {
    console.error("Error fetching college details:", error);
    throw error;
  }
}
