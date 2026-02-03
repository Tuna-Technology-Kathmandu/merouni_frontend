// app/actions/userActions.js

import { authFetch } from '../utils/authFetch'

export async function getUsers(page = 1, token) {
  if (!token) {
    throw new Error('No authentication token provided')
  }
  try {
    const response = await authFetch(
      `${process.env.baseUrl}/users?page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        cache: 'no-store'
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch users')
    }

    const data = await response.json()

    // Ensure the response has the expected structure
    return {
      items: data.items || [],
      // pagination: {
      //   currentPage: page,
      //   totalPages: Math.ceil((data.total || 0) / 9), // Assuming 9 items per page
      //   total: data.total || 0,
      // },
      pagination: data.pagination
    }
  } catch (error) {
    console.error('Error fetching users:', error)
    throw error
  }
}

export async function createUser(formData) {
  try {
    const response = await fetch(
      `${process.env.baseUrl}/auth/register`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      }
    )

    return await response.json()
  } catch (error) {
    throw new Error(error.message || 'Failed to create user')
  }
}

export async function updateUser(userId, formData) {
  try {
    const response = await authFetch(
      `${process.env.baseUrl}/users/edit-profile?user_id=${userId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      }
    )

    if (!response.ok) {
      throw new Error('Failed to update user')
    }

    return await response.json()
  } catch (error) {
    console.error('Error updating user:', error)
    throw error
  }
}

export async function deleteUser(userId, userData) {
  try {
    const response = await authFetch(
      `${process.env.baseUrl}/users`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: userId,
          role: userData?.role
        })
      }
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Failed to delete user')
    }

    return true
  } catch (error) {
    console.error('Error deleting user:', error)
    throw error
  }
}
