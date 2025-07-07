import Store from 'electron-store'
import { setupPathHandlers } from './path/ipcPathHandlers.js'
import { setupDataHandlers } from './Views/index.js'
import { setupSettingsHandlers } from './settings/ipcSettingsHandlers.js'
import { setupAppHandlers } from './app/ipcAppHandlers.js'
import { setupAutoUpdaterHandlers } from './updater/icpAutoUpdater.js'
import { appendToLog } from '../utils/fileManager.js'
import {
  setCustomSavePathGlobal,
  getCustomSavePathGlobal,
  getLogFilePathGlobal
} from '../config/index.js'

const store = new Store()

function setupIpcHandlers(getMainWindow) {
  setupAppHandlers(store, setCustomSavePathGlobal, getLogFilePathGlobal)

  setupPathHandlers(setCustomSavePathGlobal, getCustomSavePathGlobal, getLogFilePathGlobal)

  setupSettingsHandlers(store, getLogFilePathGlobal)

  setupAutoUpdaterHandlers(getMainWindow, appendToLog, getLogFilePathGlobal)

  setupDataHandlers(store, getCustomSavePathGlobal, getLogFilePathGlobal)
}

export { setupIpcHandlers }
