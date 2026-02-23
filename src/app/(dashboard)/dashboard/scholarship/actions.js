// app/actions/scholarship.js

import { authFetch } from '@/app/utils/authFetch'

let url = `${process.env.baseUrl}/scholarship`

export async function getAllScholarships(page) {
  try {
    const response = await authFetch(`${url}?page=${page}`, {
      cache: 'no-store'
    })
    const data = await response.json()
    return data
  } catch (error) {
    throw new Error('Failed to fetch scholarships')
  }
}

export async function createScholarship(data) {
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
      `${process.env.baseUrl}/scholarship-application?scholarshipId=${scholarshipId}&page=${page}&limit=10`,
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
//for category search
export const fetchCategories = async (searchQuery = '') => {
  try {
    const response = await authFetch(
      `${process.env.baseUrl}/category${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''}`
    )
    if (!response.ok) {
      throw new Error('Failed to fetch categories')
    }
    const data = await response.json()
    return data.items
  } catch (error) {
    console.error(error)
    throw error
  }
}
