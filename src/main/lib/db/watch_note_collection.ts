import { Note } from './models/Note'

export async function watch_note_collection() {
  const changeStream = Note.watch()
  console.log(changeStream)
  changeStream.on('change', (change) => {
    console.log('change: ', change)
    if (change === 'insert') {
      console.log('new note: ', change.fullDocument)
    }
  })
}
