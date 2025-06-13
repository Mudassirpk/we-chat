import { BrowserWindow } from 'electron'
import { Note } from './models/Note'
import { Message } from './models/Message'

export async function watch_note_collection(mainWindow: BrowserWindow) {
  const changeStream = Note.watch()
  console.log(changeStream)
  changeStream.on('change', (change) => {
    console.log('change: ', change)
    if (change === 'insert') {
      mainWindow.webContents.send('new-note', { added: true })
      console.log('new note: ', change.fullDocument)
    }
  })
}
export async function watch_chat_collection(mainWindow: BrowserWindow) {
  const changeStream = Message.watch()
  console.log('Change stream started')

  changeStream.on('change', (change) => {
    console.log('change detected: ', change)

    // Fix: Check operationType, not the change object itself
    if (change.operationType === 'insert') {
      mainWindow.webContents.send('new_message', { doc: change.fullDocument })
      console.log('new message sent to renderer: ', change.fullDocument)
    }
  })

  // Handle errors
  changeStream.on('error', (error) => {
    console.error('Change stream error:', error)
  })
}
