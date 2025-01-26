'use server'

export async function getAllFaculty() {
  try {
    const response = await fetch('http://localhost:8000/api/v1/faculty', {
      cache: 'no-store'
    });
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error('Failed to fetch faculty data');
  }
}

export async function createFaculty(data) {
  try {
    const response = await fetch('http://localhost:8000/api/v1/faculty', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    throw new Error('Failed to create faculty');
  }
}

export async function updateFaculty(id, data) {
  try {
    const response = await fetch(`http://localhost:8000/api/v1/faculty?id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    throw new Error('Failed to update faculty');
  }
}

export async function deleteFaculty(id) {
  try {
    const response = await fetch(`http://localhost:8000/api/v1/faculty?id=${id}`, {
      method: 'DELETE',
    });
    return await response.json();
  } catch (error) {
    throw new Error('Failed to delete faculty');
  }
}