import { BrowserWindow, Notification } from 'electron'

export const notification_service = {
  os_notification({
    title,
    message,
    mainWindow
  }: {
    title: string
    message: string
    mainWindow: BrowserWindow
  }) {
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
