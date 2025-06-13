import { Message } from '../lib/db/models/Message'

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

      return {
        success: true,
        data: new_message.toObject()
      }
    } catch (error) {
      return { success: false }
    }
  }
}
