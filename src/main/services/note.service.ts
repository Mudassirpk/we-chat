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
  }
}
