import { authFetch } from '@/app/utils/authFetch'
import { DotenvConfig } from '@/config/env.config'

let url = `${DotenvConfig.NEXT_APP_API_BASE_URL}/faculty`

export async function getAllFaculty(page) {
  try {
    const response = await authFetch(`${url}?page=${page}`, {
      cache: 'no-store'
    })
    const data = await response.json()
    return data
  } catch (error) {
    throw new Error('Failed to fetch faculty data')
  }
}

export async function createFaculty(data) {
  try {
    const response = await authFetch(`${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    return await response.json()
  } catch (error) {
    throw new Error('Failed to create faculty')
  }
}

export async function updateFaculty(id, data) {
  try {
    const response = await authFetch(`${url}?faculty_id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    return await response.json()
  } catch (error) {
    throw new Error('Failed to update faculty')
  }
}

export async function deleteFaculty(id) {
  try {
    const response = await authFetch(`${url}?faculty_id=${id}`, {
      method: 'DELETE'
    })
    return await response.json()
  } catch (error) {
    throw new Error('Failed to delete faculty')
  }
}
