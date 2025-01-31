"use client";
import React, { useState, useMemo, useEffect } from "react";
import {
  createUniversity,
  getUniversities,
  deleteUniversity,
  updateUniversity,
} from "./actions";
import { toast } from "react-toastify";
import Loading from "../../../components/Loading";
import Table from "@/app/components/Table";
import { Edit2, Trash2 } from "lucide-react";

const UniversityManager = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    address: {
      country: "",
      state: "",
      city: "",
      street: "",
      postalCode: "",
    },
    level: [],
    contactInfo: {
      faxes: "",
      poboxes: "",
      email: "",
      phoneNumber: "",
    },
    members: [
      {
        role: "",
        salutation: "",
        name: "",
        contactInfo: {
          phone: "",
          email: "",
        },
      },
    ],
    assets: {
      gallery: [],
      videos: "",
      featuredImage: "",
    },
  });
  const [loading, setLoading] = useState(true);
  const [visibility, setVisibility] = useState(false);
  const [universities, setUniversities] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);

  const levelOptions = ["Bachelor", "Master", "Diploma", "PhD"];

  const columns = useMemo(
    () => [
      {
        header: "Full Name",
        accessorKey: "fullname",
      },
      {
        header: "Address",
        accessorKey: "address",
        cell: ({ getValue }) => {
          const address = getValue();
          return `${address.street},${address.city},${address.state},${address.country} - ${address.postalCode}`;
        },
      },
      {
        header: "Level",
        accessorKey: "level",
        cell: ({ getValue }) => getValue().join(", "),
      },

      {
        header: "Contact Info",
        accessorKey: "contactInfo",
        cell: ({ getValue }) => {
          const contact = getValue();
          return (
            <>
              <p>Email: {contact.email}</p>
              <p>Phone: {contact.phoneNumber}</p>
              <p>Faxes: {contact.faxes}</p>
              <p>PO Boxes: {contact.poboxes}</p>
            </>
          );
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

  const membersChange = (index, field, value) => {
    const updatedMembers = [...formData.members];
    updatedMembers[index][field] = value;
    setFormData((formData) => ({
      ...formData,
      members: updatedMembers,
    }));
  };

  const handleMemberContactChange = (index, field, value) => {
    const updatedMembers = [...formData.members];
    updatedMembers[index].contactInfo[field] = value;
    setFormData((formData) => ({
      ...formData,
      members: updatedMembers,
    }));
  };

  const handleLevel = (selectedOptions) => {
    setFormData((formData) => ({
      ...formData,
      level: Array.from(new Set([...formData.level, ...selectedOptions])),
    }));
  };

  const handleRemoveLevel = (levelToRemove) => {
    setFormData((formData) => ({
      ...formData,
      level: formData.level.filter((level) => level !== levelToRemove),
    }));
  };

  useEffect(() => {
    loadUniversities();
  }, []);

  const loadUniversities = async () => {
    try {
      const response = await getUniversities();
      setUniversities(response.items);
    } catch (error) {
      setError("Failed to load universities");
      console.error("Error loading universities:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (university) => {
    setFormData({
      fullname: university.fullname,
      address: {
        country: university.address.country,
        state: university.address.state,
        city: university.address.city,
        street: university.address.street,
        postalCode: university.address.postalCode,
      },
      level: university.level, // Assuming this is an array
      contactInfo: {
        faxes: university.contactInfo.faxes,
        poboxes: university.contactInfo.poboxes,
        email: university.contactInfo.email,
        phoneNumber: university.contactInfo.phoneNumber,
      },
      members: university.members.map((member) => ({
        role: member.role,
        salutation: member.salutation,
        name: member.name,
        contactInfo: {
          phone: member.contactInfo.phone,
          email: member.contactInfo.email,
        },
      })),
      assets: {
        gallery: [...university.assets.gallery],
        videos: university.assets.videos,
        featuredImage: university.assets.featuredImage,
      },
    });
    setEditingId(university._id);
    setError(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this university?")) {
      try {
        await deleteUniversity(id);
        loadUniversities();
        setError(null);
      } catch (error) {
        setError("Failed to delete university");
        console.error("Error deleting university:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    try {
      let response;
      if (editingId) {
        // If editingId is present, update the existing university
        response = await updateUniversity(editingId, formData); // Call the update function
        console.log("Response from updateUniversity", response);

        if (response?.message) {
          toast.success(response.message || "University updated successfully!");
        } else {
          throw new Error(
            `Failed to update university: ${
              response?.message || "Unknown error"
            }`
          );
        }

        setEditingId(null); // Clear the editing state
      } else {
        // If no editingId, create a new university
        response = await createUniversity(formData); // Call the create function
        console.log("Response from createUniversity", response);

        if (response?.message) {
          toast.success(response.message || "University added successfully!");
        } else {
          throw new Error(
            `Failed to add university: ${response?.message || "Unknown error"}`
          );
        }
      }

      // Reset the form data
      setFormData({
        fullname: "",
        address: {
          country: "",
          state: "",
          city: "",
          street: "",
          postalCode: "",
        },
        level: [],
        contactInfo: {
          faxes: "",
          poboxes: "",
          email: "",
          phoneNumber: "",
        },
        members: [
          {
            role: "",
            salutation: "",
            name: "",
            contactInfo: {
              phone: "",
              email: "",
            },
          },
        ],
        assets: {
          gallery: [],
          videos: "",
          featuredImage: "",
        },
      });

      loadUniversities(); // Refresh the list of universities
    } catch (error) {
      // Handle any errors that occur during submission
      console.error(
        `Error ${editingId ? "updating" : "adding"} university:`,
        error.message
      );
      toast.error(
        `An error occurred while ${
          editingId ? "updating" : "adding"
        } the university.`
      );
    }
  };

  if (loading)
    return (
      <div className="mx-auto">
        <Loading />
      </div>
    );

  return (
    <div className="p-4 w-4/5 mx-auto">
      <h1 className="text-2xl font-bold mb-4">University Management</h1>
      <form className="mb-8 space-y-4" onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="University Name"
            value={formData.fullname}
            onChange={(e) =>
              setFormData((formData) => ({
                ...formData,
                fullname: e.target.value,
              }))
            }
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700"
          >
            Address
          </label>
          <div className="flex flex-wrap ">
            <input
              type="text"
              placeholder="Country"
              value={formData.address.country}
              onChange={(e) =>
                setFormData((formData) => ({
                  ...formData,
                  address: { ...formData.address, country: e.target.value },
                }))
              }
              className="w-1/2 p-2 border rounded mb-2"
              required
            />
            <input
              type="text"
              placeholder="State"
              value={formData.address.state}
              onChange={(e) =>
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  address: {
                    ...prevFormData.address,
                    state: e.target.value,
                  },
                }))
              }
              className="w-1/2 p-2 border rounded mb-2"
              required
            />
            <input
              type="text"
              placeholder="City"
              value={formData.address.city}
              onChange={(e) =>
                setFormData((formData) => ({
                  ...formData,
                  address: { ...formData.address, city: e.target.value },
                }))
              }
              className="w-1/3 p-2 border rounded "
              required
            />
            <input
              type="text"
              placeholder="Street"
              value={formData.address.street}
              onChange={(e) =>
                setFormData((formData) => ({
                  ...formData,
                  address: { ...formData.address, street: e.target.value },
                }))
              }
              className="w-1/3 p-2 border rounded "
              required
            />
            <input
              type="text"
              placeholder="Postal Code"
              value={formData.address.postalCode}
              onChange={(e) =>
                setFormData((formData) => ({
                  ...formData,
                  address: { ...formData.address, postalCode: e.target.value },
                }))
              }
              className="w-1/3 p-2 border rounded "
              required
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="level"
            className="block text-sm font-medium text-gray-700"
          >
            Levels
          </label>
          <select
            value=""
            onChange={(e) => {
              const selectedOptions = Array.from(
                e.target.selectedOptions,
                (option) => option.value
              );
              handleLevel(selectedOptions);
            }}
            className="border border-gray-400 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-gray-400 hover:border-gray-500"
          >
            <option value="" disabled>
              Select tags
            </option>
            {levelOptions.map((level, index) => (
              <option value={level} key={index}>
                {level}
              </option>
            ))}
          </select>

          {/* Display selected levels */}
          <div className="mt-3 flex flex-wrap gap-2">
            {formData.level.map((selectedLevel, index) => (
              <div
                key={index}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center"
              >
                <span className="mr-2">{selectedLevel}</span>
                <button
                  type="button"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleRemoveLevel(selectedLevel)} // Call the remove tag function
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label
            htmlFor="contact"
            className="block text-sm font-medium text-gray-700"
          >
            Contact
          </label>
          <div className="flex flex-wrap ">
            <input
              type="text"
              placeholder="Faxes"
              value={formData.contactInfo.faxes}
              onChange={(e) =>
                setFormData((formData) => ({
                  ...formData,
                  contactInfo: {
                    ...formData.contactInfo,
                    faxes: e.target.value,
                  },
                }))
              }
              className="w-1/2 p-2 border rounded mb-2"
              required
            />

            <input
              type="text"
              placeholder="Post Office"
              value={formData.contactInfo.poboxes}
              onChange={(e) =>
                setFormData((formData) => ({
                  ...formData,
                  contactInfo: {
                    ...formData.contactInfo,
                    poboxes: e.target.value,
                  },
                }))
              }
              className="w-1/2 p-2 border rounded mb-2"
              required
            />
            <input
              type="text"
              placeholder="Email"
              value={formData.contactInfo.email}
              onChange={(e) =>
                setFormData((formData) => ({
                  ...formData,
                  contactInfo: {
                    ...formData.contactInfo,
                    email: e.target.value,
                  },
                }))
              }
              className="w-1/2 p-2 border rounded "
              required
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={formData.contactInfo.phoneNumber}
              onChange={(e) =>
                setFormData((formData) => ({
                  ...formData,
                  contactInfo: {
                    ...formData.contactInfo,
                    phoneNumber: e.target.value,
                  },
                }))
              }
              className="w-1/2 p-2 border rounded "
              required
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="members"
            className="block text-sm font-medium text-gray-700"
          >
            Members
          </label>
          {formData.members.map((member, index) => (
            <div className="  mb-4 rounded " key={index}>
              <div className="flex flex-wrap ">
                <input
                  type="text"
                  placeholder="Role"
                  value={member.role}
                  onChange={(e) => membersChange(index, "role", e.target.value)}
                  className="w-1/3 p-2 border rounded"
                  required
                />
                <input
                  type="text"
                  placeholder="Salutation: Mr./Ms."
                  value={member.salutation}
                  onChange={(e) =>
                    membersChange(index, "salutation", e.target.value)
                  }
                  className="w-1/3 p-2 border rounded"
                  required
                />
                <input
                  type="text"
                  placeholder="Name"
                  value={member.name}
                  onChange={(e) => membersChange(index, "name", e.target.value)}
                  className="w-1/3 p-2 border rounded"
                  required
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Phone"
                  value={member.contactInfo.phone}
                  onChange={(e) =>
                    handleMemberContactChange(index, "phone", e.target.value)
                  }
                  className="w-1/2 p-2 border rounded"
                  required
                />
                <input
                  type="text"
                  placeholder="Email"
                  value={member.contactInfo.email}
                  onChange={(e) =>
                    handleMemberContactChange(index, "email", e.target.value)
                  }
                  className="w-1/2 p-2 border rounded"
                  required
                />
              </div>
              <button
                type="button"
                className="text-red-500 text-sm"
                onClick={() => {
                  const updatedMembers = [...formData.members];
                  updatedMembers.splice(index, 1);
                  setFormData({ ...formData, members: updatedMembers });
                }}
              >
                Remove Member
              </button>
            </div>
          ))}
          <button
            type="button"
            className="text-blue-500 text-sm"
            onClick={() =>
              setFormData({
                ...formData,
                members: [
                  ...formData.members,
                  {
                    role: "",
                    salutation: "",
                    name: "",
                    contactInfo: { phone: "", email: "" },
                  },
                ],
              })
            }
          >
            Add Member
          </button>
        </div>

        {/* Assets Section */}
        <div>
          <label
            htmlFor="assets"
            className="block text-sm font-medium text-gray-700"
          >
            Assets
          </label>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Gallery URLs (Comma-separated)"
              value={formData.assets.gallery.join(", ")}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  assets: {
                    ...formData.assets,
                    gallery: e.target.value.split(","),
                  },
                })
              }
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Videos"
              value={formData.assets.videos}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  assets: { ...formData.assets, videos: e.target.value },
                })
              }
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Featured Image URL"
              value={formData.assets.featuredImage}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  assets: { ...formData.assets, featuredImage: e.target.value },
                })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        {/* {error && <div className="text-red-500">{error}</div>} */}

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {editingId ? "Update University" : "Add University"}
        </button>
      </form>

      <Table data={universities} columns={columns} />
    </div>
  );
};

export default UniversityManager;
