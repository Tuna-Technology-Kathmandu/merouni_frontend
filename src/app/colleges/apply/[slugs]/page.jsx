// "use client";
// import React, { useState, useEffect } from "react";

// const ApplyCollege = () => {
//   const [formData, setFormData] = useState({
//     college_id: 0,
//     student_name: "",
//     student_phone_no: "",
//     student_email: "",
//     student_description: "",
//   });

//   return (
//     <>
//       <div className="flex items-center justify-center">
//         <div>
//           <h2 className="text-center text-3xl font-extrabold text-gray-900">
//             Apply for college:
//           </h2>

//           <form className="mt-8 space-y-6">
//             <div>
//               <input
//                 type="text"
//                 name="student_name"
//                 placeholder="Student Name"
//                 value={formData.student_name}
//               />
//             </div>
//             <div>
//               <input
//                 type="text"
//                 name="student_email"
//                 placeholder="Student Email"
//                 value={formData.student_email}
//               />
//             </div>
//             <div>
//               <input
//                 type="tel"
//                 name="student_phone_no"
//                 placeholder="Student Phone Number"
//                 value={formData.student_phone_no}
//               />
//             </div>
//             <div>
//               <input
//                 type="text"
//                 name="student_description"
//                 placeholder="Enter you description here.."
//                 value={formData.student_description}
//               />
//             </div>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ApplyCollege;

'use client'

import React, { useState, useEffect } from 'react'
import Navbar from '@/app/components/Frontpage/Navbar'
import Header from '@/app/components/Frontpage/Header'
import Footer from '@/app/components/Frontpage/Footer'
import ImageSection from './components/upperSection'
import FormSection from './components/formSection'
import { getCollegeBySlug } from '../../actions'

const ApplyPage = ({ params }) => {
  const [college, setCollege] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchSlugAndCollegeDetails = async () => {
      try {
        const resolvedParams = await params
        const slugs = resolvedParams.slugs
        console.log('SLUGS:', slugs)
        fetchCollegeDetails(slugs)
      } catch (error) {
        console.error('Error resolving params:', error)
      }
    }
    fetchSlugAndCollegeDetails()
  }, [])

  const fetchCollegeDetails = async (slugs) => {
    try {
      console.log('Fetching college apply details for slug:', slugs)
      const collegeData = await getCollegeBySlug(slugs)
      console.log('Fetched data:', collegeData)

      if (collegeData) {
        setCollege(collegeData)
      } else {
        setError('No data found')
      }
    } catch (error) {
      console.error('Error fetching college details:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    console.log('COllege data in apply section:', college)
  }, [college])

  return (
    <main className='w-full'>
      <Header />
      <Navbar />

      <ImageSection college={college} loading={loading} />
      <FormSection college={college} />

      <Footer />
    </main>
  )
}

export default ApplyPage
