'use server'

export async function fetchCategories(page = 1, limit = 10) {
  try {
    const response = await fetch(
      `http://localhost:5000/api/v1/category?limit=${limit}&page=${page}&sort=desc`,
      { cache: 'no-store' }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

export async function createCategory(data) {
  try {
    const response = await fetch('http://localhost:5000/api/v1/category', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create category');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
}

export async function updateCategory(categoryId, data) {
  try {
    const response = await fetch(`http://localhost:5000/api/v1/category?category_id=${categoryId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update category');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
}

export async function deleteCategory(categoryId) {
  try {
    const response = await fetch(`http://localhost:5000/api/v1/category?category_id=${categoryId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete category');
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
}
