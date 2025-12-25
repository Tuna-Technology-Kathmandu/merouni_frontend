import { useRef } from 'react'

/**
 *
 * @returns {{scroll: scroll, scrollContainerRef: React.RefObject<null>}}
 */
export const useScrollContainer = () => {
  const scrollContainerRef = useRef(null)
  const scroll = (direction) => {
    const container = scrollContainerRef.current
    if (!container) return

    const scrollAmount = 520
    const targetScroll =
      container.scrollLeft +
      (direction === 'left' ? -scrollAmount : scrollAmount)

    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    })
  }
  return {
    scroll,
    scrollContainerRef
  }
}
