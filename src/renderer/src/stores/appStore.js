import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import { DEFAULT_SETTINGS } from '../constants/defaultSettings'
export const useAppStore = defineStore('settings', () => {
    const router = useRouter()


    const settings = ref({ ...DEFAULT_SETTINGS })

    const isDarkMode = computed(() => settings.value.displayMode === 'dark')
    const isFullNavMode = computed(() => settings.value.navMode === 'full')
    const visibleViews = computed(() => settings.value.views.filter((v) => v.visible))
    const allViews = computed(() => settings.value.views)

    async function initializeSettings() {
        try {
            const savedSettings = await window.myAPI.getViewSettingsCache()
            if (savedSettings) {
                const mergedSettings = mergeSettings(savedSettings)
                settings.value = mergedSettings
                await handleInitialNavigation(mergedSettings)
            }
        } catch (err) {
            handleError('Error loading settings:', err)
        }
    }

    function mergeSettings(savedSettings) {
        const mergedViews = DEFAULT_SETTINGS.views.map((defaultView) => {
            const savedView = savedSettings.views?.find((v) => v.title === defaultView.title)
            return savedView ? { ...defaultView, visible: savedView.visible } : defaultView
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
        const lastView = initialSettings.lastView
        const isViewVisible = (path) =>
            initialSettings.views.some((view) => view.path === path && view.visible)

        if (lastView === '/settings' && isViewVisible('/settings')) {
            router.push('/settings')
        } else if (lastView && isViewVisible(lastView) && router.currentRoute.value.path !== lastView) {
            router.push(lastView)
        } else if (!isViewVisible(router.currentRoute.value.path)) {
            navigateToFirstVisibleView(initialSettings.views)
        }
    }

    function navigateToFirstVisibleView(views) {
        const firstVisible = views.find(
            (view) => view.visible && view.path !== '/settings' && view.path !== '/welcome',
        )
        router.push(firstVisible?.path || '/welcome')
    }

    function updateLastViewedPath(newPath) {
        settings.value.lastView = newPath
        if (newPath !== '/settings') {
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
            handleError('Error resetting settings:', err)
        }
    }

    function openSettings() {
        if (router.currentRoute.value.path === '/settings') {
            navigateBackFromSettings()
        } else {
            router.push('/settings')
        }
    }

    function navigateBackFromSettings() {
        const previousViewPath = settings.value.viewBeforeSetting
        const isBackVisible = settings.value.views.some((v) => v.visible && v.path === previousViewPath)

        if (isBackVisible) {
            router.push(previousViewPath)
        } else {
            navigateToFirstVisibleView(settings.value.views)
        }
    }

    function handleSettingsChange(newSettings) {
        try {
            const plainSettings = JSON.parse(JSON.stringify(newSettings))
            window.myAPI.saveViewSettingsCache(plainSettings)
        } catch (err) {
            handleError('Error saving settings:', err)
        }
    }

    function handleError(message, error) {
        console.error(message, error)
        window.myAPI.logError(`${message} ${error.message}`)
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
        handleSettingsChange
    }
})
