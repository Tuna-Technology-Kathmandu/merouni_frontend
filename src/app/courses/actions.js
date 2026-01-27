import axios from 'axios'
import { DotenvConfig } from '../config/env.config'

export const fetchCourses = async (
  credits = '',
  duration = '',
  faculty = '',
  page = 1,
  debouncedSearch
) => {
  try {
    const params = {}
    if (credits) params.credits = credits
    if (duration) params.duration = duration
    if (faculty) params.faculty = faculty
    if (page) params.page = page
    if (debouncedSearch) params.q = debouncedSearch

    const response = await axios.get(
      `${DotenvConfig.NEXT_APP_API_BASE_URL}/course?limit=12`,
      { params }
    )

    return response.data
  } catch (error) {
    console.error('Error fetching courses:', error)
    throw error
  }
}
