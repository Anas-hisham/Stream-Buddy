import { ipcMain } from 'electron'
import fs from 'fs'
import { getFilePaths, appendToLog } from '../../utils/fileManager.js'
import { CACHE_KEYS } from '../../constants/index.js';

export function setupMatchesHandlers(store, getCustomSavePathGlobal, getLogFilePathGlobal) {
    ipcMain.handle('loadMatchesCache', () => {
        return store.get(CACHE_KEYS.MATCHES)
    })

    ipcMain.handle('saveMatchesCache', (_event, data) => {
        try {
            store.set(CACHE_KEYS.MATCHES, JSON.parse(data))
            return true
        } catch (error) {
            console.error('Error saving matches cache:', error)
            appendToLog(`Error saving matches cache: ${error.message}`, getLogFilePathGlobal())
            return false
        }
    })

    ipcMain.handle('saveMatches', async (_event, data) => {
        try {
            const { matchesFilePath } = getFilePaths(getCustomSavePathGlobal())
            fs.writeFileSync(matchesFilePath, JSON.stringify(JSON.parse(data), null, 2), 'utf-8')
            return { success: true }
        } catch (error) {
            console.error('Error saving matches:', error)
            appendToLog(`Error saving matches: ${error.message}`, getLogFilePathGlobal())
            return { success: false, error: error.message }
        }
    })
}
