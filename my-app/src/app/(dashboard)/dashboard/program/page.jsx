// "use client";
// import React, { useState, useEffect, useMemo } from "react";
// import { getAllScholarships } from "../scholarship/actions";
// import {
//   getCourses,
//   createProgram,
//   updateProgram,
//   getPrograms,
//   getFaculties,
// } from "../../../action";
// import Fuse from "fuse.js";
// import { toast } from "react-toastify";
// import Loading from "../../../components/Loading";
// import Table from "@/app/components/Table";
// import { Edit2, Trash2 } from "lucide-react";

// const ProgramManager = () => {
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     faculty: "",
//     duration: 0,
//     credits: 0,
//     level: "",
//     language: ["English"],
//     eligibilityCriteria: "",
//     applicationOpeningStatus: "",
//     fees: 0,
//     scholarships: [],
//     curriculum: [
//       {
//         year: "",
//         semesters: [
//           {
//             semester: "",
//             nonElective: [],
//             elective: [],
//           },
//         ],
//       },
//     ],
//     learningOutcomes: [],
//     deliveryType: "Semester",
//     deliveryMode: "On-Campus",
//     startDate: "",
//     endDate: "",
//   });
//   const [pagination, setPagination] = useState({
//     currentPage: 1,
//     totalPages: 1,
//     total: 0,
//   });
//   const [scholarships, setScholarships] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [courses, setCourses] = useState([]);
//   const [faculties, setFaculties] = useState([]);
//   const [error, setError] = useState(null);
//   const [nonElectiveCourseSearch, setNonElectiveCourseSearch] = useState("");
//   const [electiveCourseSearch, setElectiveCourseSearch] = useState("");
//   const [programs, setPrograms] = useState([]);
//   const [nonElectiveSuggestions, setNonElectiveSuggestions] = useState([]);
//   const [electiveSuggestions, setElectiveSuggestions] = useState([]);
//   const [editingId, setEditingId] = useState(null);

//   const columns = useMemo(() => [
//     {
//       header: "Program Name",
//       accessorKey: "title",
//     },
//     {
//       header: "Description",
//       accessorKey: "description",
//     },
//     {
//       header: "Eligibility",
//       accessorKey: "eligibilityCriteria",
//     },
//     {
//       header: "Application Status",
//       accessorKey: "applicationOpeningStatus",
//     },
//     {
//       header: "Actions",
//       id: "actions",
//       cell: ({ row }) => (
//         <div className="flex gap-2">
//           <button
//             onClick={() => handleEdit(row.original)}
//             className="p-1 text-blue-600 hover:text-blue-800"
//           >
//             <Edit2 className="w-4 h-4" />
//           </button>
//           <button
//             onClick={() => handleDelete(row.original._id)}
//             className="p-1 text-red-600 hover:text-red-800"
//           >
//             <Trash2 className="w-4 h-4" />
//           </button>
//         </div>
//       ),
//     },
//   ]);

//   const handleEdit = (program) => {
//     setFormData({
//       title: program.title,
//       description: program.description,
//       faculty: program.faculty,
//       duration: program.duration,
//       credits: program.credits,
//       level: program.level,
//       language: [...program.language], // Copy the array
//       eligibilityCriteria: program.eligibilityCriteria,
//       applicationOpeningStatus: program.applicationOpeningStatus,
//       fees: program.fees,
//       scholarships: program.scholarships.map((scholarship) => ({
//         ...scholarship,
//       })), // Deep copy scholarships
//       curriculum: program.curriculum.map((year) => ({
//         year: year.year,
//         semesters: year.semesters.map((semester) => ({
//           semester: semester.semester,
//           nonElective: [...semester.nonElective], // Copy array to avoid mutation
//           elective: [...semester.elective],
//         })),
//       })),
//       learningOutcomes: [...program.learningOutcomes], // Copy array
//       deliveryType: program.deliveryType,
//       deliveryMode: program.deliveryMode,
//       startDate: program.startDate,
//       endDate: program.endDate,
//     });
//     setEditingId(program._id); // Set the program's ID for editing
//     setError(null); // Clear any existing errors
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this program?")) {
//       try {
//         await deleteProgram(id); // Call API or function to delete the program
//         loadAllPrograms(); // Reload the list of programs after deletion
//         setError(null); // Clear any existing errors
//       } catch (error) {
//         setError("Failed to delete the program"); // Set error if deletion fails
//         console.error("Error deleting program:", error);
//       }
//     }
//   };

