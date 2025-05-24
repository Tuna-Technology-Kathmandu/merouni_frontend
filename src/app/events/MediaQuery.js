import { useState, useEffect } from 'react'

function useMediaQuery(query) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    // Set the initial value
    if (media.matches !== matches) {
      setMatches(media.matches)
    }
    // Define a listener for changes
    const listener = () => setMatches(media.matches)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [matches, query])

  return matches
}

export default useMediaQuery
