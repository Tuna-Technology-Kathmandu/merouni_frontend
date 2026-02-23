import { authFetch } from '@/app/utils/authFetch'

export async function getAdmissions(page = 1, searchQuery = '') {
  try {
    const url = new URL(`${process.env.baseUrl}/college/admission`)
    url.searchParams.append('page', page)
    url.searchParams.append('limit', 10)
    if (searchQuery) url.searchParams.append('q', searchQuery)

    const response = await authFetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch admissions')
    }

    const data = await response.json()
    return {
      items: data.items || [],
      pagination: data.pagination || {
        currentPage: page,
        totalPages: 1,
        totalCount: 0
      }
    }
  } catch (error) {
    console.error('Error fetching admissions:', error)
    return { items: [], pagination: { currentPage: 1, totalPages: 1, totalCount: 0 } }
  }
}

export async function getAdmissionDetail(id) {
  try {
    const response = await authFetch(`${process.env.baseUrl}/college/admission/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch admission detail')
    }

    const data = await response.json()
    return data.item
  } catch (error) {
    console.error('Error fetching admission detail:', error)
    return null
  }
}

export async function createOrUpdateAdmission(data) {
  try {
    const response = await authFetch(`${process.env.baseUrl}/college/admission`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    const responseData = await response.json()
    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to save admission')
    }

    return responseData
  } catch (error) {
    console.error('Error saving admission:', error)
    throw error
  }
}

export async function deleteAdmission(id) {
  try {
    const response = await authFetch(`${process.env.baseUrl}/college/admission/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const responseData = await response.json()
    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to delete admission')
    }

    return responseData
  } catch (error) {
    console.error('Error deleting admission:', error)
    throw error
  }
}

export async function fetchColleges(searchQuery = '') {
  try {
    const response = await authFetch(`${process.env.baseUrl}/college?limit=100&q=${encodeURIComponent(searchQuery)}`)
    if (!response.ok) throw new Error('Failed to fetch colleges')
    const data = await response.json()
    return data.items
  } catch (error) {
    console.error('Error fetching colleges:', error)
    return []
  }
}

export async function fetchPrograms(searchQuery = '') {
  try {
    const response = await authFetch(`${process.env.baseUrl}/program?limit=100&q=${encodeURIComponent(searchQuery)}`)
    if (!response.ok) throw new Error('Failed to fetch programs')
    const data = await response.json()
    return data.items
  } catch (error) {
    console.error('Error fetching programs:', error)
    return []
  }
}
