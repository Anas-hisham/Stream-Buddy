import path from 'path';
import { STATIC_PATHS } from '../constants/index.js';
import { DEFAULT_SAVE_PATH } from '../config/index.js';

const logFilePath = path.join(DEFAULT_SAVE_PATH, 'errors', STATIC_PATHS.LOG_FILE_NAME);

export function getLogFilePathGlobal() {
    return logFilePath;
}
