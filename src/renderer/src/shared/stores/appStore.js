import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import { DEFAULT_SETTINGS } from '../constants/defaultSettings'
import { PATHS } from '../constants/paths'
import { DISPLAY_MODE } from '../constants/displayMode'
import { NAV_MODE } from '../constants/navMode'
import { deepClone } from '../utils/deepClone'

// Extracted constants for repeated path checks
const SETTINGS_PATH = PATHS.SETTINGS
const WELCOME_PATH = PATHS.WELCOME

export const useAppStore = defineStore('settings', () => {
    const router = useRouter()

    const settings = ref({ ...DEFAULT_SETTINGS })

    const isDarkMode = computed(() => settings.value.displayMode === DISPLAY_MODE.DARK)
    const isFullNavMode = computed(() => settings.value.navMode === NAV_MODE.FULL)
    const visibleViews = computed(() => settings.value.views.filter((v) => v.visible))
    const allViews = computed(() => settings.value.views)

    // Extracted function for common view filtering logic
    function filterViewsByPath(path, views = settings.value.views) {
        return views.some((view) => view.path === path && view.visible)
    }

    // Helper functions
    function logAndReportError(message, error) {
        console.error(message, error)
        window.myAPI.logError(`${message} ${error.message}`)
    }

    const isViewVisible = filterViewsByPath

    function getFirstVisibleView(views) {
        return views.find(
            (view) => view.visible && view.path !== SETTINGS_PATH && view.path !== WELCOME_PATH
        )?.path || WELCOME_PATH
    }

    async function navigateTo(path) {
        if (router.currentRoute.value.path !== path) {
            await router.push(path)
        }
    }

    // Extracted function for view merging logic
    function mergeViewSettings(defaultView, savedView) {
        return savedView ? { ...defaultView, visible: savedView.visible } : defaultView
    }

    async function initializeSettings() {
        try {
            const savedSettings = await window.myAPI.getViewSettingsCache()
            if (savedSettings) {
                const mergedSettings = mergeSettings(savedSettings)
                settings.value = mergedSettings
                await handleInitialNavigation(mergedSettings)
            }
        } catch (err) {
            logAndReportError('Error loading settings:', err)
        }
    }

    function mergeSettings(savedSettings) {
        const mergedViews = DEFAULT_SETTINGS.views.map((defaultView) => {
            const savedView = savedSettings.views?.find((v) => v.title === defaultView.title)
            return mergeViewSettings(defaultView, savedView)
        })

        const savedCustomViews =
            savedSettings.views?.filter(
                (savedView) =>
                    !DEFAULT_SETTINGS.views.some(
                        (defaultView) => defaultView.title === savedView.title,
                    ),
            ) || []

        return {
            ...DEFAULT_SETTINGS,
            ...savedSettings,
            views: [...mergedViews, ...savedCustomViews],
        }
    }

    async function handleInitialNavigation(initialSettings) {
        const { lastView } = initialSettings

        if (lastView === SETTINGS_PATH && isViewVisible(SETTINGS_PATH)) {
            await navigateTo(SETTINGS_PATH)
        } else if (lastView && isViewVisible(lastView, initialSettings.views)) {
            await navigateTo(lastView)
        } else {
            await navigateTo(getFirstVisibleView(initialSettings.views))
        }
    }

    function updateLastViewedPath(newPath) {
        settings.value.lastView = newPath
        if (newPath !== SETTINGS_PATH) {
            settings.value.viewBeforeSetting = newPath
        }
    }

    function setSettings(newSettings) {
        settings.value = { ...settings.value, ...newSettings }
    }

    async function resetSettings() {
        try {
            await window.myAPI.setCustomSavePath('')
            const path = await window.myAPI.getDefaultSavePath()
            const allVisibleDefaultViews = settings.value.views.map((view) => ({
                ...view,
                visible: true,
            }))

            settings.value = {
                ...DEFAULT_SETTINGS,
                savePath: path,
                views: allVisibleDefaultViews,
                lastView: settings.value.lastView,
            }
        } catch (err) {
            logAndReportError('Error resetting settings:', err)
        }
    }

    async function openSettings() {
        if (router.currentRoute.value.path === SETTINGS_PATH) {
            await navigateBackFromSettings()
        } else {
            await navigateTo(SETTINGS_PATH)
        }
    }

    async function navigateBackFromSettings() {
        const previousViewPath = settings.value.viewBeforeSetting
        const backPath = isViewVisible(previousViewPath)
            ? previousViewPath
            : getFirstVisibleView(settings.value.views)

        await navigateTo(backPath)
    }

    function handleSettingsChange(newSettings) {
        try {
            const plainSettings = deepClone(newSettings)
            window.myAPI.saveViewSettingsCache(plainSettings)
        } catch (err) {
            logAndReportError('Error saving settings:', err)
        }
    }

    // Extracted function for static views filtering
    function isStaticViewPath(path) {
        return path === PATHS.TEAMS || path === PATHS.PLAYERS || path === PATHS.MATCHES
    }

    function staticViews() {
        return DEFAULT_SETTINGS.views.filter((view) => isStaticViewPath(view.path))
    }

    return {
        settings,
        isDarkMode,
        isFullNavMode,
        visibleViews,
        allViews,
        initializeSettings,
        updateLastViewedPath,
        setSettings,
        resetSettings,
        openSettings,
        handleSettingsChange,
        staticViews
    }
})
