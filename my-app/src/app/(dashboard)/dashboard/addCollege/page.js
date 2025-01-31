"use client";
import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { createCollege, fetchUniversities } from "./actions";

export default function CollegeForm() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      facilities: [{ title: "", description: "" }],
      members: [
        {
          role: "",
          salutation: "",
          name: "",
          contactInfo: { phone: "", email: "" },
        },
      ],
    },
  });

  const {
    fields: facilityFields,
    append: appendFacility,
    remove: removeFacility,
  } = useFieldArray({ control, name: "facilities" });

  const {
    fields: memberFields,
    append: appendMember,
    remove: removeMember,
  } = useFieldArray({ control, name: "members" });

  const [universities, setUniversities] = useState([]);

  const onSubmit = async (data) => {
    try {
      console.log(data);
      // await createCollege(data);
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">College Management</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* College Information */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">College Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Full Name *</label>
              <input
                {...register("fullname", { required: true })}
                className="w-full p-2 border rounded"
              />
              {errors.fullname && (
                <span className="text-red-500">This field is required</span>
              )}
            </div>

            <div>
              <label className="block mb-2">Institute Type *</label>
              <select
                {...register("instituteType", { required: true })}
                className="w-full p-2 border rounded"
              >
                <option value="Private">Private</option>
                <option value="Public">Public</option>
              </select>
            </div>

            <div>
              <label className="block mb-2">Affiliation ID *</label>
              <select
                {...register("affiliation", { required: true })}
                className="w-full p-2 border rounded"
              >
                <option value="">Select University</option>
                {universities.map((university) => (
                  <option key={university._id} value={university._id}>
                    {university.fullname}
                  </option>
                ))}
              </select>
              {errors.affiliation && (
                <span className="text-red-500">This field is required</span>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block mb-2">Description</label>
              <textarea
                {...register("description")}
                className="w-full p-2 border rounded h-24"
                placeholder="Enter college description..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block mb-2">Vision</label>
              <textarea
                {...register("visions")}
                className="w-full p-2 border rounded h-24"
                placeholder="Enter college vision..."
              />
            </div>
          </div>
        </div>

        {/* Facilities Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Facilities</h2>
            <button
              type="button"
              onClick={() => appendFacility({ title: "", description: "" })}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Add Facility
            </button>
          </div>

          {facilityFields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 border rounded"
            >
              <div>
                <label className="block mb-2">Facility Title</label>
                <input
                  {...register(`facilities.${index}.title`)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-2">Description</label>
                <textarea
                  {...register(`facilities.${index}.description`)}
                  className="w-full p-2 border rounded"
                />
              </div>
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeFacility(index)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
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
                  contactInfo: { phone: "", email: "" },
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
                  {...register(`members.${index}.contactInfo.phone`)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-2">Email</label>
                <input
                  type="email"
                  {...register(`members.${index}.contactInfo.email`)}
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

        {/* Address Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["country", "state", "city", "street", "postalCode"].map(
              (field) => (
                <div key={field}>
                  <label className="block mb-2 capitalize">{field} *</label>
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
                {...register("address.googleMapUrl")}
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
              <label className="block mb-2">Fax</label>
              <input
                {...register("contactInfo.faxes")}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-2">PO Box</label>
              <input
                {...register("contactInfo.poboxes")}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-2">Email</label>
              <input
                type="email"
                {...register("contactInfo.email")}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-2">Website URL</label>
              <input
                {...register("contactInfo.websiteUrl")}
                className="w-full p-2 border rounded"
              />
            </div>
            {[0, 1].map((index) => (
              <div key={index}>
                <label className="block mb-2">Phone {index + 1}</label>
                <input
                  {...register(`contactInfo.phoneNumber.${index}`)}
                  className="w-full p-2 border rounded"
                />
              </div>
            ))}
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
