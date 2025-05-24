import Link from 'next/link'
import React from 'react'

const FeaturedDegree = () => {
  const degree = [
    {
      id: 1,
      title: 'Engineering',
      description: 'Description for admission 1.',
      address: 'New Baneshowr',
      image: 'https://placehold.co/600x400'
    },
    {
      id: 2,
      title:
        'Bachelor of Computer Science and Information Technology (Bsc. CSIT)',
      description: 'Description for admission 2.',
      address: 'Chabahil',
      image: 'https://placehold.co/600x400'
    },
    {
      id: 3,
      title: 'Management',
      description: 'Description for admission 3.',
      address: 'Siphal',
      image: 'https://placehold.co/600x400'
    },
    {
      id: 4,
      title: 'Hospitality Management',
      description: 'Description for admission 4.',
      address: 'Basundhara',
      image: 'https://placehold.co/600x400'
    },
    {
      id: 5,
      title: 'Science & Technology',
      description: 'Description for admission 5.',
      address: 'Siphal',
      image: 'https://placehold.co/600x400'
    },
    {
      id: 6,
      title: 'Admission Title 5',
      description: 'Description for admission 5.',
      address: 'Siphal',
      image: 'https://placehold.co/600x400'
    },
    {
      id: 7,
      title: 'Admission Title 5',
      description: 'Description for admission 5.',
      address: 'Siphal',
      image: 'https://placehold.co/600x400'
    },
    {
      id: 8,
      title: 'Admission Title 5',
      description: 'Description for admission 5.',
      address: 'Siphal',
      image: 'https://placehold.co/600x400'
    }
  ]
  return (
    <div className='bg-gray-100 py-8'>
      <div className='container mx-auto px-4'>
        <h1 className=' text-xl font-semibold text-gray-800 my-8'>
          Find the Right Degree and College for You
        </h1>{' '}
        <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {degree.map((item) => (
            <Link href=''>
              <div
                key={item.id}
                className='h-72 bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:border-gray-300'
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className='w-full h-40 object-cover'
                />
                <div className='p-4'>
                  <h2 className='text-xl font-semibold text-gray-800 mb-2'>
                    {item.title}
                  </h2>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FeaturedDegree
