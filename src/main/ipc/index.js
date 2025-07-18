import Store from 'electron-store';
import { setupPathHandlers } from './path/path.js'
import { setupDataHandlers } from './views/index.js'
import { setupSettingsHandlers } from './settings/settings.js'
import { setupAppHandlers } from './app/app.js'
import { setupAutoUpdaterHandlers } from './updater/autoUpdater.js';
import { appendToLog } from '../utils/fileManager.js';
import { setCustomSavePathGlobal, getCustomSavePathGlobal } from '../config/index.js';
import { getLogFilePathGlobal } from '../utils/logger.js';

const store = new Store();

function setupIpcHandlers(getMainWindow) {

    setupAppHandlers(store, setCustomSavePathGlobal, getLogFilePathGlobal)

    setupPathHandlers(setCustomSavePathGlobal, getCustomSavePathGlobal, getLogFilePathGlobal)

    setupSettingsHandlers(store, getLogFilePathGlobal)

    setupAutoUpdaterHandlers(getMainWindow, appendToLog, getLogFilePathGlobal);

    setupDataHandlers(store, getCustomSavePathGlobal, getLogFilePathGlobal)
}

export { setupIpcHandlers }
