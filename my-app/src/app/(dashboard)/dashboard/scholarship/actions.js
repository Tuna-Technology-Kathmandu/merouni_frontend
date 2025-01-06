// app/actions/scholarship.js
'use server'

export async function getAllScholarships() {
  try {
    const response = await fetch('http://localhost:5000/api/v1/scholarship', {
      cache: 'no-store'
    });
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error('Failed to fetch scholarships');
  }
}

export async function createScholarship(data) {
  try {
    const response = await fetch('http://localhost:5000/api/v1/scholarship', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    throw new Error('Failed to create scholarship');
  }
}

export async function updateScholarship(id, data) {
  try {
    const response = await fetch(`http://localhost:5000/api/v1/scholarship?scholarship_id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    throw new Error('Failed to update scholarship');
  }
}

export async function deleteScholarship(id) {
  try {
    const response = await fetch(`http://localhost:5000/api/v1/scholarship?scholarship_id=${id}`, {
      method: 'DELETE',
    });
    return await response.json();
  } catch (error) {
    throw new Error('Failed to delete scholarship');
  }
}