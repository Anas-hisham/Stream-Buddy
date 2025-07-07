import { app } from 'electron';
import Store from 'electron-store';
import { PATHS } from '../constants/index.js';

const store = new Store();
let customSavePath = store.get('customSavePath') || PATHS.DEFAULT_SAVE_PATH;

export function setCustomSavePathGlobal(newPath) {
    newPath = newPath?.trim() || app.getPath('userData');
    customSavePath = newPath;
    store.set('customSavePath', newPath);
}

export function getCustomSavePathGlobal() {
    return customSavePath;
}
