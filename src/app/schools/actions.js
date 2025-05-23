'use server'

export async function getColleges(page = 1, sort = 'ASC') {
  try {
    const response = await fetch(
      `${process.env.baseUrl}${process.env.version}/college/list-school`,
      {
        cache: 'no-store'
      }
    )
    console.log(response)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    return {
      colleges: data.items.map((college) => ({
        name: college.name,
        //location: `${college.address.city}, ${college.address.state}`,
        description: college.description,
        googleMapUrl: college.google_map_url,
        instituteType: college.institute_type,
        // logo: college.assets.featured_img,
        // programmes: college.programmes,
        slug: college.slugs,
        collegeId: college.id
      })),
      pagination: data.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalRecords: data.items.length,
        hasNextPage: false,
        hasPreviousPage: false
      }
    }
  } catch (error) {
    console.error('Failed to fetch colleges:', error)
    return {
      colleges: [],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalRecords: 0,
        hasNextPage: false,
        hasPreviousPage: false
      }
    }
  }
}

export async function searchColleges(query) {
  try {
    const response = await fetch(
      `${process.env.baseUrl}${
        process.env.version
      }/college/search?q=${encodeURIComponent(query)}`,
      {
        cache: 'no-store'
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    // If no results found
    if (!data[0]) {
      return {
        colleges: [],
        pagination: data.pagination
      }
    }

    const colleges = Object.keys(data)
      .filter((key) => !isNaN(key)) // Only process numeric keys (actual college data)
      .map((key) => {
        const college = data[key]
        return {
          name: college.fullname,
          location: `${college.address.city}, ${college.address.state}`,
          description: college.description,
          logo: college.assets.featuredImage,
          contactInfo: college.contactInfo,
          facilities: college.facilities,
          instituteType: college.instituteType,
          programmes: college.programmes
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
        totalRecords: 0,
        hasNextPage: false,
        hasPreviousPage: false
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
