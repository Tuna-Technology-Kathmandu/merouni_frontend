"use client";
import React, { useState, useEffect, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import FileUpload from "../addCollege/FileUpload";
import Table from "@/app/components/Table";
import { Edit2, Trash2, Plus, X } from "lucide-react";
import { authFetch } from "@/app/utils/authFetch";
import { toast } from "react-toastify";
import ConfirmationDialog from "../addCollege/ConfirmationDialog";

export default function BannerForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [banners, setBanners] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editId, setEditingId] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchTimeoutRef = useRef(null);
  const dropdownRef = useRef(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
  });
  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      collegeSearch: "",
      collegeId: "",
      bannerImages: [
        {
          title: "",
          gallery: { small: "", medium: "", large: "" },
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "bannerImages",
  });

  useEffect(() => {
    fetchBanners();

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchBanners = async (page = 1) => {
    setTableLoading(true);
    try {
      const response = await authFetch(
        `${process.env.baseUrl}${process.env.version}/banner?page=${page}`
      );
      const data = await response.json();
      setBanners(data.items);
      setPagination({
        currentPage: data.pagination.currentPage,
        totalPages: data.pagination.totalPages,
        total: data.pagination.totalCount,
      });
    } catch (error) {
      toast.error("Failed to fetch banners");
    } finally {
      setTableLoading(false);
    }
  };

  const searchCollege = async (query) => {
    setValue("collegeSearch", query);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!query) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    setSearchLoading(true);
    setShowDropdown(true);

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await authFetch(
          `${process.env.baseUrl}${process.env.version}/college?q=${query}`
        );
        const data = await response.json();
        setSearchResults(data.items || []);
      } catch (error) {
        toast.error("Failed to search colleges");
      } finally {
        setSearchLoading(false);
      }
    }, 300);
  };

  const handleCollegeSelect = (college) => {
    setSelectedCollege(college);
    setValue("collegeId", college.id);
    setValue("collegeSearch", college.name);
    setShowDropdown(false);
  };

  const onSubmit = async (data) => {
    if (!selectedCollege) {
      toast.error("Please select a college first");
      return;
    }

    try {
      const bannerData = {
        collegeId: selectedCollege.id,
        bannerImage: data.bannerImages.map((image) => ({
          title: image.title,
          gallery: image.gallery,
        })),
      };

      console.log("before subm", bannerData);
      const url = `${process.env.baseUrl}${process.env.version}/banner`;
      const method = "POST";
      //since there is no code for updating banner in backend,  simply  new banner has been added
      if (editing) {
        const response = await authFetch(`${url}?id=${editId}`, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bannerData),
        });
        await response.json();
      } else {
        const response = await authFetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bannerData),
        });
        await response.json();
      }

      toast.success(
        editing
          ? "Banner updated successfully!"
          : "Banner created successfully!"
      );
      setEditing(false);
      reset();
      setSelectedCollege(null);
      fetchBanners();
      setIsOpen(false);
    } catch (error) {
      toast.error(error.message || "Failed to save banner");
    }
  };

  const handleEdit = async (id) => {
    try {
      setEditing(true);
      setLoading(true);
      setIsOpen(true);
      const response = await authFetch(
        `${process.env.baseUrl}${process.env.version}/banner/${id}`
      );
      const data = await response.json();
      const banner = data.items;
      setEditingId(id);

      if (banner.Banners && banner.Banners.length > 0) {
        const bannerImages = banner.Banners.map((b) => ({
          title: b.title,
          gallery: {
            small:
              b.banner_galleries.find((g) => g.size === "small")?.url || "",
            medium:
              b.banner_galleries.find((g) => g.size === "medium")?.url || "",
            large:
              b.banner_galleries.find((g) => g.size === "large")?.url || "",
          },
        }));

        reset({
          collegeSearch: banner.name,
          collegeId: banner.id,
          bannerImages,
        });

        setSelectedCollege({
          id: banner.id,
          name: banner.name,
        });
      }
    } catch (error) {
      toast.error("Failed to fetch banner details");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;

    try {
      await authFetch(
        `${process.env.baseUrl}${process.env.version}/banner/${deleteId}`,
        { method: "DELETE" }
      );
      toast.success("Banner deleted successfully");
      await fetchBanners();
    } catch (error) {
      toast.error("Failed to delete banner");
    } finally {
      setIsDialogOpen(false);
      setDeleteId(null);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setIsDialogOpen(true);
  };

  const columns = [
    { header: "ID", accessorKey: "id" },
    { header: "Title", accessorKey: "title" },
    {
      header: "Actions",
      id: "actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(row.original.college_id)}
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

  const handleSearch = async (query) => {
    if (!query) {
      fetchBanners();
      return;
    }

    // try {
    //   const response = await authFetch(
    //     `${process.env.baseUrl}${process.env.version}/level?q=${query}`
    //   );
    //   if (response.ok) {
    //     const data = await response.json();
    //     setLevels(data.items);

    //     if (data.pagination) {
    //       setPagination({
    //         currentPage: data.pagination.currentPage,
    //         totalPages: data.pagination.totalPages,
    //         total: data.pagination.totalCount,
    //       });
    //     }
    //   } else {
    //     console.error("Error fetching levels:", response.statusText);
    //     setLevels([]);
    //   }
    // } catch (error) {
    //   console.error("Error fetching levels search results:", error.message);
    //   setLevels([]);
    // }
  };
  return (
    <>
      <div className="text-2xl mr-auto p-4 ml-14 font-bold">
        <div className="text-center">Banner Management</div>
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
              <h2 className="text-xl font-semibold mb-4">Banner Information</h2>

              {/* College Search */}
              <div className="relative mb-6" ref={dropdownRef}>
                <label className="block mb-2">Search College *</label>
                <input
                  type="text"
                  {...register("collegeSearch", {
                    required: "College selection is required",
                  })}
                  onChange={(e) => searchCollege(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Search for a college..."
                />
                {errors.collegeSearch && (
                  <span className="text-red-500">
                    {errors.collegeSearch.message}
                  </span>
                )}

                {showDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                    {searchLoading ? (
                      <div className="p-2 text-center text-gray-500">
                        Loading...
                      </div>
                    ) : searchResults.length > 0 ? (
                      searchResults.map((college) => (
                        <div
                          key={college.id}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleCollegeSelect(college)}
                        >
                          {college.name}
                        </div>
                      ))
                    ) : (
                      <div className="p-2 text-center text-gray-500">
                        No colleges found
                      </div>
                    )}
                  </div>
                )}
              </div>

              {selectedCollege && (
                <div className="p-2 bg-blue-50 rounded mb-6">
                  Selected College: {selectedCollege.name}
                </div>
              )}

              {/* Banner Images Array */}
              <div className="space-y-6">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="p-4 border rounded-lg relative"
                  >
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      disabled={fields.length === 1}
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <div className="mb-4">
                      <label className="block mb-2">Banner Title *</label>
                      <input
                        {...register(`bannerImages.${index}.title`, {
                          required: "Banner title is required",
                        })}
                        className="w-full p-2 border rounded"
                      />
                      {errors.bannerImages?.[index]?.title && (
                        <span className="text-red-500">
                          {errors.bannerImages[index].title.message}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <FileUpload
                          label="Small Banner Image"
                          onUploadComplete={(url) => {
                            setValue(
                              `bannerImages.${index}.gallery.small`,
                              url
                            );
                          }}
                          defaultPreview={watch(
                            `bannerImages.${index}.gallery.small`
                          )}
                        />
                      </div>
                      <div>
                        <FileUpload
                          label="Medium Banner Image"
                          onUploadComplete={(url) => {
                            setValue(
                              `bannerImages.${index}.gallery.medium`,
                              url
                            );
                          }}
                          defaultPreview={watch(
                            `bannerImages.${index}.gallery.medium`
                          )}
                        />
                      </div>
                      <div>
                        <FileUpload
                          label="Large Banner Image"
                          onUploadComplete={(url) => {
                            setValue(
                              `bannerImages.${index}.gallery.large`,
                              url
                            );
                          }}
                          defaultPreview={watch(
                            `bannerImages.${index}.gallery.large`
                          )}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    append({
                      title: "",
                      gallery: { small: "", medium: "", large: "" },
                    })
                  }
                  className="flex items-center gap-2 text-blue-500 hover:text-blue-700"
                >
                  <Plus className="w-4 h-4" /> Add Another Banner
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading || !selectedCollege}
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
              >
                {loading
                  ? "Processing..."
                  : editing
                  ? "Update Banner"
                  : "Create Banner"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mt-8">
        <Table
          loading={tableLoading}
          data={banners}
          columns={columns}
          pagination={pagination}
          onPageChange={(newPage) => fetchBanners(newPage)}
          onSearch={handleSearch}
        />
      </div>

      <ConfirmationDialog
        open={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setDeleteId(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Confirm Deletion"
        message="Are you sure you want to delete this banner? This action cannot be undone."
      />
    </>
  );
}
