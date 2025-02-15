"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import Table from "@/app/components/Table";
import { Edit2, Trash2 } from "lucide-react";
import { authFetch } from "@/app/utils/authFetch";
import { toast } from "react-toastify";
import ConfirmationDialog from "../addCollege/ConfirmationDialog";

export default function TagForm() {
  const author_id = useSelector((state) => state.user.data.id);
  const [isOpen, setIsOpen] = useState(false);
  const [tags, setTags] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editId, setEditingId] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      author: author_id,
    },
  });

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    setTableLoading(true);
    try {
      const response = await authFetch(
        `${process.env.baseUrl}${process.env.version}/tag`
      );
      const data = await response.json();
      setTags(data.items);
    } catch (error) {
      toast.error("Failed to fetch tags");
    } finally {
      setTableLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      const url = `${process.env.baseUrl}${process.env.version}/tag`;
      const method = editing ? "PUT" : "POST";

      if (editing) {
        const response = await authFetch(
          `${process.env.baseUrl}${process.env.version}/tag?tag_id=${editId}`,
          {
            method,
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );
        await response.json();
      } else {
        const response = await authFetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        await response.json();
      }

      toast.success(
        editing ? "Tag updated successfully!" : "Tag created successfully!"
      );
      setEditing(false);
      reset();
      fetchTags();
      setIsOpen(false);
    } catch (error) {
      toast.error(error.message || "Failed to save tag");
    }
  };

  const handleEdit = (tag) => {
    setEditing(true);
    setIsOpen(true);
    setEditingId(tag.id);
    setValue("title", tag.title);
    setValue("author", tag.author);
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setDeleteId(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;

    try {
      const response = await authFetch(
        `${process.env.baseUrl}${process.env.version}/tag?id=${deleteId}`,
        {
          method: "DELETE",
        }
      );
      const res = await response.json();
      toast.success(res.message);
      await fetchTags();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsDialogOpen(false);
      setDeleteId(null);
    }
  };

  const columns = [
    {
      header: "ID",
      accessorKey: "id",
    },
    {
      header: "Title",
      accessorKey: "title",
    },
   
    {
      header: "Created At",
      accessorKey: "createdAt",
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
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
  ];

  return (
    <>
      <div className="text-2xl mr-auto p-4 ml-14 font-bold">
        <div className="text-center">Tag Management</div>
        <div className="flex justify-left mt-2">
          <button
            className="bg-blue-500 text-white text-sm px-6 py-2 rounded hover:bg-blue-600 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? "Hide form" : "Show form"}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="container mx-auto p-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Tag Information</h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block mb-2">Tag Title *</label>
                  <input
                    {...register("title", {
                      required: "Tag title is required",
                      minLength: {
                        value: 3,
                        message: "Title must be at least 3 characters long",
                      },
                    })}
                    className="w-full p-2 border rounded"
                    placeholder="Enter tag title"
                  />
                  {errors.title && (
                    <span className="text-red-500">{errors.title.message}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors disabled:bg-blue-300"
              >
                {loading ? "Processing..." : editing ? "Update Tag" : "Create Tag"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mt-8">
        <Table
          loading={tableLoading}
          data={tags}
          columns={columns}
          onSearch={(query) => {
            console.log("Searching for:", query);
          }}
        />
      </div>

      <ConfirmationDialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        onConfirm={handleDeleteConfirm}
        title="Confirm Deletion"
        message="Are you sure you want to delete this tag? This action cannot be undone."
      />
    </>
  );
}