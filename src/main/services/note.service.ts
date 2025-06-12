import { Note } from '../lib/db/models/Note'

export const note_service = {
  add: async ({ title, description }: { title: string; description: string }) => {
    try {
      const note = await Note.create({
        title,
        description
      })

      return {
        data: note.toObject(),
        success: true
      }
    } catch (error) {
      console.log(error)
      return {
        error,
        success: false
      }
    }
  },

  all: async () => {
    const notes = await Note.find().sort({
      createdAt: -1
    })

    return {
      success: true,
      data: notes.map((note) => {
        return { ...note.toObject(), _id: note._id.toString() }
      })
    }
  }
}
