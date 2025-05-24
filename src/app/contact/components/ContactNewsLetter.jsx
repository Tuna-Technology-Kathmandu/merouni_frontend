export default function ContactNewsletter() {
  return (
    <div className='bg-[#6a958f] p-8 rounded-lg text-white'>
      <h3 className='text-2xl font-bold mb-4'>Our Newsletters</h3>
      <p className='mb-6'>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus,
        luctus nec ullamcorper mattis.
      </p>
      <input
        type='email'
        placeholder='Email'
        className='w-full p-3 rounded-md bg-white mb-4'
      />
      <button className='w-full py-3 bg-[#1a472f] text-white rounded-md hover:bg-opacity-90'>
        Subscribe Now
      </button>
    </div>
  )
}