//   const levels = [
//     "SLC",
//     "+2",
//     "Undergraduate",
//     "Postgraduate",
//     "Diploma",
//     "Certificate",
//   ];

//   useEffect(() => {
//     loadScholarships();
//   }, []);

//   const loadScholarships = async () => {
//     try {
//       const response = await getAllScholarships();
//       console.log(response);
//       setScholarships(response);
//       // console.log(scholarships);
//     } catch (error) {
//       setError("Failed to load scholarships");
//       console.error("Error loading scholarships:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadAllPrograms();
//   }, []);

//   const loadAllPrograms = async (page = 1) => {
//     try {
//       const response = await getPrograms(page, 9, "asc");
//       console.log("ALL RESPONSE UNIVERSITY:", response);
//       setPrograms(response.items);
//       setPagination({
//         currentPage: response.pagination.currentPage,
//         totalPages: response.pagination.totalPages,
//         total: response.pagination.totalRecords,
//       });
//     } catch (error) {
//       setError("Failed to load programs");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadCourses();
//   }, []);

//   const loadCourses = async () => {
//     try {
//       const response = await getCourses();
//       setCourses(response.items);
//     } catch (error) {
//       setError("Failed to load courses");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadFaculty();
//   }, []);

//   const loadFaculty = async () => {
//     try {
//       const response = await getFaculties();
//       setFaculties(response.items);
//     } catch (error) {
//       setError("Failed to load Faculties");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCurriculumChange = (yearIndex, semesterIndex, field, value) => {
//     setFormData((prevState) => {
//       const updatedCurriculum = [...prevState.curriculum];

//       if (semesterIndex === null) {
//         // Update year-level fields
//         updatedCurriculum[yearIndex] = {
//           ...updatedCurriculum[yearIndex],
//           [field]: value,
//         };
//       } else {
//         // Update semester-level fields
//         const updatedSemesters = [...updatedCurriculum[yearIndex].semesters];
//         updatedSemesters[semesterIndex] = {
//           ...updatedSemesters[semesterIndex],
//           [field]: value,
//         };

//         updatedCurriculum[yearIndex] = {
//           ...updatedCurriculum[yearIndex],
//           semesters: updatedSemesters,
//         };
//       }

//       return { ...prevState, curriculum: updatedCurriculum };
//     });
//   };

//   const addYear = () => {
//     setFormData({
//       ...formData,
//       curriculum: [
//         ...formData.curriculum,
//         {
//           year: "",
//           semesters: [
//             {
//               semester: "",
//               nonElective: [],
//               elective: [],
//             },
//           ],
//         },
//       ],
//     });
//   };

//   const addSemester = (yearIndex) => {
//     setFormData((prevState) => {
//       const updatedCurriculum = [...prevState.curriculum];

//       const updatedSemesters = [
//         ...updatedCurriculum[yearIndex].semesters,
//         { semester: "", nonElective: [], elective: [] },
//       ];

//       updatedCurriculum[yearIndex] = {
//         ...updatedCurriculum[yearIndex],
//         semesters: updatedSemesters,
//       };

//       return { ...prevState, curriculum: updatedCurriculum };
//     });
//   };

//   const removeYear = (yearIndex) => {
//     const updatedCurriculum = [...formData.curriculum];
//     updatedCurriculum.splice(yearIndex, 1);
//     setFormData({ ...formData, curriculum: updatedCurriculum });
//   };

//   const removeSemester = (yearIndex, semesterIndex) => {
//     const updatedCurriculum = [...formData.curriculum];
//     updatedCurriculum[yearIndex].semesters.splice(semesterIndex, 1);
//     setFormData({ ...formData, curriculum: updatedCurriculum });
//   };

