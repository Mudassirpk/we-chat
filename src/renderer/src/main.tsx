import './assets/main.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'

export const query_client = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      retry: false
    }
  }
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={query_client}>
      <App />
    </QueryClientProvider>
    <Toaster />
  </StrictMode>
)
