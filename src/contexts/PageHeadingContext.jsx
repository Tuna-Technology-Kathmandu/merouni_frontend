'use client'

import { createContext, useContext, useState } from 'react'

const PageHeadingContext = createContext({
  heading: null,
  subheading: null,
  setHeading: () => {},
  setSubheading: () => {}
})

export const usePageHeading = () => {
  const context = useContext(PageHeadingContext)
  if (!context) {
    throw new Error('usePageHeading must be used within PageHeadingProvider')
  }
  return context
}

export const PageHeadingProvider = ({ children }) => {
  const [heading, setHeading] = useState(null)
  const [subheading, setSubheading] = useState(null)

  // Support both string (backward compatibility) and object format
  const handleSetHeading = (value) => {
    if (typeof value === 'string') {
      setHeading(value)
      setSubheading(null)
    } else if (value && typeof value === 'object') {
      setHeading(value.heading || null)
      setSubheading(value.subheading || null)
    } else {
      setHeading(null)
      setSubheading(null)
    }
  }

  return (
    <PageHeadingContext.Provider
      value={{
        heading,
        subheading,
        setHeading: handleSetHeading,
        setSubheading
      }}
    >
      {children}
    </PageHeadingContext.Provider>
  )
}
