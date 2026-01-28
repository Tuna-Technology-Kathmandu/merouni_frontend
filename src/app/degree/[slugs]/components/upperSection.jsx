import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, GraduationCap, Globe, BookOpen } from 'lucide-react'

const ImageSection = ({ degree }) => {
  const infoItems = [
    {
      icon: Calendar,
      label: 'Duration',
      value: degree?.duration || 'TBD',
      color: 'bg-emerald-50 text-emerald-600'
    },
    {
      icon: GraduationCap,
      label: 'Faculty',
      value: degree?.programfaculty?.title || 'TBD',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      icon: Clock,
      label: 'Delivery Mode',
      value: degree?.delivery_mode || 'TBD',
      color: 'bg-orange-50 text-orange-600'
    }
  ]

  return (
    <div className='flex flex-col items-center w-full bg-white'>
      {/* Page Header / Hero Area */}
      <div className='w-full bg-gray-50 border-b border-gray-100 py-16 md:py-24'>
        <div className='container mx-auto px-4'>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='max-w-4xl'
          >
            <div className='flex items-center space-x-3 mb-6'>
              <span className='px-3 py-1 bg-[#30AD8F]/10 text-[#30AD8F] text-xs font-bold rounded-full border border-[#30AD8F]/20'>
                {degree?.code}
              </span>
              {degree?.programlevel?.title && (
                <span className='text-gray-400 text-xs font-bold uppercase tracking-widest'>
                  • {degree.programlevel.title}
                </span>
              )}
            </div>
            <h1 className='text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight'>
              {degree?.title}
            </h1>
            <p className='text-gray-500 text-lg max-w-2xl leading-relaxed'>
              A comprehensive {degree?.duration} program delivered {degree?.delivery_mode} at the {degree?.programlevel?.title} level.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Hero Image Section */}
      <div className='container mx-auto px-4 -mt-12 md:-mt-16 relative z-10'>
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className='w-full h-[300px] md:h-[500px] rounded-[2rem] overflow-hidden shadow-2xl shadow-gray-200 border border-gray-100'
        >
          <img
            src={'/images/degreeHero.webp'}
            alt={degree?.title || 'Degree Image'}
            className='object-cover w-full h-full'
          />
        </motion.div>
      </div>

      {/* Quick Info Grid */}
      <div className='container mx-auto px-4 py-16'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {infoItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className='flex flex-col p-8 bg-gray-50 rounded-3xl border border-gray-100'
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-sm ${item.color}`}>
                <item.icon className='w-6 h-6' />
              </div>
              <p className='text-xs font-bold text-gray-400 uppercase tracking-widest mb-2'>{item.label}</p>
              <p className='text-gray-900 font-bold text-xl'>{item.value}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Content Section */}
      <div className='container mx-auto px-4 pb-20'>
        <div className='max-w-4xl'>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className='text-3xl font-bold text-gray-900 mb-10 flex items-center'>
              <span className='w-1.5 h-8 bg-[#30AD8F] rounded-full mr-4' />
              Description
            </h2>
            <div
              className='prose prose-lg prose-gray max-w-none 
              [&>iframe]:w-full 
              [&>iframe]:aspect-video 
              [&>iframe]:h-auto
              [&>iframe]:rounded-3xl 
              [&>iframe]:my-12
              
              [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-6
              [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-4
              [&_p]:text-gray-600 [&_p]:leading-relaxed [&_p]:mb-6
              [&_ul]:list-none [&_ul]:pl-0
              [&_li]:relative [&_li]:pl-8 [&_li]:mb-4
              [&_li::before]:content-[""] [&_li::before]:absolute [&_li::before]:left-0 [&_li::before]:top-3 [&_li::before]:w-2 [&_li::before]:h-2 [&_li::before]:bg-[#30AD8F] [&_li::before]:rounded-full
              '
              dangerouslySetInnerHTML={{ __html: degree?.learning_outcomes || '' }}
            />
          </motion.div>

          {/* Careers & Eligibility */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mt-16 pt-16 border-t border-gray-100'>
            {degree?.careers && (
              <div className='space-y-4'>
                <h3 className='text-xl font-bold text-gray-900'>Career Opportunities</h3>
                <p className='text-gray-600 leading-relaxed'>{degree.careers}</p>
              </div>
            )}

            {degree?.eligibility_criteria && (
              <div className='space-y-4'>
                <h3 className='text-xl font-bold text-gray-900'>Eligibility Criteria</h3>
                <p className='text-gray-600 leading-relaxed'>{degree.eligibility_criteria}</p>
              </div>
            )}
          </div>

          {/* Quick Details List */}
          <div className='mt-20'>
            <h3 className='text-xl font-bold text-gray-900 mb-8'>Quick Details</h3>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              {[
                { icon: Globe, label: 'Language', value: degree?.language },
                { icon: BookOpen, label: 'Entrance Exam', value: degree?.programexam?.title },
                { icon: GraduationCap, label: 'Scholarship', value: degree?.programscholarship?.name },
                { icon: Clock, label: 'Delivery Type', value: degree?.delivery_type }
              ].filter(i => i.value).map((item, idx) => (
                <div key={idx} className='flex items-center p-5 bg-white border border-gray-100 rounded-2xl'>
                  <item.icon className='w-5 h-5 text-[#30AD8F] mr-4' />
                  <div>
                    <p className='text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5'>{item.label}</p>
                    <p className='text-gray-900 font-bold text-sm'>{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImageSection
