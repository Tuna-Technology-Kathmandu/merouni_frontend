'use server'

export async function getSchools(page = 1, sort = 'ASC') {
  try {
    const response = await fetch(
      `${process.env.baseUrl}/school?page=${page}&sort=${sort}&limit=24`,
      {
        cache: 'no-store'
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    return {
      schools: data.items.map((school) => ({
        name: school.name,
        description: school.description,
        googleMapUrl: school.google_map_url,
        instituteType: school.institute_type,
        slug: school.slugs,
        collegeId: college.id
      })),
      pagination: data.pagination || {
        currentPage: page,
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

export async function searchSchools(query, page = 1) {
  try {
    const response = await fetch(
      `${process.env.baseUrl}/school/search?q=${encodeURIComponent(query)}&page=${page}&limit=24`,
      {
        cache: 'no-store'
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (!data[0] && !data.items) {
      return { colleges: [], pagination: data.pagination }
    }

    const colleges = (data.items || Object.values(data))
      .filter((c) => c && c.fullname)
      .map((college) => ({
        name: college.fullname,
        location: `${college.address?.city || ''}, ${college.address?.state || ''}`,
        description: college.description,
        logo: college.assets?.featuredImage,
        contactInfo: college.contactInfo,
        facilities: college.facilities,
        instituteType: college.instituteType,
        programmes: college.programmes
      }))

    return {
      colleges,
      pagination: data.pagination || {
        currentPage: page,
        totalPages: 1,
        totalRecords: colleges.length,
        hasNextPage: false,
        hasPreviousPage: false
      }
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

export async function getSchoolBySlug(slug) {
  try {

    const response = await fetch(
      `${process.env.baseUrl}/school/${slug}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      }
    )


    if (!response.ok) {
      throw new Error('Failed to fetch School Details')
    }

    const data = await response.json()
    return data.item
  } catch (error) {
    console.error('Error fetching  school details:', error)
    throw error
  }
}
