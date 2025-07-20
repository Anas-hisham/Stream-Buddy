import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAutoUpdateStore = defineStore('autoUpdate', () => {
    // State
    const appVersion = ref('')
    const newVersion = ref('')
    const updateMessage = ref('')
    const updateAvailable = ref(false)
    const updateReady = ref(false)
    const downloadPercent = ref(0)
    const showUpdateUI = ref(false)
    const isChecking = ref(false)
    const isDownloading = ref(false)
    const showDownloadButton = ref(true)
    const showDownloadPercent = ref(false)
    // Actions
    async function checkForUpdateAuto() {
        try {
            const result = await window.myAPI.checkForUpdate()
            if (result?.error) {
                console.error('Auto update check error:', result.error)
                window.myAPI.logError('Auto update check error:', result.error)
            }
        } catch (error) {
            console.error('Auto update check failed:', error)
            window.myAPI.logError('Auto update check failed:', error)
        }
    }

    async function checkForUpdate() {
        if (isChecking.value) return

        isChecking.value = true
        showUpdateUI.value = true
        updateMessage.value = 'Checking for updates...'

        try {
            const result = await window.myAPI.checkForUpdate()
            if (result?.error) {
                updateMessage.value = 'Failed to check for updates.'
                window.myAPI.logError('Update check error:', result.error)
            }
        } finally {
            isChecking.value = false
        }
    }

    async function downloadUpdate() {
        if (isDownloading.value) return

        isDownloading.value = true
        updateMessage.value = 'Downloading update...'

        try {
            const result = await window.myAPI.downloadUpdate()
            if (result?.error) {
                updateMessage.value = 'Failed to download update.'
                window.myAPI.logError('Download update error:', result.error)
            }
        } finally {
            isDownloading.value = false
        }
    }

    function installUpdate() {
        window.myAPI.installUpdate()
    }

    // Initialize listeners
    function setupListeners() {
        window.myAPI.onUpdateAvailable((_, info) => {
            newVersion.value = info.version // Store the new version
            updateMessage.value = `New version ${info.version} available. Click to download.`
            updateAvailable.value = true
            showUpdateUI.value = true
        })

        window.myAPI.onUpdateNotAvailable(() => {
            if (showUpdateUI.value) updateMessage.value = 'You are using the latest version.'
            updateAvailable.value = false
            newVersion.value = '' // Clear new version when no update available
        })

        window.myAPI.onUpdateDownloaded(() => {
            updateMessage.value = `Update ready (v${newVersion.value}). Restart to install.`
            updateReady.value = true
            showUpdateUI.value = true
            isDownloading.value = false
            installUpdate()
        })

        window.myAPI.onDownloadProgress((percent) => {
            downloadPercent.value = percent
            updateMessage.value = `Downloading update (v${newVersion.value})... ${percent}%`
            showUpdateUI.value = true
        })
    }

    // Initialize store
    async function init() {
        try {
            appVersion.value = await window.myAPI.getAppVersion()
            setupListeners()
            checkForUpdateAuto()
        } catch (error) {
            console.error('Failed to initialize auto-update:', error)
        }
    }

    return {
        // State
        appVersion,
        newVersion,
        updateMessage,
        updateAvailable,
        updateReady,
        downloadPercent,
        showUpdateUI,
        isChecking,
        isDownloading,
        showDownloadButton,
        showDownloadPercent,
        // Actions
        checkForUpdate,
        downloadUpdate,
        installUpdate,
        init
    }
})
