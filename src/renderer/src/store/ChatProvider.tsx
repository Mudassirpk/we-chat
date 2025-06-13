import React, { createContext, SetStateAction, useContext, useState } from 'react'

type TChatContext = {
  user: TUser | null
  setUser: React.Dispatch<SetStateAction<TUser | null>>
}

export type TUser = { name: string; id: string }

const chatContext = createContext<TChatContext | null>(null)
export const useChat = () => {
  const ctx = useContext(chatContext)
  if (!ctx) throw new Error('useChat should only be used in a ChatProvider')
  return ctx
}
export default function ChatProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<TUser | null>(null)
  const values = {
    user,
    setUser
  }
  return <chatContext.Provider value={values}>{children}</chatContext.Provider>
}
