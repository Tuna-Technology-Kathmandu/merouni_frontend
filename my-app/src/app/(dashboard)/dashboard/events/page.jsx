"use client";

import { useState, useEffect, useMemo } from "react";
import Table from "../../../components/Table";
import { Edit2, Trash2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getEvents, getCategories } from "@/app/action";
import { useForm } from "react-hook-form";
import FileUpload from "../addCollege/FileUpload";
import { MapPin } from "lucide-react";
import { useSelector } from "react-redux";
import { authFetch } from "@/app/utils/authFetch";
import ConfirmationDialog from "../addCollege/ConfirmationDialog";
import debounce from "lodash/debounce";
import { fetchCategories } from "../category/action";
import { X } from "lucide-react";

import RichTextEditor from "@/app/components/RichTextEditor";

export default function EventManager() {
  const author_id = useSelector((state) => state.user.data.id);
  console.log("author", author_id);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      category_id: "",
      college_id: "",
      author_id: author_id,
      description: "",
      content: "",
      image: "",
      event_host: {
        start_date: "",
        end_date: "",
        time: "",
        host: "",
        map_url: "",
      },
      is_featured: false,
    },
  });

  const [events, setEvents] = useState([]);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({
    image: "",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
  });
  const [categories, setCategories] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [selectedColleges, setSelectedColleges] = useState([]);
  const [collegeSearch, setCollegeSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [editorContent, setEditorContent] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      console.log("fetching category");
      try {
        const categoriesList = await fetchCategories();
        console.log("middle", categoriesList);
        setCategories(categoriesList.items);
        console.log("cate1", categories);
      } catch (error) {
        console.error("Failed to fetch categories");
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    loadEvents();
  }, []);

  const searchCollege = async (e) => {
    const query = e.target.value;
    setCollegeSearch(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await authFetch(
        `${process.env.baseUrl}${process.env.version}/college?q=${query}`
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
      setValue("college_id", collegeIds[0]);
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
    setValue("college_id", updatedCollegeIds[0]);
  };

  const handleCancel = () => {
    reset();
    setEditing(false);
    setEditingEventId(null);
    setUploadedFiles({ image: "" });
    setCollegeSearch("");
    setSelectedColleges(null);
    setEditorContent("");
  };

  const handleSearch = async (query) => {
    if (!query) {
      loadEvents();
      return;
    }

    try {
      const response = await authFetch(
        `${process.env.baseUrl}${process.env.version}/event?q=${query}`
      );
      if (response.ok) {
        const data = await response.json();
        setEvents(data.items);

        if (data.pagination) {
          setPagination({
            currentPage: data.pagination.currentPage,
            totalPages: data.pagination.totalPages,
            total: data.pagination.totalCount,
          });
        }
      } else {
        console.error("Error fetching results:", response.statusText);
        setEvents([]);
      }
    } catch (error) {
      console.error("Error fetching event search results:", error.message);
      setEvents([]);
    }
  };

  const loadEvents = async (page = 1) => {
    try {
      const response = await getEvents(page);
      setEvents(response.items);
      setPagination({
        currentPage: response.pagination.currentPage,
        totalPages: response.pagination.totalPages,
        total: response.pagination.totalCount,
      });
    } catch (err) {
      toast.error("Failed to load events");
      console.error("Error loading events:", err);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    console.log("Cate2:", categories);

    try {
      const formData = {
        ...data,
        is_featured: Number(data.is_featured),
        image: uploadedFiles.image,
        content: editorContent,
      };

      // Include event ID for update operation
      if (editing) {
        formData.id = editingEventId; // Add the event ID to the formData
      }

      console.log("Form Data:", formData);

      // Use the same endpoint for both create and update
      const response = await authFetch(
        `${process.env.baseUrl}${process.env.version}/event`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const responseData = await response.json();
      console.log("REsponse data:", responseData);

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to process event");
      }

      toast.success(
        editing ? "Event updated successfully" : "Event created successfully"
      );

      // Reset form and state
      reset();
      setEditing(false);
      setUploadedFiles({ image: "" });
      setCollegeSearch("");
      setSelectedColleges([]);
      setEditorContent("");
      loadEvents(); // Refresh the event list
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Network error occurred";
      toast.error(
        `Failed to ${editing ? "update" : "create"} event: ${errorMsg}`
      );
    }
  };

  const handleEdit = async (data) => {
    console.log("Cate3:", categories);

    try {
      setEditing(true);
      setLoading(true);
      // console.log("Cate1:", categories);

      const response = await authFetch(
        `${process.env.baseUrl}${process.env.version}/event/${data.slugs}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      let eventData = await response.json();
      eventData = eventData.item; // Assuming the event data is nested under `item`

      // let eventData=slug
      console.log("Event data:", eventData);
      // console.log("Cate:", categories);
      setEditingEventId(eventData.id);

      // Populate form fields with event data
      setValue("title", eventData.title);

      // if (eventData.category?.id) {
      //   setValue("category_id", eventData.category.id);
      // }
      if (eventData.category) {
        const categoryID = categories.find(
          (c) => c.title === eventData.category.title
        )?.id;
        if (categoryID) {
          console.log("Cat id:", categoryID);
          setValue("category_id", categoryID);
        }
      }

      if (eventData?.college) {
        const response = await authFetch(
          `${process.env.baseUrl}${process.env.version}/college?q=${eventData.college.slugs}`
        );
        const collegeData = await response.json();
        const collegeId = collegeData.items[0]?.id;

        if (collegeId) {
          setValue("college_id", collegeId);

          const colgData = [
            {
              id: collegeId,
              name: eventData.college.name,
            },
          ];
          setSelectedColleges(colgData);
        }
      }

      setValue("description", eventData.description);
      setValue("content", eventData.content);
      setValue("image", eventData.image);
      setUploadedFiles((prev) => ({ ...prev, image: eventData.image })); // Set uploaded image URL

      const eventHost = eventData.event_host;

      // Populate event_host fields
      setValue("event_host.start_date", eventHost.start_date);
      setValue("event_host.end_date", eventHost.end_date);
      setValue("event_host.time", eventHost.time);
      setValue("event_host.host", eventHost.host);
      setValue("event_host.map_url", eventHost.map_url);

      // Set is_featured checkbox
      setValue("is_featured", eventData.is_featured === 1);

      // Set college search input (if applicable)
      // setCollegeSearch(eventData.college.name);
      // setSelectedCollege(eventData.college);

      console.log("Form populated with event data:", getValues());
    } catch (error) {
      console.error("Error fetching event data:", error);
      toast.error("Failed to fetch event data");
    } finally {
      setLoading(false);
    }
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
        `${process.env.baseUrl}${process.env.version}/event?event_id=${deleteId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const res = await response.json();
      toast.success(res.message);
      loadEvents();
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

  const columns = useMemo(
    () => [
      {
        header: "Title",
        accessorKey: "title",
      },
      {
        header: "Host",
        id: "host", // provide a unique id instead of a nested accessorKey
        cell: ({ row }) => {
          const rawValue = row.original.event_host;
          if (!rawValue) return "";
          try {
            const eventHost = JSON.parse(rawValue);
            return eventHost.host || "";
          } catch (error) {
            console.error("JSON parsing error for host:", error);
            return "";
          }
        },
      },
      {
        header: "Start Date",
        id: "start_date",
        cell: ({ row }) => {
          const rawValue = row.original.event_host;
          if (!rawValue) return "";
          try {
            const eventHost = JSON.parse(rawValue);
            return eventHost.start_date || "";
          } catch (error) {
            console.error("JSON parsing error for start_date:", error);
            return "";
          }
        },
      },
      {
        header: "End Date",
        id: "end_date",
        cell: ({ row }) => {
          const rawValue = row.original.event_host;
          if (!rawValue) return "";
          try {
            const eventHost = JSON.parse(rawValue);
            return eventHost.end_date || "";
          } catch (error) {
            console.error("JSON parsing error for end_date:", error);
            return "";
          }
        },
      },
      {
        header: "Time",
        id: "time",
        cell: ({ row }) => {
          const rawValue = row.original.event_host;
          if (!rawValue) return "";
          try {
            const eventHost = JSON.parse(rawValue);
            return eventHost.time || "";
          } catch (error) {
            console.error("JSON parsing error for time:", error);
            return "";
          }
        },
      },
      {
        header: "Location",
        id: "location",
        cell: ({ row }) => {
          const rawValue = row.original.event_host;
          if (!rawValue) return "N/A";
          try {
            const eventHost = JSON.parse(rawValue);
            return eventHost.map_url ? (
              <a
                href={eventHost.map_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                <MapPin className="inline w-4 h-4" /> View Map
              </a>
            ) : (
              "N/A"
            );
          } catch (error) {
            console.error("JSON parsing error for map_url:", error);
            return "N/A";
          }
        },
      },
      {
        header: "Featured",
        accessorKey: "is_featured",
        cell: ({ getValue }) => (getValue() ? "Yes" : "No"),
      },
      {
        header: "Actions",
        id: "actions",
        cell: ({ row }) => (
          <div className="flex gap-2" key={row.original.id}>
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
    [categories]
  );

  return (
    <div className="p-4 w-4/5 mx-auto">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4">Event Management</h1>
      {console.log("Cate4:", categories)}

      <form onSubmit={handleSubmit(onSubmit)} className="mb-8">
        <div className="mb-4">
          <label htmlFor="title">Event Title </label>

          <input
            {...register("title", { required: "Title is required" })}
            placeholder="Event Title"
            className="w-full p-2 border rounded"
          />
          {errors.title && (
            <span className="text-red-500">{errors.title.message}</span>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="category_id">Categories *</label>
          <select
            {...register("category_id", { required: true })}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option value={category.id} key={category.id}>
                {category.title}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-2">College</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedColleges.map((college) => (
              <div
                key={college.id}
                className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
              >
                <span>{college.name}</span>
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
              placeholder="Search college..."
            />

            {searchResults.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                {searchResults.map((college) => (
                  <div
                    key={college.id}
                    onClick={() => addCollege(college)}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {college.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="host">Host</label>

          <input
            {...register("event_host.host", { required: "Host is required" })}
            placeholder="Event Host"
            className="w-full p-2 border rounded"
          />
          {errors.event_host?.host && (
            <span className="text-red-500">
              {errors.event_host.host.message}
            </span>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="description">Description </label>
          <textarea
            {...register("description")}
            placeholder="Description"
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="content">Content </label>
          <RichTextEditor
            onEditorChange={(content) => {
              setEditorContent(content);
            }}
            initialContent={editorContent}
          />
        </div>

        <div className="flex mb-4">
          <div className="w-1/2 mr-4">
            <label htmlFor="start_date">Start Date </label>

            <input
              type="date"
              {...register("event_host.start_date", {
                required: "Start date is required",
              })}
              className="w-full p-2 border rounded"
            />
            {errors.event_host?.start_date && (
              <span className="text-red-500">
                {errors.event_host.start_date.message}
              </span>
            )}
          </div>
          <div className="w-1/2">
            <label htmlFor="end_date">End Date </label>

            <input
              type="date"
              {...register("event_host.end_date", {
                required: "End date is required",
              })}
              className="w-full p-2 border rounded"
            />
            {errors.event_host?.end_date && (
              <span className="text-red-500">
                {errors.event_host.end_date.message}
              </span>
            )}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <FileUpload
            label={"Event Image"}
            onUploadComplete={(url) => {
              setUploadedFiles((prev) => ({ ...prev, image: url }));
            }}
            defaultPreview={uploadedFiles.image}
          />
        </div>

        <div className="flex mb-4">
          <div className="w-1/2 mr-4">
            <label htmlFor="time">Time</label>

            <input
              type="time"
              {...register("event_host.time", { required: "Time is required" })}
              className="w-full p-2 border rounded"
              placeholder="Time"
            />
            {errors.event_host?.time && (
              <span className="text-red-500">
                {errors.event_host.time.message}
              </span>
            )}
          </div>
          <div className="w-1/2">
            <label htmlFor="end_date">Map Location </label>

            <input
              type="text"
              {...register("event_host.map_url")}
              placeholder="Map URL"
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div className="flex mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              {...register("is_featured")}
              className="mr-2"
            />
            Feature Event
          </label>
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {editing ? "Update Event" : "Add Event"}
          </button>
          {editing && (
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

      <Table
        data={events}
        columns={columns}
        pagination={pagination}
        onPageChange={(newPage) => loadEvents(newPage)}
        onSearch={handleSearch}
      />
      <ConfirmationDialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        onConfirm={handleDeleteConfirm}
        title="Confirm Deletion"
        message="Are you sure you want to delete this event? This action cannot be undone."
      />
    </div>
  );
}
