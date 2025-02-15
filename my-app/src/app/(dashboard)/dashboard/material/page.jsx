"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import FileUpload from "../addCollege/FileUpload";
import Table from "@/app/components/Table";
import { Edit2, Trash2 } from "lucide-react";
import { authFetch } from "@/app/utils/authFetch";
import { toast } from "react-toastify";
import ConfirmationDialog from "../addCollege/ConfirmationDialog";

export default function MaterialForm() {
  const author_id = useSelector((state) => state.user.data.id);
  const [isOpen, setIsOpen] = useState(false);
  const [materials, setMaterials] = useState([]);
  const [tags, setTags] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({
    image: "",
    file: "",
  });
  const [deleteId, setDeleteId] = useState(null);
  const [editId, setEditingId] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [collegeSearch, setCollegeSearch] = useState("");
  const [selectedColleges, setSelectedColleges] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  const statusOptions = ["draft", "published", "archived"];
  const visibilityOptions = ["public", "private"];



  const searchCollege = async (e) => {
    const query = e.target.value;
    setCollegeSearch(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await authFetch(
        `${process.env.baseUrl}${process.env.version}/tag?q=${query}`
      );
      const data = await response.json();
      setSearchResults(data.items || []);
    } catch (error) {
      console.error("College Search Error:", error);
      toast.error("Failed to search colleges");
    }
  };
  const addCollege = (college) => {
    if (!selectedColleges.some((c) => c.id === college.id)) {
      setSelectedColleges((prev) => [...prev, college]);
      // Update form value
      const collegeIds = [...selectedColleges, college].map((c) => c.id);
      setValue("colleges", collegeIds);
    }
    setCollegeSearch("");
    setSearchResults([]);
  };

  // Add function to remove college
  const removeCollege = (collegeId) => {
    setSelectedColleges((prev) => prev.filter((c) => c.id !== collegeId));
    // Update form value
    const updatedCollegeIds = selectedColleges
      .filter((c) => c.id !== collegeId)
      .map((c) => c.id);
    setValue("colleges", updatedCollegeIds);
  };

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
      tags: [],
      file: "",
      image: "",
      status: "draft",
      visibility: "public",
    },
  });

  useEffect(() => {
    fetchMaterials();
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await authFetch(
        `${process.env.baseUrl}${process.env.version}/tag`
      );
      const data = await response.json();
      setTags(data.items);
    } catch (error) {
      toast.error("Failed to fetch tags");
    }
  };

  const fetchMaterials = async () => {
    setTableLoading(true);
    try {
      const response = await authFetch(
        `${process.env.baseUrl}${process.env.version}/material`
      );
      const data = await response.json();
      setMaterials(data.materials);
    } catch (error) {
      toast.error("Failed to fetch materials");
    } finally {
      setTableLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      data.file = uploadedFiles.file;
      data.image = uploadedFiles.image;

      const url = `${process.env.baseUrl}${process.env.version}/material`;
      const method = editing ? "PUT" : "POST";

      if (editing) {
        const response = await authFetch(
          `${process.env.baseUrl}${process.env.version}/material?id=${editId}`,
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
        editing
          ? "Material updated successfully!"
          : "Material created successfully!"
      );
      setEditing(false);
      reset();
      setUploadedFiles({ image: "", file: "" });
      fetchMaterials();
      setIsOpen(false);
    } catch (error) {
      toast.error(error.message || "Failed to save material");
    }
  };

  const handleEdit = async (slug) => {
    try {
      setEditing(true);
      setLoading(true);
      setIsOpen(true);
      const response = await authFetch(
        `${process.env.baseUrl}${process.env.version}/material/${slug}`
      );
      const data = await response.json();
      const material = data.material;
      setEditingId(material.id);

      setValue("title", material.title);
      setValue("tags", JSON.parse(material.tags));
      setValue("status", material.status);
      setValue("visibility", material.visibility);

      setUploadedFiles({
        image: material.image || "",
        file: material.file || "",
      });
    } catch (error) {
      toast.error("Failed to fetch material details");
    } finally {
      setLoading(false);
    }
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
        `${process.env.baseUrl}${process.env.version}/material?id=${deleteId}`,
        {
          method: "DELETE",
        }
      );
      const res = await response.json();
      toast.success(res.message);
      await fetchMaterials();
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
      header: "Status",
      accessorKey: "status",
    },
    {
      header: "Visibility",
      accessorKey: "visibility",
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
            onClick={() => handleEdit(row.original.id)}
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
        <div className="text-center">Material Management</div>
        <div className="flex justify-left mt-2">
          <button
            className="bg-blue-500 text-white text-sm px-6 py-2 rounded hover:bg-blue-600"
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
              <h2 className="text-xl font-semibold mb-4">
                Material Information
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block mb-2">Title *</label>
                  <input
                    {...register("title", {
                      required: "Title is required",
                      minLength: {
                        value: 3,
                        message: "Title must be at least 3 characters long",
                      },
                    })}
                    className="w-full p-2 border rounded"
                  />
                  {errors.title && (
                    <span className="text-red-500">{errors.title.message}</span>
                  )}
                </div>

                <div>
                  <label className="block mb-2">Tags</label>
                  <select
                    multiple
                    {...register("tags")}
                    className="w-full p-2 border rounded"
                  >
                    {tags.map((tag) => (
                      <option key={tag.id} value={tag.id}>
                        {tag.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-2">Status</label>
                  <select
                    {...register("status")}
                    className="w-full p-2 border rounded"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-2">Visibility</label>
                  <select
                    {...register("visibility")}
                    className="w-full p-2 border rounded"
                  >
                    {visibilityOptions.map((visibility) => (
                      <option key={visibility} value={visibility}>
                        {visibility.charAt(0).toUpperCase() +
                          visibility.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <FileUpload
                    label="Material File"
                    onUploadComplete={(url) => {
                      setUploadedFiles((prev) => ({ ...prev, file: url }));
                      setValue("file", url);
                    }}
                    defaultPreview={uploadedFiles.file}
                  />
                </div>

                <div>
                  <FileUpload
                    label="Material Image"
                    onUploadComplete={(url) => {
                      setUploadedFiles((prev) => ({ ...prev, image: url }));
                      setValue("image", url);
                    }}
                    defaultPreview={uploadedFiles.image}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
              >
                {loading
                  ? "Processing..."
                  : editing
                  ? "Update Material"
                  : "Create Material"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mt-8">
        <Table
          loading={tableLoading}
          data={materials}
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
        message="Are you sure you want to delete this material? This action cannot be undone."
      />
    </>
  );
}
