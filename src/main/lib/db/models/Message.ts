import mongoose from 'mongoose'

const MessageSchema = new mongoose.Schema(
  {
    sender: String,
    message: String,
    senderChatId: String
  },
  {
    timestamps: true
  }
)

export const Message = mongoose.model('Message', MessageSchema)
