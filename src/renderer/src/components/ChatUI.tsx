import { useChat } from '@renderer/store/ChatProvider'
import type React from 'react'

import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'

export interface Message {
  _id: string
  createdAt: string
  message: string
  sender: string
  senderChatId: string
}

const userColors = [
  'text-blue-600',
  'text-green-600',
  'text-purple-600',
  'text-red-600',
  'text-orange-600',
  'text-pink-600',
  'text-indigo-600',
  'text-teal-600'
]

const popularEmojis = ['😀', '❤️', '👍', '😂', '😢', '🔥']

// Mock messages data

export default function ChatInterface() {
  console.log('router ', window.location.pathname)
  const { user } = useChat()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  // Get color for username based on hash
  const getUserColor = (username: string) => {
    let hash = 0
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash)
    }
    return userColors[Math.abs(hash) % userColors.length]
  }

  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  // Handle sending message
  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const res = await window.context.chat_create_message({
        userName: user?.name,
        message: newMessage,
        chatId: user?.id
      })

      if (res.success) {
        setMessages([...messages, res.data as any])
        setNewMessage('')
      }
    }
  }

  // Handle key press in editor
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Insert emoji into message
  const insertEmoji = (emoji: string) => {
    setNewMessage((prev) => prev + emoji)
  }
  console.log(window.context)
  // Handle text formatting
  const formatText = (command: string) => {
    document.execCommand(command, false, undefined)
  }

  async function handleIncommingMessage({ doc: incomming_message }: { doc: Message }) {
    if (incomming_message.senderChatId !== user?.id) {
      const message_present = messages.find((m) => m._id === incomming_message._id)
      if (!message_present) {
        setMessages((prev) => prev.filter((pm) => pm._id !== incomming_message._id))
        setMessages((prev) => [...prev, incomming_message])
        await window.context.chat_os_notification({
          title: incomming_message.sender,
          message: incomming_message.message
        })
      }
    }
  }

  async function getAllMessages() {
    setLoading(true)
    const res = await window.context.chat_all()
    setMessages(res)
    setLoading(false)
  }

  useEffect(() => {
    if (!user) {
      navigate('/')
    }

    getAllMessages()

    window.context?.new_message(handleIncommingMessage)
  }, [])

  const lastRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    lastRef?.current?.scrollIntoView({
      behavior: 'smooth'
    })
  }, [messages])

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 h-full max-h-dvh flex flex-col">
      <button
        onClick={async () => {
          if ('Notification' in window) {
            Notification.requestPermission().then((permission) => {
              console.log('Notification Permision: ', permission)
            })

            const notification = new Notification('hello not', {
              body: 'body',
              icon: './assets/icon.png',
              badge: './assets/badge.png'
            })

            notification.onclick = () => {
              window.focus()
              notification.close()
            }
          }
        }}
      >
        Show Notification
      </button>
      {/* Chat Header */}
      <div className="bg-gray-100 flex justify-between items-center px-4 py-3 rounded-t-lg border-b border-gray-200">
        <div className="flex gap-4 items-center">
          <h2 className="text-lg font-semibold text-gray-800">Team Chat</h2>
          <p className="text-sm text-gray-600">{messages.length} messages</p>
        </div>
        <p className="text-2xl text-indigo-700">{user?.name}</p>
      </div>

      {/* Messages Container */}
      <div className="flex-1 flex flex-col gap-4 overflow-y-auto p-4">
        {loading ? (
          <div className="p-4 text-center w-full">Loading messages.....</div>
        ) : (
          messages.map((message) => (
            <div
              key={message._id}
              className={`flex flex-col space-y-1 ${message.senderChatId === user?.id && 'self-end'}`}
            >
              {/* Username and Timestamp */}
              <div className="flex items-center space-x-2">
                <span className={`font-semibold text-sm ${getUserColor(message.senderChatId)}`}>
                  {message.senderChatId === user?.id ? 'You' : message.sender}
                </span>
                <span className="text-xs text-gray-500">
                  {formatTime(new Date(message.createdAt))}
                </span>
              </div>

              {/* Message Content */}
              <div className="bg-gray-50 rounded-lg px-3 py-2 max-w-md">
                <p className="text-gray-800 text-sm leading-relaxed">{message.message}</p>
              </div>
            </div>
          ))
        )}
        <div id="last" ref={lastRef}></div>
      </div>

      {/* Message Input Area */}
      <div className="bg-white border-t border-gray-200 p-4 space-y-3">
        {/* Formatting Toolbar */}
        <div className="flex items-center space-x-2 pb-2 border-b border-gray-100">
          <button
            onClick={() => formatText('bold')}
            className="px-2 py-1 text-sm font-bold bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            title="Bold"
          >
            B
          </button>
          <button
            onClick={() => formatText('italic')}
            className="px-2 py-1 text-sm italic bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            title="Italic"
          >
            I
          </button>

          {/* Emoji Picker */}
          <div className="flex items-center space-x-1 ml-4">
            <span className="text-sm text-gray-600">Quick emojis:</span>
            {popularEmojis.map((emoji, index) => (
              <button
                key={index}
                onClick={() => insertEmoji(emoji)}
                className="text-lg hover:bg-gray-100 rounded p-1 transition-colors"
                title={`Add ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <div className="flex space-x-3">
          <div className="flex-1">
            <div
              contentEditable
              className="min-h-[40px] max-h-32 overflow-y-auto p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              style={{ wordBreak: 'break-word' }}
              onInput={(e) => setNewMessage(e.currentTarget.textContent || '')}
              onKeyDown={handleKeyPress}
              suppressContentEditableWarning={true}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Send
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}
