import { Notification } from 'electron'
import { mainWindow } from '..'

export const notification_service = {
  os_notification({ title, message }: { title: string; message: string }) {
    if (Notification.isSupported()) {
      const notification = new Notification({
        title,
        body: message
      })

      notification.show()

      return new Promise((resolve) => {
        notification.on('click', () => {
          if (mainWindow) {
            if (mainWindow.isMinimized()) {
              mainWindow.restore()
            }
            mainWindow.show()
            mainWindow.focus()
          }
        })
        notification.on('close', () => {
          resolve('closed')
        })
      })
    }
    return Promise.resolve('not-supported')
  }
}
