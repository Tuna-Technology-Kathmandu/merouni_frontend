import React from 'react'
import Image from 'next/image'

const Navbar = () => {
  return (
    <div className='flex bg-gray-100 p-3 border-b-2'>
        <div>
            <Image alt='meroUni logo' src='/images/edusanjal-logo.svg' width={150} height={150}/>
        </div>
    </div>
  )
}

export default Navbar