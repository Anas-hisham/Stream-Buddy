import { ipcMain } from 'electron'
import fs from 'fs'
import { getFilePaths, appendToLog } from '../../utils/fileManager.js'
import { CACHE_KEYS } from '../../constants/index.js';

export function setupTeamsHandlers(store, getCustomSavePathGlobal, getLogFilePathGlobal) {
    ipcMain.handle('loadTeamsCache', () => {
        return store.get(CACHE_KEYS.TEAMS)
    })

    ipcMain.handle('saveTeamsCache', (_event, data) => {
        try {
            store.set(CACHE_KEYS.TEAMS, JSON.parse(data))
            return true
        } catch (error) {
            console.error('Error saving teams cache:', error)
            appendToLog(`Error saving teams cache: ${error.message}`, getLogFilePathGlobal())
            return false
        }
    })

    ipcMain.handle('saveTeams', async (_event, data) => {
        try {
            const { teamsFilePath } = getFilePaths(getCustomSavePathGlobal())
            fs.writeFileSync(teamsFilePath, JSON.stringify(JSON.parse(data), null, 2), 'utf-8')
            return { success: true }
        } catch (error) {
            console.error('Error saving teams:', error)
            appendToLog(`Error saving teams: ${error.message}`, getLogFilePathGlobal())
            return { success: false, error: error.message }
        }
    })
}
