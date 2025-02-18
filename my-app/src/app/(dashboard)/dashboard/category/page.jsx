"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { fetchCategories, deleteCategory } from "./action";
import Loader from "@/app/components/Loading";
import Table from "../../../components/Table";
import { Edit2, Trash2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { authFetch } from "@/app/utils/authFetch";
import ConfirmationDialog from "../addCollege/ConfirmationDialog";

export default function CategoryManager() {
  const author_id = useSelector((state) => state.user.data.id);

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      author: author_id,
    },
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
  });

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
        cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(),
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
              onClick={() => handleDeleteClick(row.original.id)}
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadCategories = async (page = 1) => {
    try {
      const response = await fetchCategories(page);
      setCategories(response.items);
      setPagination({
        currentPage: response.pagination.currentPage,
        totalPages: response.pagination.totalPages,
        total: response.pagination.totalCount,
      });
    } catch (err) {
      toast.error("Failed to load categories");
      console.error("Error loading categories:", err);
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (data) => {
    try {
      const response = await authFetch(
        `${process.env.baseUrl}${process.env.version}/category`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to create category");
      }
      return await response.json();
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  };

  const updateCategory = async (data, id) => {
    try {
      console.log("Updating category with data:", data, "and id:", id);
      const response = await authFetch(
        `${process.env.baseUrl}${process.env.version}/category?category_id=${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update category");
      }
      return await response.json();
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  };

  // Use react-hook-form's handleSubmit to process the form data.
  const onSubmit = async (data) => {
    try {
      if (editingId) {
        // Update category if in edit mode
        await updateCategory(data, editingId);
        toast.success("Category updated successfully");
      } else {
        // Otherwise, create a new category
        await createCategory(data);
        toast.success("Category created successfully");
      }
      reset(); // Clear form
      setEditingId(null);
      loadCategories(); 
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Network error occurred";
      toast.error(
        `Failed to ${editingId ? "update" : "create"} category: ${errorMsg}`
      );
      console.error("Error saving category:", err);
    }
  };

  const handleEdit = (category) => {
    setEditingId(category.id);
    setValue("title", category.title);
    setValue("description", category.description || "");
  };

  const handleCancel = () => {
    reset();
    setEditingId(null);
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setIsDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      console.log("Deleting id is :", deleteId);

      const response = await authFetch(
        `${process.env.baseUrl}${process.env.version}/category?category_id=${deleteId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const res = await response.json();
      toast.success(res.message);
      loadCategories();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsDialogOpen(false);
      setDeleteId(null);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setDeleteId(null);
  };

  const handleSearch = async (query) => {
    if (!query) {
      loadCategories();
      return;
    }

    try {
      const response = await authFetch(
        `${process.env.baseUrl}${process.env.version}/category?q=${query}`
      );
      if (response.ok) {
        const data = await response.json();
        setCategories(data.items);

        if (data.pagination) {
          setPagination({
            currentPage: data.pagination.currentPage,
            totalPages: data.pagination.totalPages,
            total: data.pagination.totalCount,
          });
        }
      } else {
        console.error("Error fetching results:", response.statusText);
        setCategories([]);
      }
    } catch (error) {
      console.error("Error fetching category search results:", error.message);
      setCategories([]);
    }
  };

  if (loading)
    return (
      <div className="mx-auto">
        <Loader />
      </div>
    );

  return (
    <div className="p-4 w-4/5 mx-auto">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4">Category Management</h1>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="mb-8">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Category Title"
            {...register("title", { required: "Title is required" })}
            className="w-full p-2 border rounded"
          />
          {errors.title && (
            <span className="text-red-500">{errors.title.message}</span>
          )}
        </div>
        <div className="mb-4">
          <textarea
            placeholder="Description"
            {...register("description")}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {editingId ? "Update Category" : "Add Category"}
          </button>
          {editingId && (
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

      {/* Table */}
      <Table
        data={categories}
        columns={columns}
        pagination={pagination}
        onPageChange={(newPage) => loadCategories(newPage)}
        onSearch={handleSearch}
      />
      <ConfirmationDialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        onConfirm={handleDeleteConfirm}
        title="Confirm Deletion"
        message="Are you sure you want to delete this category? This action cannot be undone."
      />
    </div>
  );
}
