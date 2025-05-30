const CollegeCard = ({ logo, name, address, gradient }) => {
  return (
    <div
      className='text-center min-w-[300px] md:min-w-[400px] mx-4 rounded-2xl flex flex-col items-center justify-evenly'
      style={{
        height: '70vh', // Adjusted height to 70% of viewport height
        background: gradient,
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
      }}
    >
      <h3 className='text-white font-bold text-2xl'>{name}</h3>

      <img
        src={logo}
        alt={`${name} logo`}
        className='w-24 h-24 md:w-32 md:h-32 rounded-full mb-2'
      />
      <p className='text-white font-semibold text-xl'>{address}</p>
    </div>
  )
}

export default CollegeCard
