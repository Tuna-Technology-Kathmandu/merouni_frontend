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
import { X } from "lucide-react";

export default function ConsultancyForm() {
  const author_id = useSelector((state) => state.user.data.id);
  const [isOpen, setIsOpen] = useState(false);
  const [consultancies, setConsultancies] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({
    featured: "",
  });
  const [deleteId, setDeleteId] = useState(null);
  const [editId, setEditingId] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedColleges, setSelectedColleges] = useState([]);
  const [collegeSearch, setCollegeSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      destination: [{ country: "", city: "" }],
      address: {
        street: "",
        city: "",
        state: "",
        zip: "",
      },
      featured_image: "",
      pinned: 0,
      courses: "",
    },
  });
  const {
    fields: destinationFeilds,
    append: appendDestination,
    remove: removeDestination,
  } = useFieldArray({ control, name: "destination" });

  useEffect(() => {
    fetchConsultancies();
  }, []);

  const fetchConsultancies = async () => {
    setTableLoading(true);
    try {
      const response = await authFetch(
        `${process.env.baseUrl}${process.env.version}/consultancy`
      );
      const data = await response.json();
      setConsultancies(data.items);
    } catch (error) {
      toast.error("Failed to fetch consultancies");
    } finally {
      setTableLoading(false);
    }
  };

  const searchCollege = async (e) => {
    const query = e.target.value;
    setCollegeSearch(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await authFetch(
        `${process.env.baseUrl}${process.env.version}/course?q=${query}`
      );
      const data = await response.json();
      setSearchResults(data.items || []);
    } catch (error) {
      console.error("College Search Error:", error);
      toast.error("Failed to search colleges");
    }
  };

  // Add function to handle college selection
  const addCollege = (college) => {
    if (!selectedColleges.some((c) => c.id === college.id)) {
      setSelectedColleges((prev) => [...prev, college]);
      // Update form value
      const collegeIds = [...selectedColleges, college].map((c) => c.id);
      setValue("courses", collegeIds[0]);
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

  const onSubmit = async (data) => {
    try {
      data.featured_image = uploadedFiles.featured;
      data.destination = data.destination;
      data.address = data.address;
      data.pinned = Number(data.pinned);

      const url = `${process.env.baseUrl}${process.env.version}/consultancy`;
      const method = "POST";
      console.log("consultancy data", data);

      const response = await authFetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      await response.json();

      toast.success(
        editing
          ? "Consultancy updated successfully!"
          : "Consultancy created successfully!"
      );
      setEditing(false);
      reset();
      setSelectedColleges([]);
      setUploadedFiles({ featured: "" });
      fetchConsultancies();
      setIsOpen(false);
    } catch (error) {
      toast.error(error.message || "Failed to save consultancy");
    }
  };

  const handleEdit = async (slug) => {
    try {
      setEditing(true);
      setLoading(true);
      setIsOpen(true);
      const response = await authFetch(
        `${process.env.baseUrl}${process.env.version}/consultancy/${slug}`
      );
      const data = await response.json();
      const consultancy = data.category;
      console.log("while edititnc consul", consultancy);
      setEditingId(consultancy.id);
      setValue("title", consultancy.title);
      const parsedDestination = JSON.parse(consultancy.destination);
      setValue("destination", parsedDestination);
      setValue("address", JSON.parse(consultancy.address));
      setValue("pinned", consultancy.pinned);
      setValue("courses", consultancy.courses);
      //   if (program.colleges) {
      //     const collegeData = program.colleges.map(college => ({
      //       id: college.program_college.college_id,
      //       name: college.name,
      //       slugs: college.slugs
      //     }));
      //     setSelectedColleges(collegeData);
      //     setValue('colleges', collegeData.map(c => c.id));
      //   }

      setUploadedFiles({
        featured: consultancy.featured_image || "",
      });
    } catch (error) {
      toast.error("Failed to fetch consultancy details");
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
        `${process.env.baseUrl}${process.env.version}/consultancy?id=${deleteId}`,
        {
          method: "DELETE",
        }
      );
      const res = await response.json();
      toast.success(res.message);
      await fetchConsultancies();
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
      header: "Destinations",
      accessorKey: "destination",
      cell: ({ row }) => {
        const destinations = JSON.parse(row.original.destination);
        console.log("destinations", destinations);
        return destinations.map((d) => `${d.city}, ${d.country}`).join("; ");
      },
    },
    {
      header: "Courses",
      accessorKey: "courses",
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
        <div className="text-center">Consultancy Management</div>
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
              <h2 className="text-xl font-semibold mb-4">
                Consultancy Information
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

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Destination</h2>
                    <button
                      type="button"
                      onClick={() =>
                        appendDestination({ country: "", city: "" })
                      }
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                      Add Destination
                    </button>
                  </div>
                  {destinationFeilds.map((field, index) => (
                    <div
                      key={field.id}
                      className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 border rounded"
                    >
                      <div>
                        <label className="block mb-2">Country</label>
                        <input
                          type="text"
                          {...register(`destination.${index}.country`)}
                          className="w-full p-2 border rounded"
                          min="1"
                        />
                      </div>

                      <div>
                        <label className="block mb-2">City</label>
                        <input
                          type="text"
                          {...register(`destination.${index}.city`)}
                          className="w-full p-2 border rounded"
                          min="1"
                          max="2"
                        />
                      </div>

                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => removeDestination(index)}
                          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* <div>
                  <label className="block mb-2">Destination</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      {...register("destination.0.country")}
                      placeholder="Country"
                      className="w-full p-2 border rounded"
                    />
                    <input
                      {...register("destination.0.city")}
                      placeholder="City"
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div> */}

                <div>
                  <label className="block mb-2">Address</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      {...register("address.street")}
                      placeholder="Street"
                      className="w-full p-2 border rounded"
                    />
                    <input
                      {...register("address.city")}
                      placeholder="City"
                      className="w-full p-2 border rounded"
                    />
                    <input
                      {...register("address.state")}
                      placeholder="State"
                      className="w-full p-2 border rounded"
                    />
                    <input
                      {...register("address.zip")}
                      placeholder="ZIP"
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>

                {/* <div>
                  <label className="block mb-2">Courses</label>
                  <input
                    type="number"
                    {...register("courses")}
                    className="w-full p-2 border rounded"
                  />
                </div> */}

                <div className="mb-4">
                  <label className="block mb-2">Courses</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedColleges.map((college) => (
                      <div
                        key={college.id}
                        className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
                      >
                        <span>{college.title}</span>
                        <button
                          type="button"
                          onClick={() => removeCollege(college.id)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      disabled={selectedColleges.length > 0}
                      value={collegeSearch}
                      onChange={searchCollege}
                      className="w-full p-2 border rounded"
                      placeholder="Search courses..."
                    />

                    {searchResults.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {searchResults.map((college) => (
                          <div
                            key={college.id}
                            onClick={() => addCollege(college)}
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                          >
                            {college.title}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block mb-2">Pinned</label>
                  <input
                    type="checkbox"
                    {...register("pinned")}
                    className="w-4 h-4"
                  />
                </div>

                <div>
                  <FileUpload
                    label="Featured Image"
                    onUploadComplete={(url) => {
                      setUploadedFiles((prev) => ({ ...prev, featured: url }));
                      setValue("featured_image", url);
                    }}
                    defaultPreview={uploadedFiles.featured}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors disabled:bg-blue-300"
              >
                {loading
                  ? "Processing..."
                  : editing
                  ? "Update Consultancy"
                  : "Create Consultancy"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mt-8">
        <Table
          loading={tableLoading}
          data={consultancies}
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
        message="Are you sure you want to delete this consultancy? This action cannot be undone."
      />
    </>
  );
}
