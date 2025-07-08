import { createWindow } from '../windows/window.js'
import { setupIpcHandlers } from '../handlers/index.js'
import { ensureLogExist } from '../utils/fileManager.js'

ensureLogExist()

export function initializeApp() {
  const mainWindow = createWindow()
  setupIpcHandlers(mainWindow)
}
