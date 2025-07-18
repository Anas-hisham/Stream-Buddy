import { ipcMain } from 'electron';
import { appendToLog } from '../../utils/fileManager.js';
import { CACHE_KEYS } from '../../constants/index.js';

function setupSettingsHandlers(store, getLogFilePathGlobal) {
    ipcMain.handle('saveSettingsCache', async (_event, data) => {
        try {
            store.set(CACHE_KEYS.SETTINGS, data);
            return { success: true };
        } catch (error) {
            console.error('Error saving settings:', error);
            appendToLog(`Error saving settings: ${error.message}`, getLogFilePathGlobal());
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('getSettingsCache', async () => store.get(CACHE_KEYS.SETTINGS));

    ipcMain.handle('setLastPreset', (_, name) => {
        try {
            store.set(CACHE_KEYS.LAST_APPLIED_PRESET, name);
            return true;
        } catch (error) {
            console.error('Error setting last preset:', error);
            appendToLog(`Error setting last preset: ${error.message}`, getLogFilePathGlobal());
            return false;
        }
    });

    ipcMain.handle('getLastPreset', () => store.get(CACHE_KEYS.LAST_APPLIED_PRESET, ''));

    ipcMain.handle('getPresets', async () => store.get(CACHE_KEYS.PRESETS, {}));

    ipcMain.handle('savePreset', async (_, { name, views }) => {
        try {
            const presets = store.get(CACHE_KEYS.PRESETS, {});
            presets[name] = views;
            store.set(CACHE_KEYS.PRESETS, presets);
            return true;
        } catch (error) {
            console.error('Error saving preset:', error);
            appendToLog(`Error saving preset: ${error.message}`, getLogFilePathGlobal());
            return false;
        }
    });

    ipcMain.handle('deletePreset', async (_, name) => {
        try {
            const presets = store.get(CACHE_KEYS.PRESETS, {});
            delete presets[name];
            store.set(CACHE_KEYS.PRESETS, presets);
            return true;
        } catch (error) {
            console.error('Error deleting preset:', error);
            appendToLog(`Error deleting preset: ${error.message}`, getLogFilePathGlobal());
            return false;
        }
    });

    ipcMain.handle('renamePreset', async (_, oldName, newName) => {
        try {
            const presets = store.get(CACHE_KEYS.PRESETS, {});
            if (presets[oldName]) {
                const newPresets = {};
                for (const [key, value] of Object.entries(presets)) {
                    newPresets[key === oldName ? newName : key] = value;
                }
                store.set(CACHE_KEYS.PRESETS, newPresets);
            }
            return true;
        } catch (err) {
            console.error('Error renaming preset:', err);
            appendToLog(`Error renaming preset: ${err.message}`, getLogFilePathGlobal());
            return false;
        }
    });

    ipcMain.handle('clearLastAppliedPreset', async () => {
        try {
            store.delete(CACHE_KEYS.LAST_APPLIED_PRESET);
            return true;
        } catch (err) {
            console.error('Failed to clear last applied preset:', err);
            appendToLog(`Failed to clear last applied preset: ${err.message}`, getLogFilePathGlobal());
            return false;
        }
    });

    ipcMain.handle('clearAllViewPresets', async () => {
        try {
            store.delete(CACHE_KEYS.LAST_APPLIED_PRESET);
            store.delete(CACHE_KEYS.PRESETS);
            return true;
        } catch (err) {
            console.error('Failed to clear presets:', err);
            appendToLog(`Failed to clear presets: ${err.message}`, getLogFilePathGlobal());
            return false;
        }
    });
}

export {
    setupSettingsHandlers
};
