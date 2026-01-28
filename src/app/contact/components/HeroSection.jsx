import { motion } from 'framer-motion'

export default function ContactHeroSection() {
  return (
    <section className='relative bg-[#fcfcfc] py-20 border-b border-gray-100 overflow-hidden'>
      <div className='container mx-auto px-4 relative z-10'>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='max-w-3xl'
        >
          <h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-6'>
            Let's start a <span className='text-[#30AD8F]'>conversation</span>
          </h1>
          <p className='text-gray-600 text-lg md:text-xl leading-relaxed max-w-2xl'>
            We're here to help and answer any questions you may have.
            Whether you have a question about features, pricing, or anything else, our team is ready to answer all your questions.
          </p>
        </motion.div>
      </div>

      {/* Subtle background element */}
      <div className='absolute top-0 right-0 w-1/3 h-full bg-gray-50/50 -skew-x-12 translate-x-1/2 z-0 hidden lg:block' />
    </section>
  )
}
