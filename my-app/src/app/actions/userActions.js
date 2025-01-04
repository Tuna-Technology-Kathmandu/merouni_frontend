// app/actions/userActions.js
'use server'

export async function getUsers(page = 1) {
  try {
    const response = await fetch(
      `http://localhost:5000/api/v1/users?limit=9&page=${page}&sort=asc`,
      { cache: 'no-store' } // Ensure fresh data on each request
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    const data = await response.json();
    
    // Ensure the response has the expected structure
    return {
      items: data.items || [],
      pagination: {
        currentPage: page,
        totalPages: Math.ceil((data.total || 0) / 9), // Assuming 9 items per page
        total: data.total || 0
      }
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

export async function createUser(formData) {
  'use server'
  try {
    const userData = Object.fromEntries(formData);
    const response = await fetch('http://localhost:5000/api/v1/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Failed to create user');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function updateUser(userId, formData) {
  'use server'
  try {
    const userData = Object.fromEntries(formData);
    const response = await fetch(`http://localhost:5000/api/v1/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Failed to update user');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

export async function deleteUser(userId) {
  'use server'
  try {
    const response = await fetch(`http://localhost:5000/api/v1/users/${userId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete user');
    }

    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}