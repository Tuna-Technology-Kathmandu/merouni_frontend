'use client'

import { createContext, useContext, useState } from 'react'

const PageHeadingContext = createContext({
  heading: null,
  setHeading: () => {}
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

  return (
    <PageHeadingContext.Provider value={{ heading, setHeading }}>
      {children}
    </PageHeadingContext.Provider>
  )
}
