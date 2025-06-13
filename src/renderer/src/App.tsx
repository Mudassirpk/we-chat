import { createHashRouter, RouterProvider } from 'react-router'
import UserOnBoard from './components/UserOnBoard'
import ChatInterface from './components/ChatUI'
import ErrorPage from './components/Error'
const router = createHashRouter([
  {
    path: '/',
    element: <UserOnBoard />,
    errorElement: <ErrorPage />
  },
  {
    path: '/chat',
    element: <ChatInterface />,
    errorElement: <ErrorPage />
  }
])

export default function App() {
  return <RouterProvider router={router} />
}
