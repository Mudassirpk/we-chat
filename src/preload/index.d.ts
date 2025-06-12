import { ElectronAPI } from '@electron-toolkit/preload'
import { IPCResponse } from './../../type'

declare global {
  interface Window {
    electron: ElectronAPI
    context: {
      note_add: ({ title: string, description: string }) => Promise<IPCResponse<unknown>>
      note_all: () => IPCResponse<unknown[]>
      note_delete: (_id: string) => IPCResponse<unknown>
    }
    api: unknown
  }
}
