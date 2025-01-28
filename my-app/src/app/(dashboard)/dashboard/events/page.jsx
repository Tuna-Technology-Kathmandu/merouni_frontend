"use client";

import { useState, useEffect, useMemo } from "react";
import { fetchEvents, createEvent, updateEvent, deleteEvent } from "./action";
import Loader from "@/app/components/Loading";
import Table from "../../../components/Table";
import { Edit2, Trash2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EventManager() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    host: "",
    description: "",
    content: "",
    status: "",
    visibility: "",
    eventMeta: {
      startDate: "",
      endDate: "",
      time: "",
      mapIframe: "",
    },
  });
  const [editingId, setEditingId] = useState(null);

  const columns = useMemo(
    () => [
      {
        header: "Title",
        accessorKey: "title",
      },
      {
        header: "Host",
        accessorKey: "host",
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
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const response = await fetchEvents();
      setCategories(response.items);
    } catch (err) {
      toast.error("Failed to load events");
      console.error("Error loading events:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateEvent(editingId, formData);
        toast.success("Events updated successfully");
      } else {
        await createEvent(formData);
        toast.success("Events created successfully");
      }
      setFormData({
        title: "",
        host: "",
        description: "",
        content: "",
        status: "",
        visibility: "",
        eventMeta: {
          startDate: "",
          endDate: "",
          time: "",
          mapIframe: "",
        },
      });
      setEditingId(null);
      loadEvents();
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Network error occurred";
      toast.error(
        `Failed to ${editingId ? "update" : "create"} category: ${errorMsg}`
      );
      console.error("Error saving category:", err);
    }
  };

  const handleEdit = (event) => {
    setFormData({
      title: event.title,
      host: event.host,
      description: event.description || "",
      content: event.content || "",
      status: event.status || "draft",
      visibility: event.visibility || "public",
      eventMeta: {
        startDate: event.eventMeta?.startDate || "2025",
        endDate: event.eventMeta?.endDate || "",
        time: event.eventMeta?.time || "",
        mapIframe: event.eventMeta?.mapIframe || "",
      },
    });
    setEditingId(event._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteEvent(id);
        toast.success("Event deleted successfully");
        loadEvents();
      } catch (err) {
        const errorMsg =
          err.response?.data?.message || "Network error occurred";
        toast.error(`Failed to delete event: ${errorMsg}`);
        console.error("Error deleting event:", err);
      }
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
      <h1 className="text-2xl font-bold mb-4">Event Management</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Event Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Event Host"
            value={formData.host}
            onChange={(e) => setFormData({ ...formData, host: e.target.value })}
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
          <div className="w-1/2 mr-4">
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

        <div className="flex mb-4">
          <div className="w-1/2 mr-4">
            <input
              type="date"
              placeholder=""
              value={formData.startDate}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  eventMeta: {
                    ...formData.eventMeta,
                    startDate: e.target.value,
                  },
                })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="w-1/2">
            <input
              type="date"
              placeholder=""
              value={formData.endDate}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  eventMeta: { ...formData.eventMeta, endDate: e.target.value },
                })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        <div className="flex mb-4">
          <div className="w-1/2 mr-4">
            <input
              type="time"
              placeholder=""
              value={formData.time}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  eventMeta: { ...formData.eventMeta, time: e.target.value },
                })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="w-1/2">
            <input
              type="text"
              placeholder="iFrame URL"
              value={formData.mapIframe}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  eventMeta: {
                    ...formData.eventMeta,
                    mapIframe: e.target.value,
                  },
                })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {editingId ? "Update Event" : "Add Event"}
        </button>
      </form>

      {/* Table */}
      <Table data={categories} columns={columns} />
    </div>
  );
}