//   const handleCourseSearch = (input, type) => {
//     if (type === "nonElective") {
//       setNonElectiveCourseSearch(input);
//       if (input) {
//         const fuse = new Fuse(courses, { keys: ["title"], threshold: 0.3 });
//         const results = fuse.search(input).map((result) => result.item);
//         setNonElectiveSuggestions(results);
//       } else {
//         setNonElectiveSuggestions([]);
//       }
//     } else {
//       setElectiveCourseSearch(input);
//       if (input) {
//         const fuse = new Fuse(courses, { keys: ["title"], threshold: 0.3 });
//         const results = fuse.search(input).map((result) => result.item);
//         setElectiveSuggestions(results);
//       } else {
//         setElectiveSuggestions([]);
//       }
//     }
//   };

//   const addCourse = (course, subType, year, semester) => {
//     setFormData((prevState) => {
//       const updatedCurriculum = [...prevState.curriculum];

//       const updatedSemesters = updatedCurriculum[year].semesters.map(
//         (semData, semIndex) => {
//           if (semIndex === semester) {
//             return {
//               ...semData,
//               [subType]: [...semData[subType], course._id],
//             };
//           }
//           return semData;
//         }
//       );

//       updatedCurriculum[year] = {
//         ...updatedCurriculum[year],
//         semesters: updatedSemesters,
//       };
//       return { ...prevState, curriculum: updatedCurriculum };
//     });

//     if (subType === "nonElective") {
//       setNonElectiveCourseSearch("");
//     } else {
//       setElectiveCourseSearch("");
//     }
//   };

//   const removeCourse = (courseId, subType, year, semester) => {
//     setFormData((prevState) => {
//       const updatedCurriculum = [...prevState.curriculum];

//       // Deep clone the semester being updated
//       const updatedSemesters = updatedCurriculum[year].semesters.map(
//         (semData, semIndex) => {
//           if (semIndex === semester) {
//             return {
//               ...semData,
//               [subType]: semData[subType].filter((id) => id !== courseId), // Remove course
//             };
//           }
//           return semData;
//         }
//       );

//       updatedCurriculum[year] = {
//         ...updatedCurriculum[year],
//         semesters: updatedSemesters,
//       };

//       return { ...prevState, curriculum: updatedCurriculum };
//     });
//   };

//   const addLearningOutcome = () => {
//     setFormData((prevData) => ({
//       ...prevData,
//       learningOutcomes: [...prevData.learningOutcomes, ""],
//     }));
//   };

//   const updateLearningOutcome = (index, value) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       learningOutcomes: prevData.learningOutcomes.map((outcome, i) =>
//         i === index ? value : outcome
//       ),
//     }));
//   };

//   const removeLearningOutcome = (index) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       learningOutcomes: prevData.learningOutcomes.filter((_, i) => i !== index),
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault(); // Prevent default form submission behavior

//     try {
//       const formattedData = {
//         ...formData,
//         duration: Number(formData.duration),
//         credits: Number(formData.credits),
//         fees: Number(formData.fees),
//         startDate: formatDate(formData.startDate),
//         endDate: formatDate(formData.endDate),
//       };
//       let response;
//       if (editingId) {
//         // If editingId is present, update the existing university
//         response = await updateProgram(editingId, formattedData); // Call the update function
//         console.log("Response from updateProgram", response);

//         if (response?.message) {
//           toast.success(response.message || "Program updated successfully!");
//         } else {
//           throw new Error(
//             `Failed to update program: ${response?.message || "Unknown error"}`
//           );
//         }

//         setEditingId(null); // Clear the editing state
//       } else {
//         // If no editingId, create a new university
//         response = await createProgram(formattedData); // Call the create function
//         console.log("Response from createProgram", response);

//         if (response?.status === 201) {
//           toast.success(response.message || "Program added successfully!");
//         } else if (response?.status === 403) {
//           toast.error(response.message || "Program add failed");
//         } else {
//           throw new Error(
//             `Failed to add program: ${response?.message || "Unknown error"}`
//           );
//         }
//       }

//       // Reset the form data
//       setFormData({
//         title: "",
//         description: "",
//         faculty: "",
//         duration: 0,
//         credits: 0,
//         level: "",
//         language: ["English"],
//         eligibilityCriteria: "",
//         applicationOpeningStatus: "",
//         fees: 0,
//         scholarships: [],
//         curriculum: [
//           {
//             year: "",
//             semesters: [
//               {
//                 semester: "",
//                 nonElective: [],
//                 elective: [],
//               },
//             ],
//           },
//         ],
//         learningOutcomes: [],
//         deliveryType: "Semester",
//         deliveryMode: "On-Campus",
//         startDate: "",
//         endDate: "",
//       });
//       setEditingId(null);
//       setError(null);

