"use client";
import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useSelector } from "react-redux";
import FileUpload from "../addCollege/FileUpload";
import Table from "@/app/components/Table";
import { Edit2, Trash2 } from "lucide-react";
import { authFetch } from "@/app/utils/authFetch";
import { toast } from "react-toastify";
import ConfirmationDialog from "../addCollege/ConfirmationDialog";

export default function UniversityForm() {
  const author_id = useSelector((state) => state.user.data.id);
  const [isOpen, setIsOpen] = useState(false);
  const [universities, setUniversities] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [level, setLevel] = useState([]);
  const [editing, setEditing] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({
    featured: "",
    gallery: [],
  });
  const [deleteId, setDeleteId] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullname: "",
      author_id: author_id,
      country: "",
      state: "",
      city: "",
      street: "",
      postal_code: "",
      date_of_establish: "",
      type_of_institute: "Public",
      description: "",
      contact: {
        faxes: "",
        poboxes: "",
        email: "",
        phone_number: "",
      },
      levels: [],
      members: [
        {
          role: "",
          salutation: "",
          name: "",
          phone: "",
          email: "",
        },
      ],
      assets: {
        featured_image: "",
        videos: "",
      },
      gallery: [""],
    },
  });

  const {
    fields: memberFields,
    append: appendMember,
    remove: removeMember,
  } = useFieldArray({ control, name: "members" });

  const {
    fields: galleryFields,
    append: appendGallery,
    remove: removeGallery,
  } = useFieldArray({ control, name: "gallery" });

  // Fetch universities on component mount
  useEffect(() => {
    fetchUniversities();
  }, []);

  const fetchUniversities = async () => {
    setTableLoading(true);
    try {
      const response = await authFetch(
        `${process.env.baseUrl}${process.env.version}/university`
      );
      const data = await response.json();
      setUniversities(data.items);
    } catch (error) {
      toast.error("Failed to fetch universities");
    } finally {
      setTableLoading(false);
    }
  };
  const fetchlevel = async () => {
    try {
      const response = await authFetch(
        `${process.env.baseUrl}${process.env.version}/level`
      );
      const data = await response.json();
      setLevel(data.items);
    } catch (error) {
      toast.error("Failed to fetch universities");
    } finally {
    }
  };
  useEffect(() => {
    fetchlevel();
  }, []);
  const onSubmit = async (data) => {
    try {
      // Format the data
      data.assets.featured_image = uploadedFiles.featured;
      data.gallery = uploadedFiles.gallery.filter((url) => url);
      data.levels = data.levels.map((l) => parseInt(l));

      const url = `${process.env.baseUrl}${process.env.version}/university`;
      const method = "POST";
      console.log("before submitting uni", data);
      const response = await authFetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      toast.success(
        editing
          ? "University updated successfully!"
          : "University created successfully!"
      );
      setEditing(false);
      reset();
      setUploadedFiles({ featured: "", gallery: [] });
      fetchUniversities();
      setIsOpen(false);
    } catch (error) {
      toast.error(error.message || "Failed to save university");
    }
  };

  const handleEdit = async (slugs) => {
    try {
      setEditing(true);
      setLoading(true);
      setIsOpen(true);

      const response = await authFetch(
        `${process.env.baseUrl}${process.env.version}/university/${slugs}`
      );
      const data = await response.json();
      const university = data;

      // Set basic fields
      setValue("id", university.id);
      setValue("fullname", university.fullname);
      setValue("country", university.country);
      setValue("state", university.state);
      setValue("city", university.city);
      setValue("street", university.street);
      setValue("postal_code", university.postal_code);
      setValue("date_of_establish", university.date_of_establish);
      setValue("type_of_institute", university.type_of_institute);
      setValue("description", university.description);

      // Set contact information
      setValue("contact", university.contact);

      // Set levels
      setValue("levels", university.levels || []);
      university?.levels?.forEach((element) => {
        const checkbox = document.querySelector(
          `input[type="checkbox"][value="${element}"][identity="level"]`
        );
        if (checkbox && !checkbox.checked) {
          checkbox.click();
        }
      });

      // Set members
      setValue("members", university.members);

      // Set assets and gallery
      setUploadedFiles({
        featured: university.assets?.featured_image || "",
        gallery: university.gallery || [""],
      });
      setValue("assets.videos", university.assets?.videos || "");
    } catch (error) {
      toast.error("Failed to fetch university details");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id); // Store the ID of the item to delete
    setIsDialogOpen(true); // Open the confirmation dialog
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false); // Close the dialog without deleting
    setDeleteId(null); // Reset the delete ID
  };
  const handleDeleteConfirm = async () => {
    if (!deleteId) return;

    try {
      const response = await authFetch(
        `${process.env.baseUrl}${process.env.version}/university?id=${deleteId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const res = await response.json();
      toast.success(res.message);
      await fetchUniversities();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsDialogOpen(false); // Close the dialog
      setDeleteId(null); // Reset the delete ID
    }
  };
  const columns = [
    {
      header: "ID",
      accessorKey: "id",
    },
    {
      header: "Name",
      accessorKey: "fullname",
    },
    {
      header: "Type",
      accessorKey: "type_of_institute",
    },
    {
      header: "Location",
      accessorKey: "address",
      cell: ({ row }) => {
        const data = row.original;
        return `${data.city}, ${data.state}, ${data.country}`;
      },
    },
    {
      header: "Actions",
      id: "actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(row.original.slugs)}
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
        <div className="text-center">University Management</div>
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
            {/* Basic Information */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2">University Name *</label>
                  <input
                    {...register("fullname", {
                      required: "University name is required",
                      minLength: {
                        value: 3,
                        message: "Name must be at least 3 characters long",
                      },
                    })}
                    className="w-full p-2 border rounded"
                  />
                  {errors.fullname && (
                    <span className="text-red-500">
                      {errors.fullname.message}
                    </span>
                  )}
                </div>
                <div>
                  <label className="block mb-2">Type of Institute *</label>
                  <select
                    {...register("type_of_institute", { required: true })}
                    className="w-full p-2 border rounded"
                  >
                    <option value="Public">Public</option>
                    <option value="Private">Private</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2">Date of Establishment *</label>
                  <input
                    type="date"
                    {...register("date_of_establish", { required: true })}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block mb-2">Description</label>
                  <textarea
                    {...register("description")}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            </div>
            {editing ? <input type="hidden" {...register("id")} /> : <></>}

            {/* Address Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["country", "state", "city", "street", "postal_code"].map(
                  (field) => (
                    <div key={field}>
                      <label className="block mb-2 capitalize">
                        {field.replace("_", " ")} *
                      </label>
                      <input
                        {...register(field, { required: true })}
                        className="w-full p-2 border rounded"
                      />
                      {errors[field] && (
                        <span className="text-red-500">
                          This field is required
                        </span>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: "faxes", label: "Fax" },
                  { key: "poboxes", label: "P.O. Box" },
                  { key: "email", label: "Email" },
                  { key: "phone_number", label: "Phone Number" },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className="block mb-2">{label}</label>
                    <input
                      {...register(`contact.${key}`)}
                      className="w-full p-2 border rounded"
                      type={key === "email" ? "email" : "text"}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Members Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Members</h2>
                <button
                  type="button"
                  onClick={() =>
                    appendMember({
                      role: "",
                      salutation: "",
                      name: "",
                      phone: "",
                      email: "",
                    })
                  }
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Add Member
                </button>
              </div>

              {memberFields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 border rounded"
                >
                  <div>
                    <label className="block mb-2">Role</label>
                    <input
                      {...register(`members.${index}.role`)}
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  <div>
                    <label className="block mb-2">Salutation</label>
                    <input
                      {...register(`members.${index}.salutation`)}
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  <div>
                    <label className="block mb-2">Name</label>
                    <input
                      {...register(`members.${index}.name`)}
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  <div>
                    <label className="block mb-2">Phone</label>
                    <input
                      {...register(`members.${index}.phone`)}
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  <div>
                    <label className="block mb-2">Email</label>
                    <input
                      type="email"
                      {...register(`members.${index}.email`)}
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeMember(index)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Media Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Media</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <FileUpload
                    label="Featured Image"
                    onUploadComplete={(url) => {
                      setUploadedFiles((prev) => ({ ...prev, featured: url }));
                      setValue("assets.featured_image", url);
                    }}
                    defaultPreview={uploadedFiles.featured}
                  />
                </div>

                <div>
                  <label className="block mb-2">Video URL</label>
                  <input
                    {...register("assets.videos")}
                    className="w-full p-2 border rounded"
                    placeholder="Enter video URL"
                  />
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between items-center mb-4">
                  <label className="block">Gallery Images</label>
                  <button
                    type="button"
                    onClick={() => {
                      appendGallery("");
                      setUploadedFiles((prev) => ({
                        ...prev,
                        gallery: [...prev.gallery, ""],
                      }));
                    }}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Add Image
                  </button>
                </div>
                {galleryFields.map((field, index) => (
                  <div key={field.id} className="mb-4">
                    <FileUpload
                      label={`Gallery Image ${index + 1}`}
                      onUploadComplete={(url) => {
                        const newGallery = [...uploadedFiles.gallery];
                        newGallery[index] = url;
                        setUploadedFiles((prev) => ({
                          ...prev,
                          gallery: newGallery,
                        }));
                        setValue(`gallery.${index}`, url);
                      }}
                      defaultPreview={uploadedFiles.gallery[index]}
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          removeGallery(index);
                          const newGallery = [...uploadedFiles.gallery];
                          newGallery.splice(index, 1);
                          setUploadedFiles((prev) => ({
                            ...prev,
                            gallery: newGallery,
                          }));
                        }}
                        className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Levels Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Educational Levels</h2>
              <div className="space-y-2">
                {level.map((level) => (
                  <label key={level.id} className="flex items-center">
                    <input
                      type="checkbox"
                      identity="level"
                      {...register("levels")}
                      value={level.id}
                      className="mr-2"
                    />
                    {level.title}
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors disabled:bg-blue-300"
              >
                {loading
                  ? "Processing..."
                  : editing
                  ? "Update University"
                  : "Create University"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table Section */}
      <div className="mt-8">
        <Table
          loading={tableLoading}
          data={universities}
          columns={columns}
          onSearch={(query) => {
            // Implement search functionality here
            console.log("Searching for:", query);
          }}
        />
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={isDialogOpen} // Manage this state as needed
        onClose={handleDialogClose} // Implement close handler
        onConfirm={handleDeleteConfirm} // Implement confirm handler
        title="Confirm Deletion"
        message="Are you sure you want to delete this university? This action cannot be undone."
      />
    </>
  );
}
