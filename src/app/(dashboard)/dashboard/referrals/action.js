import { authFetch } from '@/app/utils/authFetch'

export async function fetchReferrals({
  page = 1,
  limit = 10,
  q = '',
  status = '',
  college_id = '',
  isStudent = false
}) {
  try {
    const params = new URLSearchParams()
    if (page) params.append('page', page)
    if (limit) params.append('limit', limit)
    if (q) params.append('q', q)
    if (status) params.append('status', status)
    if (college_id) params.append('college_id', college_id)

    const endpoint = isStudent
      ? `/referral/user/referrals?${params.toString()}`
      : `/referral?${params.toString()}`

    const response = await authFetch(
      `${process.env.baseUrl}${endpoint}`,
      { cache: 'no-store' }
    )
    if (!response.ok) {
      throw new Error('Failed to fetch referrals')
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching referrals:', error)
    throw error
  }
}

export async function updateReferralStatus(id, status, remarks = null) {
  try {
    const response = await authFetch(
      `${process.env.baseUrl}/referral/${id}/status`,
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
      `${process.env.baseUrl}/referral/${id}`,
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

export async function fetchColleges(searchQuery = '') {
  try {
    const response = await authFetch(
      `${process.env.baseUrl}/college?limit=100&q=${encodeURIComponent(searchQuery)}`
    )
    if (!response.ok) throw new Error('Failed to fetch colleges')
    const data = await response.json()
    return data.items
  } catch (error) {
    console.error('Error fetching colleges:', error)
    return []
  }
}
