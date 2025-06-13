import './assets/main.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import ChatProvider from './store/ChatProvider'

window.addEventListener('error', (event) => {
  if (
    event.message.includes('Autofill.enable') ||
    event.message.includes('Autofill.setAddresses')
  ) {
    event.preventDefault()
    return false
  }
})

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
    <ChatProvider>
      <QueryClientProvider client={query_client}>
        <App />
      </QueryClientProvider>
    </ChatProvider>
    <Toaster />
  </StrictMode>
)
