// app/actions/scholarship.js

import { authFetch } from '@/app/utils/authFetch'

let url = `${process.env.baseUrl}${process.env.version}/exam`

export async function getAllExams(page) {
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

export async function createExam(data) {
  try {
    console.log(`Exam Data : ${data}`)

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

export async function deleteExam(id) {
  try {
    const response = await authFetch(`${url}/${id}`, {
      method: 'DELETE'
    })
    const res = await response.json()
    return res
  } catch (error) {
    throw new Error(error)
  }
}

//for search university
export const fetchUniversities = async (searchQuery = '') => {
  try {
    const response = await authFetch(
      `${process.env.baseUrl}${process.env.version}/university${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''}`
    )
    if (!response.ok) {
      throw new Error('Failed to fetch universities')
    }
    const data = await response.json()
    return data.items
  } catch (error) {
    console.error(error)
    throw error
  }
}

//for level search
export const fetchLevel = async (searchQuery = '') => {
  try {
    const response = await authFetch(
      `${process.env.baseUrl}${process.env.version}/level${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''}`
    )
    if (!response.ok) {
      throw new Error('Failed to fetch level')
    }
    const data = await response.json()
    return data.items
  } catch (error) {
    console.error(error)
    throw error
  }
}
