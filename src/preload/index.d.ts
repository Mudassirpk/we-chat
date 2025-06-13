import { ElectronAPI } from '@electron-toolkit/preload'
import { IPCResponse } from './../../type'
import { Message } from '@renderer/components/ChatUI'

declare global {
  interface Window {
    electron: ElectronAPI
    context: {
      chat_create_message: ({ userName, chatId, message }) => IPCResponse<unknown>
      new_message: (cb) => unknown
      chat_all: () => Message[]
      chat_os_notification: ({ title: string, message: string }) => void
    }
    events: {
      new_message: (cb) => unknown
    }
    api: unknown
  }
}
