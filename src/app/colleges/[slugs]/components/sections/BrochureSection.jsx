import { Eye } from 'lucide-react'

const BrochureSection = ({ college }) => {
  const brochureUrl = college?.college_broucher

  if (!brochureUrl) {
    return null
  }
  const filename = brochureUrl.split('/').pop() || 'College Brochure'

  return (
    <section className='mb-6'>
      <h2 className='text-sm md:text-lg lg:text-xl font-bold mb-2'>
        College Brochure
      </h2>
      <div className='flex items-center gap-4'>
        <a
          href={brochureUrl}
          target='_blank'
          rel='noopener noreferrer'
          className='bg-clientBtn hover:bg-clientBtnHover text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors'
        >
          <Eye className='w-4 h-4' />
          View Brochure
        </a>
        <span className='text-sm text-gray-600'>{filename}</span>
      </div>
    </section>
  )
}

export default BrochureSection
