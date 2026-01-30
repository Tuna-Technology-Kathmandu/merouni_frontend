// app/actions/scholarship.js

import { authFetch } from '@/app/utils/authFetch'
import { DotenvConfig } from '@/config/env.config'

let url = `${DotenvConfig.NEXT_APP_API_BASE_URL}/scholarship`

export async function getAllScholarships(page) {
  try {
    const response = await authFetch(`${url}?page=${page}`, {
      cache: 'no-store'
    })
    const data = await response.json()
    console.log('data', data)
    return data
  } catch (error) {
    throw new Error('Failed to fetch scholarships')
  }
}

export async function createScholarship(data) {
  try {
    console.log(`Scholarship Data : ${data}`)

    const response = await authFetch(`${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    return await response.json()
  } catch (error) {
    throw new Error('Failed to create scholarship')
  }
}

export async function updateScholarship(id, data) {
  try {
    const response = await authFetch(`${url}?scholarship_id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    return await response.json()
  } catch (error) {
    throw new Error('Failed to update scholarship')
  }
}

export async function deleteScholarship(id) {
  try {
    const response = await authFetch(`${url}?scholarship_id=${id}`, {
      method: 'DELETE'
    })
    const res = await response.json()
    return res
  } catch (error) {
    throw new Error(error)
  }
}

export async function getScholarshipApplications(scholarshipId, page = 1) {
  try {
    const response = await authFetch(
      `${DotenvConfig.NEXT_APP_API_BASE_URL}/scholarship-application?scholarshipId=${scholarshipId}&page=${page}&limit=10`,
      {
        cache: 'no-store'
      }
    )
    if (!response.ok) {
      throw new Error('Failed to fetch applications')
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching scholarship applications:', error)
    throw error
  }
}
