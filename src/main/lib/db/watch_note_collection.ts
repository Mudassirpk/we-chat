import { BrowserWindow } from 'electron'
import { Note } from './models/Note'

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