//       loadAllPrograms();
//     } catch (error) {
//       console.error(
//         `Error ${editingId ? "updating" : "adding"} program:`,
//         error.message
//       );
//       toast.error(
//         `An error occurred while ${
//           editingId ? "updating" : "adding"
//         } the program.`
//       );
//     }
//   };

//   const handleScholarships = (selectedOptions) => {
//     setFormData((formData) => ({
//       ...formData,
//       scholarships: Array.from(
//         new Set([...formData.scholarships, ...selectedOptions])
//       ),
//     }));
//   };

//   const handleRemoveScholarships = (scholarshipToRemove) => {
//     setFormData((formData) => ({
//       ...formData,
//       scholarships: formData.scholarships.filter(
//         (scholarship) => scholarship !== scholarshipToRemove
//       ),
//     }));
//   };

//   const formatDate = (date) => {
//     if (!date) return null;
//     const d = new Date(date);
//     return d.toISOString().split("T")[0]; // Returns YYYY-MM-DD format
//   };

//   const getCourseTitle = (courseId) => {
//     const course = courses.find((course) => course._id === courseId);
//     return course ? course.title : courseId;
//   };

//   const getScholarshipTitle = (scholarshipId) => {
//     const scholarship = scholarships.find(
//       (scholarship) => scholarship._id === scholarshipId
//     );
//     return scholarship ? scholarship.name : scholarshipId;
//   };

//   if (loading)
//     return (
//       <div className="mx-auto">
//         <Loading />
//       </div>
//     );

//   return (
//     <div className="p-4 w-4/5 mx-auto">
//       <h1 className="text-2xl font-bold mb-4">Program Management</h1>
//       <form className="mb-8 space-y-4" onSubmit={handleSubmit}>
//         <div>
//           <input
//             type="text"
//             placeholder="Title"
//             value={formData.title}
//             onChange={(e) =>
//               setFormData((formData) => ({
//                 ...formData,
//                 title: e.target.value,
//               }))
//             }
//             className="w-full p-2 border rounded"
//           />
//         </div>

//         <div>
//           <textarea
//             placeholder="Description"
//             value={formData.description}
//             onChange={(e) =>
//               setFormData({ ...formData, description: e.target.value })
//             }
//             className="w-full p-2 border rounded"
//           />
//         </div>

//         <div>
//           <label
//             htmlFor="faculty"
//             className="block text-sm font-medium text-gray-700"
//           >
//             Faculty
//           </label>
//           <select
//             value={formData.faculty}
//             className="border border-gray-400 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-gray-400 hover:border-gray-500"
//             onChange={(e) =>
//               setFormData((formData) => ({
//                 ...formData,
//                 faculty: e.target.value,
//               }))
//             }
//           >
//             <option value="" disabled>
//               Select Faculty
//             </option>
//             {faculties.map((facult, index) => (
//               <option value={facult._id} key={index}>
//                 {facult.title}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="flex">
//           <div className="w-full">
//             <label
//               htmlFor="duration"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Duration
//             </label>
//             <input
//               type="number"
//               placeholder="Duration"
//               value={formData.duration}
//               onChange={(e) =>
//                 setFormData((formData) => ({
//                   ...formData,
//                   duration: e.target.value,
//                 }))
//               }
//               className="w-full p-2 border rounded"
//             />
//           </div>

//           <div className="w-full">
//             <label
//               htmlFor="credits"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Credit
//             </label>
//             <input
//               type="number"
//               placeholder="Credit"
//               value={formData.credits}
//               onChange={(e) =>
//                 setFormData((formData) => ({
//                   ...formData,
//                   credits: e.target.value,
//                 }))
//               }
//               className="w-full p-2 border rounded"
//             />
//           </div>
//         </div>

//         <div>
//           <label
//             htmlFor="level"
//             className="block text-sm font-medium text-gray-700"
//           >
//             Level
//           </label>
//           <select
//             className="border border-gray-400 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-gray-400 hover:border-gray-500"
//             onChange={(e) =>
//               setFormData((formData) => ({
//                 ...formData,
//                 level: e.target.value,
//               }))
//             }
//           >
//             <option value="" disabled>
//               Select Level
//             </option>

