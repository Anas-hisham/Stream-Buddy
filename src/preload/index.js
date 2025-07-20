const { contextBridge, ipcRenderer } = require('electron')

const myAPI = {
    // ────────────────────────────────
    // Teams APIs
    // ────────────────────────────────
    loadTeamsCache: () => ipcRenderer.invoke('loadTeamsCache'),
    saveTeamsCache: (data) => ipcRenderer.invoke('saveTeamsCache', data),
    saveTeams: (data) => ipcRenderer.invoke('saveTeams', data),

    // ────────────────────────────────
    // Players APIs
    // ────────────────────────────────
    loadPlayerCache: () => ipcRenderer.invoke('loadPlayerCache'),
    savePlayerCache: (data) => ipcRenderer.invoke('savePlayerCache', data),
    savePlayer: (data) => ipcRenderer.invoke('savePlayer', data),

    // ────────────────────────────────
    // Matches APIs
    // ────────────────────────────────
    loadMatchesCache: () => ipcRenderer.invoke('loadMatchesCache'),
    saveMatchesCache: (data) => ipcRenderer.invoke('saveMatchesCache', data),
    saveMatches: (data) => ipcRenderer.invoke('saveMatches', data),

    // ────────────────────────────────
    // Presets & Settings
    // ────────────────────────────────
    setLastAppliedPreset: (name) => ipcRenderer.invoke('setLastPreset', name),
    getLastAppliedPreset: () => ipcRenderer.invoke('getLastPreset'),
    saveViewSettingsCache: (data) => ipcRenderer.invoke('saveSettingsCache', data),
    getViewSettingsCache: () => ipcRenderer.invoke('getSettingsCache'),
    clearDataCache: () => ipcRenderer.invoke('clearDataCache'),

    setCustomSavePath: (customPath) => ipcRenderer.invoke('setCustomSavePath', customPath),

    // ────────────────────────────────
    // Logging & Errors
    // ────────────────────────────────
    logError: (message) => ipcRenderer.send('logError', message),
    showErrorDialog: (message) => ipcRenderer.send('dialogError', message),

    // ────────────────────────────────
    // Presets Management
    // ────────────────────────────────
    savePreset: (name, views) => ipcRenderer.invoke('savePreset', { name, views }),
    getPresets: () => ipcRenderer.invoke('getPresets'),
    deletePreset: (name) => ipcRenderer.invoke('deletePreset', name),
    renamePreset: (oldName, newName) => ipcRenderer.invoke('renamePreset', oldName, newName),
    clearLastAppliedPreset: () => ipcRenderer.invoke('clearLastAppliedPreset'),
    clearAllViewPresets: () => ipcRenderer.invoke('clearAllViewPresets'),

    // ────────────────────────────────
    // App Version & Updates
    // ────────────────────────────────
    getAppVersion: () => ipcRenderer.invoke('getAppVersion'),
    checkForUpdate: () => ipcRenderer.invoke('checkForUpdate'),
    downloadUpdate: () => ipcRenderer.invoke('downloadUpdate'),
    installUpdate: () => ipcRenderer.send('quitAndInstall'),

    onUpdateAvailable: (callback) => ipcRenderer.on('updateAvailable', callback),
    onUpdateNotAvailable: (callback) => ipcRenderer.on('updateNotAvailable', callback),
    onUpdateDownloaded: (callback) => ipcRenderer.on('updateDownloaded', callback),
    onDownloadProgress: (callback) =>
        ipcRenderer.on('updateDownloadProgress', (event, percent) => callback(percent)),

    // ────────────────────────────────
    // Paths & File System
    // ────────────────────────────────
    getDefaultSavePath: () => ipcRenderer.invoke('getDefaultSavePath'),
    selectFolder: () => ipcRenderer.invoke('selectFolder'),
    openFileDialog: (options) => ipcRenderer.invoke('dialogOpenFile', options),
    readFile: (path) => ipcRenderer.invoke('fileRead', path),

    // ────────────────────────────────
    // Custom View
    // ────────────────────────────────
    saveViewCache: (viewPath, data) => ipcRenderer.invoke('saveViewCache', viewPath, data),
    loadViewCache: (viewPath) => ipcRenderer.invoke('loadViewCache', viewPath),
    saveViewData: (viewName, data) => ipcRenderer.invoke('saveViewData', viewName, data),
    clearViewCache: (path) => ipcRenderer.invoke('clearViewCache', path),

    // ────────────────────────────────
    // View Builder
    // ────────────────────────────────
    loadBuilderCache: (path) => ipcRenderer.invoke('loadBuilderCache', path),
    saveBuilderCache: (path, viewData) => ipcRenderer.invoke('saveBuilderCache', path, viewData),
    clearBuilderCache: (path) => ipcRenderer.invoke('clearBuilderCache', path)
}

contextBridge.exposeInMainWorld('myAPI', myAPI)
