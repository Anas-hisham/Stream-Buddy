import { ipcMain } from 'electron'
import fs from 'fs'
import { getFilePaths, appendToLog } from '../../utils/fileManager.js'
import { CACHE_KEYS } from '../../constants/index.js';

export function setupPlayersHandlers(store, getCustomSavePathGlobal, getLogFilePathGlobal) {
    ipcMain.handle('loadPlayerCache', () => {
        return store.get(CACHE_KEYS.PLAYERS)
    })

    ipcMain.handle('savePlayerCache', (_event, data) => {
        try {
            store.set(CACHE_KEYS.PLAYERS, JSON.parse(data))
            return true
        } catch (error) {
            console.error('Error saving player cache:', error)
            appendToLog(`Error saving player cache: ${error.message}`, getLogFilePathGlobal())
            return false
        }
    })

    ipcMain.handle('savePlayer', async (_event, data) => {
        try {
            const { playersFilePath } = getFilePaths(getCustomSavePathGlobal())
            fs.writeFileSync(playersFilePath, JSON.stringify(JSON.parse(data), null, 2), 'utf-8')
            return { success: true }
        } catch (error) {
            console.error('Error saving players:', error)
            appendToLog(`Error saving players: ${error.message}`, getLogFilePathGlobal())
            return { success: false, error: error.message }
        }
    })
}
