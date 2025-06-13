import { useChat } from '@renderer/store/ChatProvider'
import { FormEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { v4 as uuidv4 } from 'uuid'

export default function UserOnBoard() {
  const navigate = useNavigate()
  const { user, setUser } = useChat()
  const [chatId, setChatId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      console.log('UserOnBoard mounted, user:', user) // Debug log
      setChatId(uuidv4())

      // Add a small delay to ensure context is ready
      setTimeout(() => {
        if (user) {
          console.log('User exists, navigating to chat') // Debug log
          navigate('/chat')
        }
        setIsLoading(false)
      }, 100)
    } catch (error) {
      console.error('Error in UserOnBoard useEffect:', error)
      setIsLoading(false)
    }
  }, [user, navigate])

  function handleCreateUser(e: FormEvent) {
    e.preventDefault()
    try {
      const formData = new FormData(e.target as HTMLFormElement)
      const userName: string = formData.get('userName') as string

      console.log('Creating user:', userName, 'with chatId:', chatId) // Debug log

      if (chatId && userName.trim()) {
        setUser({
          name: userName,
          id: chatId
        })
        navigate('/chat')
      }
    } catch (error) {
      console.error('Error creating user:', error)
    }
  }

  // Show loading state
  if (isLoading) {
    return (
      <section className="h-dvh flex flex-col items-center justify-center">
        <div>Loading...</div>
      </section>
    )
  }

  // Show error state if chatId failed to generate
  if (!chatId) {
    return (
      <section className="h-dvh flex flex-col items-center justify-center">
        <div className="text-red-500">Error: Failed to initialize chat ID</div>
        <button onClick={() => window.location.reload()}>Reload</button>
      </section>
    )
  }

  return (
    <section className="h-dvh flex flex-col items-center justify-center">
      <form
        onSubmit={handleCreateUser}
        className="flex flex-col gap-4 p-4 min-w-[300px] bg-slate-100 shadow-sm rounded-lg"
      >
        <label className="font-semibold text-lg">User Name</label>
        <input
          required
          type="text"
          name="userName"
          className="bg-white rounded-lg p-2"
          placeholder="Enter you chat user name"
        />
        <p className="p-2 bg-blue-100 text-blue-800 rounded-lg">Chat ID: {chatId}</p>
        <button type="submit" className="w-full p-2 bg-blue-500 rounded-lg text-white">
          Continue to the chat
        </button>
      </form>
    </section>
  )
}