//             {levels.map((level, index) => (
//               <option value={level} key={index}>
//                 {level}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <input
//             type="text"
//             placeholder="Language"
//             value={formData.language}
//             onChange={(e) =>
//               setFormData((formData) => ({
//                 ...formData,
//                 language: e.target.value,
//               }))
//             }
//             className="w-full p-2 border rounded"
//           />
//         </div>

//         <div>
//           <input
//             type="text"
//             placeholder="Eligibility Criteria"
//             value={formData.eligibilityCriteria}
//             onChange={(e) =>
//               setFormData((formData) => ({
//                 ...formData,
//                 eligibilityCriteria: e.target.value,
//               }))
//             }
//             className="w-full p-2 border rounded"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700">
//             Opening Status
//           </label>
//           <input
//             type="date"
//             value={formData.applicationOpeningStatus}
//             onChange={(e) =>
//               setFormData({
//                 ...formData,
//                 applicationOpeningStatus: e.target.value,
//               })
//             }
//             className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
//           />
//         </div>

//         <div>
//           <label
//             htmlFor="fees"
//             className="block text-sm font-medium text-gray-700"
//           >
//             Fees
//           </label>
//           <input
//             type="number"
//             placeholder="Fee"
//             value={formData.fees}
//             onChange={(e) =>
//               setFormData((formData) => ({
//                 ...formData,
//                 fees: e.target.value,
//               }))
//             }
//             className="w-1/2 p-2 border rounded"
//           />
//         </div>

//         <div>
//           <label
//             htmlFor="scholarships"
//             className="block text-sm font-medium text-gray-700"
//           >
//             Scholarships
//           </label>
//           <select
//             value=""
//             className="border border-gray-400 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-gray-400 hover:border-gray-500"
//             onChange={(e) => {
//               const selectedOptions = Array.from(
//                 e.target.selectedOptions,
//                 (option) => option.value
//               );
//               handleScholarships(selectedOptions);
//             }}
//           >
//             <option value="" disabled>
//               Select Scholarships
//             </option>

//             {scholarships.map((scholarship, index) => (
//               <option value={scholarship._id} key={index}>
//                 {scholarship.name}
//               </option>
//             ))}
//           </select>

//           <div className="mt-3 flex flex-wrap gap-2">
//             {formData.scholarships.map((selectedScholarship, index) => (
//               <div
//                 key={index}
//                 className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center"
//               >
//                 <span className="mr-2">
//                   {getScholarshipTitle(selectedScholarship)}
//                 </span>
//                 <button
//                   type="button"
//                   className="text-red-500 hover:text-red-700"
//                   onClick={() => handleRemoveScholarships(selectedScholarship)} // Call the remove tag function
//                 >
//                   &times;
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div>
//           <label
//             htmlFor="curriculum"
//             className="block text-sm font-medium text-gray-700"
//           >
//             Curriculum
//           </label>

//           {formData.curriculum.map((yearData, yearIndex) => (
//             <div key={yearIndex} className="border p-4 rounded mb-4">
//               <div className="flex justify-between items-center">
//                 <input
//                   type="text"
//                   placeholder={`Year ${yearIndex + 1}`}
//                   value={yearData.year}
//                   onChange={(e) =>
//                     handleCurriculumChange(
//                       yearIndex,
//                       null,
//                       "year",
//                       e.target.value
//                     )
//                   }
//                   className="w-1/2 p-2 border rounded"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => removeYear(yearIndex)}
//                   className="text-red-500"
//                 >
//                   Remove Year
//                 </button>
//               </div>
//               {yearData.semesters.map((semester, semesterIndex) => (
//                 <div
//                   key={semesterIndex}
//                   className="border p-4 rounded mt-4 bg-gray-100"
//                 >
//                   <div className="flex justify-between items-center">
//                     <input
//                       type="text"
//                       placeholder={`Semester ${semesterIndex + 1}`}
//                       value={semester.semester}
//                       onChange={(e) =>
//                         handleCurriculumChange(
//                           yearIndex,
//                           semesterIndex,
//                           "semester",
//                           e.target.value
//                         )
//                       }
//                       className="w-1/2 p-2 border rounded"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => removeSemester(yearIndex, semesterIndex)}
//                       className="text-red-500"
//                     >
//                       Remove Semester
//                     </button>
//                   </div>

