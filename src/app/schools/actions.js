'use server'
import { DotenvConfig } from '../../config/env.config'

export async function getColleges(page = 1, sort = 'ASC') {
  try {
    const response = await fetch(
      `${DotenvConfig.NEXT_APP_API_BASE_URL}/college/list-school?page=${page}&sort=${sort}&limit=24`,
      {
        cache: 'no-store'
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    return {
      colleges: data.items.map((college) => ({
        name: college.name,
        description: college.description,
        googleMapUrl: college.google_map_url,
        instituteType: college.institute_type,
        slug: college.slugs,
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

export async function searchColleges(query, page = 1) {
  try {
    const response = await fetch(
      `${DotenvConfig.NEXT_APP_API_BASE_URL}/college/search?q=${encodeURIComponent(query)}&page=${page}&limit=24`,
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

export async function getCollegeBySlug(slug) {
  try {
    // console.log("Fetching college details for slug:", slug);
    console.log(`${DotenvConfig.NEXT_APP_API_BASE_URL}/college/${slug}`)

    const response = await fetch(
      `${DotenvConfig.NEXT_APP_API_BASE_URL}/college/${slug}`,
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
