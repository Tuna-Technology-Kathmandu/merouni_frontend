import { authFetch } from '@/app/utils/authFetch'
import { DotenvConfig } from '@/config/env.config'

export const fetchStudentConsultancyApplications = async () => {
  try {
    const url = `${DotenvConfig.NEXT_APP_API_BASE_URL}/consultancy-application/user/applications`

    const response = await authFetch(url, {
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error('Failed to fetch consultancy applications')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching consultancy applications:', error)
    throw error
  }
}
