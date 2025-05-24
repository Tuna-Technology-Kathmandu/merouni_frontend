import { MapPin, Mail, Phone } from 'lucide-react'

export default function ContactInfoCard() {
  return (
    <section className='py-12 bg-white'>
      <div className='container mx-auto px-4'>
        <div className='grid md:grid-cols-3 gap-8'>
          <div className='bg-[#e8f1f4] p-8 rounded-lg'>
            <Phone className='w-6 h-6 mb-4 text-[#1a472f]' />
            <h3 className='text-xl font-bold mb-2'>(+977) 765 665</h3>
            <p className='text-gray-600'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>
          <div className='bg-[#e8f1f4] p-8 rounded-lg'>
            <Mail className='w-6 h-6 mb-4 text-[#1a472f]' />
            <h3 className='text-xl font-bold mb-2'>info@merouni.com</h3>
            <p className='text-gray-600'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>
          <div className='bg-[#e8f1f4] p-8 rounded-lg'>
            <MapPin className='w-6 h-6 mb-4 text-[#1a472f]' />
            <h3 className='text-xl font-bold mb-2'>
              Putalisadak, Kathmandu Nepal
            </h3>
            <p className='text-gray-600'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
