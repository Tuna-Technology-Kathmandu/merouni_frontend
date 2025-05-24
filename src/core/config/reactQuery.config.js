import { QueryClient } from '@tanstack/react-query'

/**
 *
 * @type {QueryClient}
 */
export const reactQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false // default: true
    }
  }
})
