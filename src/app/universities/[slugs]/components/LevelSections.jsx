import axios from 'axios'
import React, { useEffect, useState } from 'react'

const LevelSections = ({ university }) => {
  const [loading, setLoading] = useState(true)
  const [allLevels, setAllLevels] = useState([])
  const [filteredLevels, setFilteredLevels] = useState([])

  const fetchLevels = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${process.env.baseUrl}/level?limit=20`)
      const data = response.data
      setAllLevels(data.items || [])

      if (Array.isArray(university?.levels) && university.levels.length > 0) {
        const filtered = data.items.filter(level =>
          university.levels.includes(level.id)
        )
        setFilteredLevels(filtered)
      }
    } catch (error) {
      console.error('Error fetching levels:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLevels()
  }, [university])

  if (loading) return null
  if (filteredLevels.length === 0) return null

  return (
    <div className="p-10 max-md:p-6 px-[75px] max-md:px-[30px] w-full max-md:mb-7">
      <h2 className="font-bold text-lg md:text-xl mb-8">Levels Offered</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredLevels.map(level => (
          <div
            key={level.id}
            className="bg-white p-4 rounded-lg shadow-[0px_0px_10px_1px_rgba(0,0,0,0.1)]"
          >
            {level.title}
          </div>
        ))}
      </div>
    </div>
  )
}

export default LevelSections
