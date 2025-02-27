"use client";
import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { getAllExams, createExam, updateExam, deleteExam } from "./actions";
import Loading from "../../../components/Loading";
import Table from "../../../components/Table";
import { Edit2, Trash2 } from "lucide-react";
import { authFetch } from "@/app/utils/authFetch";

export default function ExamManager() {
  const author_id = useSelector((state) => state.user.data.id);
  const [exams, setExams] = useState([]);
  const [levels, setLevels] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
  });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    level_id: "",
    affiliation: "",
    syllabus: "",
    pastQuestion: "",
    examDetails: [
      {
        exam_type: "Written",
        full_marks: "",
        pass_marks: "",
        number_of_question: "",
        question_type: "MCQ",
        duration: "",
      },
    ],
    applicationDetails: {
      normal_fee: "",
      late_fee: "",
      exam_date: "",
      opening_date: "",
      closing_date: "",
    },
  });

  // Fetch levels and universities
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [levelsResponse, universitiesResponse] = await Promise.all([
          fetch(`${process.env.baseUrl}${process.env.version}/level`).then(
            (res) => res.json()
          ),
          fetch(`${process.env.baseUrl}${process.env.version}/university`).then(
            (res) => res.json()
          ),
        ]);
        setLevels(levelsResponse.items);
        setUniversities(universitiesResponse.items);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load form data");
      }
    };
    fetchData();
  }, []);

  // Validate dates
  const validateDates = () => {
    const examDate = new Date(formData.applicationDetails.exam_date);
    const openingDate = new Date(formData.applicationDetails.opening_date);
    const closingDate = new Date(formData.applicationDetails.closing_date);

    if (openingDate >= closingDate) {
      setError("Opening date must be before closing date");
      return false;
    }
    if (closingDate >= examDate) {
      setError("Closing date must be before exam date");
      return false;
    }
    return true;
  };
  const columns = useMemo(
    () => [
      {
        header: "Title",
        accessorKey: "title",
      },
      {
        header: "Description",
        accessorKey: "description",
      },
      {
        header: "Syllabus",
        accessorKey: "syllabus",
      },
      {
        header: "Past Questions",
        accessorKey: "pastQuestion",
        cell: ({ getValue }) => (
          <a
            href={getValue()}
            className="text-blue-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            View
          </a>
        ),
      },
      {
        header: "Created Date",
        accessorKey: "createdAt",
        cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(),
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
              onClick={() => handleDelete(row.original.id)}
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
    loadExams();
  }, []);

  const loadExams = async (page = 1) => {
    try {
      const response = await getAllExams(page);
      
      setExams(response.items);
      setPagination({
        currentPage: response.pagination.currentPage,
        totalPages: response.pagination.totalPages,
        total: response.pagination.totalCount,
      });
    } catch (error) {
      setError("Failed to load exams");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    if (!query) {
      loadExams();
      return;
    }
    try {
      const response = await authFetch(
        `${process.env.baseUrl}${process.env.version}/exam?q=${query}`
      );
      if (response.ok) {
        const data = await response.json();
        setExams(data.items);

        if (data.pagination) {
          setPagination({
            currentPage: data.pagination.currentPage,
            totalPages: data.pagination.totalPages,
            total: data.pagination.totalCount,
          });
        }
      } else {
        setExams([]);
      }
    } catch (error) {
      console.error("Error fetching exams search results:", error.message);
      setExams([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateDates()) return;

    try {
      const formattedData = {
        ...formData,
        author: author_id,
        examDetails: [
          {
            ...formData.examDetails[0],
            full_marks: Number(formData.examDetails[0].full_marks),
            pass_marks: Number(formData.examDetails[0].pass_marks),
            number_of_question: Number(
              formData.examDetails[0].number_of_question
            ),
          },
        ],
        applicationDetails: {
          ...formData.applicationDetails,
          normal_fee: Number(formData.applicationDetails.normal_fee),
          late_fee: Number(formData.applicationDetails.late_fee),
        },
        id: editingId,
      };
      await createExam(formattedData);
      // Reset form...
      setFormData({
        title: "",
        description: "",
        level_id: "",
        affiliation: "",
        syllabus: "",
        pastQuestion: "",
        examDetails: [
          {
            exam_type: "Written",
            full_marks: "",
            pass_marks: "",
            number_of_question: "",
            question_type: "MCQ",
            duration: "",
          },
        ],
        applicationDetails: {
          normal_fee: "",
          late_fee: "",
          exam_date: "",
          opening_date: "",
          closing_date: "",
        },
      });
      setEditingId(null);
      setError(null);
      loadExams();
    } catch (error) {
      setError(`Failed to ${editingId ? "update" : "create"} exam`);
      console.error("Error saving exam:", error);
    }
  };

  const handleEdit = (exam) => {
    
    setFormData({
      title: exam.title,
      description: exam.description,
      level_id: exam.level_id,
      affiliation: exam.affiliation,
      syllabus: exam.syllabus,
      pastQuestion: exam.pastQuestion,
      examDetails: exam.exam_details || [
        {
          exam_type: "Written",
          full_marks: "",
          pass_marks: "",
          number_of_question: "",
          question_type: "MCQ",
          duration: "",
        },
      ],
      applicationDetails: exam.application_details[0] || {
        normal_fee: "",
        late_fee: "",
        exam_date: "",
        opening_date: "",
        closing_date: "",
      },
    });
    setEditingId(exam.id);
    setError(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this exam?")) {
      try {
        await deleteExam(id);
        loadExams();
        setError(null);
      } catch (error) {
        setError("Failed to delete exam");
        console.error("Error deleting exam:", error);
      }
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
      <h1 className="text-2xl font-bold mb-4">Exam Management</h1>

      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        {/* Basic Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Basic Information</h2>
          <input
            type="text"
            placeholder="Exam Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full p-2 border rounded"
            required
          />
          <select
            value={formData.level_id}
            onChange={(e) =>
              setFormData({ ...formData, level_id: e.target.value })
            }
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Level</option>
            {levels.map((level) => (
              <option key={level.id} value={level.id}>
                {level.title}
              </option>
            ))}
          </select>
          <select
            value={formData.affiliation}
            onChange={(e) =>
              setFormData({ ...formData, affiliation: e.target.value })
            }
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select University</option>
            {universities.map((university) => (
              <option key={university.id} value={university.id}>
                {university.fullname}
              </option>
            ))}
          </select>
          <textarea
            placeholder="Syllabus"
            value={formData.syllabus}
            onChange={(e) =>
              setFormData({ ...formData, syllabus: e.target.value })
            }
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="url"
            placeholder="Past Question URL"
            value={formData.pastQuestion}
            onChange={(e) =>
              setFormData({ ...formData, pastQuestion: e.target.value })
            }
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Exam Details */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Exam Details</h2>
          <select
            value={formData.examDetails[0].exam_type}
            onChange={(e) =>
              setFormData({
                ...formData,
                examDetails: [
                  {
                    ...formData.examDetails[0],
                    exam_type: e.target.value,
                  },
                ],
              })
            }
            className="w-full p-2 border rounded"
            required
          >
            <option value="Written">Written</option>
            <option value="Practical">Practical</option>
            <option value="Oral">Oral</option>
          </select>
          <input
            type="number"
            placeholder="Full Marks"
            value={formData.examDetails[0].full_marks}
            onChange={(e) =>
              setFormData({
                ...formData,
                examDetails: [
                  {
                    ...formData.examDetails[0],
                    full_marks: e.target.value,
                  },
                ],
              })
            }
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="number"
            placeholder="Pass Marks"
            value={formData.examDetails[0].pass_marks}
            onChange={(e) =>
              setFormData({
                ...formData,
                examDetails: [
                  {
                    ...formData.examDetails[0],
                    pass_marks: e.target.value,
                  },
                ],
              })
            }
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="number"
            placeholder="Number of Questions"
            value={formData.examDetails[0].number_of_question}
            onChange={(e) =>
              setFormData({
                ...formData,
                examDetails: [
                  {
                    ...formData.examDetails[0],
                    number_of_question: e.target.value,
                  },
                ],
              })
            }
            className="w-full p-2 border rounded"
            required
          />
          <select
            value={formData.examDetails[0].question_type}
            onChange={(e) =>
              setFormData({
                ...formData,
                examDetails: [
                  {
                    ...formData.examDetails[0],
                    question_type: e.target.value,
                  },
                ],
              })
            }
            className="w-full p-2 border rounded"
            required
          >
            <option value="MCQ">MCQ</option>
            <option value="Written">Written</option>
            <option value="Mixed">Mixed</option>
          </select>
          <input
            type="text"
            placeholder="Duration (e.g., 2 hours)"
            value={formData.examDetails[0].duration}
            onChange={(e) =>
              setFormData({
                ...formData,
                examDetails: [
                  {
                    ...formData.examDetails[0],
                    duration: e.target.value,
                  },
                ],
              })
            }
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Application Details */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Application Details</h2>
          {/* Normal fee and Late fee inputs remain the same */}

          <input
            type="text"
            placeholder="Normal fee (e.g., 2000)"
            value={formData.applicationDetails.normal_fee}
            onChange={(e) =>
              setFormData({
                ...formData,
                applicationDetails: {
                  ...formData.applicationDetails,
                  normal_fee: e.target.value,
                },
              })
            }
            className="w-full p-2 border rounded"
            required
          />

          <input
            type="text"
            placeholder="Late fee (e.g., 2000)"
            value={formData.applicationDetails.late_fee}
            onChange={(e) =>
              setFormData({
                ...formData,
                applicationDetails: {
                  ...formData.applicationDetails,
                  late_fee: e.target.value,
                },
              })
            }
            className="w-full p-2 border rounded"
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Exam Date
            </label>
            <input
              type="date"
              value={formData.applicationDetails.exam_date}
              min={formData.applicationDetails.closing_date || undefined}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  applicationDetails: {
                    ...formData.applicationDetails,
                    exam_date: e.target.value,
                  },
                })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Opening Date
            </label>
            <input
              type="date"
              value={formData.applicationDetails.opening_date}
              max={formData.applicationDetails.closing_date || undefined}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  applicationDetails: {
                    ...formData.applicationDetails,
                    opening_date: e.target.value,
                  },
                })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Closing Date
            </label>
            <input
              type="date"
              value={formData.applicationDetails.closing_date}
              min={formData.applicationDetails.opening_date || undefined}
              max={formData.applicationDetails.exam_date || undefined}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  applicationDetails: {
                    ...formData.applicationDetails,
                    closing_date: e.target.value,
                  },
                })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        {error && <div className="text-red-500">{error}</div>}

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {editingId ? "Update Exam" : "Add Exam"}
        </button>
      </form>

      <Table
        data={exams}
        columns={columns}
        pagination={pagination}
        onPageChange={(newPage) => loadExams(newPage)}
        onSearch={handleSearch}
      />
    </div>
  );
}
