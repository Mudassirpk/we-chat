import { FormEvent } from 'react'

function App(): React.JSX.Element {
  console.log(window.context)

  async function createNote(e: FormEvent): Promise<void> {
    e.preventDefault()
    const target = e.target as HTMLFormElement
    const data = new FormData(target)
    const note = await window.context.note_add(Object.fromEntries(data) as any)
    console.log(note.success, note.data)
  }
  return (
    <>
      <form onSubmit={createNote}>
        <input type="text" name="title" />
        <textarea name="description"></textarea>
        <button>create note</button>
      </form>
    </>
  )
}

export default App
