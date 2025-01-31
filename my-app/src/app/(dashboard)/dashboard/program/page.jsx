"use client";
import React, { useState, useEffect, useMemo } from "react";
import { getAllScholarships } from "../scholarship/actions";
import {
  getCourses,
  createProgram,
  updateProgram,
  getPrograms,
  getFaculties,
} from "../../../action";
import Fuse from "fuse.js";
import { toast } from "react-toastify";
import Loading from "../../../components/Loading";
import Table from "@/app/components/Table";
import { Edit2, Trash2 } from "lucide-react";

const ProgramManager = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    faculty: "",
    duration: 0,
    credits: 0,
    level: "",
    language: ["English"],
    eligibilityCriteria: "",
    applicationOpeningStatus: "",
    fees: 0,
    scholarships: [],
    curriculum: [
      {
        year: "",
        semesters: [
          {
            semester: "",
            nonElective: [],
            elective: [],
          },
        ],
      },
    ],
    learningOutcomes: [],
    deliveryType: "Semester",
    deliveryMode: "On-Campus",
    startDate: "",
    endDate: "",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
  });
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [error, setError] = useState(null);
  const [nonElectiveCourseSearch, setNonElectiveCourseSearch] = useState("");
  const [electiveCourseSearch, setElectiveCourseSearch] = useState("");
  const [programs, setPrograms] = useState([]);
  const [nonElectiveSuggestions, setNonElectiveSuggestions] = useState([]);
  const [electiveSuggestions, setElectiveSuggestions] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const columns = useMemo(() => [
    {
      header: "Program Name",
      accessorKey: "title",
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
      header: "Application Status",
      accessorKey: "applicationOpeningStatus",
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
  ]);

  const handleEdit = (program) => {
    setFormData({
      title: program.title,
      description: program.description,
      faculty: program.faculty,
      duration: program.duration,
      credits: program.credits,
      level: program.level,
      language: [...program.language], // Copy the array
      eligibilityCriteria: program.eligibilityCriteria,
      applicationOpeningStatus: program.applicationOpeningStatus,
      fees: program.fees,
      scholarships: program.scholarships.map((scholarship) => ({
        ...scholarship,
      })), // Deep copy scholarships
      curriculum: program.curriculum.map((year) => ({
        year: year.year,
        semesters: year.semesters.map((semester) => ({
          semester: semester.semester,
          nonElective: [...semester.nonElective], // Copy array to avoid mutation
          elective: [...semester.elective],
        })),
      })),
      learningOutcomes: [...program.learningOutcomes], // Copy array
      deliveryType: program.deliveryType,
      deliveryMode: program.deliveryMode,
      startDate: program.startDate,
      endDate: program.endDate,
    });
    setEditingId(program._id); // Set the program's ID for editing
    setError(null); // Clear any existing errors
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this program?")) {
      try {
        await deleteProgram(id); // Call API or function to delete the program
        loadAllPrograms(); // Reload the list of programs after deletion
        setError(null); // Clear any existing errors
      } catch (error) {
        setError("Failed to delete the program"); // Set error if deletion fails
        console.error("Error deleting program:", error);
      }
    }
  };

  const levels = [
    "SLC",
    "+2",
    "Undergraduate",
    "Postgraduate",
    "Diploma",
    "Certificate",
  ];

  useEffect(() => {
    loadScholarships();
  }, []);

  const loadScholarships = async () => {
    try {
      const response = await getAllScholarships();
      console.log(response);
      setScholarships(response.items);
      // console.log(scholarships);
    } catch (error) {
      setError("Failed to load scholarships");
      console.error("Error loading scholarships:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllPrograms();
  }, []);

  const loadAllPrograms = async (page = 1) => {
    try {
      const response = await getPrograms(page, 9, "asc");
      console.log("ALL RESPONSE UNIVERSITY:", response);
      setPrograms(response.items);
      setPagination({
        currentPage: response.pagination.currentPage,
        totalPages: response.pagination.totalPages,
        total: response.pagination.totalRecords,
      });
    } catch (error) {
      setError("Failed to load programs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const response = await getCourses();
      setCourses(response.items);
    } catch (error) {
      setError("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFaculty();
  }, []);

  const loadFaculty = async () => {
    try {
      const response = await getFaculties();
      setFaculties(response.items);
    } catch (error) {
      setError("Failed to load Faculties");
    } finally {
      setLoading(false);
    }
  };

  const handleCurriculumChange = (yearIndex, semesterIndex, field, value) => {
    setFormData((prevState) => {
      const updatedCurriculum = [...prevState.curriculum];

      if (semesterIndex === null) {
        // Update year-level fields
        updatedCurriculum[yearIndex] = {
          ...updatedCurriculum[yearIndex],
          [field]: value,
        };
      } else {
        // Update semester-level fields
        const updatedSemesters = [...updatedCurriculum[yearIndex].semesters];
        updatedSemesters[semesterIndex] = {
          ...updatedSemesters[semesterIndex],
          [field]: value,
        };

        updatedCurriculum[yearIndex] = {
          ...updatedCurriculum[yearIndex],
          semesters: updatedSemesters,
        };
      }

      return { ...prevState, curriculum: updatedCurriculum };
    });
  };

  const addYear = () => {
    setFormData({
      ...formData,
      curriculum: [
        ...formData.curriculum,
        {
          year: "",
          semesters: [
            {
              semester: "",
              nonElective: [],
              elective: [],
            },
          ],
        },
      ],
    });
  };

  const addSemester = (yearIndex) => {
    setFormData((prevState) => {
      const updatedCurriculum = [...prevState.curriculum];

      const updatedSemesters = [
        ...updatedCurriculum[yearIndex].semesters,
        { semester: "", nonElective: [], elective: [] },
      ];

      updatedCurriculum[yearIndex] = {
        ...updatedCurriculum[yearIndex],
        semesters: updatedSemesters,
      };

      return { ...prevState, curriculum: updatedCurriculum };
    });
  };

  const removeYear = (yearIndex) => {
    const updatedCurriculum = [...formData.curriculum];
    updatedCurriculum.splice(yearIndex, 1);
    setFormData({ ...formData, curriculum: updatedCurriculum });
  };

  const removeSemester = (yearIndex, semesterIndex) => {
    const updatedCurriculum = [...formData.curriculum];
    updatedCurriculum[yearIndex].semesters.splice(semesterIndex, 1);
    setFormData({ ...formData, curriculum: updatedCurriculum });
  };

  const handleCourseSearch = (input, type) => {
    if (type === "nonElective") {
      setNonElectiveCourseSearch(input);
      if (input) {
        const fuse = new Fuse(courses, { keys: ["title"], threshold: 0.3 });
        const results = fuse.search(input).map((result) => result.item);
        setNonElectiveSuggestions(results);
      } else {
        setNonElectiveSuggestions([]);
      }
    } else {
      setElectiveCourseSearch(input);
      if (input) {
        const fuse = new Fuse(courses, { keys: ["title"], threshold: 0.3 });
        const results = fuse.search(input).map((result) => result.item);
        setElectiveSuggestions(results);
      } else {
        setElectiveSuggestions([]);
      }
    }
  };

  const addCourse = (course, subType, year, semester) => {
    setFormData((prevState) => {
      const updatedCurriculum = [...prevState.curriculum];

      const updatedSemesters = updatedCurriculum[year].semesters.map(
        (semData, semIndex) => {
          if (semIndex === semester) {
            return {
              ...semData,
              [subType]: [...semData[subType], course._id],
            };
          }
          return semData;
        }
      );

      updatedCurriculum[year] = {
        ...updatedCurriculum[year],
        semesters: updatedSemesters,
      };
      return { ...prevState, curriculum: updatedCurriculum };
    });

    if (subType === "nonElective") {
      setNonElectiveCourseSearch("");
    } else {
      setElectiveCourseSearch("");
    }
  };

  const removeCourse = (courseId, subType, year, semester) => {
    setFormData((prevState) => {
      const updatedCurriculum = [...prevState.curriculum];

      // Deep clone the semester being updated
      const updatedSemesters = updatedCurriculum[year].semesters.map(
        (semData, semIndex) => {
          if (semIndex === semester) {
            return {
              ...semData,
              [subType]: semData[subType].filter((id) => id !== courseId), // Remove course
            };
          }
          return semData;
        }
      );

      updatedCurriculum[year] = {
        ...updatedCurriculum[year],
        semesters: updatedSemesters,
      };

      return { ...prevState, curriculum: updatedCurriculum };
    });
  };

  const addLearningOutcome = () => {
    setFormData((prevData) => ({
      ...prevData,
      learningOutcomes: [...prevData.learningOutcomes, ""],
    }));
  };

  const updateLearningOutcome = (index, value) => {
    setFormData((prevData) => ({
      ...prevData,
      learningOutcomes: prevData.learningOutcomes.map((outcome, i) =>
        i === index ? value : outcome
      ),
    }));
  };

  const removeLearningOutcome = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      learningOutcomes: prevData.learningOutcomes.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    try {
      const formattedData = {
        ...formData,
        duration: Number(formData.duration),
        credits: Number(formData.credits),
        fees: Number(formData.fees),
        startDate: formatDate(formData.startDate),
        endDate: formatDate(formData.endDate),
      };
      let response;
      if (editingId) {
        // If editingId is present, update the existing university
        response = await updateProgram(editingId, formattedData); // Call the update function
        console.log("Response from updateProgram", response);

        if (response?.message) {
          toast.success(response.message || "Program updated successfully!");
        } else {
          throw new Error(
            `Failed to update program: ${response?.message || "Unknown error"}`
          );
        }

        setEditingId(null); // Clear the editing state
      } else {
        // If no editingId, create a new university
        response = await createProgram(formattedData); // Call the create function
        console.log("Response from createProgram", response);

        if (response?.status === 201) {
          toast.success(response.message || "Program added successfully!");
        } else if (response?.status === 403) {
          toast.error(response.message || "Program add failed");
        } else {
          throw new Error(
            `Failed to add program: ${response?.message || "Unknown error"}`
          );
        }
      }

      // Reset the form data
      setFormData({
        title: "",
        description: "",
        faculty: "",
        duration: 0,
        credits: 0,
        level: "",
        language: ["English"],
        eligibilityCriteria: "",
        applicationOpeningStatus: "",
        fees: 0,
        scholarships: [],
        curriculum: [
          {
            year: "",
            semesters: [
              {
                semester: "",
                nonElective: [],
                elective: [],
              },
            ],
          },
        ],
        learningOutcomes: [],
        deliveryType: "Semester",
        deliveryMode: "On-Campus",
        startDate: "",
        endDate: "",
      });
      setEditingId(null);
      setError(null);

      loadAllPrograms();
    } catch (error) {
      console.error(
        `Error ${editingId ? "updating" : "adding"} program:`,
        error.message
      );
      toast.error(
        `An error occurred while ${
          editingId ? "updating" : "adding"
        } the program.`
      );
    }
  };

  const handleScholarships = (selectedOptions) => {
    setFormData((formData) => ({
      ...formData,
      scholarships: Array.from(
        new Set([...formData.scholarships, ...selectedOptions])
      ),
    }));
  };

  const handleRemoveScholarships = (scholarshipToRemove) => {
    setFormData((formData) => ({
      ...formData,
      scholarships: formData.scholarships.filter(
        (scholarship) => scholarship !== scholarshipToRemove
      ),
    }));
  };

  const formatDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    return d.toISOString().split("T")[0]; // Returns YYYY-MM-DD format
  };

  const getCourseTitle = (courseId) => {
    const course = courses.find((course) => course._id === courseId);
    return course ? course.title : courseId;
  };

  const getScholarshipTitle = (scholarshipId) => {
    const scholarship = scholarships.find(
      (scholarship) => scholarship._id === scholarshipId
    );
    return scholarship ? scholarship.name : scholarshipId;
  };

  if (loading)
    return (
      <div className="mx-auto">
        <Loading />
      </div>
    );

  return (
    <div className="p-4 w-4/5 mx-auto">
      <h1 className="text-2xl font-bold mb-4">Program Management</h1>
      <form className="mb-8 space-y-4" onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={(e) =>
              setFormData((formData) => ({
                ...formData,
                title: e.target.value,
              }))
            }
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label
            htmlFor="faculty"
            className="block text-sm font-medium text-gray-700"
          >
            Faculty
          </label>
          <select
            value={formData.faculty}
            className="border border-gray-400 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-gray-400 hover:border-gray-500"
            onChange={(e) =>
              setFormData((formData) => ({
                ...formData,
                faculty: e.target.value,
              }))
            }
          >
            <option value="" disabled>
              Select Faculty
            </option>
            {faculties.map((facult, index) => (
              <option value={facult._id} key={index}>
                {facult.title}
              </option>
            ))}
          </select>
        </div>

        <div className="flex">
          <div className="w-full">
            <label
              htmlFor="duration"
              className="block text-sm font-medium text-gray-700"
            >
              Duration
            </label>
            <input
              type="number"
              placeholder="Duration"
              value={formData.duration}
              onChange={(e) =>
                setFormData((formData) => ({
                  ...formData,
                  duration: e.target.value,
                }))
              }
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="w-full">
            <label
              htmlFor="credits"
              className="block text-sm font-medium text-gray-700"
            >
              Credit
            </label>
            <input
              type="number"
              placeholder="Credit"
              value={formData.credits}
              onChange={(e) =>
                setFormData((formData) => ({
                  ...formData,
                  credits: e.target.value,
                }))
              }
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="level"
            className="block text-sm font-medium text-gray-700"
          >
            Level
          </label>
          <select
            className="border border-gray-400 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-gray-400 hover:border-gray-500"
            onChange={(e) =>
              setFormData((formData) => ({
                ...formData,
                level: e.target.value,
              }))
            }
          >
            <option value="" disabled>
              Select Level
            </option>

            {levels.map((level, index) => (
              <option value={level} key={index}>
                {level}
              </option>
            ))}
          </select>
        </div>

        <div>
          <input
            type="text"
            placeholder="Language"
            value={formData.language}
            onChange={(e) =>
              setFormData((formData) => ({
                ...formData,
                language: e.target.value,
              }))
            }
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <input
            type="text"
            placeholder="Eligibility Criteria"
            value={formData.eligibilityCriteria}
            onChange={(e) =>
              setFormData((formData) => ({
                ...formData,
                eligibilityCriteria: e.target.value,
              }))
            }
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Opening Status
          </label>
          <input
            type="date"
            value={formData.applicationOpeningStatus}
            onChange={(e) =>
              setFormData({
                ...formData,
                applicationOpeningStatus: e.target.value,
              })
            }
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div>
          <label
            htmlFor="fees"
            className="block text-sm font-medium text-gray-700"
          >
            Fees
          </label>
          <input
            type="number"
            placeholder="Fee"
            value={formData.fees}
            onChange={(e) =>
              setFormData((formData) => ({
                ...formData,
                fees: e.target.value,
              }))
            }
            className="w-1/2 p-2 border rounded"
          />
        </div>

        <div>
          <label
            htmlFor="scholarships"
            className="block text-sm font-medium text-gray-700"
          >
            Scholarships
          </label>
          <select
            value=""
            className="border border-gray-400 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-gray-400 hover:border-gray-500"
            onChange={(e) => {
              const selectedOptions = Array.from(
                e.target.selectedOptions,
                (option) => option.value
              );
              handleScholarships(selectedOptions);
            }}
          >
            <option value="" disabled>
              Select Scholarships
            </option>

            {scholarships.map((scholarship, index) => (
              <option value={scholarship._id} key={index}>
                {scholarship.name}
              </option>
            ))}
          </select>

          <div className="mt-3 flex flex-wrap gap-2">
            {formData.scholarships.map((selectedScholarship, index) => (
              <div
                key={index}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center"
              >
                <span className="mr-2">
                  {getScholarshipTitle(selectedScholarship)}
                </span>
                <button
                  type="button"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleRemoveScholarships(selectedScholarship)} // Call the remove tag function
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label
            htmlFor="curriculum"
            className="block text-sm font-medium text-gray-700"
          >
            Curriculum
          </label>

          {formData.curriculum.map((yearData, yearIndex) => (
            <div key={yearIndex} className="border p-4 rounded mb-4">
              <div className="flex justify-between items-center">
                <input
                  type="text"
                  placeholder={`Year ${yearIndex + 1}`}
                  value={yearData.year}
                  onChange={(e) =>
                    handleCurriculumChange(
                      yearIndex,
                      null,
                      "year",
                      e.target.value
                    )
                  }
                  className="w-1/2 p-2 border rounded"
                />
                <button
                  type="button"
                  onClick={() => removeYear(yearIndex)}
                  className="text-red-500"
                >
                  Remove Year
                </button>
              </div>
              {yearData.semesters.map((semester, semesterIndex) => (
                <div
                  key={semesterIndex}
                  className="border p-4 rounded mt-4 bg-gray-100"
                >
                  <div className="flex justify-between items-center">
                    <input
                      type="text"
                      placeholder={`Semester ${semesterIndex + 1}`}
                      value={semester.semester}
                      onChange={(e) =>
                        handleCurriculumChange(
                          yearIndex,
                          semesterIndex,
                          "semester",
                          e.target.value
                        )
                      }
                      className="w-1/2 p-2 border rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeSemester(yearIndex, semesterIndex)}
                      className="text-red-500"
                    >
                      Remove Semester
                    </button>
                  </div>

                  {/* Non-Elective Courses Section */}
                  <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Non-Elective Courses
                    </label>
                    <input
                      type="text"
                      value={nonElectiveCourseSearch}
                      onChange={(e) =>
                        handleCourseSearch(e.target.value, "nonElective")
                      }
                      placeholder="Search Non-Elective Courses"
                      className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    />
                    {nonElectiveSuggestions.length > 0 && (
                      <ul className="mt-2 border border-gray-300 rounded-lg bg-white">
                        {nonElectiveSuggestions.map((course) => (
                          <li
                            key={course._id}
                            className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                            onClick={() => {
                              addCourse(
                                course,
                                "nonElective",
                                yearIndex,
                                semesterIndex
                              );
                              setNonElectiveSuggestions([]);
                            }}
                          >
                            {course.title}
                          </li>
                        ))}
                      </ul>
                    )}
                    {/* Display selected non-elective courses */}
                    <div className="mt-2 flex flex-wrap gap-2">
                      {semester.nonElective.map((courseId) => (
                        <div
                          key={courseId}
                          className="bg-blue-100 px-3 py-1 rounded-full flex items-center"
                        >
                          <span>{getCourseTitle(courseId)}</span>
                          <button
                            type="button"
                            onClick={() =>
                              removeCourse(
                                courseId,
                                "nonElective",
                                yearIndex,
                                semesterIndex
                              )
                            }
                            className="ml-2 text-red-500"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Elective Courses Section */}
                  <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Elective Courses
                    </label>
                    <input
                      type="text"
                      value={electiveCourseSearch}
                      onChange={(e) =>
                        handleCourseSearch(e.target.value, "elective")
                      }
                      placeholder="Search Elective Courses"
                      className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    />
                    {electiveSuggestions.length > 0 && (
                      <ul className="mt-2 border border-gray-300 rounded-lg bg-white">
                        {electiveSuggestions.map((course) => (
                          <li
                            key={course._id}
                            className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                            onClick={() => {
                              addCourse(
                                course,
                                "elective",
                                yearIndex,
                                semesterIndex
                              );
                              setElectiveSuggestions([]);
                            }}
                          >
                            {course.title}
                          </li>
                        ))}
                      </ul>
                    )}
                    {/* Display selected elective courses */}
                    <div className="mt-2 flex flex-wrap gap-2">
                      {semester.elective.map((courseId) => (
                        <div
                          key={courseId}
                          className="bg-blue-100 px-3 py-1 rounded-full flex items-center"
                        >
                          <span>{getCourseTitle(courseId)}</span>
                          <button
                            type="button"
                            onClick={() =>
                              removeCourse(
                                courseId,
                                "elective",
                                yearIndex,
                                semesterIndex
                              )
                            }
                            className="ml-2 text-red-500"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {yearData.semesters.length < 2 && (
                <button
                  type="button"
                  onClick={() => {
                    addSemester(yearIndex);
                  }}
                  className="mt-4 text-blue-500"
                >
                  Add Semester
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addYear}
            className="mt-4 text-blue-500"
          >
            Add Year
          </button>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Learning Outcomes
          </label>

          {formData.learningOutcomes.map((outcome, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={outcome}
                onChange={(e) => updateLearningOutcome(index, e.target.value)}
                placeholder={`Learning Outcome ${index + 1}`}
                className="w-full p-2 border rounded"
              />
              <button
                type="button"
                onClick={() => removeLearningOutcome(index)}
                className="text-red-500 px-2"
              >
                ×
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addLearningOutcome}
            className="text-blue-500"
          >
            Add Learning Outcome
          </button>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Delivery Type
          </label>
          <select
            value={formData.deliveryType}
            onChange={(e) =>
              setFormData((formData) => ({
                ...formData,
                deliveryType: e.target.value,
              }))
            }
            className="border border-gray-400 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-gray-400 hover:border-gray-500"
          >
            <option value="Semester">Semester</option>
            <option value="Yearly">Yearly</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Delivery Mode
          </label>
          <select
            value={formData.deliveryMode}
            onChange={(e) =>
              setFormData((formData) => ({
                ...formData,
                deliveryMode: e.target.value,
              }))
            }
            className="border border-gray-400 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-gray-400 hover:border-gray-500"
          >
            <option value="Online">Online</option>
            <option value="On-Campus">On-Campus</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>

        {/* Date Selection */}
        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
              type="date"
              value={formData.endDate}
              min={formData.startDate} // Ensures end date can't be before start date
              onChange={(e) =>
                setFormData({ ...formData, endDate: e.target.value })
              }
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
        </div>

        {error && <div className="text-red-500">{error}</div>}

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {editingId ? "Update Program" : "Add Program"}
        </button>
      </form>
      <Table
        data={programs}
        columns={columns}
        pagination={pagination}
        onPageChange={(newPage) => loadAllPrograms(newPage)}
      />
    </div>
  );
};

export default ProgramManager;
