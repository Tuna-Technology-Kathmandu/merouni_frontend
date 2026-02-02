import { authFetch } from '@/app/utils/authFetch'
import { DotenvConfig } from '@/config/env.config'

export async function fetchConsultancyApplications(params = {}) {
  try {
    const query = new URLSearchParams(params).toString()
    const response = await authFetch(
      `${DotenvConfig.NEXT_APP_API_BASE_URL}/consultancy-application/all?${query}`,
      { cache: 'no-store' }
    )
    if (!response.ok) {
      throw new Error('Failed to fetch consultancy applications')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching applications:', error)
    throw error
  }
}

export async function fetchAllConsultancies() {
  try {
    const response = await authFetch(`${DotenvConfig.NEXT_APP_API_BASE_URL}/consultancy`, { cache: 'no-store' })
    if (response.ok) return await response.json()
  } catch (error) {
    console.error('Error fetching consultancies:', error)
    return []
  }
}

export async function updateConsultancyApplicationStatus(id, status, remarks = null) {
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
      throw new Error('Failed to update status')
    }

    return await response.json()
  } catch (error) {
    console.error('Error updating status:', error)
    throw error
  }
}

export async function deleteConsultancyApplication(id) {
  try {
    const response = await authFetch(
      `${DotenvConfig.NEXT_APP_API_BASE_URL}/consultancy-application/${id}`,
      {
        method: 'DELETE'
      }
    )

    if (!response.ok) {
      throw new Error('Failed to delete application')
    }

    return await response.json()
  } catch (error) {
    console.error('Error deleting application:', error)
    throw error
  }
}
