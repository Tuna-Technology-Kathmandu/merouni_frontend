import { authFetch } from '@/app/utils/authFetch'

export async function fetchReferrals(page = 1) {
  try {
    const response = await authFetch(
      `${process.env.baseUrl}${process.env.version}/referral?page=${page}`,
      { cache: 'no-store' }
    )
    if (!response.ok) {
      throw new Error('Failed to fetch referrals')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching referrals:', error)
    throw error
  }
}

export async function updateReferralStatus(id, status, remarks = null) {
  try {
    const response = await authFetch(
      `${process.env.baseUrl}${process.env.version}/referral/${id}/status`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status, remarks })
      }
    )

    if (!response.ok) {
      throw new Error('Failed to update referral status')
    }

    return await response.json()
  } catch (error) {
    console.error('Error updating referral status:', error)
    throw error
  }
}

export async function deleteReferral(id) {
  try {
    const response = await authFetch(
      `${process.env.baseUrl}${process.env.version}/referral/${id}`,
      {
        method: 'DELETE'
      }
    )

    if (!response.ok) {
      throw new Error('Failed to delete referral')
    }

    return await response.json()
  } catch (error) {
    console.error('Error deleting referral:', error)
    throw error
  }
}
