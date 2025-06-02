'use server'

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
      page: page.toString()
    })

    // Only add filter parameters if provided
    if (filters.degree) {
      queryParams.append('degree', filters.degree)
    }

    if (filters.state) {
      queryParams.append('state', filters.state)
    }

    if (filters.uni) {
      queryParams.append('university', filters.uni)
    }

    // Log the final URL for debugging
    const url = `${process.env.baseUrl}${process.env.version}/college?${queryParams.toString()}`
    console.log('Fetching URL:', url)

    const response = await fetch(url, {
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    return {
      colleges: data.items.map((college) => ({
        name: college.name,
        location: `${college.address?.city || ''}, ${college.address?.state || ''}`,
        description: college.description,
        googleMapUrl: college.google_map_url,
        instituteType: college.institute_type,
        slug: college.slugs,
        collegeId: college.id,
        collegeImage: college.featured_img,
        logo: college.college_logo
      })),
      pagination: data.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalCount: data.items.length
      }
    }
  } catch (error) {
    console.error('Failed to fetch colleges:', error)
    return {
      colleges: [],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalCount: 0
      }
    }
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
    'URL OF search:',
    `${process.env.baseUrl}${process.env.version}/college?q=${query}`
  )

  try {
    const response = await fetch(
      `${process.env.baseUrl}${process.env.version}/college?q=${query}`,
      {
        cache: 'no-store'
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log('College Search Results:', data)

    // Handle case where no colleges are found
    if (!data.items || data.items.length === 0) {
      return {
        colleges: [],
        pagination: data.pagination
      }
    }

    const colleges = data.items.map((clz) => {
      return {
        id: clz.id,
        name: clz.name,
        slug: clz.slugs,
        location: `${clz.address.city}, ${clz.address.state}`,
        description: clz.description || 'No description available.',
        logo: clz.college_logo || 'default_logo.png', // Provide a fallback
        instituteType: clz.institute_type || 'Unknown',
        instituteLevel: JSON.parse(clz.institute_level || '[]'), // Properly parse the field
        programmes: clz.collegeCourses.map((course) => ({
          id: course.id,
          title: course.program.title,
          slug: course.program.slugs
        }))
      }
    })

    return {
      colleges,
      pagination: data.pagination
    }
  } catch (error) {
    console.error('Failed to search colleges:', error)
    return {
      colleges: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalCount: 0
      }
    }
  }
}

export async function getCollegeBySlug(slug) {
  try {
    // console.log("Fetching college details for slug:", slug);
    console.log(`${process.env.baseUrl}${process.env.version}/college/${slug}`)

    const response = await fetch(
      `${process.env.baseUrl}${process.env.version}/college/${slug}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      }
    )

    console.log('RESPOnse:', response)

    if (!response.ok) {
      throw new Error('Failed to fetch College Details')
    }

    const data = await response.json()
    console.log('Data:', data)
    return data.item
  } catch (error) {
    console.error('Error fetching college details:', error)
    throw error
  }
}

//to get degrees/program
export async function getPrograms() {
  try {
    const url = `${process.env.baseUrl}${process.env.version}/program`
    console.log('Fetching programs from:', url)

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    })

    console.log('Response:', response)

    if (!response.ok) {
      throw new Error('Failed to fetch Programs')
    }

    const data = await response.json()
    console.log('Data:', data)
    return data.items || [] // Adjust according to actual API structure
  } catch (error) {
    console.error('Error fetching programs:', error)
    throw error
  }
}

//for getting university name
export async function getUniversity() {
  try {
    const url = `${process.env.baseUrl}${process.env.version}/university`
    console.log('Fetching programs from:', url)

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    })

    console.log('Response:', response)

    if (!response.ok) {
      throw new Error('Failed to fetch Programs')
    }

    const data = await response.json()
    console.log('Data:', data)
    return data.items || [] // Adjust according to actual API structure
  } catch (error) {
    console.error('Error fetching programs:', error)
    throw error
  }
}
