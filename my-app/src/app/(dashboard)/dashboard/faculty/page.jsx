"use client";
import { useState, useEffect, useMemo } from "react";
import {
  getAllFaculty,
  createFaculty,
  updateFaculty,
  deleteFaculty,
} from "./action";
import Loader from "@/app/components/Loading";
import Table from "../../../components/Table"; // Adjust the import path as needed
import { Edit2, Trash2 } from "lucide-react"; // For action icons

export default function FacultyManager() {
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [editingId, setEditingId] = useState(null);

  // Define columns with actions
  const columns = useMemo(
    () => [
      {
        header: "Title",
        accessorKey: "title",
      },
      {
        header: "Description",
        accessorKey: "description",
      },
      {
        header: "Author",
        accessorFn: (row) => `${row.author.firstName} ${row.author.lastName}`,
      },
      {
        header: "Created At",
        accessorKey: "createdAt",
        cell: ({ getValue }) => {
          return new Date(getValue()).toLocaleDateString();
        },
      },
      {
        header: "Actions",
        id: "actions",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <button
              onClick={() => handleEdit(row.original)}
              className="p-1 text-blue-600 hover:text-blue-800"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(row.original._id)}
              className="p-1 text-red-600 hover:text-red-800"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ),
      },
    ],
    []
  );

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

  if (loading) return <div className="mx-auto"><Loader /></div>;

  return (
    <div className="p-4 w-4/5 mx-auto">
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

      {/* Table */}
      <Table data={faculties} columns={columns} />
    </div>
  );
}