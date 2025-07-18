import { ipcMain, dialog } from 'electron'
import fs from 'fs'
import { appendToLog } from '../../utils/fileManager.js'
import { DEFAULT_SAVE_PATH } from '../../config/appPaths.js'

function setupPathHandlers(setCustomSavePathGlobal, getCustomSavePathGlobal, getLogFilePathGlobal) {
    ipcMain.handle('getDefaultSavePath', () => {
        return getCustomSavePathGlobal()
    })

    ipcMain.handle('setCustomSavePath', async (_event, newPath) => {
        try {
            newPath = newPath?.trim() ? newPath : DEFAULT_SAVE_PATH

            if (!fs.existsSync(newPath)) {
                fs.mkdirSync(newPath, { recursive: true })
            }

            setCustomSavePathGlobal(newPath)

            return { success: true }
        } catch (error) {
            console.error('Error setting custom save path:', error)
            appendToLog(`Error setting custom save path: ${error.message}`, getLogFilePathGlobal())
            return { success: false, error: error.message }
        }
    })

    ipcMain.handle('selectFolder', async () => {
        const result = await dialog.showOpenDialog({
            properties: ['openDirectory']
        })
        return result.canceled ? null : result.filePaths[0]
    })
}

export {
    setupPathHandlers
}
