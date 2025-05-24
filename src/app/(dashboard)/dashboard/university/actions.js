import { authFetch } from '@/app/utils/authFetch'
import { University } from 'lucide-react'

export async function getUniversities(page = 1) {
  try {
    const response = await authFetch(
      `${process.env.baseUrl}${process.env.version}/university`,
      {
        cache: 'no-store'
      }
    )
    const data = await response.json()
    console.log('data', data)
    return data
  } catch (error) {
    throw new Error('Failed to fetch Universities')
  }
}

export async function createUniversity(data) {
  try {
    const response = await fetch(
      `${process.env.baseUrl}${process.env.version}/university`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }
    )
    return await response.json()
  } catch (error) {
    throw new Error('Failed to create university')
  }
}

export async function updateUniversity(id, data) {
  try {
    const response = await fetch(
      `${process.env.baseUrl}${process.env.version}/university?university_id=${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }
    )
    return await response.json()
  } catch (error) {
    throw new Error('Failed to update university')
  }
}

export async function deleteUniversity(id) {
  try {
    const response = await fetch(
      `${process.env.baseUrl}${process.env.version}/university?university_id=${id}`,
      {
        method: 'DELETE'
      }
    )
    return await response.json()
  } catch (error) {
    throw new Error('Failed to delete university')
  }
}
