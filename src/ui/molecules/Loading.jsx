import React from 'react'

import CircularLoader from './CircularLoader'

const Loader = () => {
  return (
    <div className='h-screen flex justify-center items-center'>
      <CircularLoader size='w-12 h-12' />
    </div>
  )
}

export default Loader
