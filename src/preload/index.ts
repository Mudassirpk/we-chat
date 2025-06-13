import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { get_services_to_invoke } from './services_to_invoke'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    // this will invoke all the services defined in - main/services
    contextBridge.exposeInMainWorld('context', get_services_to_invoke(ipcRenderer))
    contextBridge.exposeInMainWorld('eventsNote', {
      update: (cb) => ipcRenderer.on('new-note', (event, data) => cb(data))
    })
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
