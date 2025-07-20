import { ipcMain, dialog, app } from 'electron'
import fs from 'fs'
import { appendToLog } from '../../utils/fileManager.js'
import { CACHE_KEYS, KEYS_TO_CLEAR } from '../../constants/index.js';

function setupAppHandlers(store, setCustomSavePathGlobal, getLogFilePathGlobal) {
    ipcMain.handle('clearDataCache', async () => {
        try {
            const viewCache = store.get(CACHE_KEYS.CUSTOM_VIEWS) || {};

            Object.keys(viewCache).forEach(viewPath => {
                const view = viewCache[viewPath];
                if (view?.config) {
                    view.config.forEach(section => {
                        section.lines?.forEach(line => {
                            line.fields?.forEach(field => {
                                if (field.type === 'image') {
                                    if (field.value?.startsWith('blob:')) {
                                        URL.revokeObjectURL(field.value);
                                    }
                                    field.filePath = '';
                                }
                                field.value = '';
                            });
                        });
                    });
                }
            });
            KEYS_TO_CLEAR.forEach(key => store.set(key, {}));
            store.set(CACHE_KEYS.CUSTOM_VIEWS, viewCache);

            return { success: true };
        } catch (error) {
            console.error('Error clearing cache:', error);
            appendToLog(`Error clearing cache: ${error.message}`, getLogFilePathGlobal());
            return { success: false, error: error.message };
        }
    });
    ipcMain.handle('getAppVersion', () => app.getVersion())


    ipcMain.handle('dialogOpenFile', async (_, options) => {
        const result = await dialog.showOpenDialog({
            properties: ['openFile'],
            filters: options.filters
        })
        return result
    })


    ipcMain.handle('fileRead', async (_, path) => {
        try {
            return fs.promises.readFile(path)
        } catch (error) {
            console.error(`Error reading file at ${path}:`, error)
            appendToLog(`Error reading file at ${path}: ${error.message}`, getLogFilePathGlobal())
            return null
        }
    })

    // Displays a native error dialog box.
    ipcMain.on('dialogError', (_, message) => {
        dialog.showErrorBox('Error', message)
        appendToLog(`Dialog Error: ${message}`, getLogFilePathGlobal())
    })
}

export {
    setupAppHandlers
}
