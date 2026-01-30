'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, Briefcase, Building2 } from 'lucide-react'

const VacancyContent = ({ vacancy }) => {
    if (!vacancy) return null

    const infoItems = [
        {
            icon: Calendar,
            label: 'Posted',
            value: new Date(vacancy.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            color: 'bg-blue-50 text-blue-600'
        },
        {
            icon: Briefcase,
            label: 'Type',
            value: vacancy.type || 'Full Time',
            color: 'bg-emerald-50 text-emerald-600'
        },
        {
            icon: MapPin,
            label: 'Location',
            value: vacancy.location || 'On Site',
            color: 'bg-orange-50 text-orange-600'
        }
    ]

    const processContent = (html) => {
        if (!html) return ''
        return html.replace(
            /<table([^>]*)>([\s\S]*?)<\/table>/g,
            '<div class="table-wrapper"><table$1>$2</table></div>'
        )
    }

    return (
        <div className='bg-white min-h-screen'>
            {/* Hero Section */}
            <div className='relative w-full bg-gray-50 border-b border-gray-100 py-16 md:py-24 overflow-hidden'>
                <div className='container mx-auto px-4 relative z-10'>
                    <div className='max-w-4xl mx-auto text-center'>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {vacancy.college && (
                                <div className='inline-flex items-center gap-2 px-3 py-1 bg-white border border-gray-200 rounded-full mb-6 shadow-sm'>
                                    <Building2 className='w-4 h-4 text-[#0A6FA7]' />
                                    <span className='text-xs font-bold text-gray-700 uppercase tracking-wide'>
                                        {vacancy.college.name}
                                    </span>
                                </div>
                            )}

                            <h1 className='text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight'>
                                {vacancy.title}
                            </h1>

                            <p className='text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed'>
                                {vacancy.description}
                            </p>
                        </motion.div>
                    </div>
                </div>

                {/* Decorative background elements */}
                <div className='absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none'>
                    <div className='absolute -top-[20%] -right-[10%] w-[50%] h-[50%] bg-blue-50/50 rounded-full blur-3xl' />
                    <div className='absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] bg-emerald-50/50 rounded-full blur-3xl' />
                </div>
            </div>

            {/* Featured Image */}
            {vacancy.featuredImage && (
                <div className='container mx-auto px-4 -mt-12 relative z-20'>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className='max-w-5xl mx-auto h-[300px] md:h-[500px] rounded-[2rem] overflow-hidden shadow-2xl shadow-gray-200 border-4 border-white'
                    >
                        <img
                            src={vacancy.featuredImage}
                            alt={vacancy.title}
                            className='object-cover w-full h-full'
                        />
                    </motion.div>
                </div>
            )}

            {/* Quick Info Grid */}
            <div className='container mx-auto px-4 py-16'>
                <div className='max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6'>
                    {infoItems.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className='flex items-center p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors'
                        >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 shadow-sm ${item.color}`}>
                                <item.icon className='w-5 h-5' />
                            </div>
                            <div>
                                <p className='text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5'>{item.label}</p>
                                <p className='text-gray-900 font-bold text-base'>{item.value}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className='container mx-auto px-4 pb-24'>
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className='max-w-3xl mx-auto'
                >
                    <div className='prose prose-lg prose-gray max-w-none
            prose-headings:font-bold prose-headings:text-gray-900
            prose-p:text-gray-600 prose-p:leading-relaxed
            prose-a:text-[#0A6FA7] prose-a:no-underline hover:prose-a:underline
            prose-strong:text-gray-900
            prose-ul:list-disc prose-ul:pl-6
            prose-ol:list-decimal prose-ol:pl-6
            prose-li:marker:text-gray-400
            prose-img:rounded-3xl prose-img:shadow-lg prose-img:my-8
            
             /* Heading styles */
             [&_h1]:text-3xl [&_h1]:mt-12 [&_h1]:mb-6
             [&_h2]:text-2xl [&_h2]:mt-10 [&_h2]:mb-4
             [&_h3]:text-xl [&_h3]:mt-8 [&_h3]:mb-3
             
             /* Custom list bullet styling */
             [&_li]:relative [&_li]:pl-2 [&_li]:mb-2
             
             /* Iframe/Embed styles */
             [&>iframe]:w-full 
             [&>iframe]:aspect-video 
             [&>iframe]:rounded-2xl
             [&>iframe]:my-8

             /* Table styles */
             [&_.table-wrapper]:overflow-x-auto
             [&_.table-wrapper]:my-8
             [&_.table-wrapper]:rounded-xl
             [&_.table-wrapper]:border
             [&_.table-wrapper]:border-gray-100
             [&_table]:w-full
             [&_th]:bg-gray-50 [&_th]:p-4 [&_th]:text-left [&_th]:font-semibold [&_th]:text-gray-900
             [&_td]:p-4 [&_td]:border-t [&_td]:border-gray-100
             [&_tr:hover]:bg-gray-50/50
          '
                        dangerouslySetInnerHTML={{ __html: processContent(vacancy.content) }}
                    />

                   
                </motion.div>
            </div>
        </div>
    )
}

export default VacancyContent
