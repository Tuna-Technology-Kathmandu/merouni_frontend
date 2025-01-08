"use client";
import { useState, useEffect, useMemo } from "react";
import {
  getAllScholarships,
  createScholarship,
  updateScholarship,
  deleteScholarship,
} from "./actions";
import Loading from "../../../components/Loading";
import Table from "../../../components/Table";
import { Edit2, Trash2 } from "lucide-react";

export default function ScholarshipManager() {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    eligibilityCriteria: "",
    amount: "",
    applicationDeadline: "",
    renewalCriteria: "",
    contactInfo: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);

  const columns = useMemo(
    () => [
      {
        header: "Name",
        accessorKey: "name",
      },
      {
        header: "Description",
        accessorKey: "description",
      },
      {
        header: "Eligibility",
        accessorKey: "eligibilityCriteria",
      },
      {
        header: "Amount",
        accessorKey: "amount",
        cell: ({ getValue }) => `$${getValue().toLocaleString()}`,
      },
      {
        header: "Deadline",
        accessorKey: "applicationDeadline",
        cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(),
      },
      {
        header: "Renewal Criteria",
        accessorKey: "renewalCriteria",
      },
      {
        header: "Contact",
        accessorKey: "contactInfo",
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

  useEffect(() => {
    loadScholarships();
  }, []);

  const loadScholarships = async () => {
    try {
      const response = await getAllScholarships();
      setScholarships(response.items);
    } catch (error) {
      setError("Failed to load scholarships");
      console.error("Error loading scholarships:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedData = {
        ...formData,
        amount: Number(formData.amount),
        applicationDeadline: formatDate(formData.applicationDeadline),
      };

      if (editingId) {
        await updateScholarship(editingId, formattedData);
      } else {
        await createScholarship(formattedData);
      }

      setFormData({
        name: "",
        description: "",
        eligibilityCriteria: "",
        amount: "",
        applicationDeadline: "",
        renewalCriteria: "",
        contactInfo: "",
      });
      setEditingId(null);
      setError(null);
      loadScholarships();
    } catch (error) {
      setError(`Failed to ${editingId ? "update" : "create"} scholarship`);
      console.error("Error saving scholarship:", error);
    }
  };

  const handleEdit = (scholarship) => {
    setFormData({
      name: scholarship.name,
      description: scholarship.description,
      eligibilityCriteria: scholarship.eligibilityCriteria,
      amount: scholarship.amount.toString(),
      applicationDeadline: formatDateForInput(scholarship.applicationDeadline),
      renewalCriteria: scholarship.renewalCriteria,
      contactInfo: scholarship.contactInfo,
    });
    setEditingId(scholarship._id);
    setError(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this scholarship?")) {
      try {
        await deleteScholarship(id);
        loadScholarships();
        setError(null);
      } catch (error) {
        setError("Failed to delete scholarship");
        console.error("Error deleting scholarship:", error);
      }
    }
  };

  const formatDate = (date) => {
    return date.split("-").join("/");
  };

  const formatDateForInput = (dateString) => {
    return new Date(dateString).toISOString().split("T")[0];
  };

  if (loading) return <div className="mx-auto"><Loading /></div>;

  return (
    <div className="p-4 w-4/5 mx-auto">
      <h1 className="text-2xl font-bold mb-4">Scholarship Management</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div>
          <input
            type="text"
            placeholder="Scholarship Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <input
            type="text"
            placeholder="Eligibility Criteria"
            value={formData.eligibilityCriteria}
            onChange={(e) =>
              setFormData({ ...formData, eligibilityCriteria: e.target.value })
            }
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <input
            type="number"
            placeholder="Amount"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <input
            type="date"
            value={formData.applicationDeadline}
            onChange={(e) =>
              setFormData({ ...formData, applicationDeadline: e.target.value })
            }
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <input
            type="text"
            placeholder="Renewal Criteria"
            value={formData.renewalCriteria}
            onChange={(e) =>
              setFormData({ ...formData, renewalCriteria: e.target.value })
            }
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <input
            type="text"
            placeholder="Contact Information"
            value={formData.contactInfo}
            onChange={(e) =>
              setFormData({ ...formData, contactInfo: e.target.value })
            }
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {error && <div className="text-red-500">{error}</div>}

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {editingId ? "Update Scholarship" : "Add Scholarship"}
        </button>
      </form>

      {/* Table */}
      <Table data={scholarships} columns={columns} />
    </div>
  );
}