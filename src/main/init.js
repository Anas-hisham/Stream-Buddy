import { createWindow } from './windowManager.js'
import { setupIpcHandlers } from './handlers/index.js'
import { ensureLogExist } from './utils/fileManager.js'

import { setMainWindow, getMainWindow } from './config/index.js'

ensureLogExist()

export function initializeApp() {
  const mainWindow = createWindow()

  setMainWindow(mainWindow)
  setupIpcHandlers(getMainWindow)
}
