import { DotenvConfig } from "@/config/env.config"

export async function getExams(page = 1, search = '', examType = '', level = '', affiliation = '', faculty = '') {
  try {
    const url = new URL(`${DotenvConfig.NEXT_APP_API_BASE_URL}/exam`)
    url.searchParams.append('page', page)
    url.searchParams.append('limit', 15)

    if (search) url.searchParams.append('q', search)
    if (examType) url.searchParams.append('examType', examType)
    if (level) url.searchParams.append('level', level)
    if (affiliation) url.searchParams.append('affiliation', affiliation)
    if (faculty) url.searchParams.append('faculty', faculty)

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch exams')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching exams:', error)
    throw error
  }
}

export const fetchFaculties = async () => {
  try {
    const response = await fetch(`${DotenvConfig.NEXT_APP_API_BASE_URL}/faculty`)
    if (!response.ok) throw new Error('Failed to fetch faculties')
    const data = await response.json()
    return data.items
  } catch (error) {
    console.error('Error fetching faculties:', error)
    return []
  }
}

export const fetchLevels = async () => {
  try {
    const response = await fetch(`${DotenvConfig.NEXT_APP_API_BASE_URL}/level`)
    if (!response.ok) throw new Error('Failed to fetch levels')
    const data = await response.json()
    return data.items
  } catch (error) {
    console.error('Error fetching levels:', error)
    return []
  }
}

export const fetchUniversities = async () => {
  try {
    const response = await fetch(`${DotenvConfig.NEXT_APP_API_BASE_URL}/university`)
    if (!response.ok) throw new Error('Failed to fetch universities')
    const data = await response.json()
    return data.items
  } catch (error) {
    console.error('Error fetching universities:', error)
    return []
  }
}
