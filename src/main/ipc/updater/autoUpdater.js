import { ipcMain } from 'electron'
import pkg from 'electron-updater';
const { autoUpdater } = pkg;

function setupAutoUpdaterHandlers(getMainWindow, appendToLog, getLogFilePathGlobal) {
    // Set autoDownload to false so we can control when to download updates
    autoUpdater.autoDownload = false

    // Track download state to prevent duplicate downloads
    let isDownloading = false
    let lastDownloadProgress = 0

    // ======================
    // Helper Functions
    // ======================
    const safeSendToRenderer = (channel, data) => {
        try {
            const currentMainWindow = getMainWindow()
            if (currentMainWindow && !currentMainWindow.isDestroyed()) {
                currentMainWindow.webContents.send(channel, data)
            } else {
                console.warn(`Cannot send ${channel} - main window not available`)
            }
        } catch (error) {
            console.error(`Error sending ${channel}:`, error)
        }
    }

    const logError = (message, error) => {
        const errorMessage = `${message}: ${error.message || error}`
        console.error(errorMessage)
        appendToLog(errorMessage, getLogFilePathGlobal())
        safeSendToRenderer('updateError', errorMessage)
    }

    // ======================
    // Auto Update Event Handlers
    // ======================
    autoUpdater.on('update-available', (info) => {
        safeSendToRenderer('updateAvailable', {
            version: info.version || info.releaseName,
            releaseDate: info.releaseDate,
            releaseNotes: info.releaseNotes
        })
    })

    autoUpdater.on('update-not-available', () => {
        safeSendToRenderer('updateNotAvailable')
    })

    autoUpdater.on('update-downloaded', () => {
        isDownloading = false
        lastDownloadProgress = 0
        safeSendToRenderer('updateDownloaded')
    })

    autoUpdater.on('download-progress', (progressObj) => {
        const percent = Math.round(progressObj.percent)
        // Only send progress updates if they've changed significantly (1% or more)
        if (Math.abs(percent - lastDownloadProgress) >= 1 || percent === 100) {
            lastDownloadProgress = percent
            safeSendToRenderer('updateDownloadProgress', percent)
        }
    })

    autoUpdater.on('error', (error) => {
        isDownloading = false
        logError('AutoUpdater error', error)
    })

    // ======================
    // Auto Update IPC Handlers
    // ======================
    ipcMain.handle('checkForUpdate', async () => {
        try {
            // Reset download state when checking for updates
            isDownloading = false
            lastDownloadProgress = 0

            // Initiates the check for updates
            await autoUpdater.checkForUpdates()
            return { success: true }
        } catch (error) {
            logError('Error checking for update', error)
            return { success: false, error: error.message }
        }
    })

    ipcMain.handle('downloadUpdate', async () => {
        if (isDownloading) {
            return { success: false, error: 'Download already in progress' }
        }

        try {
            isDownloading = true
            lastDownloadProgress = 0
            await autoUpdater.downloadUpdate()
            return { success: true }
        } catch (error) {
            isDownloading = false
            logError('Error downloading update', error)
            return { success: false, error: error.message }
        }
    })

    ipcMain.on('quitAndInstall', () => {
        try {
            // Ensure we're not in the middle of a download
            isDownloading = false
            autoUpdater.quitAndInstall()
        } catch (error) {
            logError('Error quitting and installing', error)
        }
    })

    // Cleanup function to remove listeners when needed
    const cleanup = () => {
        autoUpdater.removeAllListeners()
    }

    return {
        cleanup
    }
}

export {
    setupAutoUpdaterHandlers
}
