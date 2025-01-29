"use client";

import { useState, useEffect, useMemo } from "react";
import { fetchNews, createNews, updateNews, deleteNews } from "./action";
import Loader from "@/app/components/Loading";
import Table from "../../../components/Table";
import { Edit2, Trash2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function NewsManager() {
  const [news, setNews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    tags: [],
    author: "",
    images: "",
    description: "",
    content: "",
    status: "draft",
    visibility: "private",
  });
  const [editingId, setEditingId] = useState(null);

  const columns = useMemo(
    () => [
      {
        header: "Title",
        accessorKey: "title",
      },
      {
        header: "Author",
        accessorKey: "author.firstName",
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
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      setCategories("");
      setTags([]);
    } catch (err) {
      toast.error("Failed to load data");
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateNews(editingId, formData);
        toast.success("News updated successfully");
      } else {
        await createNews(formData);
        toast.success("News created successfully");
      }
      resetForm();
      loadData();
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Network error occurred";
      toast.error(
        `Failed to ${editingId ? "update" : "create"} news: ${errorMsg}`
      );
      console.error("Error saving news:", err);
    }
  };

  const handleEdit = (newsItem) => {
    setFormData({
      title: newsItem.title,
      category: newsItem.category,
      tags: newsItem.tags,
      author: newsItem.author,
      images: newsItem.images,
      description: newsItem.description,
      content: newsItem.content,
      status: newsItem.status,
      visibility: newsItem.visibility,
    });
    setEditingId(newsItem._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this news?")) {
      try {
        await deleteNews(id);
        toast.success("News deleted successfully");
        loadData();
      } catch (err) {
        const errorMsg =
          err.response?.data?.message || "Network error occurred";
        toast.error(`Failed to delete news: ${errorMsg}`);
        console.error("Error deleting news:", err);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      category: "",
      tags: [],
      author: "",
      images: "",
      description: "",
      content: "",
      status: "draft",
      visibility: "private",
    });
    setEditingId(null);
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
      <h1 className="text-2xl font-bold mb-4">News Management</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <input
            type="text"
            placeholder="News Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="flex mb-4">
          <div className="w-1/2 mr-4">
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="w-1/2">
            <select
              value={formData.author}
              onChange={(e) =>
                setFormData({ ...formData, author: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Author</option>
              {authors.map((author) => (
                <option key={author._id} value={author._id}>
                  {author.firstName} {author.lastName}
                </option>
              ))}
            </select>
          </div>
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
        <div className="mb-4">
          <textarea
            placeholder="Content"
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="flex mb-4">
          <div className="w-1/2">
            <select
              className="w-full p-2 border rounded"
              value={formData.visibility}
              onChange={(e) =>
                setFormData({ ...formData, visibility: e.target.value })
              }
            >
              <option value="private">Private</option>
              <option value="public">Public</option>
            </select>
          </div>
          <div className="w-1/2">
            <select
              value={formData.status}
              className="w-full p-2 border rounded"
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {editingId ? "Update News" : "Add News"}
        </button>
      </form>

      {/* Table */}
      <Table data={news} columns={columns} />
    </div>
  );
}
