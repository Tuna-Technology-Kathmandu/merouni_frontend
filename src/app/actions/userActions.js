// app/actions/userActions.js

import { authFetch } from '../utils/authFetch'

export async function getUsers(page = 1, token, role) {
  try {
    const response = await authFetch(
      `${process.env.baseUrl}${process.env.version}/users?page=${page}`,
      {
        headers: {
          // Authorization: `Bearer ${token}`,
          Role: role.join(',')
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
    // const userData = Object.fromEntries(formData);
    console.log('FORM Data:', formData)

    const response = await fetch(
      `${process.env.baseUrl}${process.env.version}/auth/register`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      }
    )

    if (!response.ok) {
      throw new Error('Failed to create user')
    }

    return await response.json()
  } catch (error) {
    console.error('Error creating user:', error)
    throw error
  }
}

export async function updateUser(userId, formData) {
  try {
    const userData = Object.fromEntries(formData)
    const response = await fetch(
      `${process.env.baseUrl}${process.env.version}/users/${userId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
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

export async function deleteUser(userId) {
  try {
    const response = await fetch(
      `${process.env.baseUrl}${process.env.version}/users/${userId}`,
      {
        method: 'DELETE'
      }
    )

    if (!response.ok) {
      throw new Error('Failed to delete user')
    }

    return true
  } catch (error) {
    console.error('Error deleting user:', error)
    throw error
  }
}
