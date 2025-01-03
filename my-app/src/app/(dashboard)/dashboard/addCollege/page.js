"use client";
import { useForm } from "react-hook-form";
import { useState } from "react";

export default function ManageInstitutions() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const [institutions, setInstitutions] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  // Handle form submission
  const onSubmit = (data) => {
    if (editIndex !== null) {
      const updatedInstitutions = [...institutions];
      updatedInstitutions[editIndex] = data;
      setInstitutions(updatedInstitutions);
      setEditIndex(null);
    } else {
      setInstitutions([...institutions, data]);
    }
    reset();
  };

  // Handle edit action
  const handleEdit = (index) => {
    setEditIndex(index);
    reset(institutions[index]);
  };

  // Handle delete action
  const handleDelete = (index) => {
    setInstitutions(institutions.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4 w-5/6 md:w-1/2 mx-auto my-auto">
      <h1 className="text-xl font-bold mb-4">Manage Institutions</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 border p-4 rounded shadow-md "
      >
        <div>
          <label htmlFor="name" className="block font-medium">
            Institution Name:
          </label>
          <input
            id="name"
            className="border p-2 w-full rounded"
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && (
            <span className="text-red-500 text-sm">{errors.name.message}</span>
          )}
        </div>

        <div>
          <label htmlFor="type" className="block font-medium">
            Institution Type:
          </label>
          <select
            id="type"
            className="border border-gray-400 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-gray-400 hover:border-gray-500"
            {...register("type", { required: "Type is required" })}
          >
            <option value="" className="hover:bg-slate-800">
              Select Type
            </option>
            <option value="college" className=" hover:bg-slate-800">
              College
            </option>
            <option value="school" className="hover:bg-slate-200">
              School
            </option>
            <option value="consultancy" className="hover:bg-slate-200">
              Consultancy
            </option>
            <option value="skill-based" className="hover:bg-slate-200">
              Skill-Based Institution
            </option>
          </select>

          {errors.type && (
            <span className="text-red-500 text-sm">{errors.type.message}</span>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
        >
          {editIndex !== null ? "Update Institution" : "Add Institution"}
        </button>
      </form>

      <div className="mt-6">
        <h2 className="text-lg font-bold mb-2">Institution List</h2>
        {institutions.length === 0 ? (
          <p>No institutions added yet.</p>
        ) : (
          <ul className="space-y-4">
            {institutions.map((institution, index) => (
              <li
                key={index}
                className="border p-4 rounded flex justify-between items-center"
              >
                <div>
                  <p className="font-bold">{institution.name}</p>
                  <p className="text-sm text-gray-500">{institution.type}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(index)}
                    className="bg-yellow-400 text-white py-1 px-3 rounded hover:bg-yellow-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
