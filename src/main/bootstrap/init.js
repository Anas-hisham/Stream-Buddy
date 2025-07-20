import { createWindow, setMainWindow, getMainWindow } from '../windows/index.js'
import { setupIpcHandlers } from '../ipc/index.js'
import { ensureLogExist } from '../utils/fileManager.js'

ensureLogExist()

export function initializeApp() {
    const mainWindow = createWindow()
    setMainWindow(mainWindow)
    setupIpcHandlers(getMainWindow)
}
