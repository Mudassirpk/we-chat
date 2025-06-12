import mongoose from 'mongoose'

export const NoteSchema = new mongoose.Schema(
  {
    title: String,
    description: String
  },
  { timestamps: true }
)

export const Note = mongoose.model('Note', NoteSchema)