//                   {/* Non-Elective Courses Section */}
//                   <div className="mt-2">
//                     <label className="block text-sm font-medium text-gray-700">
//                       Non-Elective Courses
//                     </label>
//                     <input
//                       type="text"
//                       value={nonElectiveCourseSearch}
//                       onChange={(e) =>
//                         handleCourseSearch(e.target.value, "nonElective")
//                       }
//                       placeholder="Search Non-Elective Courses"
//                       className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
//                     />
//                     {nonElectiveSuggestions.length > 0 && (
//                       <ul className="mt-2 border border-gray-300 rounded-lg bg-white">
//                         {nonElectiveSuggestions.map((course) => (
//                           <li
//                             key={course._id}
//                             className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
//                             onClick={() => {
//                               addCourse(
//                                 course,
//                                 "nonElective",
//                                 yearIndex,
//                                 semesterIndex
//                               );
//                               setNonElectiveSuggestions([]);
//                             }}
//                           >
//                             {course.title}
//                           </li>
//                         ))}
//                       </ul>
//                     )}
//                     {/* Display selected non-elective courses */}
//                     <div className="mt-2 flex flex-wrap gap-2">
//                       {semester.nonElective.map((courseId) => (
//                         <div
//                           key={courseId}
//                           className="bg-blue-100 px-3 py-1 rounded-full flex items-center"
//                         >
//                           <span>{getCourseTitle(courseId)}</span>
//                           <button
//                             type="button"
//                             onClick={() =>
//                               removeCourse(
//                                 courseId,
//                                 "nonElective",
//                                 yearIndex,
//                                 semesterIndex
//                               )
//                             }
//                             className="ml-2 text-red-500"
//                           >
//                             ×
//                           </button>
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   {/* Elective Courses Section */}
//                   <div className="mt-2">
//                     <label className="block text-sm font-medium text-gray-700">
//                       Elective Courses
//                     </label>
//                     <input
//                       type="text"
//                       value={electiveCourseSearch}
//                       onChange={(e) =>
//                         handleCourseSearch(e.target.value, "elective")
//                       }
//                       placeholder="Search Elective Courses"
//                       className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
//                     />
//                     {electiveSuggestions.length > 0 && (
//                       <ul className="mt-2 border border-gray-300 rounded-lg bg-white">
//                         {electiveSuggestions.map((course) => (
//                           <li
//                             key={course._id}
//                             className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
//                             onClick={() => {
//                               addCourse(
//                                 course,
//                                 "elective",
//                                 yearIndex,
//                                 semesterIndex
//                               );
//                               setElectiveSuggestions([]);
//                             }}
//                           >
//                             {course.title}
//                           </li>
//                         ))}
//                       </ul>
//                     )}
//                     {/* Display selected elective courses */}
//                     <div className="mt-2 flex flex-wrap gap-2">
//                       {semester.elective.map((courseId) => (
//                         <div
//                           key={courseId}
//                           className="bg-blue-100 px-3 py-1 rounded-full flex items-center"
//                         >
//                           <span>{getCourseTitle(courseId)}</span>
//                           <button
//                             type="button"
//                             onClick={() =>
//                               removeCourse(
//                                 courseId,
//                                 "elective",
//                                 yearIndex,
//                                 semesterIndex
//                               )
//                             }
//                             className="ml-2 text-red-500"
//                           >
//                             ×
//                           </button>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               ))}

//               {yearData.semesters.length < 2 && (
//                 <button
//                   type="button"
//                   onClick={() => {
//                     addSemester(yearIndex);
//                   }}
//                   className="mt-4 text-blue-500"
//                 >
//                   Add Semester
//                 </button>
//               )}
//             </div>
//           ))}

//           <button
//             type="button"
//             onClick={addYear}
//             className="mt-4 text-blue-500"
//           >
//             Add Year
//           </button>
//         </div>

//         <div className="space-y-2">
//           <label className="block text-sm font-medium text-gray-700">
//             Learning Outcomes
//           </label>

