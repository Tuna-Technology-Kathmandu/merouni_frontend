"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { authFetch } from "@/app/utils/authFetch";

const page = () => {
  const [formData, setFormData] = useState([]);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [collegeSearch, setCollegeSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const user = useSelector((state) => state.user.data);

  const teacherId = user.id;
  const searchCollege = async (e) => {
    const query = e.target.value;
    setCollegeSearch(query);
    if (query.length < 2) return;

    try {
      const response = await fetch(
        `${process.env.baseUrl}${process.env.version}/college?q=${query}`
      );
      const data = await response.json();
      setSearchResults(data.items || []);
    } catch (error) {
      console.error("College Search Error:", error);
    }
  };

  const addCollege = (college) => {
    setFormData((prev) => [
      ...prev,
      {
        college_id: college.id,
        teacher_id: teacherId,
        students: [],
        college_name: college.name,
      },
    ]);
    setCollegeSearch("");
    setSearchResults([]);
  };

  const handleStudentChange = (collegeIndex, studentIndex, field, value) => {
    setFormData((prev) => {
      const updated = [...prev];
      updated[collegeIndex].students[studentIndex][field] = value;
      return updated;
    });
  };

  const addStudent = (collegeIndex) => {
    setFormData((prev) => {
      const updated = [...prev];
      updated[collegeIndex] = {
        ...updated[collegeIndex],
        students: [
          ...updated[collegeIndex].students,
          {
            student_name: "",
            student_phone_no: "",
            student_email: "",
            student_description: "",
          },
        ],
      };
      return updated;
    });
  };

  const deleteStudent = (collegeIndex, studentIndex) => {
    setFormData((prev) => {
      const updated = [...prev];
      updated[collegeIndex].students.splice(studentIndex, 1);
      return updated;
    });
  };

  const deleteCollege = (collegeIndex) => {
    setFormData((prev) => prev.filter((_, index) => index !== collegeIndex));
  };

  // Validate Form Data
  const validateForm = () => {
    if (formData.length === 0) {
      toast.error("Please add at least one college");
      return false;
    }

    for (const college of formData) {
      if (!college.students || college.students.length === 0) {
        toast.error("Each college must have at least one student");
        return false;
      }
    }

    const newErrors = {};
    formData.forEach((college, collegeIndex) => {
      college.students.forEach((student, studentIndex) => {
        if (!student.student_name.trim()) {
          newErrors[`student_name_${collegeIndex}_${studentIndex}`] =
            "Student name is required";
        }
        if (
          !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(
            student.student_email
          )
        ) {
          newErrors[`student_email_${collegeIndex}_${studentIndex}`] =
            "Invalid email format";
        }
        if (!/^\d{10}$/.test(student.student_phone_no)) {
          newErrors[`student_phone_no_${collegeIndex}_${studentIndex}`] =
            "Phone number must be exactly 10 digits";
        }
        if (!student.student_description.trim()) {
          newErrors[`student_description_${collegeIndex}_${studentIndex}`] =
            "Description is required";
        }
      });
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit the Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const cleanedFormData = formData.map(({ college_name, ...rest }) => rest);

    console.log("Form to be submitted:", cleanedFormData);
    try {
      const response = await authFetch(
        `${process.env.baseUrl}${process.env.version}/referral/agent-apply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(cleanedFormData), // API expects multiple colleges
        }
      );

      console.log("Response:", response);

      const data = await response.json();
      if (response.ok) {
        toast.success(data.message || "Application Submitted Successfully");
        setFormData([]); // Reset form
      } else {
        toast.error(data?.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      toast.error("Connection error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Student Application Form
      </h2>
      <form onSubmit={handleSubmit}>
        {/* College Search */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search College
          </label>
          <div className="relative">
            <input
              type="text"
              value={collegeSearch}
              onChange={searchCollege}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Type college name to search..."
            />
            {searchResults.length > 0 && (
              <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {searchResults.map((college) => (
                  <li
                    key={college.id}
                    className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors border-b last:border-b-0"
                    onClick={() => addCollege(college)}
                  >
                    {college.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Colleges & Students */}
        {formData.map((college, collegeIndex) => (
          <div
            key={collegeIndex}
            className="mb-8 bg-gray-50 p-6 rounded-lg border border-gray-200"
          >
            <div className="flex justify-between items-center mb-4 gap-4">
              <h3 className="text-lg font-semibold text-gray-800">
                College Name: {college.college_name}
              </h3>
              <button
                onClick={() => deleteCollege(collegeIndex)}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <span>Delete</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>

            {college.students.map((student, studentIndex) => (
              <div
                key={studentIndex}
                className="mb-4 bg-white p-4 rounded-lg shadow-sm"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Student Name
                    </label>
                    <input
                      type="text"
                      value={student.student_name}
                      onChange={(e) =>
                        handleStudentChange(
                          collegeIndex,
                          studentIndex,
                          "student_name",
                          e.target.value
                        )
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter student name"
                    />
                    {errors[`student_name_${collegeIndex}_${studentIndex}`] && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors[`student_name_${collegeIndex}_${studentIndex}`]}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={student.student_email}
                      onChange={(e) =>
                        handleStudentChange(
                          collegeIndex,
                          studentIndex,
                          "student_email",
                          e.target.value
                        )
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter email address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={student.student_phone_no}
                      onChange={(e) =>
                        handleStudentChange(
                          collegeIndex,
                          studentIndex,
                          "student_phone_no",
                          e.target.value
                        )
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      value={student.student_description}
                      onChange={(e) =>
                        handleStudentChange(
                          collegeIndex,
                          studentIndex,
                          "student_description",
                          e.target.value
                        )
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter description"
                    />
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => deleteStudent(collegeIndex, studentIndex)}
                    className="px-3 py-1.5 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors text-sm"
                  >
                    Remove Student
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2"
              onClick={() => addStudent(collegeIndex)}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span>Add Student</span>
            </button>
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="w-full md:w-auto px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Processing...
            </span>
          ) : (
            "Submit Application"
          )}
        </button>
      </form>
    </div>
  );
};

export default page;
