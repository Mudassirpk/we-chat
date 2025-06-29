import { Message } from '../lib/db/models/Message'
import { Notification } from 'electron'
import { mainWindow } from '..'

export const chat_services = {
  create_message: async ({
    userName,
    chatId,
    message
  }: {
    userName: string
    chatId: string
    message: string
  }) => {
    try {
      const new_message = await Message.create({
        sender: userName,
        senderChatId: chatId,
        message
      })
      const objectMessage = new_message.toObject()
      return {
        success: true,
        data: { ...objectMessage, _id: objectMessage._id.toString() }
      }
    } catch (error) {
      return { success: false }
    }
  },
  async all() {
    const messages = await Message.find()
    return messages.map((m) => ({ ...m.toObject(), _id: m.toObject()._id.toString() }))
  }
}
