import { authFetch } from '@/app/utils/authFetch'

export async function createCollege(data) {
  const response = await authFetch(
    `${process.env.baseUrl}${process.env.version}/college`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to create college')
  }

  return response.json()
}

export const fetchUniversities = async () => {
  try {
    const response = await authFetch(
      `${process.env.baseUrl}${process.env.version}/university`
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

export const fetchCourse = async () => {
  try {
    const response = await authFetch(
      `${process.env.baseUrl}${process.env.version}/program`
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
