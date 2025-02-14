"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { decodeJwt } from "jose";
import { useSelector } from "react-redux";

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
      { college_id: college.id, teacher_id: teacherId, students: [] },
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
    console.log("Form to be submitted:", formData);
    try {
      const response = await fetch(
        `${process.env.baseUrl}${process.env.version}/referral/agent-apply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData), // API expects multiple colleges
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
    //     <div className="flex flex-col">
    //       <h2>Apply For Student</h2>
    //       <form>
    //         <div>
    //           <label htmlFor="search">Search College</label>
    //         </div>
    //         <div>
    //           <label htmlFor="formData">Application field here</label>
    //         </div>
    //       </form>
    //     </div>
    //   );
    <div className="p-4">
      <h2 className="text-lg font-semibold">Apply for Students</h2>
      <form onSubmit={handleSubmit}>
        {/* College Search */}
        <div className="mb-4">
          <label className="block">Search College</label>
          <input
            type="text"
            value={collegeSearch}
            onChange={searchCollege}
            className="border rounded w-full p-2"
            placeholder="Type college name..."
          />
          {/* Show search results */}
          {searchResults.length > 0 && (
            <ul className="border rounded mt-2">
              {searchResults.map((college) => (
                <li
                  key={college.id}
                  className="cursor-pointer p-2 hover:bg-gray-200"
                  onClick={() => addCollege(college)}
                >
                  {college.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Colleges & Students */}
        {formData.map((college, collegeIndex) => (
          <div key={collegeIndex} className="mb-4 p-4 border rounded">
            <h3 className="font-semibold">
              College ID: {college.college_id}
              <button
                onClick={() => deleteCollege(collegeIndex)}
                className="bg-red-500 text-white ml-4 p-1 rounded"
              >
                🗑 Delete College
              </button>
            </h3>

            {college.students.map((student, studentIndex) => (
              <div key={studentIndex} className="border p-2 mb-2 rounded">
                <input
                  type="text"
                  name="student_name"
                  value={student.student_name}
                  onChange={(e) =>
                    handleStudentChange(
                      collegeIndex,
                      studentIndex,
                      "student_name",
                      e.target.value
                    )
                  }
                  className="border p-2 w-full"
                  placeholder="Student Name"
                />
                {errors[`student_name_${collegeIndex}_${studentIndex}`] && (
                  <span className="text-red-500 text-sm">
                    {errors[`student_name_${collegeIndex}_${studentIndex}`]}
                  </span>
                )}

                <input
                  type="email"
                  name="student_email"
                  value={student.student_email}
                  onChange={(e) =>
                    handleStudentChange(
                      collegeIndex,
                      studentIndex,
                      "student_email",
                      e.target.value
                    )
                  }
                  className="border p-2 w-full mt-2"
                  placeholder="Email"
                />
                <input
                  type="text"
                  name="student_phone_no"
                  value={student.student_phone_no}
                  onChange={(e) =>
                    handleStudentChange(
                      collegeIndex,
                      studentIndex,
                      "student_phone_no",
                      e.target.value
                    )
                  }
                  className="border p-2 w-full mt-2"
                  placeholder="Phone Number"
                />
                <input
                  type="text"
                  name="student_description"
                  value={student.student_description}
                  onChange={(e) =>
                    handleStudentChange(
                      collegeIndex,
                      studentIndex,
                      "student_description",
                      e.target.value
                    )
                  }
                  className="border p-2 w-full mt-2"
                  placeholder="Description"
                />
              </div>
            ))}

            <button
              type="button"
              className="bg-blue-500 text-white p-2 rounded"
              onClick={() => addStudent(collegeIndex)}
            >
              + Add Student
            </button>

            <button
              type="button"
              onClick={() => deleteStudent(collegeIndex, studentIndex)}
            >
              🗑 Delete Student{" "}
            </button>
          </div>
        ))}

        <button
          type="submit"
          className="bg-green-500 text-white p-2 rounded mt-4"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default page;
