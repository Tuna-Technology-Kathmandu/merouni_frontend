import { MapPin, Mail, Phone } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ContactInfoCard() {
  const contactDetails = [
    {
      icon: Phone,
      title: 'Phone',
      value: '(+977) 9840747576',
      description: 'Mon - Fri, 9am - 6pm'
    },
    {
      icon: Mail,
      title: 'Email',
      value: 'info@merouni.com',
      description: 'Online support 24/7'
    },
    {
      icon: MapPin,
      title: 'Office',
      value: 'Putalisadak, Kathmandu',
      description: 'Nepal - 44600'
    }
  ]

  return (
    <section className='py-20 bg-white'>
      <div className='container mx-auto px-4'>
        <div className='grid md:grid-cols-3 gap-10'>
          {contactDetails.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className='flex flex-col'
            >
              <div className='w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-6 border border-gray-100'>
                <item.icon className='w-6 h-6 text-[#30AD8F]' />
              </div>
              <h3 className='text-sm font-bold text-gray-400 uppercase tracking-widest mb-3'>
                {item.title}
              </h3>
              <p className='text-xl font-bold text-gray-900 mb-2'>
                {item.value}
              </p>
              <p className='text-gray-500 text-sm'>
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
