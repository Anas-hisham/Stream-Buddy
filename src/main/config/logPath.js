import path from 'path';
import { PATHS } from '../constants/index.js';

const logFilePath = path.join(PATHS.DEFAULT_SAVE_PATH, 'errors', PATHS.LOG_FILE_NAME);

export function getLogFilePathGlobal() {
    return logFilePath;
}
