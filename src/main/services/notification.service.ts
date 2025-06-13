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
      console.log('notification supported')
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
    console.log('notification rejected')
    return Promise.resolve('not-supported')
  }
}
