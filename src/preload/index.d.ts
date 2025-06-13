import { ElectronAPI } from '@electron-toolkit/preload'
import { IPCResponse } from './../../type'

declare global {
  interface Window {
    electron: ElectronAPI
    context: {
      chat_create_message: ({ userName, chatId, message }) => IPCResponse<unknown>
      new_message: (cb) => unknown
    }
    events: {
      new_message: (cb) => unknown
    }
    api: unknown
  }
}
