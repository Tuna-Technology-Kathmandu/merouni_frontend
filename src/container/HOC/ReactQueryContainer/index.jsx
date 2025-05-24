'use client'
import { QueryClientProvider } from '@tanstack/react-query'
import { reactQueryClient } from '@/core/config/reactQuery.config'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const ReactQueryContainer = ({ children }) => {
  return (
    <>
      <QueryClientProvider client={reactQueryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  )
}

export default ReactQueryContainer
