"use server";

export async function getColleges(page = 1, sort = "ASC") {
  try {
    const response = await fetch(
        `${process.env.baseUrl}${process.env.version}/college?page=${page}`,
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
        name: college.fullname,
        location: `${college.address.city}, ${college.address.state}`,
        description: college.description,
        logo: college.assets.featuredImage,
        contactInfo: college.contactInfo,
        facilities: college.facilities,
        instituteType: college.instituteType,
        programmes: college.programmes,
        collegeId: college._id,
      })),
      pagination: data.pagination,
    };
  } catch (error) {
    console.error("Failed to fetch colleges:", error);
    return {
      colleges: [],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalRecords: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
  }
}

export async function searchColleges(query) {
  try {
    const response = await fetch(
     `${process.env.baseUrl}${process.env.version}/college/search?q=${encodeURIComponent(
        query
      )}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // If no results found
    if (!data[0]) {
      return {
        colleges: [],
        pagination: data.pagination,
      };
    }

    const colleges = Object.keys(data)
      .filter((key) => !isNaN(key)) // Only process numeric keys (actual college data)
      .map((key) => {
        const college = data[key];
        return {
          name: college.fullname,
          location: `${college.address.city}, ${college.address.state}`,
          description: college.description,
          logo: college.assets.featuredImage,
          contactInfo: college.contactInfo,
          facilities: college.facilities,
          instituteType: college.instituteType,
          programmes: college.programmes,
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
        totalRecords: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
  }
}
