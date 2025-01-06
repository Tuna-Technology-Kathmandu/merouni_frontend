"use client";

import { useState, useEffect } from "react";
import {
  getAllFaculty,
  createFaculty,
  updateFaculty,
  deleteFaculty,
} from "./action";

export default function FacultyManager() {
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadFaculties();
  }, []);

  const loadFaculties = async () => {
    try {
      const response = await getAllFaculty();
      setFaculties(response.items);
    } catch (error) {
      console.error("Error loading faculties:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateFaculty(editingId, formData);
      } else {
        await createFaculty(formData);
      }
      setFormData({ title: "", description: "" });
      setEditingId(null);
      loadFaculties();
    } catch (error) {
      console.error("Error saving faculty:", error);
    }
  };

  const handleEdit = (faculty) => {
    setFormData({
      title: faculty.title,
      description: faculty.description,
    });
    setEditingId(faculty._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this faculty?")) {
      try {
        await deleteFaculty(id);
        loadFaculties();
      } catch (error) {
        console.error("Error deleting faculty:", error);
      }
    }
  };

  if (loading) return <div className="mx-auto">Loading...</div>;

  return (
    <div className="p-4 w-1/2 mx-auto">
      <h1 className="text-2xl font-bold mb-4">Faculty Management</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Faculty Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {editingId ? "Update Faculty" : "Add Faculty"}
        </button>
      </form>

      {/* List */}
      <div className="grid gap-4">
        {faculties.map((faculty) => (
          <div key={faculty._id} className="border p-4 rounded">
            <h3 className="font-bold">{faculty.title}</h3>
            <p className="text-gray-600">{faculty.description}</p>
            <div className="mt-2">
              <button
                onClick={() => handleEdit(faculty)}
                className="mr-2 text-blue-500 hover:text-blue-700"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(faculty._id)}
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
}
