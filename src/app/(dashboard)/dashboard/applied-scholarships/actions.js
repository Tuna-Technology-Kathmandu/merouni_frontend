import { authFetch } from '@/app/utils/authFetch'
import { DotenvConfig } from '@/config/env.config'

export const fetchStudentScholarshipApplications = async (query = {}) => {
  try {
    const queryParams = new URLSearchParams()

    if (query.page) queryParams.append('page', query.page)
    if (query.limit) queryParams.append('limit', query.limit)
    if (query.status) queryParams.append('status', query.status)

    const url = `${DotenvConfig.NEXT_APP_API_BASE_URL}/scholarship-application/my-applications${queryParams.toString() ? '?' + queryParams.toString() : ''}`

    const response = await authFetch(url, {
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error('Failed to fetch scholarship applications')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching scholarship applications:', error)
    throw error
  }
}

export const deleteScholarshipApplication = async (applicationId) => {
  try {
    const { authFetch } = await import('@/app/utils/authFetch')
    const response = await authFetch(
      `${DotenvConfig.NEXT_APP_API_BASE_URL}/scholarship-application/${applicationId}`,
      {
        method: 'DELETE',
        cache: 'no-store'
      }
    )

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.message || data.error || 'Failed to delete application')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error deleting scholarship application:', error)
    throw error
  }
}
