import { authFetch } from '@/app/utils/authFetch'
import { DotenvConfig } from '@/config/env.config'

export async function fetchConsultancyApplications() {
  try {
    const response = await authFetch(
      `${DotenvConfig.NEXT_APP_API_BASE_URL}/consultancy-application/all`,
      { cache: 'no-store' }
    )
    if (!response.ok) {
      throw new Error('Failed to fetch consultancy applications')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching consultancy applications:', error)
    throw error
  }
}

export async function updateApplicationStatus(id, status, remarks = null) {
  try {
    const response = await authFetch(
      `${DotenvConfig.NEXT_APP_API_BASE_URL}/consultancy-application/${id}/status`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status, remarks })
      }
    )

    if (!response.ok) {
      throw new Error('Failed to update application status')
    }

    return await response.json()
  } catch (error) {
    console.error('Error updating application status:', error)
    throw error
  }
}
