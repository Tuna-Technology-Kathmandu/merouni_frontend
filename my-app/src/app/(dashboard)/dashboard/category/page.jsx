'use client'

import { useState, useEffect } from 'react';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from './action';

const Page = () => {
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await fetchCategories();
      setCategories(response.items);
    } catch (err) {
      setError('Failed to load categories');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (editingCategory) {
        await updateCategory(editingCategory._id, { title, description });
      } else {
        await createCategory({ title, description });
      }
      setTitle('');
      setDescription('');
      setEditingCategory(null);
      await loadCategories();
    } catch (err) {
      setError(`Failed to ${editingCategory ? 'update' : 'create'} category`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setTitle(category.title);
    setDescription(category.description || '');
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
    }

    setLoading(true);
    try {
      await deleteCategory(categoryId);
      await loadCategories();
    } catch (err) {
      setError('Failed to delete category');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingCategory(null);
    setTitle('');
    setDescription('');
  };

  return (
    <div className="w-1/2 mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div>
          <label htmlFor="title" className="block mb-2">
            Category Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 rounded"
            rows={3}
          />
        </div>

        {error && (
          <div className="text-red-500">{error}</div>
        )}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}
          </button>

          {editingCategory && (
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Categories</h2>
        {categories.map((category) => (
          <div key={category._id} className="border p-4 rounded flex justify-between items-start">
            <div>
              <h3 className="font-semibold">{category.title}</h3>
              <p className="text-gray-600">{category.description}</p>
              <p className="text-sm text-gray-500">
                Created: {new Date(category.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(category)}
                className="text-blue-500 hover:text-blue-700"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(category._id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;