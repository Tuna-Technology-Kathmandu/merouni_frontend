"use client";
import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useSelector } from "react-redux";
import Table from "@/app/components/Table";
import { Edit2, Trash2 } from "lucide-react";
import { authFetch } from "@/app/utils/authFetch";
import { toast } from "react-toastify";
import ConfirmationDialog from "../addCollege/ConfirmationDialog";
import { X } from "lucide-react";

export default function ProgramForm() {

  const author_id = useSelector((state) => state.user.data.id);
  const [isOpen, setIsOpen] = useState(false);
  const [programs, setPrograms] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // States for dropdowns
  const [faculties, setFaculties] = useState([]);
  const [levels, setLevels] = useState([]);
  const [scholarships, setScholarships] = useState([]);
  const [exams, setExams] = useState([]);
  const [courses, setCourses] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [collegeSearch, setCollegeSearch] = useState("");
  const [selectedColleges, setSelectedColleges] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

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
  const addCollege = (college) => {
    if (!selectedColleges.some((c) => c.id === college.id)) {
      setSelectedColleges((prev) => [...prev, college]);
      // Update form value
      const collegeIds = [...selectedColleges, college].map((c) => c.id);
      setValue("colleges", collegeIds);
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
    setValue("colleges", updatedCollegeIds);
  };

  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      author: author_id,
      faculty_id: "",
      duration: "",
      credits: "",
      level_id: "",
      language: "",
      eligibility_criteria: "",
      fee: "",
      scholarship_id: "",
      curriculum: "",
      learning_outcomes: "",
      delivery_type: "Full-time",
      delivery_mode: "On-campus",
      careers: "",
      exam_id: "",
      syllabus: [
        {
          year: 1,
          semester: 1,
          course_id: "",
        },
      ],
      colleges: [],
    },
  });

  const {
    fields: syllabusFields,
    append: appendSyllabus,
    remove: removeSyllabus,
  } = useFieldArray({ control, name: "syllabus" });

  // Fetch all necessary data on component mount
  useEffect(() => {
    fetchPrograms();
    fetchFaculties();
    fetchLevels();
    fetchScholarships();
    fetchExams();
    fetchCourses();
    fetchColleges();
  }, []);

  // Fetch functions for all dropdown data
  const fetchPrograms = async () => {
    setTableLoading(true);
    try {
      const response = await authFetch(
        `${process.env.baseUrl}${process.env.version}/program`
      );
      const data = await response.json();
      setPrograms(data.items);
    } catch (error) {
      toast.error("Failed to fetch programs");
    } finally {
      setTableLoading(false);
    }
  };

  const fetchFaculties = async () => {
    try {
      const response = await authFetch(
        `${process.env.baseUrl}${process.env.version}/faculty`
      );
      const data = await response.json();
      setFaculties(data.items);
    } catch (error) {
      toast.error("Failed to fetch faculties");
    }
  };

  const fetchLevels = async () => {
    try {
      const response = await authFetch(
        `${process.env.baseUrl}${process.env.version}/level`
      );
      const data = await response.json();
      setLevels(data.items);
    } catch (error) {
      toast.error("Failed to fetch levels");
    }
  };
  const fetchScholarships = async () => {
    try {
      const response = await authFetch(
        `${process.env.baseUrl}${process.env.version}/scholarship`
      );
      const data = await response.json();
      setScholarships(data.scholarships);
    } catch (error) {
      toast.error("Failed to fetch levels");
    }
  };

  const fetchExams = async () => {
    try {
      const response = await authFetch(
        `${process.env.baseUrl}${process.env.version}/exam`
      );
      const data = await response.json();
      setExams(data.items);
    } catch (error) {
      toast.error("Failed to fetch levels");
    }
  };

  const fetchColleges = async () => {
    try {
      const response = await authFetch(
        `${process.env.baseUrl}${process.env.version}/college`
      );
      const data = await response.json();
      setColleges(data.items);
    } catch (error) {
      toast.error("Failed to fetch levels");
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await authFetch(
        `${process.env.baseUrl}${process.env.version}/course`
      );
      const data = await response.json();
      setCourses(data.items);
    } catch (error) {
      toast.error("Failed to fetch levels");
    }
  };

  const onSubmit = async (data) => {
    try {
      const url = `${process.env.baseUrl}${process.env.version}/program`;
      const method =  "POST";
      console.log("while submiting data is", data);

      const response = await authFetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      toast.success(
        editing
          ? "Program updated successfully!"
          : "Program created successfully!"
      );
      setEditing(false);
      reset();
      fetchPrograms();
      setIsOpen(false);
    } catch (error) {
      toast.error(error.message || "Failed to save program");
    }
  };

  const handleEdit = async (slug) => {
    try {
      setEditing(true);
      setLoading(true);
      setIsOpen(true);

      const response = await authFetch(
        `${process.env.baseUrl}${process.env.version}/program/${slug}`
      );
      const program = await response.json();

      // Set basic information
      setValue("id", program.id);
      setValue("title", program.title);
      setValue("duration", program.duration);
      setValue("credits", program.credits);
      setValue("language", program.language);
      setValue("eligibility_criteria", program.eligibility_criteria);
      setValue("fee", program.fee);
      setValue("curriculum", program.curriculum);
      setValue("learning_outcomes", program.learning_outcomes);
      setValue("delivery_type", program.delivery_type);
      setValue("delivery_mode", program.delivery_mode);
      setValue("careers", program.careers);
      setValue("syllabus", program.syllabus);

      // Set faculty_id from programfaculty
      if (program.programfaculty) {
        const faculty = faculties.find(
          (f) => f.title === program.programfaculty.title
        );
        if (faculty) {
          setValue("faculty_id", faculty.id);
        }
      }

      // Set level_id from programlevel
      if (program.programlevel) {
        const level = levels.find(
          (l) => l.title === program.programlevel.title
        );
        if (level) {
          setValue("level_id", level.id);
        }
      }

      // Set scholarship_id from programscholarship
      if (program.programscholarship) {
        const scholarship = scholarships.find(
          (s) => s.name === program.programscholarship.name
        );
        if (scholarship) {
          setValue("scholarship_id", scholarship.id);
        }
      }

      // Set exam_id from programexam
      if (program.programexam) {
        const exam = exams.find((e) => e.title === program.programexam.title);
        if (exam) {
          setValue("exam_id", exam.id);
        }
      }

      // Set colleges - extract college_ids from program_college
      if (program.colleges) {
        const collegeIds = program.colleges.map(
          (college) => college.program_college.college_id
        );
        setValue("colleges", collegeIds);
      }

      if (program.colleges) {
        const collegeData = program.colleges.map((college) => ({
          id: college.program_college.college_id,
          name: college.name,
          slugs: college.slugs,
        }));
        setSelectedColleges(collegeData);
        setValue(
          "colleges",
          collegeData.map((c) => c.id)
        );
      }

      // Set syllabus
      // if (program.syllabus) {
      //   // Clear existing syllabus fields first
      //   while (syllabusFields.length) {
      //     removeSyllabus(0);
      //   }

      //   // Add new syllabus entries
      //   program.syllabus.forEach((item, index) => {
      //     appendSyllabus({
      //       year: item.year,
      //       semester: item.semester,
      //       course_id: item.course_id,
      //     });
      //   });
      // }
    } catch (error) {
      console.error("Error in handleEdit:", error);
      toast.error("Failed to fetch program details");
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteConfirm = async () => {
    if (!deleteId) return;

    try {
      const response = await authFetch(
        `${process.env.baseUrl}${process.env.version}/program/${deleteId}`,
        {
          method: "DELETE",
        }
      );
      await response.json();
      toast.success("Program deleted successfully");
      await fetchPrograms();
    } catch (error) {
      toast.error("Failed to delete program");
    } finally {
      setIsDialogOpen(false);
      setDeleteId(null);
    }
  };

  const columns = [
    {
      header: "Title",
      accessorKey: "title",
    },
    {
      header: "Faculty",
      accessorKey: "faculty_id",
    },
    {
      header: "Duration",
      accessorKey: "duration",
    },
    {
      header: "Fee",
      accessorKey: "fee",
    },
    {
      header: "Level",
      accessorKey: "level_id",
    },
    {
      header: "Actions",
      id: "actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(row.original.slugs)}
            className="p-1 text-blue-600 hover:text-blue-800"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setDeleteId(row.original.id);
              setIsDialogOpen(true);
            }}
            className="p-1 text-red-600 hover:text-red-800"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="text-2xl mr-auto p-4 ml-14 font-bold">
        <div className="text-center">Program Management</div>
        <div className="flex justify-left mt-2">
          <button
            className="bg-blue-500 text-white text-sm px-6 py-2 rounded hover:bg-blue-600 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? "Hide form" : "Show form"}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="container mx-auto p-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2">Program Title *</label>
                  <input
                    {...register("title", { required: "Title is required" })}
                    className="w-full p-2 border rounded"
                  />
                  {errors.title && (
                    <span className="text-red-500">{errors.title.message}</span>
                  )}
                </div>

                <div>
                  <label className="block mb-2">Faculty *</label>
                  <select
                    {...register("faculty_id", { required: true })}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select Faculty</option>
                    {faculties.map((faculty) => (
                      <option key={faculty.id} value={faculty.id}>
                        {faculty.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-2">Duration *</label>
                  <input
                    {...register("duration", { required: true })}
                    className="w-full p-2 border rounded"
                    placeholder="e.g., 4 years"
                  />
                </div>

                <div>
                  <label className="block mb-2">Credits *</label>
                  <input
                    type="number"
                    {...register("credits", { required: true })}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block mb-2">Level *</label>
                  <select
                    {...register("level_id", { required: true })}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select Level</option>
                    {levels.map((level) => (
                      <option key={level.id} value={level.id}>
                        {level.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-2">Language *</label>
                  <input
                    {...register("language", { required: true })}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            </div>

            {/* Program Details */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Program Details</h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block mb-2">Eligibility Criteria</label>
                  <textarea
                    {...register("eligibility_criteria")}
                    className="w-full p-2 border rounded"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="block mb-2">Fee Structure</label>
                  <input
                    {...register("fee")}
                    className="w-full p-2 border rounded"
                    placeholder="e.g., 5000 USD per year"
                  />
                </div>

                <div>
                  <label className="block mb-2">Curriculum</label>
                  <textarea
                    {...register("curriculum")}
                    className="w-full p-2 border rounded"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="block mb-2">Learning Outcomes</label>
                  <textarea
                    {...register("learning_outcomes")}
                    className="w-full p-2 border rounded"
                    rows="3"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">
                Delivery Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2">Delivery Type</label>
                  <select
                    {...register("delivery_type")}
                    className="w-full p-2 border rounded"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Online">Online</option>
                    <option value="Hybrid">Hybrird</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2">Delivery Mode</label>
                  <select
                    {...register("delivery_mode")}
                    className="w-full p-2 border rounded"
                  >
                    <option value="On-campus">On-campus</option>
                    <option value="Remote">Remote</option>
                    <option value="Blended">Hybrid</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Syllabus Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Syllabus</h2>
                <button
                  type="button"
                  onClick={() =>
                    appendSyllabus({
                      year: 1,
                      semester: 1,
                      course_id: "",
                    })
                  }
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Add Course
                </button>
              </div>

              {syllabusFields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 border rounded"
                >
                  <div>
                    <label className="block mb-2">Year</label>
                    <input
                      type="number"
                      {...register(`syllabus.${index}.year`)}
                      className="w-full p-2 border rounded"
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block mb-2">Semester</label>
                    <input
                      type="number"
                      {...register(`syllabus.${index}.semester`)}
                      className="w-full p-2 border rounded"
                      min="1"
                      max="2"
                    />
                  </div>

                  <div>
                    <label className="block mb-2">Course</label>
                    <select
                      {...register(`syllabus.${index}.course_id`)}
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

                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeSyllabus(index)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Additional Information */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">
                Additional Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2">Scholarship</label>
                  <select
                    {...register("scholarship_id")}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select Scholarship</option>
                    {scholarships.map((scholarship) => (
                      <option key={scholarship.id} value={scholarship.id}>
                        {scholarship.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-2">Entrance Exam</label>
                  <select
                    {...register("exam_id")}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select Exam</option>
                    {exams.map((exam) => (
                      <option key={exam.id} value={exam.id}>
                        {exam.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-2">Career Opportunities</label>
                  <textarea
                    {...register("careers")}
                    className="w-full p-2 border rounded"
                    rows="3"
                    placeholder="e.g., Software Developer, Data Scientist, IT Consultant"
                  />
                </div>

                {/* <div>
                  <label className="block mb-2">Associated Colleges</label>
                  <select
                    multiple
                    {...register("colleges")}
                    className="w-full p-2 border rounded"
                    size="4"
                  >
                    {colleges.map((college) => (
                      <option key={college.id} value={college.id}>
                        {college.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-sm text-gray-500 mt-1">
                    Hold Ctrl/Cmd to select multiple colleges
                  </p>
                </div> */}

                <div className="mb-4">
                  <label className="block mb-2">Colleges</label>
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
                      value={collegeSearch}
                      onChange={searchCollege}
                      className="w-full p-2 border rounded"
                      placeholder="Search colleges..."
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
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors disabled:bg-blue-300"
              >
                {loading
                  ? "Processing..."
                  : editing
                  ? "Update Program"
                  : "Create Program"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table Section */}
      <div className="mt-8">
        <Table
          loading={tableLoading}
          data={programs}
          columns={columns}
          onSearch={(query) => {
            // Implement search functionality here
            console.log("Searching for:", query);
          }}
        />
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setDeleteId(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Confirm Deletion"
        message="Are you sure you want to delete this program? This action cannot be undone."
      />
    </>
  );
}
