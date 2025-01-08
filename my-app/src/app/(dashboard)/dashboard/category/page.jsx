// 'use client'

// import { useState, useEffect } from 'react';
// import { fetchCategories, createCategory, updateCategory, deleteCategory } from './action';

// const Page = () => {
//   const [categories, setCategories] = useState([]);
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [editingCategory, setEditingCategory] = useState(null);

//   useEffect(() => {
//     loadCategories();
//   }, []);

//   const loadCategories = async () => {
//     try {
//       const response = await fetchCategories();
//       setCategories(response.items);
//     } catch (err) {
//       setError('Failed to load categories');
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     try {
//       if (editingCategory) {
//         await updateCategory(editingCategory._id, { title, description });
//       } else {
//         await createCategory({ title, description });
//       }
//       setTitle('');
//       setDescription('');
//       setEditingCategory(null);
//       await loadCategories();
//     } catch (err) {
//       setError(`Failed to ${editingCategory ? 'update' : 'create'} category`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (category) => {
//     setEditingCategory(category);
//     setTitle(category.title);
//     setDescription(category.description || '');
//   };

//   const handleDelete = async (categoryId) => {
//     if (!window.confirm('Are you sure you want to delete this category?')) {
//       return;
//     }

//     setLoading(true);
//     try {
//       await deleteCategory(categoryId);
//       await loadCategories();
//     } catch (err) {
//       setError('Failed to delete category');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCancel = () => {
//     setEditingCategory(null);
//     setTitle('');
//     setDescription('');
//   };

//   return (
//     <div className="w-1/2 mx-auto p-4">
//       <form onSubmit={handleSubmit} className="space-y-4 mb-8">
//         <div>
//           <label htmlFor="title" className="block mb-2">
//             Category Title
//           </label>
//           <input
//             type="text"
//             id="title"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             className="w-full border p-2 rounded"
//             required
//           />
//         </div>
        
//         <div>
//           <label htmlFor="description" className="block mb-2">
//             Description
//           </label>
//           <textarea
//             id="description"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             className="w-full border p-2 rounded"
//             rows={3}
//           />
//         </div>

//         {error && (
//           <div className="text-red-500">{error}</div>
//         )}

//         <div className="flex gap-2">
//           <button
//             type="submit"
//             disabled={loading}
//             className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
//           >
//             {loading ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}
//           </button>

//           {editingCategory && (
//             <button
//               type="button"
//               onClick={handleCancel}
//               className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
//             >
//               Cancel
//             </button>
//           )}
//         </div>
//       </form>

//       <div className="space-y-4">
//         <h2 className="text-xl font-bold">Categories</h2>
//         {categories.map((category) => (
//           <div key={category._id} className="border p-4 rounded flex justify-between items-start">
//             <div>
//               <h3 className="font-semibold">{category.title}</h3>
//               <p className="text-gray-600">{category.description}</p>
//               <p className="text-sm text-gray-500">
//                 Created: {new Date(category.createdAt).toLocaleDateString()}
//               </p>
//             </div>
//             <div className="flex gap-2">
//               <button
//                 onClick={() => handleEdit(category)}
//                 className="text-blue-500 hover:text-blue-700"
//               >
//                 Edit
//               </button>
//               <button
//                 onClick={() => handleDelete(category._id)}
//                 className="text-red-500 hover:text-red-700"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Page;
"use client";
import { useState, useEffect, useMemo } from "react";
import { fetchCategories, createCategory, updateCategory, deleteCategory } from "./action";
import Loader from "@/app/components/Loading";
import Table from "../../../components/Table";
import { Edit2, Trash2 } from "lucide-react";

export default function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);

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
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await fetchCategories();
      setCategories(response.items);
    } catch (err) {
      setError("Failed to load categories");
      console.error("Error loading categories:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateCategory(editingId, formData);
      } else {
        await createCategory(formData);
      }
      setFormData({ title: "", description: "" });
      setEditingId(null);
      setError(null);
      loadCategories();
    } catch (err) {
      setError(`Failed to ${editingId ? "update" : "create"} category`);
      console.error("Error saving category:", err);
    }
  };

  const handleEdit = (category) => {
    setFormData({
      title: category.title,
      description: category.description || "",
    });
    setEditingId(category._id);
    setError(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory(id);
        loadCategories();
        setError(null);
      } catch (err) {
        setError("Failed to delete category");
        console.error("Error deleting category:", err);
      }
    }
  };

  if (loading) return <div className="mx-auto"><Loader /></div>;

  return (
    <div className="p-4 w-4/5 mx-auto">
      <h1 className="text-2xl font-bold mb-4">Category Management</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Category Title"
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
        {error && (
          <div className="text-red-500 mb-4">{error}</div>
        )}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {editingId ? "Update Category" : "Add Category"}
        </button>
      </form>

      {/* Table */}
      <Table data={categories} columns={columns} />
    </div>
  );
}