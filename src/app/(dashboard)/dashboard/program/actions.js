import { authFetch } from '@/app/utils/authFetch'

export const fetchFaculties = async (searchQuery = '') => {
  try {
    const response = await authFetch(
      `${process.env.baseUrl}/faculty${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''}`
    )

    if (!response.ok) {
      throw new Error('Failed to fetch faculties')
    }
    const data = await response.json()
    return data.items
  } catch (error) {
    console.error(error)
    throw error
  }
}

//for level search
export const fetchLevel = async (searchQuery = '') => {
  try {
    const response = await authFetch(
      `${process.env.baseUrl}/level${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''}`
    )
    if (!response.ok) {
      throw new Error('Failed to fetch level')
    }
    const data = await response.json()
    return data.items
  } catch (error) {
    console.error(error)
    throw error
  }
}

//fetch course
export const fetchCourse = async (searchQuery = '') => {
  try {
    const response = await authFetch(
      `${process.env.baseUrl}/course${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''}`
    )

    if (!response.ok) {
      throw new Error('Failed to fetch universities')
    }
    const data = await response.json()
    return data.items
  } catch (error) {
    console.error(error)
    throw error
  }
}

//fetch scholarship
export const fetchScholarship = async (searchQuery = '') => {
  try {
    const response = await authFetch(
      `${process.env.baseUrl}/scholarship${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''}`
    )

    if (!response.ok) {
      throw new Error('Failed to fetch scholarships')
    }
    const data = await response.json()
    return data.scholarships
  } catch (error) {
    console.error(error)
    throw error
  }
}

//fetch Exams

export const fetchExam = async (searchQuery = '') => {
  try {
    const response = await authFetch(
      `${process.env.baseUrl}/exam${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''}`
    )

    if (!response.ok) {
      throw new Error('Failed to fetch exams')
    }
    const data = await response.json()
    return data.items
  } catch (error) {
    console.error(error)
    throw error
  }
}

// fetch degrees for program form
export const fetchDegrees = async (searchQuery = '') => {
  try {
    const response = await authFetch(
      `${process.env.baseUrl}/degree${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : '?limit=100'}`
    )
    if (!response.ok) throw new Error('Failed to fetch degrees')
    const data = await response.json()
    return data.items || []
  } catch (error) {
    console.error(error)
    throw error
  }
}
