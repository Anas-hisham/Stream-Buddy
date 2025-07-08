import { ipcMain } from 'electron'
import { CACHE_KEYS } from '../../constants'

export function setupViewBuilderHandlers(store) {
  ipcMain.handle('getAutoSavedView', async (event, key) => {
    try {
      return store.get(`${CACHE_KEYS.BUILDER}.${key}`)
    } catch (error) {
      console.error('Error reading auto-saved view:', error)
      return null
    }
  })

  ipcMain.handle('saveViewAutoSave', async (event, key, viewData) => {
    try {
      store.set(`${CACHE_KEYS.BUILDER}.${key}`, viewData)
    } catch (error) {
      console.error('Error saving auto-saved view:', error)
    }
  })

  ipcMain.handle('clearAutoSavedView', async (event, key) => {
    try {
      store.delete(`${CACHE_KEYS.BUILDER}.${key}`)
    } catch (error) {
      console.error('Error clearing auto-saved view:', error)
    }
  })
}