//           {formData.learningOutcomes.map((outcome, index) => (
//             <div key={index} className="flex gap-2">
//               <input
//                 type="text"
//                 value={outcome}
//                 onChange={(e) => updateLearningOutcome(index, e.target.value)}
//                 placeholder={`Learning Outcome ${index + 1}`}
//                 className="w-full p-2 border rounded"
//               />
//               <button
//                 type="button"
//                 onClick={() => removeLearningOutcome(index)}
//                 className="text-red-500 px-2"
//               >
//                 ×
//               </button>
//             </div>
//           ))}

//           <button
//             type="button"
//             onClick={addLearningOutcome}
//             className="text-blue-500"
//           >
//             Add Learning Outcome
//           </button>
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">
//             Delivery Type
//           </label>
//           <select
//             value={formData.deliveryType}
//             onChange={(e) =>
//               setFormData((formData) => ({
//                 ...formData,
//                 deliveryType: e.target.value,
//               }))
//             }
//             className="border border-gray-400 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-gray-400 hover:border-gray-500"
//           >
//             <option value="Semester">Semester</option>
//             <option value="Yearly">Yearly</option>
//           </select>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700">
//             Delivery Mode
//           </label>
//           <select
//             value={formData.deliveryMode}
//             onChange={(e) =>
//               setFormData((formData) => ({
//                 ...formData,
//                 deliveryMode: e.target.value,
//               }))
//             }
//             className="border border-gray-400 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-gray-400 hover:border-gray-500"
//           >
//             <option value="Online">Online</option>
//             <option value="On-Campus">On-Campus</option>
//             <option value="Hybrid">Hybrid</option>
//           </select>
//         </div>

//         {/* Date Selection */}
//         <div className="flex gap-4">
//           <div className="w-1/2">
//             <label className="block text-sm font-medium text-gray-700">
//               Start Date
//             </label>
//             <input
//               type="date"
//               value={formData.startDate}
//               onChange={(e) =>
//                 setFormData({ ...formData, startDate: e.target.value })
//               }
//               className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
//             />
//           </div>

//           <div className="w-1/2">
//             <label className="block text-sm font-medium text-gray-700">
//               End Date
//             </label>
//             <input
//               type="date"
//               value={formData.endDate}
//               min={formData.startDate} // Ensures end date can't be before start date
//               onChange={(e) =>
//                 setFormData({ ...formData, endDate: e.target.value })
//               }
//               className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
//             />
//           </div>
//         </div>

//         {error && <div className="text-red-500">{error}</div>}

//         <button
//           type="submit"
//           className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//         >
//           {editingId ? "Update Program" : "Add Program"}
//         </button>
//       </form>
//       <Table
//         data={programs}
//         columns={columns}
//         pagination={pagination}
//         onPageChange={(newPage) => loadAllPrograms(newPage)}
//       />
//     </div>
//   );
// };

// export default ProgramManager;

//new code

"use client";
import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useSelector } from "react-redux";
import Table from "@/app/components/Table";
import { Edit2, Trash2 } from "lucide-react";
import { authFetch } from "@/app/utils/authFetch";
import { toast } from "react-toastify";
import ConfirmationDialog from "../addCollege/ConfirmationDialog";

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

  // Similar fetch functions for other dropdowns
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
  // Implement other fetch functions similarly...

  const onSubmit = async (data) => {
    try {
      const url = `${process.env.baseUrl}${process.env.version}/program`;
      const method = editing ? "PUT" : "POST";

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

  const handleEdit = async (id) => {
    try {
      setEditing(true);
      setLoading(true);
      setIsOpen(true);

      const response = await authFetch(
        `${process.env.baseUrl}${process.env.version}/program/${id}`
      );
      const program = await response.json();

      // Set form values
      Object.keys(program).forEach((key) => {
        setValue(key, program[key]);
      });
    } catch (error) {
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
            onClick={() => handleEdit(row.original.id)}
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
                  </select>
                </div>

                <div>
                  <label className="block mb-2">Delivery Mode</label>
                  <select
                    {...register("delivery_mode")}
                    className="w-full p-2 border rounded"
                  >
                    <option value="On-campus">On-campus</option>
                    <option value="Online">Online</option>
                    <option value="Hybrid">Hybrid</option>
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

                <div>
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
