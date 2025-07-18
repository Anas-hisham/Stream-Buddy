import Store from 'electron-store'
import { CACHE_KEYS } from '../constants/index.js'
import { DEFAULT_SAVE_PATH } from './index.js'
const store = new Store()
let customSavePath = store.get(CACHE_KEYS.CUSTOM_PATH) || DEFAULT_SAVE_PATH

export function setCustomSavePathGlobal(newPath) {
    newPath = newPath?.trim() || DEFAULT_SAVE_PATH
    customSavePath = newPath
    store.set(CACHE_KEYS.CUSTOM_PATH, newPath)
}

export function getCustomSavePathGlobal() {
    return customSavePath
}
