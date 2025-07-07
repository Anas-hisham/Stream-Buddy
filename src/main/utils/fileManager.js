import path from 'path'
import fs from 'fs'
import { FILE_NAMES, PATHS } from '../constants/index.js';

function ensureLogExist() {
    const errorsDir = path.join(PATHS.DEFAULT_SAVE_PATH, 'errors');
    const logFile = path.join(errorsDir, PATHS.LOG_FILE_NAME);
    if (!fs.existsSync(logFile)) {
        try {
            if (!fs.existsSync(errorsDir)) {
                fs.mkdirSync(errorsDir, { recursive: true });
            }

            if (!fs.existsSync(logFile)) {
                fs.writeFileSync(logFile, '');
            }
        } catch (error) {
            console.error(`Failed to create log file at ${logFile}:`, error)
        }
    }
}

function getFilePaths(customSavePath) {
    return {
        teamsFilePath: path.join(customSavePath, FILE_NAMES.TEAMS),
        playersFilePath: path.join(customSavePath, FILE_NAMES.PLAYERS),
        matchesFilePath: path.join(customSavePath, FILE_NAMES.MATCHES),
    }
}

function appendToLog(message, logFilePath) {
    const logMessage = `[${new Date().toISOString()}] ${message}\n`
    try {
        fs.appendFileSync(logFilePath, logMessage)
    } catch (error) {
        console.error(`Failed to append to log file at ${logFilePath}:`, error)
    }
}

export {
    ensureLogExist,
    getFilePaths,
    appendToLog,
}
