// stores/settingsStore.js
import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { useAppStore } from './index'

export const useSettingsStore = defineStore('settingsStore', () => {
    /* -------------------- Store -------------------- */
    const appStore = useAppStore()

    /* -------------------- Reactive State -------------------- */
    const folderPath = ref('')
    const newPresetName = ref('')
    const editingName = ref(null)
    const editedPresetName = ref('')
    const updatingPreset = ref(null)
    const tempUpdatedViews = ref([])
    const lastAppliedPreset = ref(null)
    const presets = ref({})

    /* -------------------- Computed Properties -------------------- */
    const presetList = computed(() =>
        Object.entries(presets.value).map(([name, views]) => ({ name, views })),
    )

    /* -------------------- File Path Management -------------------- */
    async function selectFolder(showAlertCallback) { // Add showAlertCallback
        try {
            const path = await window.myAPI.selectFolder()
            if (path) {
                folderPath.value = path
                appStore.settings.savePath = path
                await applySavePath(showAlertCallback) // Pass it here too
            }
        } catch (error) {
            handleError('Error selecting folder:', error, showAlertCallback) // Pass showAlertCallback
        }
    }

    async function applySavePath(showAlertCallback) { // Accept showAlertCallback
        try {
            const pathToApply = appStore.settings.savePath.trim()
            await window.myAPI.setCustomSavePath(pathToApply)
            if (showAlertCallback) showAlertCallback('Save path updated successfully') // Use the callback
        } catch (error) {
            handleError('Error updating save path:', error, showAlertCallback) // Pass showAlertCallback
        }
    }

    async function resetSavePath(showAlertCallback) { // Accept showAlertCallback
        try {
            await window.myAPI.setCustomSavePath('')
            const defaultPath = await window.myAPI.getDefaultSavePath()
            appStore.settings.savePath = defaultPath
            folderPath.value = defaultPath
            if (showAlertCallback) showAlertCallback('Save path reset to default.')
        } catch (error) {
            handleError('Error resetting save path:', error, showAlertCallback) // Pass showAlertCallback
        }
    }

    /* -------------------- Settings Management -------------------- */
    async function fullReset(showConfirmCallback, showAlertCallback) {
        try {
            const shouldReset = await showConfirmCallback('Are you sure you want to reset all settings?')
            if (!shouldReset) return

            await appStore.resetSettings()
            await window.myAPI.clearLastAppliedPreset()
            resetLocalState()
            if (showAlertCallback) showAlertCallback('All settings reset to default.')
        } catch (error) {
            handleError('Full reset failed:', error, showAlertCallback) // Pass showAlertCallback
        }
    }

    function resetLocalState() {
        newPresetName.value = ''
        editedPresetName.value = ''
        editingName.value = null
        updatingPreset.value = null
        tempUpdatedViews.value = []
        folderPath.value = ''
        lastAppliedPreset.value = null
    }

    async function clearInputs(showConfirmCallback, showAlertCallback) {
        try {
            const shouldClear = await showConfirmCallback('Are you sure you want to clear all inputs data?')
            if (shouldClear) {
                await window.myAPI.clearDataCache()
                if (showAlertCallback) showAlertCallback('Inputs cleared successfully')
            }
        } catch (error) {
            handleError('Failed to clear cache:', error, showAlertCallback) // Pass showAlertCallback
        }
    }

    /* -------------------- Preset Management -------------------- */
    async function loadPresets(showAlertCallback) { // Accept showAlertCallback
        try {
            const savedPresets = (await window.myAPI.getPresets()) || {}
            presets.value = normalizePresets(savedPresets)

            await handleLastAppliedPreset(showAlertCallback) // Pass it here
            await initializeSavePath(showAlertCallback) // Pass it here
        } catch (error) {
            handleError('Error loading presets:', error, showAlertCallback) // Pass showAlertCallback
        }
    }

    function normalizePresets(savedPresets) {
        return Object.fromEntries(
            Object.entries(savedPresets).map(([name, presetViews]) => {
                const normalizedViews = appStore.allViews.map((view) => {
                    const presetView = presetViews.find((v) => v.title === view.title)
                    return presetView || { title: view.title, visible: true }
                })
                return [name, normalizedViews]
            }),
        )
    }

    async function handleLastAppliedPreset(showAlertCallback) { // Accept showAlertCallback
        try {
            lastAppliedPreset.value = (await window.myAPI.getLastAppliedPreset()) || ''
        } catch (error) {
            handleError('Error loading last preset:', error, showAlertCallback) // Pass showAlertCallback
            lastAppliedPreset.value = ''
        }
    }

    async function initializeSavePath(showAlertCallback) { // Accept showAlertCallback
        if (window.myAPI?.getDefaultSavePath) {
            appStore.settings.savePath = await window.myAPI.getDefaultSavePath()
            folderPath.value = appStore.settings.savePath
        }
    }

    async function savePreset(name, currentViews, showAlertCallback) { // Accept showAlertCallback
        if (!name.trim()) return false

        try {
            const formattedViews = formatViewsForPreset(currentViews)
            await window.myAPI.savePreset(name.trim(), formattedViews)
            presets.value[name] = formattedViews
            if (newPresetName.value === name) newPresetName.value = ''
            return true
        } catch (error) {
            handleError('Error saving preset:', error, showAlertCallback) // Pass showAlertCallback
            return false
        }
    }

    function formatViewsForPreset(currentViews) {
        return appStore.allViews.map((view) => {
            const currentView = currentViews.find((v) => v.title === view.title)
            return {
                title: view.title,
                visible: currentView ? currentView.visible : true,
            }
        })
    }

    async function handleSavePreset(showConfirmCallback, showAlertCallback) {
        if (lastAppliedPreset.value) {
            const shouldOverwrite = await showConfirmCallback(
                `Update "${lastAppliedPreset.value}" with current visibility?`,
                true,
            )
            if (shouldOverwrite) {
                await savePreset(lastAppliedPreset.value, appStore.allViews, showAlertCallback) // Pass showAlertCallback
                if (showAlertCallback) showAlertCallback(`Preset "${lastAppliedPreset.value}" updated`)
                return
            }
        }

        if (!newPresetName.value.trim()) {
            if (showAlertCallback) showAlertCallback('Please enter a name for the new preset')
            return
        }

        const presetName = newPresetName.value.trim()
        if (await savePreset(presetName, appStore.allViews, showAlertCallback)) { // Pass showAlertCallback
            await applyPreset(presetName, showAlertCallback) // Pass showAlertCallback
            if (showAlertCallback) showAlertCallback(`New preset "${presetName}" created and applied`)
            newPresetName.value = ''
        }
    }

    async function applyPreset(name, showAlertCallback) { // Accept showAlertCallback
        try {
            const preset = presets.value[name]
            if (!preset) {
                if (showAlertCallback) showAlertCallback('Preset not found') // Use the callback
                return
            }

            lastAppliedPreset.value = name
            await window.myAPI.setLastAppliedPreset(name)
            applyViewsFromPreset(preset)
        } catch (error) {
            handleError('Error applying preset:', error, showAlertCallback) // Pass showAlertCallback
        }
    }

    function applyViewsFromPreset(preset) {
        const fullViews = appStore.allViews.map((view) => {
            const presetView = preset.find((v) => v.title === view.title)
            return presetView ? { ...view, visible: presetView.visible } : { ...view, visible: true }
        })
        appStore.setSettings({ ...appStore.settings, views: fullViews })
    }

    async function applyCurrentPreset(presetName) {
        const preset = presets.value[presetName]
        if (!preset) return

        lastAppliedPreset.value = presetName
        await window.myAPI.setLastAppliedPreset(presetName)
        applyViewsFromPreset(preset)
    }

    async function applyPresetFromButton(presetName, showAlertCallback) {
        await applyCurrentPreset(presetName);
        if (showAlertCallback) showAlertCallback(`Preset "${presetName}" has been applied.`)

    }

    async function deletePreset(name, showAlertCallback, showConfirmCallback) { // Accept showAlertCallback
        try {
            const shouldOverwrite = await showConfirmCallback(
                `Are you sure to delete "${name}" preset?`
            )
            if (shouldOverwrite) {

                // Check if the deleted preset is the currently applied one
                if (lastAppliedPreset.value === name) {
                    lastAppliedPreset.value = '' // Clear the applied preset
                    await window.myAPI.clearLastAppliedPreset() // Persist clearing

                    // Make all views visible again
                    const allViewsVisible = appStore.allViews.map(view => ({
                        ...view,
                        visible: true
                    }));
                    appStore.setSettings({ ...appStore.settings, views: allViewsVisible });
                }
                await window.myAPI.deletePreset(name)
                await loadPresets(showAlertCallback)
            }

        } catch (error) {
            handleError('Error deleting preset:', error, showAlertCallback) // Pass showAlertCallback
        }
    }

    /* -------------------- Preset Editing -------------------- */
    function startUpdatingPreset(preset) {
        updatingPreset.value = preset.name
        tempUpdatedViews.value = appStore.allViews.map((view) => {
            const presetView = preset.views.find((v) => v.title === view.title)
            return presetView
                ? { title: view.title, visible: presetView.visible }
                : { title: view.title, visible: true }
        })
    }

    function cancelUpdatePreset() {
        updatingPreset.value = null
        tempUpdatedViews.value = []
    }

    async function confirmUpdatePreset(name, showAlertCallback) { // Accept showAlertCallback
        if (!name.trim() || !tempUpdatedViews.value.length) return

        try {
            await savePreset(name, tempUpdatedViews.value, showAlertCallback) // Pass showAlertCallback
            updatingPreset.value = null
            tempUpdatedViews.value = []
            await loadPresets(showAlertCallback) // Pass it here

            if (showAlertCallback) showAlertCallback(`Preset "${name}" updated`)
            if (lastAppliedPreset.value === name) {
                await applyCurrentPreset(name, showAlertCallback) // Pass it here

            }
        } catch (error) {
            handleError('Error updating preset:', error, showAlertCallback) // Pass showAlertCallback
        }
    }

    function startRenaming(name) {
        editingName.value = name
        editedPresetName.value = name
    }

    function cancelRename() {
        editingName.value = null
        editedPresetName.value = ''
    }

    async function confirmRename(oldName, showAlertCallback) { // Accept showAlertCallback
        const newName = editedPresetName.value.trim()
        if (!newName) return

        try {
            await window.myAPI.renamePreset(oldName, newName)
            if (lastAppliedPreset.value === oldName) {
                lastAppliedPreset.value = newName
                await window.myAPI.setLastAppliedPreset(newName)
            }
            await loadPresets(showAlertCallback) // Pass it here
            cancelRename()
        } catch (error) {
            handleError('Error renaming preset:', error, showAlertCallback) // Pass showAlertCallback
        }
    }

    /* -------------------- Error Handling -------------------- */
    function handleError(message, error, showAlertCallback = null) { // Make showAlertCallback optional
        console.error(message, error)
        window.myAPI.logError(`${message} ${error.message}`)
        if (showAlertCallback) { // Only call if provided
            showAlertCallback(message.split(':')[0] + ' - see console for details')
        }
    }

    /* -------------------- Watchers -------------------- */
    watch(
        () => appStore.settings.savePath,
        async (newPath) => {
            if (newPath.trim() === '') {
                await window.myAPI.setCustomSavePath('')
            }
        },
    )

    watch(
        () => appStore.allViews,
        (newViews, oldViews) => {
            const addedViews = newViews.filter(
                (newView) => !oldViews.some((oldView) => oldView.title === newView.title),
            )

            if (addedViews.length > 0) {
                updatePresetsWithNewViews(addedViews)

                if (lastAppliedPreset.value) {
                    applyCurrentPreset(lastAppliedPreset.value)
                }
            }
        },
        { deep: true },
    )

    function updatePresetsWithNewViews(addedViews) {
        Object.keys(presets.value).forEach((presetName) => {
            const preset = presets.value[presetName]
            addedViews.forEach((view) => {
                if (!preset.some((v) => v.title === view.title)) {
                    preset.push({ title: view.title, visible: true })
                }
            })
        })
    }

    return {
        folderPath,
        newPresetName,
        editingName,
        editedPresetName,
        updatingPreset,
        tempUpdatedViews,
        lastAppliedPreset,
        presets,
        presetList,
        selectFolder,
        applySavePath,
        resetSavePath,
        fullReset,
        clearInputs,
        loadPresets,
        handleSavePreset,
        applyCurrentPreset,
        applyPresetFromButton,
        deletePreset,
        startUpdatingPreset,
        cancelUpdatePreset,
        confirmUpdatePreset,
        startRenaming,
        cancelRename,
        confirmRename,
        handleError
    }
})
