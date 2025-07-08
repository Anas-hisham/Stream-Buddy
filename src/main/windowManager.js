import { shell, BrowserWindow } from 'electron'
import { is } from '@electron-toolkit/utils'
import path from 'path'
import { PATHS } from './constants/index.js'

let mainWindow

export function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    show: false,
    autoHideMenuBar: true,
    icon: path.join(import.meta.dirname, '..', '..', PATHS.ICON),
    webPreferences: {
      preload: path.join(import.meta.dirname, PATHS.PRELOAD),
      nodeIntegration: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(path.join(import.meta.dirname, PATHS.DIST_HTML))
  }

  return mainWindow
}