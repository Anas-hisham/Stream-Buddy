import { app, ipcMain } from 'electron';
import { initializeApp } from './bootstrap/init.js';
import { appendToLog } from './utils/fileManager.js';
import { getLogFilePathGlobal } from './utils/logger.js'

// Global Error Handlers
ipcMain.on('logError', (_event, message) => {
    appendToLog(message, getLogFilePathGlobal());
});

process.on('uncaughtException', (err) => {
    appendToLog(`Uncaught Exception: ${err.stack || err.message}`, getLogFilePathGlobal());
});

process.on('unhandledRejection', (reason, promise) => {
    appendToLog(`Unhandled Rejection: ${reason}\nPromise: ${promise}`, getLogFilePathGlobal());
});

// Application Lifecycle
app.whenReady().then(initializeApp);
