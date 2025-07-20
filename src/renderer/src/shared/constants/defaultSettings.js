import { DISPLAY_MODE } from "./displayMode"
import { NAV_MODE } from "./navMode"
import { PATHS } from "./paths"
import { TITLES } from "./titles"
export const DEFAULT_SETTINGS = {
    displayMode: DISPLAY_MODE.DARK,
    navMode: NAV_MODE.FULL,
    savePath: '',
    lastView: PATHS.WELCOME,
    viewBeforeSetting: PATHS.WELCOME,
    views: [
        { title: TITLES.TEAMS, path: PATHS.TEAMS, visible: true },
        { title: TITLES.PLAYERS, path: PATHS.PLAYERS, visible: true },
        { title: TITLES.MATCHES, path: PATHS.MATCHES, visible: true },
        { title: TITLES.SETTINGS, path: PATHS.SETTINGS, visible: true },
        { title: TITLES.VIEW_BUILDER, path: PATHS.VIEW_BUILDER, visible: true }
    ]
}
