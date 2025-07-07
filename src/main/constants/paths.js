import path from 'path'
import { app } from 'electron'

const DEFAULT_SAVE_PATH = app.getPath('userData')

export const PATHS = {
    ICON: path.join('public/icons/icon.ico'),
    PRELOAD: path.join('../preload/index.js'),
    DIST_HTML: path.join('../renderer/index.html'),
    LOG_FILE_NAME: 'errors.log',
    DEFAULT_SAVE_PATH
}
