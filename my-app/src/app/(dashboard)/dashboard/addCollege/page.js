"use client";
import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { createCollege, fetchCourse, fetchUniversities } from "./actions";
import { Upload } from "lucide-react";
import { getCourses } from "@/app/action";
import { get } from "lodash";
import { useSelector } from "react-redux";

const FileUpload = ({ onUploadComplete, label, defaultPreview = null }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(defaultPreview);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Create preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("title", file.name);
    formData.append("altText", file.name);
    formData.append("description", "");
    formData.append("file", file);
    formData.append("authorId", "1");

    try {
      const response = await fetch(
        "https://uploads.merouni.com/api/v1/media/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload media");
      }

      const data = await response.json();
      console.log("Upload complete:", data);
      onUploadComplete(data.media.url);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <label className="block mb-2">{label}</label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
        <div className="flex flex-col items-center">
          {!preview && <Upload className="h-12 w-12 text-gray-400" />}
          <div className="mt-4 text-center">
            <label className="cursor-pointer">
              <span className="text-blue-500 hover:text-blue-600">
                {preview ? "Change file" : "Click to upload"}
              </span>
              <input
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                accept="image/*"
                disabled={isUploading}
              />
            </label>
          </div>
        </div>
        {isUploading && (
          <div className="mt-4 text-center text-sm text-gray-500">
            Uploading...
          </div>
        )}
        {preview && (
          <div className="mt-4">
            <img
              src={preview}
              alt="Preview"
              className="mx-auto max-h-40 rounded-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default function CollegeForm() {
  const author_id = useSelector((state) => state.user.data.id);
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      author_id: author_id,
      institute_type: "Private",
      institute_level: [],
      courses: [],
      description: "",
      content: "",
      website_url: "",
      google_map_url: "",
      college_logo: "",
      featured_img: "",
      is_featured: false,
      pinned: false,
      images: [""],
      address: {
        country: "",
        state: "",
        city: "",
        street: "",
        postal_code: "",
      },
      contacts: ["", ""],
      members: [
        {
          name: "",
          contact_number: "",
          role: "",
          description: "",
        },
      ],
      admissions: [
        {
          course_id: "",
          eligibility_criteria: "",
          admission_process: "",
          fee_details: "",
          description: "",
        },
      ],
    },
  });

  const {
    fields: memberFields,
    append: appendMember,
    remove: removeMember,
  } = useFieldArray({ control, name: "members" });

  const {
    fields: admissionFields,
    append: appendAdmission,
    remove: removeAdmission,
  } = useFieldArray({ control, name: "admissions" });

  const {
    fields: imageFields,
    append: appendImage,
    remove: removeImage,
  } = useFieldArray({ control, name: "images" });

  const [universities, setUniversities] = useState([]);
  const [courses, setCourses] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState({
    logo: "",
    featured: "",
    additional: [],
  });

  const onSubmit = async (data) => {
    try {
      data.is_featured = +data.is_featured;
      data.pinned = +data.pinned;
      data.university_id=parseInt(data.university_id)
      data.courses=data.courses.map(course=>parseInt(course))

      // Ensure all image URLs are included
      data.college_logo = uploadedFiles.logo;
      data.featured_img = uploadedFiles.featured;
      data.images = uploadedFiles.additional.filter((url) => url);

      console.log("final data is", data);
      await createCollege(data);
      alert("College created successfully!");
    } catch (error) {
      alert(error.message || "Failed to create college");
    }
  };

  useEffect(() => {
    const getUniversities = async () => {
      try {
        const universityList = await fetchUniversities();
        setUniversities(universityList);
      } catch (error) {
        console.error("Error fetching universities:", error);
      }
    };
    getUniversities();
  }, []);

  useEffect(() => {
    const getCourses = async () => {
      try {
        const courseList = await fetchCourse();
        setCourses(courseList);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    getCourses();
  }, []);
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">College Management</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">College Name *</label>
              <input
                {...register("name", { required: true })}
                className="w-full p-2 border rounded"
              />
              {errors.name && (
                <span className="text-red-500">This field is required</span>
              )}
            </div>

            <div>
              <label className="block mb-2">Institute Type *</label>
              <select
                {...register("institute_type", { required: true })}
                className="w-full p-2 border rounded"
              >
                <option value="Private">Private</option>
                <option value="Public">Public</option>
              </select>
            </div>

            <div>
              <label className="block mb-2">Institute Level</label>
              <div className="space-y-2">
                {["School", "College"].map((level) => (
                  <label key={level} className="flex items-center">
                    <input
                      type="checkbox"
                      {...register("institute_level")}
                      value={level}
                      className="mr-2"
                    />
                    {level}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block mb-2">University *</label>
              <select
                {...register("university_id", {
                  required: true,
                })}
                className="w-full p-2 border rounded"
                onChange={(e) =>
                  setValue("university_id", Number(e.target.value))
                }
              >
                <option value="">Select University</option>
                {universities.map((university) => (
                  <option key={university.id} value={university.id}>
                    {university.fullname}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block mb-2">Description</label>
              <textarea
                {...register("description")}
                className="w-full p-2 border rounded h-24"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block mb-2">Content</label>
              <textarea
                {...register("content")}
                className="w-full p-2 border rounded h-24"
              />
            </div>
          </div>
        </div>

        {/* Courses Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map((course) => (
              <label key={course.id} className="flex items-center">
                <input
                  type="checkbox"
                  {...register("courses")}
                  value={course.id}
                  className="mr-2"
                />
                {course.title}
              </label>
            ))}
          </div>
        </div>

        {/*author section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Author Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Author ID *</label>
              <input
                {...register("author_id", { required: true })}
                className="w-full p-2 border rounded "
                disabled
              />
              {errors.author_id && (
                <span className="text-red-500">This field is required</span>
              )}
            </div>
          </div>
        </div>

        {/* Media Section */}
        {/* <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Media</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">College Logo URL</label>
              <input
                {...register("college_logo")}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-2">Featured Image URL</label>
              <input
                {...register("featured_img")}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div className="mt-4">
            <div className="flex justify-between items-center mb-4">
              <label className="block">Additional Images</label>
              <button
                type="button"
                onClick={() => appendImage("")}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Add Image URL
              </button>
            </div>
            {imageFields.map((field, index) => (
              <div key={field.id} className="flex gap-2 mb-2">
                <input
                  {...register(`images.${index}`)}
                  className="flex-1 p-2 border rounded"
                  placeholder="Image URL"
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div> */}

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Media</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FileUpload
                label="College Logo"
                onUploadComplete={(url) => {
                  setUploadedFiles((prev) => ({ ...prev, logo: url }));
                  setValue("college_logo", url);
                }}
                defaultPreview={uploadedFiles.logo}
              />
            </div>
            <div>
              <FileUpload
                label="Featured Image"
                onUploadComplete={(url) => {
                  setUploadedFiles((prev) => ({ ...prev, featured: url }));
                  setValue("featured_img", url);
                }}
                defaultPreview={uploadedFiles.featured}
              />
            </div>
          </div>

          <div className="mt-4">
            <div className="flex justify-between items-center mb-4">
              <label className="block">Additional Images</label>
              <button
                type="button"
                onClick={() => {
                  appendImage("");
                  setUploadedFiles((prev) => ({
                    ...prev,
                    additional: [...prev.additional, ""],
                  }));
                }}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Add Image
              </button>
            </div>
            {imageFields.map((field, index) => (
              <div key={field.id} className="mb-4">
                <FileUpload
                  label={`Additional Image ${index + 1}`}
                  onUploadComplete={(url) => {
                    const newAdditional = [...uploadedFiles.additional];
                    newAdditional[index] = url;
                    setUploadedFiles((prev) => ({
                      ...prev,
                      additional: newAdditional,
                    }));
                    setValue(`images.${index}`, url);
                  }}
                  defaultPreview={uploadedFiles.additional[index]}
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      removeImage(index);
                      const newAdditional = [...uploadedFiles.additional];
                      newAdditional.splice(index, 1);
                      setUploadedFiles((prev) => ({
                        ...prev,
                        additional: newAdditional,
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

        {/* Members Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Members</h2>
            <button
              type="button"
              onClick={() =>
                appendMember({
                  name: "",
                  contact_number: "",
                  role: "",
                  description: "",
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
                <label className="block mb-2">Name</label>
                <input
                  {...register(`members.${index}.name`)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-2">Role</label>
                <input
                  {...register(`members.${index}.role`)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-2">Contact Number</label>
                <input
                  {...register(`members.${index}.contact_number`)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-2">Description</label>
                <textarea
                  {...register(`members.${index}.description`)}
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

        {/* Admissions Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Admissions</h2>
            <button
              type="button"
              onClick={() =>
                appendAdmission({
                  course_id: "",
                  eligibility_criteria: "",
                  admission_process: "",
                  fee_details: "",
                  description: "",
                })
              }
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Add Admission
            </button>
          </div>

          {admissionFields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 border rounded"
            >
              <div>
                <label className="block mb-2">Course</label>
                <select
                  {...register(`admissions.${index}.course_id`)}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-2">Eligibility Criteria</label>
                <input
                  {...register(`admissions.${index}.eligibility_criteria`)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-2">Admission Process</label>
                <input
                  {...register(`admissions.${index}.admission_process`)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-2">Fee Details</label>
                <input
                  {...register(`admissions.${index}.fee_details`)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-2">Description</label>
                <textarea
                  {...register(`admissions.${index}.description`)}
                  className="w-full p-2 border rounded"
                />
              </div>
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeAdmission(index)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

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
                    {...register(`address.${field}`, { required: true })}
                    className="w-full p-2 border rounded"
                  />
                  {errors.address?.[field] && (
                    <span className="text-red-500">This field is required</span>
                  )}
                </div>
              )
            )}
            <div>
              <label className="block mb-2">Google Map URL</label>
              <input
                {...register("google_map_url")}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Website URL</label>
              <input
                {...register("website_url")}
                className="w-full p-2 border rounded"
              />
            </div>
            {[0, 1].map((index) => (
              <div key={index}>
                <label className="block mb-2">Contact {index + 1}</label>
                <input
                  {...register(`contacts.${index}`)}
                  className="w-full p-2 border rounded"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Featured and Pinned */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Additional Settings</h2>
          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                {...register("is_featured")}
                className="mr-2"
              />
              Featured College
            </label>
            <label className="flex items-center">
              <input type="checkbox" {...register("pinned")} className="mr-2" />
              Pinned
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Create College
        </button>
      </form>
    </div>
  );
}
