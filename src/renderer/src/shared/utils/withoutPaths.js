import { PATHS } from "../constants/paths"
import { TITLES } from "../constants/titles"

export const viewTemplates = (path, title) => {
    if (path) {
        return path !== PATHS.SETTINGS &&
            path !== PATHS.WELCOME &&
            path !== PATHS.VIEW_BUILDER &&
            path !== PATHS.OVER_VIEW
    }
    if (title) {
        return title !== TITLES.SETTINGS &&
            title !== TITLES.WELCOME &&
            title !== TITLES.VIEW_BUILDER &&
            title !== TITLES.OVER_VIEW
    }
    return true
}
export const withoutEditButton = (path) => {
    const without =
        path !== PATHS.TEAMS &&
        path !== PATHS.PLAYERS &&
        path !== PATHS.MATCHES
    return without
}
export const withoutInit = (path) => {
    const without = PATHS.WELCOME && path !== PATHS.OVER_VIEW
    return without
}
