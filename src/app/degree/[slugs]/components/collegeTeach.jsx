import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Building2, MapPin } from 'lucide-react'

const CollegeTeach = ({ degree }) => {
  if (!degree || !degree.colleges || degree.colleges.length === 0) {
    return null
  }

  return (
    <div className='container mx-auto px-4 py-20'>
      <div className='max-w-4xl mx-auto'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className='flex flex-col items-center md:items-start'
        >
          <h2 className='text-3xl font-bold text-gray-900 mb-8 flex items-center bg-gray-50/50 p-4 rounded-2xl w-full'>
            <Building2 className='w-8 h-8 text-[#30AD8F] mr-4' />
            Colleges offering this course
          </h2>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 w-full'>
            {degree.colleges.map((college, index) => {
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  viewport={{ once: true }}
                >
                  <Link href={`/colleges/${college.slugs || college.slug}`}>
                    <div className='group bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 flex items-center space-x-5 h-full'>
                      <div className='w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-50 border border-gray-100 group-hover:border-[#30AD8F]/20 transition-colors'>
                        <img
                          src={college.college_logo || college.logo || '/images/collegePhoto.png'}
                          alt={college.name}
                          className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                        />
                      </div>

                      <div className='flex-1'>
                        <h3 className='font-bold text-gray-900 group-hover:text-[#0A70A7] transition-colors line-clamp-1'>
                          {college.name}
                        </h3>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default CollegeTeach
