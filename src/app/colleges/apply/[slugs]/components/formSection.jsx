// "use client";

// import React, { useState } from "react";
// import { toast } from "react-toastify";

// const FormSection = ({id}) => {
//   const [formData, setFormData] = useState({
//     college_id: 0,
//     student_name: "",
//     student_phone_no: "",
//     student_email: "",
//     student_description: "",
//   });

//   const [errors, setErrors] = useState({
//     student_name: "",
//     student_phone_no: "",
//     student_email: "",
//     student_description: "",
//   });

//   const [loading, setLoading] = useState(false);

//   const validateForm = () => {
//     const newErrors = {
//       student_name: "",
//       student_phone_no: "",
//       student_email: "",
//       student_description: "",
//     };

//     if (!formData.student_name.trim()) {
//       newErrors.student_name = "Student name is required";
//     }

//     if (
//       !formData.student_email.match(/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/)
//     ) {
//       newErrors.student_email = "Invalid email format";
//     }

//     if (!formData.student_phone_no.match(/^\d{10}$/)) {
//       newErrors.student_phone_no = "Phone number must be 10 digits";
//     }

//     if (!formData.student_description.trim()) {
//       newErrors.student_description = "Description is required";
//     }

//     setErrors(newErrors);
//     // return isValid;
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//       college_id: id
//     }));

//     if (errors[name]) {
//       setErrors((prev) => ({
//         ...prev,
//         [name]: "",
//       }));
//     }
//   };
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;
//     setLoading(true);
//     try {
//       const response = await fetch(
//         `${process.env.baseUrl}${process.env.version}/referral/self-apply`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(formData),
//         }
//       );
//       console.log("Response apply:", response);
//       const data = await response.json();
//       if (response.ok) {
//         alert("College Applied successfully" || data.message);
//         setFormData({
//           student_name: "",
//           student_email: "",
//           student_description: "",
//           student_phone_no: "",
//         });
//         toast.success("College Applied Successfully" || data.message);
//       } else {
//         toast.error(data?.message || "Something went wrong. Please try again");
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error("Connection error:" + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <div className="flex flex-col items-center bg-[#D9D9D9] bg-opacity-30 justify-center  p-6">
//         <h2 className="text-center text-3xl font-bold mb-6">
//           Apply For College
//         </h2>
//         <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6">
//           <form className="space-y-4" onSubmit={handleSubmit}>
//             <div>
//               <input
//                 type="text"
//                 name="student_name"
//                 placeholder="Student Name"
//                 value={formData.student_name}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//               {errors.student_name && (
//                 <p className="text-red-500 text-sm">{errors.student_name}</p>
//               )}
//             </div>
//             <div>
//               <input
//                 type="email"
//                 name="student_email"
//                 placeholder="Student Email"
//                 value={formData.student_email}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//               {errors.student_email && (
//                 <p className="text-red-500 text-sm">{errors.student_email}</p>
//               )}
//             </div>
//             <div>
//               <input
//                 type="tel"
//                 name="student_phone_no"
//                 placeholder="Student Phone Number"
//                 value={formData.student_phone_no}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//               {errors.student_phone_no && (
//                 <p className="text-red-500 text-sm">
//                   {errors.student_phone_no}
//                 </p>
//               )}
//             </div>
//             <div>
//               <textarea
//                 name="student_description"
//                 placeholder="Enter your description here.."
//                 value={formData.student_description}
//                 onChange={handleChange}
//                 rows={3}
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//               {errors.student_description && (
//                 <p className="text-red-500 text-sm">
//                   {errors.student_description}
//                 </p>
//               )}
//             </div>
//             <button
//               type="submit"
//               className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition duration-200"
//             >
//               Submit Application
//             </button>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// };

// export default FormSection;

'use client'

import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

const FormSection = ({ id }) => {
  const [formData, setFormData] = useState({
    college_id: id || 0,
    student_name: '',
    student_phone_no: '',
    student_email: '',
    student_description: ''
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      college_id: id || 0
    }))
  }, [id])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.student_name.trim()) {
      newErrors.student_name = 'Student name is required'
    }

    if (
      !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(
        formData.student_email
      )
    ) {
      newErrors.student_email = 'Invalid email format'
    }

    if (!/^\d{10}$/.test(formData.student_phone_no)) {
      newErrors.student_phone_no = 'Phone number must be exactly 10 digits'
    }

    if (!formData.student_description.trim()) {
      newErrors.student_description = 'Description is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    try {
      const response = await fetch(
        `${process.env.baseUrl}${process.env.version}/referral/self-apply`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        }
      )

      const data = await response.json()
      if (response.ok) {
        toast.success(data.message || 'College Applied Successfully')
        setFormData({
          college_id: id || 0,
          student_name: '',
          student_phone_no: '',
          student_email: '',
          student_description: ''
        })
      } else {
        toast.error(data?.message || 'Something went wrong. Please try again.')
      }
    } catch (error) {
      toast.error('Connection error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex flex-col items-center bg-[#D9D9D9] bg-opacity-30 p-6'>
      <h2 className='text-center text-3xl font-bold mb-6'>Apply For College</h2>
      <div className='w-full max-w-3xl bg-white shadow-lg rounded-lg p-6'>
        <form className='space-y-4' onSubmit={handleSubmit}>
          <div>
            <input
              type='text'
              name='student_name'
              placeholder='Student Name'
              value={formData.student_name}
              onChange={handleChange}
              className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            {errors.student_name && (
              <p className='text-red-500 text-sm'>{errors.student_name}</p>
            )}
          </div>
          <div>
            <input
              type='email'
              name='student_email'
              placeholder='Student Email'
              value={formData.student_email}
              onChange={handleChange}
              className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            {errors.student_email && (
              <p className='text-red-500 text-sm'>{errors.student_email}</p>
            )}
          </div>
          <div>
            <input
              type='tel'
              name='student_phone_no'
              placeholder='Student Phone Number'
              value={formData.student_phone_no}
              onChange={handleChange}
              className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            {errors.student_phone_no && (
              <p className='text-red-500 text-sm'>{errors.student_phone_no}</p>
            )}
          </div>
          <div>
            <textarea
              name='student_description'
              placeholder='Enter your description here..'
              value={formData.student_description}
              onChange={handleChange}
              rows={3}
              className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            {errors.student_description && (
              <p className='text-red-500 text-sm'>
                {errors.student_description}
              </p>
            )}
          </div>
          <button
            type='submit'
            disabled={loading}
            className={`w-full bg-[#011E3F] bg-opacity-80 text-white font-semibold py-2 rounded-lg transition duration-200 ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#011E3F]'
            }`}
          >
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default FormSection
