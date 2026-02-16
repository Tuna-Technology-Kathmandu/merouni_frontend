'use server'

import { authFetch } from "../utils/authFetch"


export async function getColleges(page = 1, filters = {}) {
  try {
    // Initialize query parameters with page
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: filters.limit ? filters.limit.toString() : '24'
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
    if (filters.level) {
      queryParams.append('type', filters.level)
    }

    // Log the final URL for debugging
    const url = `${process.env.baseUrl}/college?${queryParams.toString()}`

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

export async function searchColleges(query) {
  try {
    const response = await fetch(
      `${process.env.baseUrl}/college?q=${query}`,
      {
        cache: 'no-store'
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

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
        collegeImage: clz.featured_img,
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
    const response = await fetch(
      `${process.env.baseUrl}/college/${slug}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch College Details')
    }

    const data = await response.json()
    return data.item
  } catch (error) {
    console.error('Error fetching college details:', error)
    throw error
  }
}

//to get degrees/program
export async function getPrograms(searchQuery = '') {
  try {
    // Build query string
    const queryParams = new URLSearchParams()
    if (searchQuery) {
      queryParams.append('q', searchQuery) // Assuming your API supports `q` for search
    }

    const url = `${process.env.baseUrl}/program?${queryParams.toString()}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error('Failed to fetch Programs')
    }

    const data = await response.json()
    return data.items || [] // Adjust if your API returns differently
  } catch (error) {
    console.error('Error fetching programs:', error)
    return []
  }
}

//for getting university name
export async function getUniversity(searchQuery = '') {
  try {
    // Add query param if searching
    const queryParams = new URLSearchParams()
    if (searchQuery) {
      queryParams.append('q', searchQuery) // or change 'q' to whatever your API expects
    }

    const url = `${process.env.baseUrl}/university?${queryParams.toString()}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error('Failed to fetch universities')
    }

    const data = await response.json()
    return data.items || []
  } catch (error) {
    console.error('Error fetching universities:', error)
    return []
  }
}
// check if already applied
export async function checkIfApplied(collegeId, token) {
  try {


    if (!response.ok) {
      
      const errorData = await response.json()
      return { error: errorData.error || errorData.message || 'Failed to check status' }
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error checking application status:', error)
    return { error: error.message }
  }
}
