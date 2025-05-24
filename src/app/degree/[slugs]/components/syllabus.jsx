import React from 'react'

// {
// 	"id": 17,
// 	"title": "Bachelor of Electronics In Thapathali",
// 	"slugs": "bachelor-of-electronics-in-thapathali",
// 	"duration": "4 years",
// 	"credits": 120,
// 	"language": "English",
// 	"eligibility_criteria": "High school diploma with a minimum GPA of 3.0",
// 	"fee": "5000 USD per year",
// 	"curriculum": "Core programming, Algorithms, Data Structures, AI, ML, Web Development",
// 	"learning_outcomes": "Strong programming skills, problem-solving ability, software development expertise",
// 	"delivery_type": "Full-time",
// 	"delivery_mode": "On-campus",
// 	"careers": "Software Developer, Data Scientist, IT Consultant",
// 	"createdAt": "2025-02-06T06:20:26.000Z",
// 	"updatedAt": "2025-02-06T06:33:27.000Z",
// 	"programfaculty": {
// 		"title": "Science",
// 		"slugs": "science"
// 	},
// 	"syllabus": [
// 		{
// 			"id": 7,
// 			"year": 1,
// 			"semester": 1,
// 			"is_elective": false,
// 			"program_id": 17,
// 			"course_id": 5,
// 			"createdAt": "2025-02-06T06:20:27.000Z",
// 			"updatedAt": "2025-02-06T06:20:27.000Z",
// 			"programCourse": {
// 				"id": 5,
// 				"title": "Excel Training",
// 				"description": "asda asd adasd asdas dasdasd",
// 				"credits": 3
// 			}
// 		},
// 		{
// 			"id": 8,
// 			"year": 1,
// 			"semester": 2,
// 			"is_elective": false,
// 			"program_id": 17,
// 			"course_id": 3,
// 			"createdAt": "2025-02-06T06:20:27.000Z",
// 			"updatedAt": "2025-02-06T06:20:27.000Z",
// 			"programCourse": {
// 				"id": 3,
// 				"title": "Big Data",
// 				"description": "asda asd adasd asdas dasdasd",
// 				"credits": 3
// 			}
// 		},
// 		{
// 			"id": 9,
// 			"year": 2,
// 			"semester": 1,
// 			"is_elective": true,
// 			"program_id": 17,
// 			"course_id": 1,
// 			"createdAt": "2025-02-06T06:20:27.000Z",
// 			"updatedAt": "2025-02-06T06:20:27.000Z",
// 			"programCourse": {
// 				"id": 1,
// 				"title": "Digital Logic",
// 				"description": "asda asd adasd asdas dasdasd",
// 				"credits": 3
// 			}
// 		}
// 	],
// 	"programlevel": {
// 		"title": "+2",
// 		"slugs": "2"
// 	},
// 	"programscholarship": {
// 		"name": "Funding Nepal Check Update"
// 	},
// 	"programexam": {
// 		"title": "Engineering Entrance Exam"
// 	},
// 	"programauthorDetails": {
// 		"firstName": "Admin",
// 		"middleName": "adasd",
// 		"lastName": "Tuna"
// 	}
// }

const Syllabus = ({ degree }) => {
  const groupedSyllabus = degree?.syllabus?.reduce((acc, course) => {
    if (!acc[course.year]) {
      acc[course.year] = []
    }
    acc[course.year].push(course)
    return acc
  }, {})

  console.log('Grouped Syllabus:', groupedSyllabus)
  return (
    <>
      <div className='bg-[#D9D9D9] bg-opacity-20 flex flex-col items-center '>
        <h2 className='font-bold text-3xl leading-10 mt-8'>Syllabus</h2>
        <div className='flex flex-col'>
          {groupedSyllabus &&
            Object.entries(groupedSyllabus).map(([year, courses]) => (
              <div className='mb-10'>
                <p className='mb-4 mt-10 text-xl font-semibold'>Year {year}</p>
                <div className='grid grid-cols-2 gap-x-96 gap-y-10 '>
                  {courses.map((course) => (
                    <div
                      key={course.id}
                      className='bg-white w-[350px] h-[120px] flex flex-col rounded-2xl'
                    >
                      <div className='pl-4 pt-4'>
                        <h2 className=' text-lg'>
                          {course.programCourse.title}
                        </h2>
                        <h3 className='text-sm text-gray-700'>
                          Course Code: {course.programCourse.code}
                        </h3>

                        <h3 className='text-sm text-gray-700'>
                          Credits: {course.programCourse.credits}
                        </h3>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  )
}

export default Syllabus
