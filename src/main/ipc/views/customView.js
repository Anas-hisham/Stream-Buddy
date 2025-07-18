import { ipcMain } from 'electron';
import fs from 'fs';
import path from 'path';
import { CACHE_KEYS } from '../../constants/index.js';

export function setupCustomViewHandlers(store, getCustomSavePathGlobal) {
    ipcMain.handle('saveViewCache', async (event, viewPath, data) => {
        try {
            const viewCache = store.get(CACHE_KEYS.CUSTOM_VIEWS) || {};
            viewCache[viewPath] = data;
            store.set(CACHE_KEYS.CUSTOM_VIEWS, viewCache);
            return { success: true };
        } catch (error) {
            console.error('Error saving view cache:', error);
            return { success: false, message: error.message };
        }
    });

    ipcMain.handle('loadViewCache', (event, viewPath) => {
        try {
            const viewCache = store.get(CACHE_KEYS.CUSTOM_VIEWS) || {};
            return { success: true, data: viewCache[viewPath] || null };
        } catch (error) {
            console.error('Error loading view cache:', error);
            return { success: false, message: error.message };
        }
    });

    ipcMain.handle('clearViewCache', async (event, viewPath) => {
        try {
            const viewCache = store.get(CACHE_KEYS.CUSTOM_VIEWS) || {};
            const viewData = viewCache[viewPath];

            if (viewData?.config) {
                viewData.config.forEach(section => {
                    section.lines?.forEach(line => {
                        line.fields?.forEach(field => {
                            if (field.type === 'image' && field.value?.startsWith('blob:')) {
                                URL.revokeObjectURL(field.value);
                            }
                        });
                    });
                });
            }

            delete viewCache[viewPath];
            store.set(CACHE_KEYS.CUSTOM_VIEWS, viewCache);

            return { success: true };
        } catch (error) {
            console.error('Error clearing view cache:', error);
            return { success: false, message: error.message };
        }
    });

    ipcMain.handle('saveViewData', async (event, viewName, data) => {
        try {
            const fileName = `${viewName}.json`;
            const savePath = path.join(getCustomSavePathGlobal(), fileName);

            const dirPath = path.dirname(savePath);
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
            }

            fs.writeFileSync(savePath, JSON.stringify(data, null, 2), 'utf-8');

            return {
                success: true,
                message: 'View data saved successfully',
                path: savePath
            };
        } catch (error) {
            console.error('Error saving view data:', error);
            return {
                success: false,
                message: `Failed to save view data: ${error.message}`
            };
        }
    });

    ipcMain.handle('load-view-data', async (event, viewName) => {
        try {
            const fileName = `${viewName}.json`;
            const loadPath = path.join(getCustomSavePathGlobal(), fileName);

            if (fs.existsSync(loadPath)) {
                const fileContent = fs.readFileSync(loadPath, 'utf-8');
                return { success: true, data: JSON.parse(fileContent) };
            } else {
                return { success: true, data: null, message: 'No existing data found for this view.' };
            }
        } catch (error) {
            console.error('Error loading view data:', error);
            return { success: false, message: `Failed to load view data: ${error.message}` };
        }
    });
}
